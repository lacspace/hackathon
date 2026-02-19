# PharmaGuard - Startup Guide

## Prerequisites
Ensure MongoDB is running on your system.

### Option 1: Start MongoDB with Homebrew
```bash
brew services start mongodb-community
```

### Option 2: Start MongoDB with Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Option 3: Check if MongoDB is already running
```bash
lsof -i :27017
```

---

## Starting the Application

### Terminal 1: Start Backend Server (Port 5000)
```bash
cd /Users/apple/Downloads/hackathon/Rift_hackathon_project_using_healthcare/backend
npm run dev
```

Expected output:
```
🚀 Server running in development mode on port 5000
📄 Documentation available at http://localhost:5000/api-docs
✅ MongoDB Connected: localhost
```

### Terminal 2: Start Frontend (Port 3000)
```bash
cd /Users/apple/Downloads/hackathon/Rift_hackathon_project_using_healthcare
npm run dev
```

Expected output:
```
▲ Next.js 16.1.6
- Local: http://localhost:3000
```

---

## Troubleshooting

### Error: "Failed to fetch" from Frontend
- ✅ Ensure backend is running on port 5000
- ✅ Check MongoDB is connected (see logs)
- ✅ Check CORS is allowing localhost:3000

### Error: "ECONNREFUSED 127.0.0.1:27017"
- MongoDB is not running
- Start it with: `brew services start mongodb-community` or Docker command above

### API Documentation
Once running, view backend API docs at: http://localhost:5000/api-docs
