import React, { useState, useRef, useEffect } from 'react';
    import './MediaPlayer.css';
    import 'video.js/dist/video-js.css';
    import supabase from '../utils/supabaseClient';

    function MediaPlayer({ url, type }) {
      const audioRef = useRef(null);
      const videoRef = useRef(null);
      const [isPlaying, setIsPlaying] = useState(false);
      const [currentTime, setCurrentTime] = useState(0);
      const [duration, setDuration] = useState(0);
      const [mediaError, setMediaError] = useState(null);
      const [fallbackImage, setFallbackImage] = useState(null);
      const [mediaUrl, setMediaUrl] = useState(null);

      useEffect(() => {
        const fetchMediaUrl = async () => {
          try {
            const { data } = supabase.storage.from('media').getPublicUrl(url);
            setMediaUrl(data.publicUrl);
          } catch (error) {
            console.error('Error fetching media URL:', error);
            setMediaError('Failed to load media.');
            setFallbackImage('/fallback-image.png');
          }
        };

        fetchMediaUrl();
      }, [url]);

      useEffect(() => {
        const audio = audioRef.current;
        const video = videoRef.current;
        if (!audio && !video || !mediaUrl) return;

        const handleTimeUpdate = () => {
          if (audio) {
            setCurrentTime(audio.currentTime);
          } else if (video) {
            setCurrentTime(video.currentTime);
          }
        };

        const handleLoadedMetadata = () => {
          if (audio) {
            setDuration(audio.duration);
          } else if (video) {
            setDuration(video.duration);
          }
        };

        const handleEnded = () => {
          setIsPlaying(false);
          setCurrentTime(0);
        };

        const handleError = (e) => {
          console.error('Media loading error:', e);
          setMediaError('Failed to load media.');
          setFallbackImage('/fallback-image.png');
        };

        if (audio) {
          audio.addEventListener('timeupdate', handleTimeUpdate);
          audio.addEventListener('loadedmetadata', handleLoadedMetadata);
          audio.addEventListener('ended', handleEnded);
          audio.addEventListener('error', handleError);

          return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
          };
        } else if (video) {
          video.addEventListener('timeupdate', handleTimeUpdate);
          video.addEventListener('loadedmetadata', handleLoadedMetadata);
          video.addEventListener('ended', handleEnded);
          video.addEventListener('error', handleError);

          return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('error', handleError);
          };
        }
      }, [mediaUrl]);

      const handlePlayPause = () => {
        const audio = audioRef.current;
        const video = videoRef.current;

        if (audio) {
          if (isPlaying) {
            audio.pause();
          } else {
            audio.play();
          }
        } else if (video) {
          if (isPlaying) {
            video.pause();
          } else {
            video.play();
          }
        }
        setIsPlaying(!isPlaying);
      };

      const handleSeek = (e) => {
        const audio = audioRef.current;
        const video = videoRef.current;
        const seekTime = parseFloat(e.target.value);

        if (audio) {
          audio.currentTime = seekTime;
          setCurrentTime(seekTime);
        } else if (video) {
          video.currentTime = seekTime;
          setCurrentTime(seekTime);
        }
      };

      const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      };

      const isAudio = type === 'mp3' || type === 'wav' || type === 'ogg';

      if (mediaError) {
        return (
          <div>
            <p>Error loading media: {mediaError}</p>
            {fallbackImage && <img src={fallbackImage} alt="Fallback" style={{ maxWidth: '100px' }} />}
          </div>
        );
      }

      if (isAudio) {
        return (
          <div className="audio-player">
            <audio ref={audioRef} src={mediaUrl} />
            <div className="audio-controls">
              <button onClick={handlePlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
              />
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
          </div>
        );
      } else {
        return (
          <div className="media-player">
            <video ref={videoRef} controls src={mediaUrl} className="video-player" onError={e => {setMediaError('Failed to load video.'); setFallbackImage('/fallback-image.png')}} />
            {fallbackImage && <img src={fallbackImage} alt="Fallback" style={{ maxWidth: '100px' }} />}
          </div>
        );
      }
    }

    export default MediaPlayer;
