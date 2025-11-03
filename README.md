# Global Disease Tracker 🌍

A modern, interactive dashboard for tracking multiple global diseases including COVID-19, Influenza, Mpox, Malaria, and Dengue. Built with React 19, TypeScript, and real-time data integration.

![Global Disease Tracker](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1-646cff?logo=vite)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Multi-Disease Support
- **COVID-19**: Real-time data from disease.sh API
- **Influenza**: Mock data with realistic patterns
- **Mpox**: Simulated outbreak tracking
- **Malaria**: Endemic disease monitoring
- **Dengue**: Seasonal outbreak data

### Interactive Visualizations
- 🗺️ **Interactive Leaflet Map** with disease-specific markers
- 📊 **Real-time Statistics** with animated stat cards
- 🎨 **Disease-Specific Color Schemes** for visual clarity
- 🔄 **Smooth Animations** using Framer Motion
- 📱 **Responsive Design** for mobile, tablet, and desktop

### Advanced Features
- **Momentum Tracking**: 24-hour, 3-day, and 7-day case trends
- **Population Normalization**: Per-million population metrics
- **Projected Cases**: AI-powered case projections
- **Multiple Map Styles**: Light, color, and dark themes
- **Logarithmic/Linear Scaling**: Flexible data visualization
- **Collapsible Control Panel**: Clean, organized interface

## 🏗️ Architecture

### Technology Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 19 | UI library with concurrent features |
| **Language** | TypeScript | 5.9 | Type-safe development |
| **Build Tool** | Vite | 7.1 | Fast HMR and optimized builds |
| **Styling** | Tailwind CSS | v4 | Utility-first CSS with custom theme |
| **UI Components** | Shadcn/ui | Latest | Accessible Radix UI components |
| **State Management** | Zustand | 5.0 | Client state with localStorage |
| **Server State** | TanStack Query | 5.90 | Data fetching and caching |
| **Animations** | Framer Motion | 12.23 | Declarative animations |
| **Maps** | Leaflet + React-Leaflet | 1.9.4 / 5.0.0 | Interactive mapping |
| **HTTP Client** | Axios | 1.13 | API requests with retry logic |
| **Testing** | Vitest | 4.0.6 | Unit testing framework |
| **Icons** | Lucide React | 0.552.0 | Beautiful icon library |

### Project Structure

```
global-disease-tracker/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Shadcn UI components
│   │   │   ├── card.tsx
│   │   │   ├── select.tsx
│   │   │   ├── toggle.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── button.tsx
│   │   ├── DiseaseMap.tsx           # Interactive Leaflet map
│   │   ├── DiseaseStatsCard.tsx     # Animated statistics cards
│   │   ├── CollapsibleControlPanel.tsx  # Collapsible sidebar
│   │   └── ErrorBoundary.tsx        # Error handling component
│   │
│   ├── config/              # Configuration files
│   │   └── diseases.ts      # Disease metadata and color schemes
│   │
│   ├── services/            # Business logic and APIs
│   │   ├── api/
│   │   │   ├── diseaseApi.ts      # Unified disease API (Adapter Pattern)
│   │   │   ├── covidApi.ts        # COVID-19 API integration
│   │   │   ├── apiClient.ts       # Axios client with retry logic
│   │   │   └── queryClient.ts     # TanStack Query configuration
│   │   │
│   │   ├── algorithms/
│   │   │   ├── momentumCalculations.ts   # Trend calculations
│   │   │   ├── containmentScore.ts       # Disease metrics
│   │   │   └── __tests__/                # Algorithm tests
│   │   │
│   │   └── mockData/
│   │       ├── influenzaMockData.ts
│   │       ├── mpoxMockData.ts
│   │       ├── malariaMockData.ts
│   │       └── dengueMockData.ts
│   │
│   ├── store/               # State management
│   │   └── appStore.ts      # Zustand store with persistence
│   │
│   ├── types/               # TypeScript definitions
│   │   └── index.ts         # Shared type definitions
│   │
│   ├── test/                # Test utilities
│   │   └── setup.ts         # Vitest configuration
│   │
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles and Tailwind imports
│
├── public/                  # Static assets
├── docs/                    # Documentation
│   ├── API_INTEGRATION.md   # API integration guide
│   └── DISEASE_DATA_SOURCES.md  # Data source documentation
│
├── package.json
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── vitest.config.ts         # Vitest test configuration
```

### Key Design Patterns

#### 1. **Adapter Pattern** (Core Architecture)
The application uses an adapter pattern to abstract data sources, allowing seamless switching between real APIs and mock data:

