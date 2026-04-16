# Task Manager (Backend Assignment)

This is a full-stack Task Manager application built as part of a Backend Developer assignment.

It demonstrates secure authentication, role-based access, and CRUD operations with a simple frontend interface.

---

## 🚀 Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcrypt (password hashing)

### Frontend

* React (Vite)
* Axios

---

##  Features

* User Registration & Login (JWT-based authentication)
* Secure password hashing using bcrypt
* Role-based access (User / Admin)
* Task CRUD operations:

  * Create task
  * View tasks
  * Update task (edit / toggle complete)
  * Delete task
* Protected routes using middleware
* API error handling & validation
* Basic frontend UI to interact with APIs

---

##  Project Structure

```
project-root/
│
├── backend/
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middlewares/
│       └── utils/
│
├── frontend/
├── postman/
└── README.md
```

---

##  Setup Instructions

### 1. Clone the repository

```
git clone <your-repo-url>
cd project-root
```

---

### 2. Backend Setup

```
cd backend
npm install
```

Create a `.env` file:

```
PORT=8000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=1d
CORS_ORIGIN=http://localhost:5173
```

Run backend:

```
npm run dev
```

---

### 3. Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

##  API Documentation (Postman)

### Postman Collection

1. Import the Postman collection:
   `postman/taskmanager-postman-collection.json`

2. Import the environment:
   `postman/taskmanager-environment.json`

3. Set environment variable:

```
server = http://localhost:8000/api/v1
```

4. Run APIs in this order:

* Register
* Login
* Create Task
* Get Tasks
* Update Task
* Delete Task

---

##  Authentication Notes

* JWT access tokens are used for authentication
* Tokens are stored in HTTP-only cookies
* For simplicity, access tokens use extended expiry

In production:

* Refresh tokens and rotation should be implemented
* Secure cookies (HTTPS) should be enforced

---

##  Scalability Notes

* Modular folder structure for easy feature expansion
* Middleware-based authentication and authorization

Can be extended to:

* Microservices architecture
* Redis caching
* Load balancing
* Docker deployment

---

##  Summary

This project demonstrates:

* Clean API design
* Secure authentication practices
* Full-stack integration
* Scalable backend structure
