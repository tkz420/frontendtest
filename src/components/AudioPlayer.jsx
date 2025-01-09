import { useState, useRef } from 'react'

    export default function AudioPlayer({ src }) {
      const [isPlaying, setIsPlaying] = useState(false)
      const [currentTime, setCurrentTime] = useState(0)
      const [duration, setDuration] = useState(0)
      const audioRef = useRef(null)

      const togglePlay = () => {
        if (isPlaying) {
          audioRef.current.pause()
        } else {
          audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
      }

      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime)
      }

      const handleLoadedData = () => {
        setDuration(audioRef.current.duration)
      }

      const handleSeek = (e) => {
        const seekTime = parseFloat(e.target.value)
        audioRef.current.currentTime = seekTime
        setCurrentTime(seekTime)
      }

      return (
        <div className="audio-player">
          <audio
            ref={audioRef}
            src={src}
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={handleLoadedData}
          />
          <button onClick={togglePlay}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
          />
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      )
    }

    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
    }
