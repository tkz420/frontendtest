import { Link } from 'react-router-dom'

    export default function Navbar() {
      return (
        <nav className="navbar">
          <div className="container">
            <Link to="/" className="logo">
              b0ard
            </Link>
          </div>
        </nav>
      )
    }
