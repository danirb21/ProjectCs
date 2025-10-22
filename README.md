<h1>ProjectCs</h1>

ProjectCs is a web application that maintains the weekly CS2 team rankings and displays them through an interactive web interface.

The backend updates the ranking daily on demand: it checks if today's ranking has already been fetched and only performs scraping if the data is outdated.

## Key Features

On-demand daily ranking updates: The backend checks if today’s ranking is already available and updates it if needed.

Web visualization: Displays teams with ranking, points, region, and logo.

Team details: Clicking on a team shows detailed information and its logo from the Liquipedia API.

Image proxy: Displays Liquipedia logos without CORS issues.

## 🛠 Technologies Used

Frontend: React

Backend: Node.js, Express, Puppeteer (for scraping)

Database: Minimal usage currently (planned for future enhancements)

Other tools: sessionStorage for temporary team data on the frontend

## ⚙️ Installation & Running

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
|`/latest-valve-ranking`| GET    | Returns the latest vale ranking data (VRS)                                                                       | None                                                                                       |

## 3. Setup Frontend
```
cd frontend
npm install
npm start
```
The React web app runs at http://localhost:3000.

## 4. Database (Optional / In Progress)

A MySQL setup exists, but database integration is currently minimal and mainly for future enhancements.
