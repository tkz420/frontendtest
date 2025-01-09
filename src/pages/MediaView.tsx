import { useEffect, useState } from 'react';
    import { useParams, useNavigate, Link } from 'react-router-dom';
    import { MediaPlayer } from '@/components/MediaPlayer';
    import { Navigation } from '@/components/Navigation';
    import { getMediaItem, supabase } from '@/lib/supabase';
    import type { MediaItem } from '@/lib/types';

    const MediaView = () => {
      const { id } = useParams<{ id: string }>();
      const navigate = useNavigate();
      const [item, setItem] = useState<MediaItem | null>(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const fetchItem = async () => {
          try {
            if (!id) return;
            const data = await getMediaItem(parseInt(id));
            setItem(data);
          } catch (error) {
            console.error('Error fetching media item:', error);
            navigate('/not-found');
          } finally {
            setLoading(false);
          }
        };

        fetchItem();
      }, [id, navigate]);

      const handlePrevious = () => {
        if (item) {
          navigate(`/${item.id - 1}`);
        }
      };

      const handleNext = () => {
        if (item) {
          navigate(`/${item.id + 1}`);
        }
      };

      if (loading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        );
      }

      if (!item) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div>Media not found</div>
          </div>
        );
      }

      return (
        <div className="media-view">
          <header className="fixed top-0 left-0 right-0 p-4 z-10">
            <Link to="/" className="text-2xl font-bold hover:text-primary">
              b0ard
            </Link>
          </header>
          
          <div className="media-container relative">
            <div className="media-content">
              {item.type.startsWith('image') ? (
                <img
                  src={`${supabase.storage.from('media').getPublicUrl(item.storage_path).data.publicUrl}`}
                  alt={`Media ${item.id}`}
                  className="max-h-[90vh] w-auto mx-auto"
                />
              ) : (
                <MediaPlayer
                  src={`${supabase.storage.from('media').getPublicUrl(item.storage_path).data.publicUrl}`}
                  type={item.type.startsWith('video') ? 'video' : 'audio'}
                />
              )}
            </div>
            
            <Navigation
              onPrevious={handlePrevious}
              onNext={handleNext}
              showNavigation={!loading}
            />
            
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Posted by {item.user}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Score: {item.score}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Type: {item.type}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    export default MediaView;
