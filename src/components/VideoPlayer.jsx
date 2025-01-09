import { useEffect, useRef } from 'react'
    import videojs from 'video.js'
    import 'video.js/dist/video-js.css'

    export default function VideoPlayer({ src }) {
      const videoRef = useRef(null)
      const playerRef = useRef(null)

      useEffect(() => {
        if (!playerRef.current) {
          const videoElement = videoRef.current
          if (!videoElement) return

          playerRef.current = videojs(videoElement, {
            controls: true,
            fluid: true,
            responsive: true,
            playbackRates: [0.5, 1, 1.5, 2]
          })
        }

        return () => {
          if (playerRef.current) {
            playerRef.current.dispose()
            playerRef.current = null
          }
        }
      }, [])

      return (
        <div data-vjs-player>
          <video
            ref={videoRef}
            className="video-js vjs-big-play-centered"
            preload="auto"
          >
            <source src={src} type="video/mp4" />
          </video>
        </div>
      )
    }
