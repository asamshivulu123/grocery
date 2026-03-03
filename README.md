# Hyperlocal Grocery Delivery App

A full-stack MERN application for gated communities with a customer mobile-first app and an admin dashboard.

## Tech Stack
- **Backend:** Node.js, Express, MongoDB Atlas, JWT, Socket.io
- **Frontend & Admin:** React (Vite), Tailwind CSS, Context API, Axios, Socket.io-client

## Project Structure
- `backend/` - REST API & Socket server
- `frontend/` - Resident/Customer mobile-first app
- `admin/` - Supermarket/Admin dashboard

## Setup Instructions

### 1. Database Setup
- Create a Cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Get the Connection String.

### 2. Backend Setup
- `cd backend`
- Rename `.env.example` to `.env` or just use `.env`.
- Update `MONGO_URI` with your connection string.
- Run `npm install`
- Run `npm run dev`

### 3. Frontend (Customer) Setup
- `cd frontend`
- Run `npm install`
- Run `npm run dev` (Runs on http://localhost:5173 by default)

### 4. Admin Dashboard Setup
- `cd admin`
- Run `npm install`
- Run `npm run dev` (Runs on http://localhost:5174 or similar)

## Features
- **Customer App:** JWT Auth, Add to Cart, Checkout, Real-time Order Tracking.
- **Admin Dashboard:** Analytics, Product CRUD, Order Status Management, Live notifications.
- **Real-time:** Socket.io for instant order alerts and status updates.
