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

    useEffect(() => {
        if (audioRef.current) {
            if (process.env.REACT_APP_DEMO)
                audioRef.current.src = 'https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_5MB_WAV.wav'
            else if (clip_id)
                audioRef.current.src = `${process.env.REACT_APP_API_HOST}/api/clips/audio/${clip_id}`;

            if (isNaN(clip_id))
                audioRef.current.src = '';
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
            oldRow?.classList.remove("bg-slate-100");
            oldRow?.classList.remove("dark:bg-slate-700");

            // Remove the retry interval if a new clip was found
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            // Make it blue!
            setClipID(nextClipKey);
        } else {
            // Handle page change or something idk make this idiot work somehow or I'm gonna lose it
            // console.log('No newer clip in this date detected. Current CID:', (clip_id), `vmo-clip-${nextClipKey}`);
            if (!intervalRef.current)
                intervalRef.current = setInterval(handleEnd, 10000);
        }

        // Clear interval on component unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [clip_id, setClipID, getNextClipKey, setIsPlaying, intervalRef]);

    const handleTimeUpdate: any = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    // This should all be server side when added into the app
    // useEffect(() => {
    //     let plays_remaining = parseInt(cookies.plays_remaining);

    //     // Make sure the payment param isn't there!
    //     if (plays_remaining === 0 && !window.location.search.includes('p=1')) {
    //         toast.error("You have no more plays remaining for today! Consider subscribing to get unlimited plays!");
    //     } else if (plays_remaining) {
    //         toast.success("You have " + plays_remaining + ` play${plays_remaining > 1 ? 's' : ''} remaining for today!`);
    //     }

    //     console.log('check cookie: ' + plays_remaining + ' ' + cookies.plays_remaining + ' ' + isPlaying);

    //     removeCookie('plays_remaining', { path: '/' });

    //     // Remove url params
    //     window.history.replaceState({}, document.title, window.location.pathname);

    // }, [clip_id]);

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            audioRef.current.play().catch(() => { toast.error("Please allow auto play for the site to work!") });
            setIsLoading(false);
        }
    };

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
        if (currentAudioRef) {
            currentAudioRef.addEventListener('timeupdate', handleTimeUpdate);
            currentAudioRef.addEventListener('loadedmetadata', handleLoadedMetadata);
            currentAudioRef.addEventListener('play', () => setIsPlaying(true));
            currentAudioRef.addEventListener('pause', () => setIsPlaying(false));
            currentAudioRef.addEventListener('ended', () => handleEnd);
            return () => {
                currentAudioRef?.removeEventListener('ended', () => handleEnd);
                currentAudioRef?.removeEventListener('timeupdate', handleTimeUpdate);
                currentAudioRef?.removeEventListener('loadedmetadata', handleLoadedMetadata);
                currentAudioRef?.removeEventListener('play', () => setIsPlaying(true));
                currentAudioRef?.removeEventListener('pause', () => setIsPlaying(false));
            };
        }
    }, [handleEnd]);

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
                src=''
                onEnded={() => handleEnd()}
            ></audio>
        </div>
    );
}

export default AudioPlayer;