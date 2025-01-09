import React, { useState, useEffect } from 'react';
    import MediaItem from './MediaItem';
    import FilterBar from './FilterBar';
    import supabase from '../utils/supabaseClient';
    import './Gallery.css';

    function Gallery() {
      const [mediaItems, setMediaItems] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const fetchMedia = async () => {
          setLoading(true);
          try {
            const { data, error } = await supabase
              .from('media_items')
              .select('*')
              .order('id', { ascending: false });
            if (error) {
              console.error('Error fetching data:', error);
            } else {
              console.log('Fetched data:', data); // Debugging line
              setMediaItems(data);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setLoading(false);
          }
        };

        fetchMedia();
      }, []);

      if (loading) {
        return <p>Loading...</p>;
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
