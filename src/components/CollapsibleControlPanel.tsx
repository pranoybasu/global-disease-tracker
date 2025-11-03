/**
 * CollapsibleControlPanel Component
 * 
 * A collapsible side panel that contains all dashboard controls.
 * Features:
 * - Smooth expand/collapse animation
 * - Disease selector at the top
 * - Data sorting and filtering controls
 * - Map visualization settings
 * - Responsive design
 */

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DiseaseSelector } from './DiseaseSelector';
import type { DiseaseType } from '@/types';

interface CollapsibleControlPanelProps {
  disease: DiseaseType;
  onDiseaseChange: (disease: DiseaseType) => void;
  children?: React.ReactNode;
  className?: string;
}

export function CollapsibleControlPanel({
  disease,
  onDiseaseChange,
  children,
  className = '',
}: CollapsibleControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Toggle Button - Hidden on mobile, shown on large screens */}
      <Button
        onClick={togglePanel}
        variant="outline"
        size="icon"
        className="hidden lg:flex absolute -right-4 top-4 z-10 h-8 w-8 rounded-full border-2 bg-white shadow-md hover:shadow-lg transition-all"
        aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
      >
        {isExpanded ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      {/* Control Panel - Full width on mobile, fixed width on large screens */}
      <Card
        className={`h-full transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-full lg:w-80' : 'w-0 overflow-hidden opacity-0'
        }`}
      >
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings2 className="h-5 w-5" />
            <span>Dashboard Controls</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 p-6">
          {/* Disease Selector Section */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Select Disease
            </label>
            <DiseaseSelector
              value={disease}
              onValueChange={onDiseaseChange}
            />
          </div>

          {/* Separator */}
          <div className="border-t" />

          {/* Children (Additional Controls) */}
          {children}
        </CardContent>
      </Card>

      {/* Collapsed State Indicator - Only on large screens */}
      {!isExpanded && (
        <div className="hidden lg:flex h-full w-12 items-center justify-center bg-gray-100 rounded-r-lg">
          <Settings2 className="h-5 w-5 text-gray-400" />
        </div>
      )}
    </div>
  );
}