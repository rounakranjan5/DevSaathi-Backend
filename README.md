
A full-stack social networking platform designed for developers to connect, collaborate, and build their professional network. Built with modern web technologies and real-time communication features.

## 🚀 Live Demo

- **Frontend**: [DevSaathi Frontend](https://github.com/rounakranjan5/DevSaathi-frontend)
- **Backend**: Current Repository

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication with cookies
- Password encryption with bcrypt
- Secure session management

### 👤 User Management
- Complete user profiles with skills, about section, and profile pictures
- Profile editing and updates
- User discovery and browsing

### 🤝 Connection System
- Send connection requests (interested/ignored)
- Accept/reject incoming connection requests
- View and manage connections
- Connection status tracking

### 💬 Real-time Chat System
- One-on-one messaging between connected users
- Real-time message delivery using Socket.IO
- Chat history persistence
- Create and manage conversations

### 📧 Weekly Email Notifications
- Automated weekly email summaries for users with pending connection requests
- Personalized emails with sender details
- Scheduled delivery every Sunday at 5:00 AM IST
- Email notifications for new connection requests

### 🎯 User Feed
- Browse potential connections
- Skill-based user filtering
- Profile viewing and interaction

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **nodemailer** - Email sending functionality
- **node-cron** - Task scheduling for automated emails
- **date-fns** - Date utility library
- **CORS** - Cross-origin resource sharing


## ⚡ Real-time Features

### Socket.IO Events
- Real-time messaging between connected users
- Connection request notifications
- Chat room management
- Message delivery confirmation

## Database Schema

### User Model
- Personal information (name, email, age, gender)
- Skills array (max 10 skills)
- Profile picture and about section
- Authentication credentials

### Connection Request Model
- Sender and receiver user references
- Request status (ignored, interested, accepted, rejected)
- Timestamps for tracking

### Chat Model
- Participants array
- Message history with sender and timestamp
- Real-time message storage


**DevSaathi** - Connecting Developers, Building Communities 🤝