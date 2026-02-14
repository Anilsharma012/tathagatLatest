# TathaGat - CAT Exam Preparation Platform

## Overview
TathaGat is a full-stack education platform for CAT/XAT/SNAP exam preparation. It includes course management, mock tests, live classes, study materials, discussion forums, and payment integration.

## Project Architecture

### Frontend (React CRA)
- **Location**: `/frontend`
- **Port**: 5000 (bound to 0.0.0.0)
- **Framework**: Create React App (React 18)
- **Key Libraries**: react-router-dom, axios, chart.js, recharts, framer-motion, react-toastify, razorpay integration
- **Proxy**: `/api` and `/uploads` requests are proxied to the backend at `http://127.0.0.1:3001` via `src/setupProxy.js`

### Backend (Express.js)
- **Location**: `/backend`
- **Port**: 3001 (bound to 0.0.0.0)
- **Framework**: Express.js with Mongoose ORM
- **Database**: MongoDB Atlas (external)
- **Key Features**: JWT authentication, file uploads (multer), Razorpay payments, email (nodemailer), SMS (Karix), rate limiting, CORS

### Database
- **Type**: MongoDB Atlas (cloud-hosted)
- **Connection**: Via `MONGO_URI` environment secret
- **ORM**: Mongoose

## Environment Variables & Secrets

### Secrets (stored in Replit Secrets)
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - JWT signing key
- `RAZORPAY_KEY_ID` - Razorpay payment key
- `RAZORPAY_KEY_SECRET` - Razorpay payment secret
- `EMAIL_PASSWORD` - Gmail SMTP app password
- `KARIX_API_KEY` - Karix SMS API key

### Environment Variables
- `EMAIL` - Gmail address for SMTP
- `KARIX_SENDER_ID`, `KARIX_DLT_ENTITY_ID`, `KARIX_DLT_TEMPLATE_ID` - SMS config
- `KARIX_SMS_URL` - SMS API endpoint
- `NODE_ENV` - development/production
- `SKIP_SEED` - Skip database seeding (set to 1)

## Workflows
- **Backend Server**: `cd backend && node index.js` (port 3001)
- **Frontend**: `cd frontend && react-scripts start` (port 5000, webview)

## Recent Changes
- 2026-02-14: Initial Replit setup - migrated from GitHub import
  - Moved sensitive credentials from `.env` to Replit Secrets
  - Configured workflows for frontend and backend
  - Set up `.gitignore`
  - Backend binds to 0.0.0.0:3001, frontend to 0.0.0.0:5000
