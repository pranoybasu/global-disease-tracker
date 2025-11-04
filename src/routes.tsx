import { Routes, Route } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard';
import { DetailedStatsPage } from '@/pages/DetailedStatsPage';

/**
 * Application Routes Configuration
 * =================================
 * 
 * Route Structure:
 * - / : Main dashboard with disease selector, stats, and map
 * - /stats/:disease/:metric : Detailed statistics page for specific metric
 * 
 * Future Routes (planned):
 * - /compare : Compare multiple diseases side-by-side
 * - /historical : Historical trends and timelines
 * - /about : About page with data sources and methodology
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/stats/:disease/:metric" element={<DetailedStatsPage />} />
    </Routes>
  );
}