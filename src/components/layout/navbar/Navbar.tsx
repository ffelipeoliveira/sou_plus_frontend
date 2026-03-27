// Navbar.tsx
import { Link } from 'react-router-dom';
import UserProfile from '../../features/userProfile';
import Logo from '../../common/logo/Logo';
import './navbar.css'

function Navbar() {
  return (
    <>
      <div className="wrapper"></div>
      <div className="navbar space-between">
        <UserProfile/>
        <Link to={'/'}><Logo/></Link>
        <div className="navbar-spacer"></div> {/* For layout balance */}
      </div>
    </>
  )
}

export default Navbar