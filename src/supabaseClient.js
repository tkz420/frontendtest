import { createClient } from '@supabase/supabase-js'

    // Validate environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Missing Supabase credentials. Please check your .env file'
      )
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test connection
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('media_items')
          .select('*')
          .limit(1)

        if (error) {
          console.error('Supabase connection error:', error)
          throw error
        }

        console.log('Supabase connected successfully')
        return data
      } catch (error) {
        console.error('Failed to connect to Supabase:', error)
        throw error
      }
    }

    // Export client and test function
    export { supabase, testConnection }
