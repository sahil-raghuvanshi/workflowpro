import React from 'react'
import Navbar from './Navbar'
const Layout = ({onLogout,user}) => {
  return (
    <div>
     <Navbar user={user} onLogout={onLogout} />
    </div>
  )
}

export default Layout
