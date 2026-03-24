# 🔐 Face & GeoMap Authentication System

A **production-ready**, full-stack face recognition authentication system with **location-based login enforcement**. Users register with their face + GPS coordinates, and can only login from their registered location.

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)

---

## ✨ Key Features

### 🧑‍💻 Face Recognition Authentication
- **Multi-angle face capture** during registration (front, left, right, up)
- **Real-time face verification** with continuous auto-scanning during login
- **Liveness detection** to prevent spoofing (blink detection, head position checks)
- **YuNet + SFace ONNX models** — zero-compilation, lightweight face detection & recognition
- **AES-256 encrypted** face embeddings stored in MongoDB

### 📍 Location-Based Login (GeoMap)
- **GPS geofencing** — users can only login within **100m** of their registered location
- **Real-time location detection** using browser Geolocation API
- **Live interactive map** with OpenStreetMap showing registered vs current location
- **Distance calculation** using Haversine formula
- **Location mismatch popup** — shows exact distance, both coordinates, and re-registration prompt
- **Both password-login AND face-login** enforce location checks

### 🔒 Security
- **JWT authentication** with access + refresh tokens
- **Bcrypt password hashing**
- **Rate limiting middleware**
- **Security headers** (HSTS, X-Frame-Options, CSP)
- **CORS configuration**
- **Encrypted face data at rest** (Fernet/AES-128-CBC)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, TailwindCSS, React Router, React Hot Toast |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Motor (async MongoDB) |
| **Database** | MongoDB |
| **Face Recognition** | OpenCV DNN (YuNet face detector + SFace face recognizer) |
| **Maps** | Leaflet.js + OpenStreetMap |
| **Auth** | JWT (PyJWT), Bcrypt, Fernet encryption |

---

## 📁 Project Structure

```
face-auth/
├── backend/
│   ├── main.py                          # FastAPI entry point
│   ├── app/
│   │   ├── config/
│   │   │   ├── settings.py              # Environment config
│   │   │   └── database.py              # MongoDB connection manager
│   │   ├── models/
│   │   │   └── user.py                  # Pydantic schemas + DB models
│   │   ├── routes/
│   │   │   └── auth_routes.py           # API endpoints
│   │   ├── services/
│   │   │   ├── auth_service.py          # Auth logic + location checks
│   │   │   └── face_recognition.py      # Face detection & recognition
│   │   ├── middleware/
│   │   │   └── auth_middleware.py        # JWT validation + rate limiting
│   │   └── utils/
│   │       ├── encryption.py            # Face embedding encryption
│   │       └── logging_config.py        # Structured logging
│   ├── models/                          # ONNX model files
│   │   ├── face_detection_yunet_*.onnx
│   │   └── face_recognition_sface_*.onnx
│   ├── requirements.txt
│   └── .env                             # Environment variables
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx            # Login with location check
│   │   │   ├── RegisterPage.jsx         # Registration with GPS capture
│   │   │   ├── LocationPage.jsx         # Live location map
│   │   │   └── DashboardPage.jsx        # User dashboard
│   │   ├── components/
│   │   │   ├── face/
│   │   │   │   ├── FaceVerification.jsx # Real-time face verification
│   │   │   │   └── FaceCaptureRegistration.jsx
│   │   │   └── map/
│   │   │       └── LocationMap.jsx      # Interactive OpenStreetMap
│   │   ├── hooks/
│   │   │   ├── useGeolocation.js        # GPS tracking hook
│   │   │   └── useCamera.js             # Camera access hook
│   │   ├── services/
│   │   │   └── authService.js           # API client
│   │   └── context/
│   │       └── AuthContext.jsx          # Auth state management
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ & npm
- **Python** 3.11+
- **MongoDB** (local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/Rakeshbjp/Face_Giomap-authentication-system.git
cd Face_Giomap-authentication-system
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URL and secrets
```

**`.env` Configuration:**
```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=face_auth
JWT_SECRET_KEY=your-super-secret-key-change-this
EMBEDDING_ENCRYPTION_KEY=your-encryption-key-change-this
DEBUG=true
HOST=0.0.0.0
PORT=8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install
```

### 4. Run the Application
```bash
# Terminal 1 — Backend
cd backend
venv\Scripts\python.exe main.py
# Server starts at http://localhost:8000

# Terminal 2 — Frontend
cd frontend
npm run dev
# App opens at http://localhost:3000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user with face images + location |
| `POST` | `/api/auth/login` | Login with email/password + location check |
| `POST` | `/api/auth/verify-face` | Verify face after password login |
| `POST` | `/api/auth/face-login` | Direct face login + location check |
| `GET` | `/api/auth/profile` | Get authenticated user profile |
| `PUT` | `/api/auth/update-face` | Update face data |
| `GET` | `/api/auth/health` | Health check |

---

## 🗺️ Location-Based Login Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  REGISTER   │     │    LOGIN     │     │  LOCATION CHECK │
│             │     │              │     │                 │
│ • Face data │────▶│ • Email/Pass │────▶│ • GPS detected  │
│ • GPS saved │     │ • OR Face    │     │ • Compare with  │
│ (lat, lng)  │     │ • GPS sent   │     │   registered    │
└─────────────┘     └──────────────┘     │ • Distance ≤    │
                                         │   100m? ✅ Pass  │
                                         │ • Distance >    │
                                         │   100m? ❌ Fail  │
                                         └─────────────────┘
```

**If location mismatch:**
- Shows **LOGIN FAILED** popup with:
  - Distance from registered location
  - Both GPS coordinates (registered vs current)
  - Button to re-register from new location

---

## 🛡️ Security Architecture

- **Passwords**: Bcrypt hashed (12 rounds)
- **Face Embeddings**: AES-128-CBC encrypted at rest (Fernet)
- **Tokens**: JWT with configurable expiry (access: 30min, refresh: 7days)
- **Location**: GPS coordinates stored and compared using Haversine formula
- **Rate Limiting**: Configurable per-IP request throttling
- **Headers**: HSTS, X-Frame-Options DENY, X-XSS-Protection, no-cache

---

## 📸 Screenshots

### Login Page with Location Detection
- Real-time GPS coordinate display
- Location mismatch error popup

### Registration with GPS Capture
- Multi-angle face capture (4 directions)
- Location auto-captured during registration

### Live Location Map
- Interactive OpenStreetMap with registered vs current position
- Distance and login eligibility indicator

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 👤 Author

**Rakesh** — [GitHub](https://github.com/Rakeshbjp)

Built with ❤️ using FastAPI, React, OpenCV, and MongoDB.
