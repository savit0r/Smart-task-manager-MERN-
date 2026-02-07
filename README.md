# Smart Task Manager (MERN Stack)

A full-stack task management application built with MongoDB, Express.js, React, and Node.js.

## 🌟 Features

### Core Functionality

- **User Authentication**: Secure registration and login with JWT-based authentication
- **Task Management**: Create, read, update, and delete tasks
- **Protected Routes**: API endpoints secured with authentication middleware
- **Responsive Design**: Modern UI that works on desktop and mobile devices

### Security Features

- **Password Encryption**: bcryptjs for secure password hashing (12 salt rounds)
- **JWT Tokens**: JSON Web Tokens with 7-day expiration
- **Input Validation**: Server-side validation for all user inputs
- **CORS Protection**: Configured Cross-Origin Resource Sharing
- **Error Handling**: Structured error responses with error codes

### User Experience

- **Real-time Feedback**: Loading states and error messages
- **Form Validation**: Client-side and server-side validation
- **Token Management**: Automatic token storage and retrieval
- **Session Persistence**: Login state maintained across sessions

## 🛠️ Tech Stack

### Frontend

- **React 18.3**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API requests
- **CSS3**: Custom styling with responsive design

### Backend

- **Node.js**: JavaScript runtime environment
- **Express 5**: Fast, minimalist web framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: ODM for MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing library
- **dotenv**: Environment variable management
- **cors**: Cross-Origin Resource Sharing middleware

### Database

- **MongoDB Atlas**: Cloud-hosted MongoDB database
- **User Model**: Name, email, password (hashed), timestamps
- **Task Model**: Title, description, status, priority, due date, user reference

## 📡 API Endpoints

### Authentication Routes

#### POST /auth/register

Register a new user account.

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201 Created):**

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "jwt_token_here"
}
```

**Error Responses:**

- 400: Missing fields, invalid email format, weak password
- 400: User already exists
- 500: Server error

#### POST /auth/login

Authenticate existing user.

**Request:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200 OK):**

```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**

- 400: Missing credentials, invalid email format
- 401: Invalid credentials
- 500: Server error

#### GET /auth/me

Get current authenticated user's profile.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**

```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

- 401: No token provided, invalid/expired token
- 404: User not found
- 500: Server error

### Task Routes (Protected)

#### GET /tasks

Get all tasks for authenticated user.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**

```json
{
  "tasks": [
    {
      "_id": "task_id",
      "title": "Complete project",
      "description": "Finish the MERN stack project",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2024-01-20T00:00:00.000Z",
      "user": "user_id",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### POST /tasks

Create a new task.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request:**

```json
{
  "title": "New Task",
  "description": "Task description",
  "priority": "medium",
  "dueDate": "2024-01-25T00:00:00.000Z"
}
```

**Response (201 Created):**

```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "task_id",
    "title": "New Task",
    "description": "Task description",
    "status": "pending",
    "priority": "medium",
    "dueDate": "2024-01-25T00:00:00.000Z",
    "user": "user_id",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
```

#### PUT /tasks/:id

Update an existing task.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request:**

```json
{
  "title": "Updated Task Title",
  "status": "completed"
}
```

**Response (200 OK):**

```json
{
  "message": "Task updated successfully",
  "task": {
    "_id": "task_id",
    "title": "Updated Task Title",
    "status": "completed",
    ...
  }
}
```

#### DELETE /tasks/:id

Delete a task.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**

```json
{
  "message": "Task deleted successfully"
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd Smart-task-manager-(MERN)
```

2. **Install server dependencies:**

```bash
cd server
npm install
```

3. **Configure environment variables:**
   Create a `.env` file in the server directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5001
```

4. **Install client dependencies:**

```bash
cd ../client
npm install
```

5. **Start the application:**

Terminal 1 (Server):

```bash
cd server
PORT=5001 node index.js
```

Terminal 2 (Client):

```bash
cd client
npm start
```

6. **Access the application:**

- Frontend: http://localhost:3001
- API: http://localhost:5001

## 📁 Project Structure

```
Smart-task-manager-(MERN)/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── vite.config.js      # Vite configuration
│   └── package.json
├── server/                  # Node.js backend
│   ├── config/             # Database configuration
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── index.js           # Server entry point
│   └── package.json
└── README.md
```

## 🔒 Security Best Practices Implemented

1. **Password Hashing**: bcrypt with 12 salt rounds
2. **JWT Authentication**: Tokens with 7-day expiration
3. **Input Validation**: Server-side validation for all inputs
4. **CORS Configuration**: Restricted to specific origins
5. **Error Handling**: No sensitive data in error messages
6. **MongoDB Sanitization**: Prevent injection attacks
7. **Environment Variables**: Sensitive data not in code

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
