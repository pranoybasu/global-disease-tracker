/**
 * CountryDataTable Component
 * 
 * A comprehensive data table for displaying country-level disease statistics.
 * Features:
 * - Multi-column sorting with visual indicators
 * - Search/filter with debouncing
 * - Continent filtering
 * - Pagination for large datasets
 * - Responsive design
 * - Export to CSV/JSON
 */

import { useState, useMemo, useCallback } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Download, FileJson } from 'lucide-react';
import type { CountryData } from '@/types';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type SortField = 'country' | 'cases' | 'deaths' | 'recovered' | 'active' | 'todayCases' | 'todayDeaths' | 'continent';
type SortDirection = 'asc' | 'desc' | null;

interface CountryDataTableProps {
  data: CountryData[];
  metric?: string;
  diseaseColors: {
    primary: string;
    secondary: string;
  };
}

export function CountryDataTable({ data, metric, diseaseColors }: CountryDataTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('cases');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Extract unique continents - filter out empty/undefined values
  const continents = useMemo(() => {
    const uniqueContinents = new Set(
      data
        .map(country => country.continent)
        .filter(continent => continent && continent.trim() !== '')
    );
    return ['all', ...Array.from(uniqueContinents).sort()];
  }, [data]);

  // Handle sorting
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      // Cycle through: desc -> asc -> null -> desc
      if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else if (sortDirection === 'asc') {
        setSortDirection(null);
        setSortField('cases');
      } else {
        setSortDirection('desc');
      }
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  }, [sortField, sortDirection]);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = data;

    // Apply continent filter
    if (selectedContinent !== 'all') {
      filtered = filtered.filter(country => country.continent === selectedContinent);
    }

    // Apply search filter (debounced in effect)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(country =>
        country.country.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortDirection && sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc' 
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        
        const aNum = Number(aVal) || 0;
        const bNum = Number(bVal) || 0;
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      });
    }

    return filtered;
  }, [data, searchQuery, selectedContinent, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [processedData, currentPage]);

  // Export functions
  const exportToCSV = useCallback(() => {
    const headers = ['Country', 'Continent', 'Total Cases', 'Deaths', 'Recovered', 'Active', 'Today Cases', 'Today Deaths'];
    const rows = processedData.map(country => [
      country.country,
      country.continent,
      country.cases,
      country.deaths,
      country.recovered,
      country.active,
      country.todayCases,
      country.todayDeaths,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
const blob = new Blob([csv], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
const filename = `disease-data-${metric || 'all'}-${new Date().toISOString().split('T')[0]}.csv`;
link.download = filename;
link.click();
URL.revokeObjectURL(url);

toast({
  variant: "default",
  title: "CSV Export Successful",
  description: `Downloaded ${processedData.length} countries to ${filename}`,
});
    URL.revokeObjectURL(url);
  }, [processedData, metric]);

  const exportToJSON = useCallback(() => {
    const json = JSON.stringify(processedData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = `disease-data-${metric || 'all'}-${new Date().toISOString().split('T')[0]}.json`;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      variant: "default",
      title: "JSON Export Successful",
      description: `Downloaded ${processedData.length} countries to ${filename}`,
    });
  }, [processedData, metric]);

  // Format numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Sort icon component
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-4 h-4" style={{ color: diseaseColors.primary }} />;
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="w-4 h-4" style={{ color: diseaseColors.primary }} />;
    }
    return <ArrowUpDown className="w-4 h-4 opacity-40" />;
  };

  return (
    <div className="space-y-4">
      {/* Filters and Controls */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Continent Filter */}
          <Select value={selectedContinent} onValueChange={(value) => {
            setSelectedContinent(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Continents" />
            </SelectTrigger>
            <SelectContent>
              {continents.map((continent) => (
                <SelectItem key={continent} value={continent}>
                  {continent === 'all' ? 'All Continents' : continent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToJSON}
              className="flex items-center gap-2"
            >
              <FileJson className="w-4 h-4" />
              JSON
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Showing {paginatedData.length} of {processedData.length} countries
          {processedData.length !== data.length && ` (filtered from ${data.length})`}
        </div>
      </Card>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('country')}
                    className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Country
                    <SortIcon field="country" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('continent')}
                    className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Continent
                    <SortIcon field="continent" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('cases')}
                    className="flex items-center gap-2 ml-auto hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Total Cases
                    <SortIcon field="cases" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('deaths')}
                    className="flex items-center gap-2 ml-auto hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Deaths
                    <SortIcon field="deaths" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('recovered')}
                    className="flex items-center gap-2 ml-auto hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Recovered
                    <SortIcon field="recovered" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('active')}
                    className="flex items-center gap-2 ml-auto hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Active
                    <SortIcon field="active" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('todayCases')}
                    className="flex items-center gap-2 ml-auto hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Today Cases
                    <SortIcon field="todayCases" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('todayDeaths')}
                    className="flex items-center gap-2 ml-auto hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Today Deaths
                    <SortIcon field="todayDeaths" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((country, index) => (
                <TableRow key={country.countryInfo._id}>
                  <TableCell className="text-slate-500">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <img
                        src={country.countryInfo.flag}
                        alt={`${country.country} flag`}
                        className="w-6 h-4 object-cover rounded"
                      />
                      {country.country}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {country.continent}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatNumber(country.cases)}
                  </TableCell>
                  <TableCell className="text-right text-red-600 dark:text-red-400">
                    {formatNumber(country.deaths)}
                  </TableCell>
                  <TableCell className="text-right text-green-600 dark:text-green-400">
                    {formatNumber(country.recovered)}
                  </TableCell>
                  <TableCell className="text-right text-orange-600 dark:text-orange-400">
                    {formatNumber(country.active)}
                  </TableCell>
                  <TableCell className="text-right text-blue-600 dark:text-blue-400">
                    {country.todayCases > 0 ? `+${formatNumber(country.todayCases)}` : '0'}
                  </TableCell>
                  <TableCell className="text-right text-red-600 dark:text-red-400">
                    {country.todayDeaths > 0 ? `+${formatNumber(country.todayDeaths)}` : '0'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}