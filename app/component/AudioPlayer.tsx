"use client"

import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { AudioPlayerProps } from '../lib/types';

function AudioPlayer(props: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(prevIsPlaying => !prevIsPlaying);
        }
    };

    const handleEnd = () => {
        setIsPlaying(false);
        console.log('DONE PLAYING, LOAD A NEW CLIP FUCKER!');
    }

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
        if (audioRef.current) {
            const barWidth = event.currentTarget.clientWidth;
            const clickPosition = event.nativeEvent.offsetX;
            const seekTime = (clickPosition / barWidth) * audioRef.current.duration;
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
            audioRef.current.addEventListener('play', () => setIsPlaying(true));
            audioRef.current.addEventListener('pause', () => setIsPlaying(false));
            return () => {
                audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
                audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audioRef.current?.removeEventListener('play', () => setIsPlaying(true));
                // eslint-disable-next-line react-hooks/exhaustive-deps
                audioRef.current?.removeEventListener('pause', () => setIsPlaying(false));
            };
        }
    }, []);

    useEffect(() => {
        if (audioRef.current?.paused) {
            setIsPlaying(false);
        }
    }, [audioRef.current?.paused]);

    return (
        <div className="flex items-center">
            <button className="mr-2 text-gray-500" onClick={togglePlay}>
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </button>
            <div className="flex items-center">
                <div className="bg-gray-400 h-2 w-32 mr-2" onClick={handleSeek}>
                    <div className="bg-gradient-to-r from-sky-500 to-indigo-800 h-full w-1/3" style={{ width: `${currentTime == 0 ? 0 : (currentTime / duration) * 100}%` }}></div>
                </div>
                <p className="text-gray-500 text-sm">
                    {`${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60).toString().padStart(2, '0')} / ${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}`}
                </p>
            </div>
            <audio autoPlay ref={audioRef} src={props.url} onEnded={() => handleEnd()}></audio>
        </div>
    );
}

export default AudioPlayer;