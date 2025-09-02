# Chat App

A real-time 1:1 chat application with authentication, online presence, unread badges, and toast notifications. The platform offers a clean UI for conversations, user profiles with image upload, and a settings page with a theme switcher featuring **32 DaisyUI themes**.

## Table of Contents
- [Live Preview](#live-preview)
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Public Part (Unauthenticated Access)](#public-part-unauthenticated-access)
- [Private Part (User Area)](#private-part-user-area)
- [Key Features](#key-features)
  - [Chat & Presence](#chat--presence)
  - [Notifications & Unread](#notifications--unread)
  - [Profile & Settings](#profile--settings)

## Live Preview

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open-green?style=for-the-badge)](<!-- add your deployed URL here -->)

**Important Note:**  
If you encounter Error 502 Bad Gateway, the servers are down so you try again in a few minutes.

## Test User - email: **pesho@abv.bg** password: **asdasd** (or register your own)

## Project Overview

This project includes:
- Public and private sections
- User authentication (JWT)
- Real-time messaging (Socket.IO)
- Online users presence
- Unread message badges & 3s toast notifications
- Client-side routing

## Technologies Used

- **Frontend:**
  - React (Vite)
  - Zustand (state management)
  - socket.io-client
  - Tailwind CSS with DaisyUI (32 themes)
  - react-hot-toast (notifications)
  - Lucide React (icons)

- **Backend:**
  - Node.js + Express
  - Socket.IO
  - MongoDB (Mongoose)
  - Cloudinary (profile image uploads)
  - JWT (authentication)

[![React](https://img.shields.io/badge/React-✓-blue)]() [![Zustand](https://img.shields.io/badge/Zustand-✓-orange)]() [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-✓-informational)]() [![DaisyUI](https://img.shields.io/badge/DaisyUI-✓-purple)]() [![Socket.IO](https://img.shields.io/badge/Socket.IO-✓-black)]() [![MongoDB](https://img.shields.io/badge/MongoDB-✓-brightgreen)]() [![Express](https://img.shields.io/badge/Express-✓-lightgrey)]() [![Cloudinary](https://img.shields.io/badge/Cloudinary-✓-blueviolet)]() [![JWT](https://img.shields.io/badge/JWT-✓-yellowgreen)]()

## Public Part (Unauthenticated Access)
- Login/Register pages
- **Settings:** Switch among 32 DaisyUI themes

## Private Part (User Area)
- **Home:** Sidebar with contacts + chat window (1:1 messaging)
- **Profile:** Update profile picture (Cloudinary)


## Key Features

### Chat & Presence
- **Direct Messages:** Real-time 1:1 conversations
- **Online Indicator:** Live online/offline status via Socket.IO

### Notifications & Unread
- **Unread Badges:** Per-user unread counters in the sidebar
- **Toast Alerts:** 3-second toast when a new message arrives and that chat isn’t open

### Profile & Settings
- **Profile Image:** Upload and update via Cloudinary
- **Theme Switcher:** Choose from 32 DaisyUI themes
