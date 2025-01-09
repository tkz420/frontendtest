import React, { useState, useEffect } from 'react';
    import MediaItem from './MediaItem';
    import FilterBar from './FilterBar';
    import supabase from '../utils/supabaseClient';
    import './Gallery.css';

    function Gallery() {
      const [mediaItems, setMediaItems] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchMedia = async () => {
          setLoading(true);
          setError(null);
          try {
            const { data, error } = await supabase
              .from('media_items')
              .select('*')
              .order('id', { ascending: false });
            if (error) {
              console.error('Error fetching data:', error);
              setError('Failed to load media items.');
            } else {
              setMediaItems(data);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load media items.');
          } finally {
            setLoading(false);
          }
        };

        fetchMedia();
      }, []);

      if (loading) {
        return <p>Loading...</p>;
      }

      if (error) {
        return <p>{error}</p>;
      }

      if (mediaItems.length === 0) {
        return <p>No media items found.</p>;
      }

      return (
        <div>
          <FilterBar />
          <div className="gallery">
            {mediaItems.map(item => (
              <MediaItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      );
    }

    export default Gallery;
