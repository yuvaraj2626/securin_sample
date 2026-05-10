# CVE Management System

A full-stack web application for managing Common Vulnerabilities and Exposures (CVE) data. This project provides a comprehensive platform to view, create, update, and delete CVE records with advanced filtering and pagination capabilities.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Frontend Features](#frontend-features)
- [Database Schema](#database-schema)
- [Project Optimization](#project-optimization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Project Overview

The **CVE Management System** is a modern web application built with the MERN stack (MongoDB, Express, React, Node.js). It allows users to:

- Browse and search CVE (Common Vulnerabilities and Exposures) records
- Filter CVEs by year, severity score, and modification date
- Create new CVE entries with detailed information
- Edit existing CVE records
- Delete CVE entries
- View detailed information about each CVE
- Paginate through large datasets efficiently

This application integrates with the NIST CVE database and automatically fetches and stores CVE data periodically using a scheduled background job.

---

## ✨ Features

### Backend Features
- ✅ **CRUD Operations**: Full Create, Read, Update, Delete functionality
- ✅ **Advanced Filtering**: Filter by year, CVSS score, and modification date
- ✅ **Pagination**: Efficient data handling with configurable page size
- ✅ **Data Validation**: Input validation and error handling
- ✅ **Scheduled Sync**: Automatic CVE data fetching from external sources
- ✅ **RESTful API**: Clean, well-organized API endpoints
- ✅ **Database Indexing**: Optimized MongoDB queries with proper indexes
- ✅ **CORS Support**: Cross-origin resource sharing enabled

### Frontend Features
- ✅ **Responsive UI**: Clean, modern interface
- ✅ **Component Architecture**: Modular, reusable React components
- ✅ **Modal Forms**: User-friendly create/edit modal dialogs
- ✅ **Real-time Search**: Filter and paginate results instantly
- ✅ **Detail View**: Comprehensive CVE information display
- ✅ **Action Buttons**: Quick access to create, view, edit, and delete operations
- ✅ **Error Handling**: User-friendly error messages and feedback

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose 9.6.2 ODM
- **Task Scheduler**: node-cron (for periodic CVE sync)
- **HTTP Client**: Axios 1.16.0
- **Environment**: dotenv 17.4.2
- **Development**: Nodemon (auto-reload on file changes)

### Frontend
- **Framework**: React 19.2.5 with Vite 8.0.10
- **Routing**: React Router DOM 7.15.0
- **HTTP Client**: Axios 1.16.0
- **Styling**: CSS Modules
- **Build Tool**: Vite (lightning-fast build tool)
- **Linting**: ESLint with React plugins

### Deployment
- **Version Control**: Git & GitHub
- **Package Management**: npm

---

## 📁 Project Structure

```
securin_sample/
│
├── backend/                          # Node.js/Express API server
│   ├── app.js                        # Express app initialization
│   ├── package.json                  # Backend dependencies
│   ├── .env                          # Environment variables (not in repo)
│   │
│   ├── config/
│   │   └── db.js                     # MongoDB connection configuration
│   │
│   ├── models/
│   │   └── cveModels.js              # Mongoose schemas (CVE, Progress)
│   │
│   ├── controllers/
│   │   └── cveContollers.js          # Business logic for CRUD operations
│   │
│   ├── routers/
│   │   └── cveRouters.js             # API route definitions
│   │
│   ├── services/
│   │   └── cveService.js             # External CVE data fetching & scheduling
│   │
│   └── utils/
│       └── resetDB.js                # Database reset utility
│
├── frontend/
│   └── cve_project/                  # React/Vite application
│       ├── package.json              # Frontend dependencies
│       ├── vite.config.js            # Vite configuration
│       ├── index.html                # HTML entry point
│       │
│       └── src/
│           ├── main.jsx              # React entry point
│           ├── App.jsx               # Root component
│           │
│           ├── services/
│           │   └── appService.js     # Axios API client
│           │
│           ├── pages/
│           │   ├── cvePages.jsx      # Main CVE list/detail component (273 lines)
│           │   └── cvePages.css      # Comprehensive styling
│           │
│           ├── components/           # Reusable React components
│           │   ├── CVETable.jsx      # CVE list table display
│           │   ├── CVEDetailView.jsx # Single CVE detail view
│           │   ├── CVECRUDModal.jsx  # Create/Edit form modal
│           │   ├── FilterSection.jsx # Filter dropdown controls
│           │   ├── PaginationSection.jsx # Pagination controls
│           │   └── navbar.jsx        # Navigation bar
│           │
│           └── assets/               # Static files (images, etc.)
│
└── README.md                         # This file

```

---

## 📦 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (v8 or higher) - comes with Node.js
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - **OR** MongoDB Atlas (cloud) - [Free Tier](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** - VS Code recommended - [Download](https://code.visualstudio.com/)

### Verify Installation
```bash
node --version        # Should show v16+
npm --version         # Should show v8+
git --version         # Should be installed
```

---

## 🚀 Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/securin_sample.git
cd securin_sample
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend/cve_project
npm install
cd ../..
```

### Step 4: Create Environment Files

**Backend (.env)** - Create `backend/.env`:
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/cve_database?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

**Frontend (.env)** - Create `frontend/cve_project/.env.local`:
```env
VITE_API_URL=http://localhost:5000
```

### Step 5: MongoDB Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service (Windows)
mongod

# Start MongoDB service (macOS)
brew services start mongodb-community

# Start MongoDB service (Linux)
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Get connection string
5. Add connection string to `.env` file

---

## ⚙️ Environment Setup

### Backend Environment Variables

```env
# MongoDB Connection String
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

### Frontend Environment Variables

```env
# API Base URL
VITE_API_URL=http://localhost:5000
```

---

## ▶️ Running the Application

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Output: `CVE API Server is running on http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend/cve_project
npm run dev
```
Output: `Local: http://localhost:5174`

### Option 2: Run Backend Only (for Production)
```bash
cd backend
npm start
```

### Option 3: Production Build (Frontend)
```bash
cd frontend/cve_project
npm run build
npm run preview
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Get All CVEs
```http
GET /cves?page=1&limit=10
```
**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Records per page, default 10

**Response:**
```json
{
  "cves": [...],
  "totalRecords": 150,
  "currentPage": 1,
  "totalPages": 15
}
```

#### 2. Get CVE by ID
```http
GET /cves/:id
```
**Parameters:**
- `id`: CVE ID (e.g., CVE-2024-1234)

**Response:**
```json
{
  "cveId": "CVE-2024-1234",
  "severity": "HIGH",
  "score": 7.5,
  "published": "2024-01-15T00:00:00.000Z",
  "description": "...",
  ...
}
```

#### 3. Filter CVEs by Year
```http
GET /cves/year/:year?page=1&limit=10
```
**Parameters:**
- `year`: Published year (e.g., 2024)

#### 4. Filter CVEs by CVSS Score
```http
GET /cves/score/:score?page=1&limit=10
```
**Parameters:**
- `score`: Minimum CVSS score (e.g., 7.0)

#### 5. Filter CVEs by Modified Days
```http
GET /cves/modified/:days?page=1&limit=10
```
**Parameters:**
- `days`: Last modified within N days (e.g., 30)

#### 6. Create New CVE
```http
POST /cves
Content-Type: application/json

{
  "cveId": "CVE-2024-5678",
  "sourceIdentifier": "nvd@nist.gov",
  "vulnStatus": "Active",
  "published": "2024-02-01T00:00:00.000Z",
  "description": "...",
  "severity": "CRITICAL",
  "score": 9.8,
  "attackVector": "NETWORK",
  "attackComplexity": "LOW",
  "exploitabilityScore": 3.9,
  "impactScore": 5.9
}
```

#### 7. Update CVE (Full Replacement)
```http
PUT /cves/:id
Content-Type: application/json

{
  "cveId": "CVE-2024-5678",
  "severity": "HIGH",
  "score": 7.5,
  ...
}
```

#### 8. Partial Update CVE
```http
PATCH /cves/:id
Content-Type: application/json

{
  "severity": "MEDIUM",
  "score": 5.5
}
```

#### 9. Delete CVE
```http
DELETE /cves/:id
```

---

## 🎨 Frontend Features

### Main Components

#### CVEPage Component (273 lines)
- Central state management
- List and detail view logic
- CRUD operation handlers
- Filter and pagination state

#### CVETable Component
- Displays CVE records in table format
- Action buttons (View, Edit, Delete)
- Loading and error states

#### CVEDetailView Component
- Shows comprehensive CVE information
- CVSS metrics display
- Back navigation

#### CVECRUDModal Component
- Reusable form for Create and Edit
- Form validation
- Success/error messaging

#### FilterSection Component
- Dropdown filter controls
- Year, Score, Days filters
- Apply filter button

#### PaginationSection Component
- Page navigation buttons
- Results per page selector
- Total records display

---

## 📊 Database Schema

### CVE Collection
```javascript
{
  _id: ObjectId,
  cveId: String (unique),           // e.g., "CVE-2024-1234"
  sourceIdentifier: String,         // e.g., "nvd@nist.gov"
  vulnStatus: String,               // e.g., "Active", "Analyzed"
  published: Date,                  // Publication date
  lastModified: Date,               // Last update timestamp
  description: String,              // Vulnerability description
  severity: String,                 // CRITICAL, HIGH, MEDIUM, LOW
  score: Number,                    // CVSS v3.1 score (0-10)
  attackVector: String,             // NETWORK, ADJACENT_NETWORK, LOCAL
  attackComplexity: String,         // LOW, HIGH
  exploitabilityScore: Number,      // 0-3.9
  impactScore: Number,              // 0-5.9
  raw: Mixed                        // Raw API response
}
```

### Indexes
- `{ severity, score }` - For filtered queries
- `{ published }` - For date-based queries
- `{ cveId, description }` - For text search

---

## 🚀 Project Optimization

### Code Optimization Completed
- **Original Size**: 837 lines (with duplicated code)
- **Optimized Size**: 273 lines (main component)
- **Reduction**: 67% code reduction

### Component Splitting
The main component was split into 5 focused, reusable components:
1. **CVETable** - Table display logic
2. **CVEDetailView** - Detail page logic
3. **CVECRUDModal** - Form modal logic
4. **FilterSection** - Filter controls
5. **PaginationSection** - Pagination controls

### Benefits
- ✅ Improved readability
- ✅ Enhanced reusability
- ✅ Easier testing and debugging
- ✅ Better performance
- ✅ Simplified maintenance

---

## 🔧 Troubleshooting

### Backend Issues

**Issue: "Missing MONGO_URL"**
```
Solution: Add MONGO_URL to backend/.env file
```

**Issue: "Cannot connect to MongoDB"**
```
Solution: 
1. Verify MongoDB is running (mongod service)
2. Check connection string format
3. Verify username/password if using Atlas
4. Check network access if using MongoDB Atlas
```

**Issue: "Port 5000 already in use"**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Frontend Issues

**Issue: "Cannot find module 'appService'"**
```
Solution: Check import paths in components, ensure appService.js exists
```

**Issue: "API calls returning 404"**
```
Solution:
1. Verify backend is running on port 5000
2. Check VITE_API_URL in .env.local
3. Verify API endpoints match backend routes
```

**Issue: "Module not found: Could not locate CSS file"**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Common Solutions

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install

# Update packages
npm update

# Check for vulnerabilities
npm audit
npm audit fix
```

---

## 👥 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow ES6+ conventions
- Use meaningful variable names
- Add comments for complex logic
- Test before submitting PR

---

## 📄 License

This project is licensed under the **ISC License**. See the LICENSE file for details.

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for similar problems
- Provide detailed error messages and steps to reproduce

---

## 🙏 Acknowledgments

- **NIST** - For providing CVE data
- **MongoDB** - For the flexible database
- **React** - For the frontend framework
- **Express** - For the backend framework

---

## 🔗 Quick Links

- [GitHub Repository](https://github.com/yourusername/securin_sample)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [Vite Documentation](https://vitejs.dev/)

---

## 📝 Notes

- **Database Sync**: CVE data is automatically synced every 6 hours via scheduled job
- **CORS**: Enabled for `http://localhost:3000` (can be modified in app.js)
- **API Rate Limiting**: Not currently implemented (consider for production)
- **Authentication**: Not currently implemented (recommended for production)

---

**Last Updated**: May 2026  
**Version**: 1.0.0

