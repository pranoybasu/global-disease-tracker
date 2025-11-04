# Global Disease Tracker - Usage Guide

Complete guide for using the Global Disease Tracker application.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Navigation](#navigation)
4. [Detailed Statistics Pages](#detailed-statistics-pages)
5. [Export & Sharing](#export--sharing)
6. [Advanced Features](#advanced-features)
7. [Keyboard Shortcuts](#keyboard-shortcuts)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Application

**Local Development:**
```bash
npm run dev
```
Visit: `http://localhost:5173`

**Production:**
Visit: [https://global-disease-tracker-ws0794eak-pranoybasus-projects.vercel.app](https://global-disease-tracker-ws0794eak-pranoybasus-projects.vercel.app)

### System Requirements
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript enabled
- Minimum 1024x768 screen resolution (responsive down to 320px)
- Internet connection for real-time data

---

## Dashboard Overview

The main dashboard (`/`) provides a high-level overview of the selected disease:

### Components

#### 1. Disease Selector
- **Location:** Top-left dropdown in control panel
- **Function:** Switch between COVID-19, Influenza, Mpox, Malaria, Dengue
- **Behavior:** Entire UI updates with disease-specific theming and data

#### 2. Global Statistics Cards
Four main metrics displayed prominently:
- **Total Cases:** Cumulative confirmed cases worldwide
- **Deaths:** Total fatalities attributed to the disease
- **Recovered:** Number of patients who have recovered
- **Active Cases:** Currently active infections (Total - Recovered - Deaths)

Each card shows:
- Current value (animated counter)
- 7-day trend indicator (↑ increasing, ↓ decreasing)
- Percentage change from previous week
- Click to view detailed statistics

#### 3. Interactive World Map
- **Markers:** Circular markers sized by case count
- **Colors:** Disease-specific color scheme
- **Interaction:**
  - Hover over markers to see country details
  - Zoom in/out with mouse wheel or controls
  - Pan by clicking and dragging

#### 4. Top 10 Countries Table
- **Sorting:** By active cases (descending)
- **Columns:** Country, Total Cases, Deaths, Recovered, Active Cases
- **Interaction:** Scroll on mobile, full table on desktop

---

## Navigation

### Route Structure

| Route | Description | Example |
|-------|-------------|---------|
| `/` | Main dashboard | Home page |
| `/stats/:disease/:metric` | Detailed statistics | `/stats/covid19/total-cases` |

### Navigating to Detailed Stats

**Method 1: Click Statistic Cards**
1. On dashboard, click any of the four statistic cards
2. Automatically routes to corresponding detailed page
3. Preserves disease selection

**Method 2: Direct URL**
- Manually navigate to `/stats/{disease}/{metric}`
- Valid diseases: `covid19`, `influenza`, `mpox`, `malaria`, `dengue`
- Valid metrics: `total-cases`, `deaths`, `recovered`, `active-cases`

**Breadcrumb Navigation:**
- Click "← Back to Dashboard" to return home
- Preserves all dashboard settings

---

## Detailed Statistics Pages

Comprehensive analysis of specific disease metrics.

### Layout

```
┌─────────────────────────────────────────┐
│ Breadcrumb   │   Title    │   Export    │
├─────────────────────────────────────────┤
│                                         │
│           Charts (Tabs)                 │
│  - Country Comparison                   │
│  - Continental Distribution             │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         Data Table with Filters         │
│                                         │
└─────────────────────────────────────────┘
```

### Interactive Charts

#### Country Comparison Chart

**Purpose:** Compare top 10 countries by selected metric

**Chart Types:**
- **Bar Chart** (default): Best for comparing discrete values
- **Line Chart:** Shows trends and connections
- **Area Chart:** Emphasizes magnitude with filled areas

**Features:**
- Hover tooltips with exact values
- Responsive sizing (adapts to screen width)
- Disease-specific color theming
- Automatic top 10 selection

**Controls:**
- Toggle between chart types using tabs above chart
- Automatically resorts data for optimal display

#### Metric Distribution Chart

**Purpose:** Show continental breakdown of cases

**Chart Types:**
- **Pie Chart** (default): Shows proportions clearly
- **Donut Chart:** Modern variant with center label

**Features:**
- Percentage labels on segments
- Hover tooltips with absolute values
- Legend with continent names
- Color-coded by continent

**Continents Tracked:**
- Asia
- Europe
- North America
- South America
- Africa
- Oceania

### Data Table

#### Search & Filter

**Search by Country:**
```
[🔍 Search countries...]
```
- Type country name (case-insensitive)
- Real-time filtering as you type
- Clear button (×) to reset

**Filter by Continent:**
```
[Continent: All ▼]
```
- Dropdown with continent options
- "All" shows all countries
- Combines with search filter

#### Sorting

Click any column header to sort:
- First click: Ascending order (↑)
- Second click: Descending order (↓)
- Third click: Reset to default

**Sortable Columns:**
- Country (alphabetical)
- Continent (alphabetical)
- Value (numerical)

#### Pagination

Controls at bottom of table:

```
[◀ Previous] Page 1 of 10 [Next ▶]
[Show: 10 ▼] entries per page
```

**Rows per page options:**
- 10 (default)
- 25
- 50
- 100

**Navigation:**
- Previous/Next buttons
- Page indicator shows current position
- Automatically resets to page 1 when filtering

---

## Export & Sharing

### Accessing Export Options

1. Navigate to any detailed statistics page
2. Click "Export" button in top-right corner
3. Select desired export format from modal

### Export Formats

#### 1. PDF Export 📄

**Best for:** Reports, presentations, documentation

**Contents:**
- Full page capture including charts
- Title with disease and metric
- Timestamp
- All visible data

**Technical Details:**
- Format: PDF (Portable Document Format)
- Resolution: High quality (2x scale)
- Size: Typically 200KB - 2MB
- Orientation: Portrait

**Steps:**
1. Click "Export as PDF"
2. Wait for processing (1-3 seconds)
3. File downloads automatically
4. Success notification appears

**Filename Example:**
```
covid19-total-cases-2025-01-04T13-30-45.pdf
```

#### 2. PNG Export 🖼️

**Best for:** Quick sharing, social media, presentations

**Contents:**
- High-resolution screenshot
- Full page including charts and tables
- Transparent or white background

**Technical Details:**
- Format: PNG (Portable Network Graphics)
- Resolution: 2x retina display (high DPI)
- Size: Typically 500KB - 5MB
- Dimensions: Variable (based on viewport)

**Steps:**
1. Click "Export as PNG"
2. Wait for rendering (1-2 seconds)
3. Image downloads automatically
4. Success notification appears

**Filename Example:**
```
covid19-deaths-2025-01-04T13-30-45.png
```

#### 3. CSV Export 📊

**Best for:** Data analysis, Excel, Google Sheets, R, Python

**Contents:**
- Country name
- Continent
- Metric value
- Header row included

**Technical Details:**
- Format: CSV (Comma-Separated Values)
- Encoding: UTF-8
- Line endings: CRLF (Windows compatible)
- Size: Typically 1-50KB

**Sample Data:**
```csv
Country,Continent,Value
United States,North America,45678901
India,Asia,34567890
Brazil,South America,23456789
```

**Steps:**
1. Click "Export as CSV"
2. File downloads instantly
3. Success notification appears

**Filename Example:**
```
malaria-active-cases-2025-01-04T13-30-45.csv
```

**Usage:**
- Open in Excel: File → Open → Select CSV
- Import to Google Sheets: File → Import → Upload
- Python: `pd.read_csv('filename.csv')`
- R: `read.csv('filename.csv')`

#### 4. JSON Export 💾

**Best for:** APIs, data pipelines, programmatic analysis, archiving

**Contents:**
- Structured data with metadata
- Disease identifier
- Metric identifier
- ISO 8601 timestamp
- Complete country array

**Technical Details:**
- Format: JSON (JavaScript Object Notation)
- Structure: Single root object
- Encoding: UTF-8
- Size: Typically 2-100KB
- Formatted: Pretty-printed with 2-space indent

**Sample Structure:**
```json
{
  "disease": "covid19",
  "metric": "total-cases",
  "exportedAt": "2025-01-04T13:30:45.123Z",
  "data": [
    {
      "country": "United States",
      "continent": "North America",
      "value": 45678901
    },
    {
      "country": "India",
      "continent": "Asia",
      "value": 34567890
    }
  ]
}
```

**Steps:**
1. Click "Export as JSON"
2. File downloads instantly
3. Success notification appears

**Filename Example:**
```
dengue-recovered-2025-01-04T13-30-45.json
```

**Usage:**
- JavaScript: `const data = JSON.parse(fileContent)`
- Python: `import json; data = json.load(file)`
- Command line: `cat file.json | jq .`

#### 5. Share Link 🔗

**Best for:** Collaboration, bookmarking, email sharing

**Contents:**
- Current page URL
- Disease parameter
- Metric parameter
- Exact route preserved

**Technical Details:**
- Uses browser Clipboard API
- Copies to system clipboard
- No file download
- Instant operation

**Steps:**
1. Click "Copy Shareable Link"
2. URL copied to clipboard
3. Success notification: "Link copied!"
4. Paste anywhere (Ctrl+V / Cmd+V)

**Example URLs:**
```
https://your-domain.com/stats/covid19/total-cases
https://your-domain.com/stats/influenza/deaths
https://your-domain.com/stats/mpox/active-cases
```

**Use Cases:**
- Email to colleagues
- Slack/Teams message
- Bookmark for later
- Documentation links
- Social media sharing

### Export Tips

**Performance:**
- PDF/PNG exports may take 1-3 seconds for large charts
- CSV/JSON exports are instant
- Wait for success notification before closing tab

**Browser Compatibility:**
- All formats work in Chrome, Firefox, Edge, Safari
- Pop-up blockers may block downloads (allow if prompted)
- Clipboard API requires HTTPS (production) or localhost

**File Size:**
- PDFs: 200KB - 2MB
- PNGs: 500KB - 5MB
- CSVs: 1-50KB
- JSONs: 2-100KB

**Privacy:**
- All exports are client-side (no server upload)
- Data processed in browser only
- Files saved directly to your device

---

## Advanced Features

### Control Panel Settings

#### Display Mode
- **Cumulative:** Total cases since pandemic start
- **24h Momentum:** New cases in last 24 hours
- **3-day Momentum:** New cases in last 3 days
- **7-day Momentum:** New cases in last 7 days

#### Map Style
- **Light:** Clean, minimal map (best for printing)
- **Color:** Detailed geography with colors
- **Dark:** Dark theme (better for dark mode)

#### Population Normalized
- **Off:** Absolute case numbers
- **On:** Cases per million population (fairer comparison)

#### Marker Size
- Slider from small to large
- Adjusts all markers proportionally
- Useful for dense regions

### Responsive Design

**Mobile (< 640px):**
- Stacked layout
- Simplified charts
- Touch-optimized controls
- Export button hidden (use landscape)

**Tablet (640px - 1024px):**
- Two-column layout
- Full chart features
- Side-by-side comparisons

**Desktop (> 1024px):**
- Full-width charts
- All features visible
- Optimal data density

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Focus search input (on stats pages) |
| `Escape` | Close modal/dialog |
| `←` / `→` | Navigate chart types (when focused) |
| `Tab` | Navigate interactive elements |

---

## Troubleshooting

### Common Issues

#### Charts Not Loading
**Symptoms:** Empty chart area, loading spinner indefinitely

**Solutions:**
1. Check internet connection
2. Refresh page (Ctrl+R / Cmd+R)
3. Clear browser cache
4. Try different browser

#### Export Not Working
**Symptoms:** Click export button, nothing happens

**Solutions:**
1. Check pop-up blocker settings
2. Disable ad blockers temporarily
3. Update browser to latest version
4. Try different export format

#### Data Not Updating
**Symptoms:** Old data shown, no refresh

**Solutions:**
1. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
2. Clear browser cache and cookies
3. Check API status (COVID-19 API: disease.sh)

#### Search Not Working
**Symptoms:** Typing in search box, no filtering

**Solutions:**
1. Clear search input and re-type
2. Check for JavaScript errors (F12 console)
3. Reload page

### Performance Tips

**Slow Loading:**
- Reduce rows per page to 10
- Disable animations (browser settings)
- Close other browser tabs
- Check network speed

**High Memory Usage:**
- Refresh page periodically
- Don't keep multiple tabs open
- Close export modal after use
- Reduce marker size on map

### Browser Compatibility

**Fully Supported:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Partially Supported:**
- ⚠️ IE 11 (deprecated, not recommended)
- ⚠️ Older mobile browsers

**Features Requiring Modern Browser:**
- Clipboard API (sharing)
- Canvas export (PNG)
- ES2022 features
- CSS Grid

---

## Support

### Getting Help

**GitHub Issues:**
- Report bugs
- Request features
- Ask questions

**Documentation:**
- [README.md](README.md) - Project overview
- [API_INTEGRATION.md](docs/API_INTEGRATION.md) - API guide
- [DISEASE_DATA_SOURCES.md](docs/DISEASE_DATA_SOURCES.md) - Data sources

### Contributing

See [README.md](README.md) Contributing section for guidelines.

---

**Last Updated:** January 4, 2025  
**Version:** 2.0.0  
**Maintained by:** Global Disease Tracker Team