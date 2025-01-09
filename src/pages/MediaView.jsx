import { useEffect, useState } from 'react'
    import { useParams, useNavigate } from 'react-router-dom'
    import { supabase } from '../supabaseClient'
    import VideoPlayer from '../components/VideoPlayer'
    import AudioPlayer from '../components/AudioPlayer'
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
    import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

    export default function MediaView() {
      const { id } = useParams()
      const navigate = useNavigate()
      const [media, setMedia] = useState(null)
      const [loading, setLoading] = useState(true)
      const [prevId, setPrevId] = useState(null)
      const [nextId, setNextId] = useState(null)

      useEffect(() => {
        const fetchMedia = async () => {
          const { data, error } = await supabase
            .from('media_items')
            .select('*')
            .eq('id', id)
            .single()

          if (error) {
            console.error('Error fetching media:', error)
            navigate('/404')
          } else {
            setMedia(data)
            fetchAdjacentIds(data.id)
          }
          setLoading(false)
        }

        const fetchAdjacentIds = async (currentId) => {
          const { data: prev } = await supabase
            .from('media_items')
            .select('id')
            .lt('id', currentId)
            .order('id', { ascending: false })
            .limit(1)

          const { data: next } = await supabase
            .from('media_items')
            .select('id')
            .gt('id', currentId)
            .order('id', { ascending: true })
            .limit(1)

          setPrevId(prev[0]?.id || null)
          setNextId(next[0]?.id || null)
        }

        fetchMedia()
      }, [id, navigate])

      if (loading) return <div>Loading...</div>
      if (!media) return <div>Media not found</div>

      return (
        <div className="media-view">
          {prevId && (
            <div
              className="nav-arrow left"
              onClick={() => navigate(`/${prevId}`)}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </div>
          )}

          {media.type === 'image' && (
            <img src={media.storage_path} alt={media.user} />
          )}

          {media.type === 'video' && (
            <VideoPlayer src={media.storage_path} />
          )}

          {media.type === 'audio' && (
            <AudioPlayer src={media.storage_path} />
          )}

          {nextId && (
            <div
              className="nav-arrow right"
              onClick={() => navigate(`/${nextId}`)}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          )}
        </div>
      )
    }
