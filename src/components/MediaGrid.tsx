import { Link } from 'react-router-dom';
import { MediaItem } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface MediaGridProps {
  items: MediaItem[];
}

export const MediaGrid = ({ items }: MediaGridProps) => {
  return (
    <div className="media-grid">
      {items.map((item) => (
        <Link key={item.id} to={`/${item.id}`} className="media-item">
          <img
            src={`${supabase.storage.from('media').getPublicUrl(item.thumb_path).data.publicUrl}`}
            alt={`Media ${item.id}`}
            className="media-thumbnail"
            loading="lazy"
          />
        </Link>
      ))}
    </div>
  );
};
