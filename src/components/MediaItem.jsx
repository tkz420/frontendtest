import React from 'react';
    import './MediaItem.css';
    import supabase from '../utils/supabaseClient';
    import { Link } from 'react-router-dom';

    function MediaItem({ item }) {
      const storageUrl = supabase.storage.from('media').getPublicUrl(item.thumb_path).data.publicUrl;
      return (
        <div className="media-item">
          <Link to={`/${item.id}`}>
            {item.thumb_path && <img src={storageUrl} alt={item.url} />}
          </Link>
        </div>
      );
    }

    export default MediaItem;
