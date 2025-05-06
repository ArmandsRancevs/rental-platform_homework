# Rental Platform Homework

## Project Structure

```
Rental_Platform_Homework/
├── backend/
│   ├── models/
│   │   ├── Listing.js
│   │   ├── Reservation.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── listings.js
│   │   ├── reservations.js
│   │   └── user.js
│   ├── server.js
│   ├── start.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   ├── robots.txt
│   │   └── _redirects
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AdminPage.js
│   │   │   └── BrowsePage.js
│   │   ├── utils/
│   │   │   ├── availability.js
│   │   │   └── date.js
│   │   ├── config.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── reportWebVitals.js
│   │   ├── setupTests.js
│   │   └── App.test.js
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
├── .gitignore
├── netlify.toml
└── README.md
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev       # start with auto-reload
```

Runs on [http://localhost:5000](http://localhost:5000).

### Frontend

```bash
cd frontend
npm install
npm start         # starts CRA dev server
```

Runs on [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` in backend: starts server with nodemon.
- `npm start` in backend: runs server once.
- `npm start` in frontend: starts React dev server.
- `npm run build` in frontend: builds static assets.

## Deployment

This setup uses Netlify. Configuration in `netlify.toml` routes API calls to functions and serves the SPA.

