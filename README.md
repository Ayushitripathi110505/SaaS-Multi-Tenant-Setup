# Multi-Tenant SaaS Platform

A full-stack multi-tenant SaaS platform built using the MERN stack that enables organizations to manage projects, tasks, users, and collaboration in a secure, isolated environment.

## 🚀 Features

- Multi-tenant architecture with complete tenant isolation
- JWT-based authentication and authorization
- Role-based access control (Admin, Manager, Employee)
- Project and task management
- Real-time notifications using Socket.IO
- Activity logs for user actions
- Task comments and collaboration
- File upload support for tasks
- Analytics dashboard
- Company profile management
- Responsive user interface

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO
- Multer

---

## 👥 User Roles

### Admin
- Manage company information
- Create and manage users
- Assign roles
- View analytics
- Manage projects and tasks

### Manager
- Create and manage projects
- Assign tasks
- Monitor project progress
- View team activities

### Employee
- View assigned tasks
- Update task status
- Upload attachments
- Add comments
- Receive notifications

---

## 📊 Dashboard

The platform provides:

- Total Projects
- Total Tasks
- Total Users
- Task Status Distribution
- Project Progress Overview

---

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Role-Based Authorization

---

## 📂 Project Structure

```
client/
│── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── services/
│   └── App.jsx

server/
│── controllers/
│── middleware/
│── models/
│── routes/
│── uploads/
│── utils/
│── server.js
```

---

## 📦 Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/multi-tenant-saas-platform.git
```

### Backend

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the backend:

```bash
npm start
```

---

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 📡 REST APIs

Implemented 20+ REST APIs including:

- Authentication
- User Management
- Company Management
- Project CRUD
- Task CRUD
- Comments
- Notifications
- Analytics
- Activity Logs
- File Uploads

---

## 📸 Screenshots

Add screenshots of:

- Login Page
- Dashboard
- Project Management
- Task Board
- Analytics
- User Management

---

## 🌟 Key Highlights

- Supports multiple organizations with isolated data
- Secure JWT authentication
- Role-based access control
- Real-time notifications
- Activity tracking
- Responsive design
- Scalable backend architecture

---

## 📈 Future Improvements

- Email notifications
- Calendar integration
- Team chat
- Advanced analytics
- Docker deployment
- CI/CD pipeline
- Unit and integration testing

---

## 👩‍💻 Author

**Ayushi Tripathi**

- GitHub: https://github.com/Ayushitripathi110505
- LinkedIn: *(Add your LinkedIn profile)*
