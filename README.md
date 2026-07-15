# Bux Designs

A full-stack MERN portfolio platform built for a design agency, featuring a public-facing showcase site and a powerful admin dashboard for managing team content, projects, and client interactions.

## 🎨 About

Bux Designs is a designer/agency portfolio website where the admin manages their own work along with their team's projects, blog posts, and client reviews — all through a secure, custom-built dashboard.

## ✨ Features

- **Public Portfolio Site** — Dynamic project showcase with smooth animations
- **Blog Management** — Full CRUD blog system manageable from the admin dashboard
- **Team Management** — Add, view, and manage team member profiles
- **Client Reviews** — Testimonials section with Swiper-based slider
- **Authentication & RBAC** — JWT-based auth with role-based access control
- **Gate Code Access** — PIN-protected access system with progressive lockout for extra security
- **Admin Dashboard** — Centralized panel for quotes, blogs, portfolio, reviews, team, and account settings
- **System Toggle** — Admin can activate/deactivate quote submissions and CRUD operations
- **Cloudinary Integration** — Optimized image upload and management
- **Production-Grade Logging** — Winston with daily log rotation for error tracking

## 🛠️ Tech Stack

**Frontend**
- React.js
- Bootstrap / SCSS
- Swiper.js (carousels/sliders)
- Custom Hooks (scroll-triggered animations via IntersectionObserver)

**Backend**
- Node.js / Express.js
- MongoDB / Mongoose
- JWT Authentication
- express-validator

**Other Tools**
- Cloudinary (image storage)
- Winston + winston-daily-rotate-file (logging)