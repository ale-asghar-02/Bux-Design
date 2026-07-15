import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './features/portfolio/pages/Portfolio'
import CaseStudy from './pages/CaseStudy'
import Services from './pages/Services'
import Blog from './features/blog/pages/Blog'
import BlogDetail from './features/blog/pages/BlogDetail'
import Quote from './features/quote/pages/Quote'
import NotFound from './pages/NotFound'
import ReviewSubmit from './features/review/pages/ReviewSubmit'

import GuestRoute from './features/auth/routes/GuestRoute'
import PrivateRoute from './features/auth/routes/PrivateRoute'
import ProtectedRoute from './features/auth/routes/ProtectedRoute'

import Dashboard from './features/dashboard/pages/Dashboard'
import CreatePortfolio from './features/portfolio/pages/CreatePortfolio'

import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import ResetPassword from './features/auth/pages/ResetPassword'
import ResetCode from './features/auth/pages/ResetCode'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/portfolio' element={<Portfolio />} />
      <Route path='/case-study' element={<CaseStudy />} />
      <Route path='/services' element={<Services />} />
      <Route path='/blogs' element={<Blog />} />
      <Route path='/blog-details/:id' element={<BlogDetail />} />
      <Route path='/quote' element={<Quote />} />

      <Route path='*' element={<NotFound />} />
      <Route path='/review/:token' element={<ReviewSubmit />} />

      <Route path='/user/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path='/user/create/portfolio' element={<PrivateRoute><CreatePortfolio /></PrivateRoute>} />

      <Route path='/register' element={<ProtectedRoute><Register /></ProtectedRoute>} />
      <Route path='/login' element={<GuestRoute><ProtectedRoute><Login /></ProtectedRoute></GuestRoute>} />
      <Route path='/reset-password/:token' element={<GuestRoute><ResetPassword /></GuestRoute>} />
      <Route path='/reset-code/:token' element={<GuestRoute><ResetCode /></GuestRoute>} />
    </Routes>
  )
}

export default App