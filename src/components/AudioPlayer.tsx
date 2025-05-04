import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faSpinner } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { ClipDateStateDataProp } from '../lib/types';

interface AudioPlayerProp {
    CDStateData: ClipDateStateDataProp;
}

function AudioPlayer({ CDStateData }: AudioPlayerProp) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // You know the drill by now
    const [clip_id, setClipID] = [CDStateData.clip_id, CDStateData.setClipID];

    const audioRef = useRef<HTMLAudioElement>(null);
    const sourceRef = useRef<HTMLSourceElement>(null);

    useEffect(() => {
        if (sourceRef.current && audioRef.current) {
            if (process.env.REACT_APP_DEMO)
                sourceRef.current.src = 'https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_5MB_WAV.wav'
            else if (clip_id)
                sourceRef.current.src = `${process.env.REACT_APP_API_HOST}/api/clips/audio/${clip_id}`.replaceAll('"', '');

            if (isNaN(clip_id))
                sourceRef.current.src = '';

            // You must call load to get the audio element to load the new source
            audioRef.current.load();

            setIsLoading(true);
        }
        console.log(clip_id)
    }, [clip_id]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying)
                audioRef.current.pause();
            else
                audioRef.current.play();
        }
    };

    // This is the screwed up method to get the next clip key without ignoring clips that were uploaded out of sequence
    const getNextClipKey = useCallback(() => {
        console.log("Checking for next clip in DOM...");

        // Get the attribute x-vmo-clipidx from the element with the id vmo-clip-clip_id=props.clip_id
        const currentIndex = Number(document.getElementById(`vmo-clip-${clip_id}`)?.getAttribute('x-vmo-clipidx'));

        // Get the element with the attribute x-vmo-clipidx=currentIndex-1
        return Number(document.querySelector(`[x-vmo-clipidx="${currentIndex - 1}"]`)?.id.split('-')[2]);
    }, [clip_id]);

    // This means the audio has ended
    const handleEnd = useCallback(() => {
        setIsPlaying(false);

        const nextClipKey = getNextClipKey();

        // If next clip exists, play it
        if (nextClipKey) {
            // Remove old highlight
            const oldRow = document.getElementById(`vmo-clip-${clip_id}`);
            oldRow?.classList.remove("bg-slate-700");

            // Remove the retry interval if a new clip was found
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            // Make it blue!
            setClipID(nextClipKey);
        } else {
            // Try to go to the next page if available
            if (window.vmoPagination && window.vmoPagination['clips']) {
                const paginationHandler = window.vmoPagination['clips'];

                // If we can advance to the next page
                if (paginationHandler.goToNextPage()) {
                    console.log('Moving to next page to continue playback');

                    // Clear any existing interval
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }

                    // Set a short timeout to allow the clips to load before selecting the oldest clip
                    setTimeout(() => {
                        // Find all clips on the current page
                        const clipElements = document.querySelectorAll('[x-vmo-clipidx]');
                        if (clipElements.length > 0) {
                            // Find the clip with the highest index (oldest clip on page)
                            let highestIndex = -1;
                            let oldestClipElement: Element | null = null;

                            clipElements.forEach(element => {
                                const index = Number(element.getAttribute('x-vmo-clipidx'));
                                if (index > highestIndex) {
                                    highestIndex = index;
                                    oldestClipElement = element;
                                }
                            });

                            // Play the oldest clip (highest index) on the page
                            if (oldestClipElement) {
                                const newClipId = Number((oldestClipElement as HTMLElement).id.split('-')[2]);
                                if (newClipId) {
                                    setClipID(newClipId);

                                    // Manually apply visual highlight
                                    setTimeout(() => {
                                        applyVisualHighlight(newClipId);
                                    }, 50); // Short delay to ensure DOM is updated
                                }
                            }
                        }
                    }, 300);

                    return;
                }
            }

            // If we can't advance to the next page or there's no pagination handler,
            // use the existing retry logic
            if (!intervalRef.current) {
                intervalRef.current = setInterval(handleEnd, 10000);
            }
        }

        // Clear interval on component unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [clip_id, setClipID, getNextClipKey, setIsPlaying, intervalRef]);

    const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
        if (audioRef.current) {
            const barWidth = event.currentTarget.clientWidth;
            const clickPosition = event.nativeEvent.offsetX;
            const seekTime = (clickPosition / barWidth) * audioRef.current.duration;
            if (isFinite(seekTime))
                audioRef.current.currentTime = seekTime
            else
                audioRef.current.currentTime = NaN;
            setCurrentTime(seekTime);
        }
    };

    useEffect(() => {
        const currentAudioRef = audioRef.current;

        const handlePlay = () => {
            setIsPlaying(true);
        };

        const handlePause = () => {
            setIsPlaying(false);
        };

        const handleTimeUpdate = () => {
            if (currentAudioRef) {
                setCurrentTime(currentAudioRef.currentTime);
            }
        };

        const handleLoadedMetadata = () => {
            if (currentAudioRef) {
                setDuration(currentAudioRef.duration);
                currentAudioRef.volume = 1; // Ensure volume is set to 100%
                currentAudioRef.play().catch(() => {
                    toast.error("Please allow auto play for the site to work!");
                });
                setIsLoading(false);
            }
        };

        if (currentAudioRef) {
            currentAudioRef.addEventListener('play', handlePlay);
            currentAudioRef.addEventListener('pause', handlePause);
            currentAudioRef.addEventListener('timeupdate', handleTimeUpdate);
            currentAudioRef.addEventListener('loadedmetadata', handleLoadedMetadata);
            currentAudioRef.addEventListener('ended', handleEnd);
        }

        return () => {
            if (currentAudioRef) {
                currentAudioRef.removeEventListener('play', handlePlay);
                currentAudioRef.removeEventListener('pause', handlePause);
                currentAudioRef.removeEventListener('timeupdate', handleTimeUpdate);
                currentAudioRef.removeEventListener('loadedmetadata', handleLoadedMetadata);
                currentAudioRef.removeEventListener('ended', handleEnd);
            }
        };
    }, [audioRef, handleEnd, setIsPlaying, setCurrentTime, setDuration, setIsLoading]);

    return (
        <div className="flex items-center">
            {isLoading ? (
                <div className="mr-2">
                    <div className="animate-spin origin-center">
                        <FontAwesomeIcon icon={faSpinner} />
                    </div>
                </div>
            ) : (
                <button className="mr-2" onClick={togglePlay}>
                    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                </button>
            )}
            <div className="flex items-center">
                {
                    isLoading ? (
                        null
                    ) :
                        <div className="bg-gray-400 h-2 w-32 mr-2" onClick={handleSeek}>
                            <div className="bg-gradient-to-r from-sky-500 to-indigo-800 h-full w-1/3" style={{ width: `${currentTime === 0 ? 0 : (currentTime / duration) * 100}%` }}></div>
                        </div>
                }
                <p className="text-sm">
                    {isLoading ? (
                        'Nothing to play...'
                    ) : (
                        `${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60).toString().padStart(2, '0')} / ${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}`
                    )}
                </p>
            </div>
            <audio
                autoPlay
                ref={audioRef}
            >
                <source ref={sourceRef} src="" type="audio/wav" />
            </audio>
        </div>
    );
}

export default AudioPlayer;