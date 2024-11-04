import React from 'react';
import { FlaskConical, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface LabResult {
  date: string;
  type: string;
  result: string;
  normalRange: string;
  status: 'normal' | 'abnormal';
  notes?: string;
}

interface LabResultsProps {
  results: LabResult[];
}

export default function LabResults({ results }: LabResultsProps) {
  if (!results?.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No lab results available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <div key={index} className="bg-card p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FlaskConical className="text-pink-500" size={20} />
              <h3 className="font-medium">{result.type}</h3>
            </div>
            <div className={cn(
              "flex items-center gap-1 text-sm px-2 py-1 rounded-full",
              result.status === 'normal' 
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
            )}>
              {result.status === 'normal' 
                ? <CheckCircle2 size={14} />
                : <AlertCircle size={14} />
              }
              <span className="capitalize">{result.status}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">{new Date(result.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Result</p>
              <p className="font-medium">{result.result}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Normal Range</p>
              <p className="font-medium">{result.normalRange}</p>
            </div>
            {result.notes && (
              <div className="md:col-span-2">
                <p className="text-muted-foreground">Notes</p>
                <p className="font-medium">{result.notes}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}