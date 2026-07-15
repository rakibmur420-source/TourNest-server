# 📚 TourNest – Travel Booking Platform (Server)

Express.js REST API backend for the TourNest travel booking platform. It manages authentication, users, tour packages, bookings, and administrative operations.

## 🔗 Client Repository

https://github.com/rakibmur420-source/TourNest-client

---

## ✨ Key Features

- JWT Authentication
- Role-based Authorization
- Tour Package CRUD Operations
- Booking Management
- User Management
- Secure Password Hashing
- MongoDB Database
- RESTful API
- CORS Configuration
- Environment Variable Support

---

## 📌 API Routes

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |
| POST | /api/auth/google | Google Authentication |

---

### Packages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/packages | Get All Packages |
| GET | /api/packages/:id | Get Package Details |
| POST | /api/packages | Create Package |
| PATCH | /api/packages/:id | Update Package |
| DELETE | /api/packages/:id | Delete Package |

---

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/bookings | Create Booking |
| GET | /api/bookings | Get User Bookings |
| PATCH | /api/bookings/:id | Update Booking |
| DELETE | /api/bookings/:id | Cancel Booking |

---

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Get All Users |
| PATCH | /api/users/:id | Update User |
| PATCH | /api/users/:id/role | Change User Role |
| DELETE | /api/users/:id | Delete User |

---

## 📦 Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT
- bcryptjs
- dotenv
- cors
- cookie-parser

---

## 🔐 Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=https://tour-nest-client-beta.vercel.app
```

---

## 🚀 Getting Started

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Run production server

```bash
npm start
```

---

## 👨‍💻 Author

**Rakib Hasan**

GitHub: https://github.com/rakibmur420-source
