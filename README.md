# TechSphere – MERN Stack Technology Blog

TechSphere is a full-stack technology blog application developed using the MERN stack. It provides a platform to explore technology articles and an admin interface to manage blog content.

## Technologies Used

- **Frontend:** React.js, Vite, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JSON Web Token (JWT)
- **API Testing:** Thunder Client
- **Version Control:** Git and GitHub

## Features

### User Interface
- Responsive technology blog homepage
- Featured and latest articles
- Category-based filtering
- Keyword search
- Article detail view

### Admin Panel
- Admin login with authentication
- Show/hide password option
- Create, edit, and delete articles
- Publish articles or save them as drafts
- Select featured articles
- Manage article details, categories, and authors
- Protected article management APIs

## Project Structure

```text
softrate-blog/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── .gitignore
└── README.md
```

## Running the Project Locally

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd softrate-blog
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder with your own MongoDB connection string and authentication settings.

Required variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_secret_key
```

### 3. Start the backend

```bash
npm run dev
```

### 4. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run locally using Vite.

## Project Status

Core blog functionality, MongoDB integration, admin authentication, and article CRUD operations have been implemented and tested locally.

Deployment and additional enhancements are in progress.