# Readily - Workforce Readiness Dashboard

A workforce readiness dashboard designed to support staffing decisions during periods of workforce disruption. Provides real-time visibility of workforce availability, absence monitoring, and critical staffing gap identification.

## Features

### Team Lead View
- **List of employees** with active absences and escalation to HR
- **Remote vs onsite breakdown** visualization
- **Comparison to other team** absence statistics
- **Team availability** status and metrics
- **World RAG tab** with global absence distribution map
- **Interactive world map** showing absence severity by office location (London, New York, Johannesburg, Mumbai)

## Prerequisites

Before running the app, ensure you have installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

To verify installation, run:
```bash
node --version
npm --version
```

## Installation

1. Clone or navigate to the project directory:
```bash
cd Readily
```

2. Install dependencies:
```bash
npm install
```

This will download all required packages including:
- React 19
- Vite (build tool)
- ESLint (code linting)

## Running the App

### Development Server

Start the development server with hot module reloading:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

Build the app for production:

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Check code for errors and style issues:

```bash
npm run lint
```

## Project Structure

```
src/
├── components/           # React components
│   ├── TeamLeadTab.jsx  # Main dashboard container
│   ├── EmployeeList.jsx # Employee absence list
│   ├── TeamStats.jsx    # Team statistics and comparisons
│   ├── RAGStatus.jsx    # Red/Amber/Green status overview
│   └── WorldMap.jsx     # Global absence distribution map
├── data/
│   └── mockData.js      # Mock CSV data and utility functions
├── styles/              # Component styling
│   ├── TeamLeadTab.css
│   ├── EmployeeList.css
│   ├── TeamStats.css
│   ├── RAGStatus.css
│   └── WorldMap.css
├── App.jsx              # Main app component
└── main.jsx             # Entry point
```

## Data Source

The app currently uses mock CSV data for demonstration. The data structure includes:

- Employee information (ID, name, team)
- Absence details (type, start/end dates)
- Location information (office location, work type)
- Escalation status (flagged for HR review)

To integrate with your backend CSV data, update the `mockCSVData` in [src/data/mockData.js](src/data/mockData.js).

## Technologies

- **React 19** - UI framework
- **Vite 8** - Build tool and dev server
- **ESLint** - Code quality
- **CSS3** - Styling and responsive design

## Troubleshooting

### Port 5173 already in use
The dev server will try to use the next available port. Check the terminal output for the actual port.

### Dependencies not installing
Delete `node_modules` folder and `package-lock.json`, then run `npm install` again.

### Hot reload not working
Ensure you're editing files in the `src/` directory. Vite watches this folder for changes.