```typescript
// Unified API interface
export function useDiseaseData(disease: Disease) {
  return useQuery({
    queryKey: ['disease', disease],
    queryFn: async () => {
      // Adapter selects appropriate data source
      if (disease === 'covid19') {
        return await fetchCovidData(); // Real API
      } else {
        return generateMockData(disease); // Mock data
      }
    }
  });
}
```

**Benefits:**
- Easy to add new diseases
- Simple migration from mock to real data
- Consistent data structure across all diseases
- Testable with mock data

#### 2. **Component Composition**
Reusable, composable components for maintainability:

```typescript
<DiseaseStatsCard
  title="Total Cases"
  value={globalStats?.cases || 0}
  icon={Activity}
  disease={selectedDisease}
/>
```

#### 3. **Type-Safe Configuration**
Disease configurations use const assertions for type safety:

```typescript
export const diseaseConfigs = {
  covid19: {
    name: 'COVID-19',
    colors: { primary: 'rgb(239, 68, 68)', ... },
    icon: Activity,
    // ...
  }
} as const;

export type Disease = keyof typeof diseaseConfigs;
```

#### 4. **State Management Strategy**
- **Zustand**: Client state (disease selection, preferences) with localStorage persistence
- **TanStack Query**: Server state (API data) with automatic caching and revalidation
- **React State**: Component-local UI state (form controls, toggles)

#### 5. **Error Boundaries**
Graceful error handling at multiple levels:
- Top-level boundary in [`main.tsx`](global-disease-tracker/src/main.tsx:1)
- Component-level boundaries around critical sections (map, charts)
- Custom fallback UIs that maintain layout integrity

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern browser with ES2022 support

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/global-disease-tracker.git
cd global-disease-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 📖 Usage Guide

### Switching Diseases
Use the disease selector dropdown in the collapsible control panel to switch between different diseases. The entire UI updates with disease-specific colors and data.

### Map Controls
- **Display Mode**: Choose between cumulative cases or momentum (24h, 3-day, 7-day trends)
- **Map Style**: Switch between light, color, and dark map themes
- **Scale Mode**: Toggle between linear and logarithmic scaling
- **Population Normalized**: View cases per million population
- **Projected Cases**: Enable AI-powered case projections
- **Marker Size**: Adjust the size of disease markers on the map

### Interpreting Data
- **Red markers**: High case counts or rapid spread
- **Marker size**: Proportional to case count (or normalized rate)
- **Stat cards**: Show total cases, deaths, recoveries, and active cases
- **Top 10 Countries**: Ranked by total case count with detailed metrics

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Current test coverage includes:
- Algorithm correctness (momentum, containment scores)
- Component rendering
- API integration logic

## 📚 Documentation

- [API Integration Guide](docs/API_INTEGRATION.md) - How to add real disease APIs
- [Disease Data Sources](docs/DISEASE_DATA_SOURCES.md) - Available data sources for each disease

## 🎨 Customization

### Adding a New Disease

1. **Update Type Definition** in [`src/types/index.ts`](global-disease-tracker/src/types/index.ts:1)
2. **Add Configuration** in [`src/config/diseases.ts`](global-disease-tracker/src/config/diseases.ts:1)
3. **Create Mock Data Generator** in `src/services/mockData/`
4. **Update API Adapter** in [`src/services/api/diseaseApi.ts`](global-disease-tracker/src/services/api/diseaseApi.ts:1)
5. **Add Tailwind Colors** in [`tailwind.config.js`](global-disease-tracker/tailwind.config.js:1)

See [API_INTEGRATION.md](docs/API_INTEGRATION.md) for detailed instructions.

### Customizing Colors

Disease-specific colors are defined in [`src/config/diseases.ts`](global-disease-tracker/src/config/diseases.ts:1):

```typescript
colors: {
  primary: 'rgb(239, 68, 68)',    // Main theme color
  secondary: 'rgb(254, 202, 202)', // Accent color
  bg: 'bg-red-50',                 // Background class
  text: 'text-red-700',            // Text color class
  border: 'border-red-200'         // Border color class
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for API configuration:

```env
VITE_COVID_API_URL=https://disease.sh/v3/covid-19
VITE_ENABLE_MOCK_DATA=false
VITE_API_RETRY_ATTEMPTS=3
```

### TypeScript Configuration

The project uses strict TypeScript settings:
- `strict: true`
- `verbatimModuleSyntax: true`
- `erasableSyntaxOnly: true`

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow ESLint rules (run `npm run lint`)
- Write tests for new features
- Use meaningful commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **disease.sh** - COVID-19 data API
- **Shadcn/ui** - Beautiful UI components
- **Leaflet** - Interactive mapping library
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Powerful data synchronization

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**