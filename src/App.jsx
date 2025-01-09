import { Routes, Route } from 'react-router-dom'
    import Home from './pages/Home'
    import MediaView from './pages/MediaView'
    import NotFound from './pages/NotFound'
    import Navbar from './components/Navbar'

    function App() {
      return (
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:id" element={<MediaView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      )
    }

    export default App
