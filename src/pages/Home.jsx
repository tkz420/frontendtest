import { useEffect, useState } from 'react'
    import { supabase, testConnection } from '../supabaseClient'
    import { Link } from 'react-router-dom'

    export default function Home() {
      const [mediaItems, setMediaItems] = useState([])
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState(null)

      useEffect(() => {
        const initialize = async () => {
          try {
            // Test connection first
            await testConnection()
            
            // Fetch media items
            const { data, error } = await supabase
              .from('media_items')
              .select('*')
              .order('id', { ascending: false })

            if (error) throw error
            setMediaItems(data)
          } catch (err) {
            setError(err.message)
            console.error('Error:', err)
          } finally {
            setLoading(false)
          }
        }

        initialize()
      }, [])

      if (loading) return <div>Loading...</div>
      if (error) return <div>Error: {error}</div>

      return (
        <div className="grid">
          {mediaItems.map((item) => (
            <Link to={`/${item.id}`} key={item.id} className="media-item">
              <img
                src={item.thumb_path}
                alt={item.user}
                className="media-thumbnail"
              />
            </Link>
          ))}
        </div>
      )
    }
