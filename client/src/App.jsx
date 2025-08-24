import React, { useEffect, useState } from 'react'
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import Layout from './components/Layout';
import Login from './components/Login';
import SignUp from './components/Signup';


const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const handleAuthSubmit = data => {
    const user = {
      email: data.email,
      name: data.name || 'user',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'user')}&background=random`
    }
    setCurrentUser(user);
    navigate('/', { replace: true })
  }

  const handleLogOut = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login', { replace: true })
  }

  const protectedLayout = () => {
    <Layout user={currentUser} onLogout={handleLogOut}>
      <Outlet />
    </Layout>
  }
  return (
    <Routes>
      <Route path='/login' element={<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
        <Login onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/signup')} />
      </div>} />

      <Route path='/signup' element={<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
        <SignUp onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/login')} />
      </div>} />

      <Route path='/' element={<Layout />} />
    </Routes>
  )
}

export default App
