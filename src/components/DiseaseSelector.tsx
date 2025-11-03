/**
 * DiseaseSelector Component
 * 
 * A dropdown selector for switching between different diseases.
 * Features disease-specific icons, colors, and visual feedback.
 * Uses Shadcn UI Select component for accessibility and styling.
 */

import { Check } from 'lucide-react';
import { Disease, type DiseaseType } from '@/types';
import { diseaseConfigs } from '@/config/diseases';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DiseaseSelectorProps {
  value: DiseaseType;
  onValueChange: (disease: DiseaseType) => void;
  className?: string;
}

export function DiseaseSelector({ value, onValueChange, className }: DiseaseSelectorProps) {
  const selectedDisease = diseaseConfigs[value];
  const Icon = selectedDisease.icon;

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={`w-[280px] ${className || ''} ${selectedDisease.colors.bg} border-2`}
        style={{
          borderColor: selectedDisease.colors.primary,
        }}
      >
        <SelectValue>
          <div className="flex items-center gap-2">
            <Icon
              className="h-5 w-5"
              style={{ color: selectedDisease.colors.primary }}
            />
            <span className="font-semibold">{selectedDisease.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      
      <SelectContent>
        {Object.values(Disease).map((diseaseKey) => {
          const disease = diseaseConfigs[diseaseKey];
          const DiseaseIcon = disease.icon;
          const isSelected = diseaseKey === value;
          
          return (
            <SelectItem
              key={diseaseKey}
              value={diseaseKey}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full gap-3">
                <div className="flex items-center gap-2">
                  <DiseaseIcon
                    className="h-5 w-5"
                    style={{ color: disease.colors.primary }}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{disease.name}</span>
                    <span
                      className="text-xs text-gray-500"
                    >
                      {disease.description}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <Check
                    className="h-4 w-4"
                    style={{ color: disease.colors.primary }}
                  />
                )}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}