import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface MediaPlayerProps {
  src: string;
  type: 'video' | 'audio';
}

export const MediaPlayer = ({ src, type }: MediaPlayerProps) => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const videoJsRef = useRef<any>(null);

  useEffect(() => {
    if (playerRef.current) {
      videoJsRef.current = videojs(playerRef.current, {
        controls: true,
        fluid: true,
        sources: [{ src, type: `${type}/${src.split('.').pop()}` }],
      });
    }

    return () => {
      if (videoJsRef.current) {
        videoJsRef.current.dispose();
      }
    };
  }, [src, type]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <video
        ref={playerRef}
        className="video-js vjs-theme-city vjs-big-play-centered"
      />
    </div>
  );
};
