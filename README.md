<h1>ProjectCs</h1>

ProjectCs is a web application that maintains the weekly CS2 team rankings and displays them through an interactive web interface.

The backend updates the ranking daily on demand: it checks if today's ranking has already been fetched and only performs scraping if the data is outdated.

## Key Features
Daily ranking updates: The backend scrapes HLTV and updates the latest ranking automatically.

Web visualization: Displays teams with ranking, points, region, and logo.

Team details: Clicking on a team shows detailed information and its logo from the Liquipedia API.

Image proxy: Displays Liquipedia logos without CORS issues.

## 🛠 Technologies Used

Frontend: React, Axios

Backend: Node.js, Express, Puppeteer (for scraping)

Database: Minimal usage currently (planned for future enhancements)

Other tools: sessionStorage for temporary team data on the frontend
