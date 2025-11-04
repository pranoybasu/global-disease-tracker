/**
 * Main Application Component - Global Disease Tracker
 * 
 * This component serves as the root container for the React Router application.
 * It imports and renders the AppRoutes component which handles all routing logic.
 * 
 * Route Structure:
 * - / : Dashboard (main disease tracking dashboard)
 * - /stats/:disease/:metric : DetailedStatsPage (drill-down statistics view)
 * 
 * The actual dashboard implementation has been moved to src/pages/Dashboard.tsx
 * to follow proper separation of concerns and routing best practices.
 */

import { AppRoutes } from './routes';

function App() {
  return <AppRoutes />;
}

export default App;