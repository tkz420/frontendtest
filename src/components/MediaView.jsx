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
      const [mediaLoaded, setMediaLoaded] = useState(false);
      const [mediaError, setMediaError] = useState(null);

      useEffect(() => {
        const fetchMedia = async () => {
          setLoading(true);
          setMediaLoaded(false);
          setMediaError(null);
          try {
            const { data, error } = await supabase
              .from('media_items')
              .select('*')
              .order('id', { ascending: true });
            if (error) {
              console.error('Error fetching data:', error);
              setMediaError('Failed to load media items.');
            } else {
              setMediaItems(data);
              const currentItem = data.find(item => item.id === parseInt(id));
              if (currentItem) {
                setMediaItem(currentItem);
              } else {
                setMediaItem(null);
                console.error('Media item not found');
                navigate('/not-found');
              }
            }
          } catch (error) {
            console.error('Error fetching data:', error);
            setMediaError('Failed to load media items.');
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

      const handlePrev = () => {
        if (!mediaItem) return;
        const currentId = parseInt(mediaItem.id);
        const nextItem = mediaItems
          .filter(item => item.id > currentId)
          .sort((a, b) => a.id - b.id)[0];
        if (nextItem) {
          navigate(`/${nextItem.id}`);
        }
      };

      const handleNext = () => {
        if (!mediaItem) return;
        const currentId = parseInt(mediaItem.id);
        const prevItem = mediaItems
          .filter(item => item.id < currentId)
          .sort((a, b) => b.id - a.id)[0];
        if (prevItem) {
          navigate(`/${prevItem.id}`);
        }
      };

      if (loading) {
        return <p>Loading...</p>;
      }

      if (mediaError) {
        return <p>{mediaError}</p>;
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
                className={`nav-arrow prev ${!mediaItems.some(item => item.id < parseInt(mediaItem.id)) ? 'disabled' : ''}`}
                onClick={handleNext}
                style={{ display: !mediaItems.some(item => item.id < parseInt(mediaItem.id)) ? 'none' : 'block' }}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </span>
            )}
            {isImage ? (
              <img src={storageUrl} alt={mediaItem.url} className="media-image" onLoad={() => setMediaLoaded(true)} onError={() => setMediaError('Failed to load media.')} />
            ) : (
              <MediaPlayer url={mediaItem.storage_path} type={mediaItem.type} />
            )}
            {mediaLoaded && (
              <span
                className={`nav-arrow next ${!mediaItems.some(item => item.id > parseInt(mediaItem.id)) ? 'disabled' : ''}`}
                onClick={handlePrev}
                style={{ display: !mediaItems.some(item => item.id > parseInt(mediaItem.id)) ? 'none' : 'block' }}
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
