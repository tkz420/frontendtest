import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MediaGrid } from '@/components/MediaGrid';
import { getMediaItems } from '@/lib/supabase';
import type { MediaItem } from '@/lib/types';

const Index = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getMediaItems();
        setItems(data);
      } catch (error) {
        console.error('Error fetching media items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="p-4 border-b border-border">
        <Link to="/" className="text-2xl font-bold hover:text-primary">
          b0ard
        </Link>
      </header>
      <main>
        <MediaGrid items={items} />
      </main>
    </div>
  );
};

export default Index;
