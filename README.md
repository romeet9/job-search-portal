# DesignJobs India — Product Design & UI/UX Map

An interactive, live job board for designers in India. Powered by RapidAPI JSearch.

## Setup Instructions

### 1. Prerequisites
- Node.js (v16+)
- Python 3 (to serve the frontend)

### 2. Live Data Source (MCP)
This project uses the **RapidAPI Hub - JSearch** MCP server. To enable live fetching, ensure your environment is configured with the following MCP settings:

```json
{
  "mcpServers": {
    "RapidAPI Hub - JSearch": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.rapidapi.com",
        "--header",
        "x-api-host: jsearch.p.rapidapi.com",
        "--header",
        "x-api-key: 1998a180b8msh0af4c8f2452816fp1d70ebjsne4813048b27b"
      ]
    }
  }
}
```

### 3. Running Locally

#### Step A: Install Dependencies
```bash
npm install
```

#### Step B: Start Proxy Server
```bash
node server.js
```
The proxy runs at `http://localhost:3000` and handles 12-hour caching of JSearch results.

#### Step C: Serve Frontend
```bash
python3 -m http.server 8765
```
Open [http://localhost:8765](http://localhost:8765) in your browser.

## Features
- **Map-First Navigation:** Interactive map with company markers.
- **Live Data:** Fetches real jobs from JSearch (cached twice daily).
- **Brand Colors:** Company logos appear in full color against a sleek monochromatic map.
- **City Filtering:** Shortlist roles in Bengaluru, Mumbai, Pune, Hyderabad, Delhi, and Chennai.
