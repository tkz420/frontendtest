import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = 'https://nbkjoywxmijaufsjxfob.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ia2pveXd4bWlqYXVmc2p4Zm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMDQ3ODEsImV4cCI6MjA1MTg4MDc4MX0.DI2ASqJ03s81V188MIt2EAsfUfKPNUs_odjJ72swQU8';

    export const supabase = createClient(supabaseUrl, supabaseKey);

    export const getMediaItems = async () => {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      return data;
    };

    export const getMediaItem = async (id: number) => {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching media item:", error);
      } else {
        console.log("Fetched media item:", data);
      }
      return data;
    };
