# ProjectCs

**ProjectCs** is a web application currently in development that tracks and displays weekly **CS2 team rankings** through an interactive web interface.

This project is being developed as a learning and experimentation exercise, with plans to expand functionality over time.

---

## Project Overview

The backend updates the ranking data on demand — it checks whether the current day’s ranking has already been fetched and performs scraping only when needed.

The frontend provides a simple visualization of the teams, their points, regions, and logos.

---

## Current Features

- **On-demand ranking updates:** The backend automatically verifies if today’s data is already stored before fetching new information.  
- **Team visualization:** Interactive frontend showing teams, ranking, and points.  
- **Team details:** Clicking on a team displays additional info (via Liquipedia API).  
- **Image proxy:** Allows Liquipedia logos to load without CORS issues.

---

## Technologies Used

- **Frontend:** React  
- **Backend:** Node.js, Express, Puppeteer (for scraping)  
- **Database:** MySQL *(planned for future integration)*  
- **Other tools:** `sessionStorage` for temporary data handling on the frontend  

---

## ⚙️ Installation & Running (Development mode)

## 1. Clone the repository
    git clone https://github.com/danirb21/ProjectCs.git
    cd ProjectCs

## 2. Setup Backend
    cd backend  
    npm install  
    npm start

The backend runs at http://localhost:5000.

| Endpoint           | Method | Description                                                                                           | Parameters / Query                                                                         |
| ------------------ | ------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `/image-proxy`     | GET    | Returns an image from an external URL through a proxy (avoids CORS issues)                            | `url` (query string) – the URL of the image                                                |
| `/team/:name`  | GET    | Returns team information including the Liquipedia logo URL                                            | `name` (path parameter)
|`/latest-valve-ranking`| GET    | Returns the latest valve ranking data (VRS)                                                                       | None                                                                                       |

## 3. Setup Frontend
```
cd frontend
npm install
npm start
```
The React web app runs at http://localhost:3000.

## 4. Database (Optional / In Progress)

A MySQL setup exists, but database integration is currently minimal and mainly for future enhancements.
