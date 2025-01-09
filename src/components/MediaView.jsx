import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import supabase from '../utils/supabaseClient';
    import './MediaView.css';
    import MediaPlayer from './MediaPlayer';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

    function MediaView() {
      const { id } = useParams();
      const navigate = useNavigate();
      const [mediaItem, setMediaItem] = useState(null);
      const [loading, setLoading] = useState(true);
      const [mediaItems, setMediaItems] = useState([]);
      const [currentIndex, setCurrentIndex] = useState(0);
      const [mediaLoaded, setMediaLoaded] = useState(false);

      useEffect(() => {
        const fetchMedia = async () => {
          setLoading(true);
          setMediaLoaded(false);
          try {
            const { data, error } = await supabase
              .from('media_items')
              .select('*')
              .order('id', { ascending: true });
            if (error) {
              console.error('Error fetching data:', error);
            } else {
              setMediaItems(data);
              const index = data.findIndex(item => item.id === parseInt(id));
              if (index !== -1) {
                setCurrentIndex(index);
                setMediaItem(data[index]);
              } else {
                 setMediaItem(null);
                console.error('Media item not found');
                navigate('/not-found');
              }
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setLoading(false);
          }
        };

        fetchMedia();
      }, [id, navigate]);

      useEffect(() => {
        if (mediaItem) {
          setMediaLoaded(true);
        }
      }, [mediaItem]);

      useEffect(() => {
        if (mediaItems.length > 0 && currentIndex >= 0 && currentIndex < mediaItems.length) {
          setMediaItem(mediaItems[currentIndex]);
        }
      }, [currentIndex, mediaItems]);

      const handlePrev = () => {
        if (currentIndex > 0) {
          const prevIndex = currentIndex - 1;
          setCurrentIndex(prevIndex);
          navigate(`/${mediaItems[prevIndex].id}`);
        }
      };

      const handleNext = () => {
        if (currentIndex < mediaItems.length - 1) {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          navigate(`/${mediaItems[nextIndex].id}`);
        }
      };

      if (loading) {
        return <p>Loading...</p>;
      }

      if (!mediaItem) {
        return <p>Media item not found.</p>;
      }

      const storageUrl = supabase.storage.from('media').getPublicUrl(mediaItem.storage_path).data.publicUrl;
      const isImage = mediaItem.type === 'image' || mediaItem.type === 'jpeg' || mediaItem.type === 'png' || mediaItem.type === 'jpg' || mediaItem.type === 'webp' || mediaItem.type === 'gif';
      const isAudio = mediaItem.type === 'mp3' || mediaItem.type === 'wav' || mediaItem.type === 'ogg';

      return (
        <div className="media-view-container">
          <div className="media-display">
            {mediaLoaded && (
              <span
                className={`nav-arrow prev ${currentIndex === 0 ? 'disabled' : ''}`}
                onClick={handlePrev}
                style={{ display: currentIndex === 0 ? 'none' : 'block' }}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </span>
            )}
            {isImage ? (
              <img src={storageUrl} alt={mediaItem.url} className="media-image" onLoad={() => setMediaLoaded(true)} />
            ) : (
              <MediaPlayer url={storageUrl} type={mediaItem.type} />
            )}
            {mediaLoaded && (
              <span
                className={`nav-arrow next ${currentIndex === mediaItems.length - 1 ? 'disabled' : ''}`}
                onClick={handleNext}
                style={{ display: currentIndex === mediaItems.length - 1 ? 'none' : 'block' }}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </span>
            )}
          </div>
          <div className="media-info">
            <div>
              <strong>User:</strong>
              {mediaItem.user}
            </div>
            <div>
              <strong>Type:</strong>
              {mediaItem.type}
            </div>
            <div>
              <strong>Score:</strong>
              {mediaItem.score}
            </div>
          </div>
        </div>
      );
    }

    export default MediaView;
