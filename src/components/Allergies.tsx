import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface AllergiesProps {
  allergies: string[];
}

export default function Allergies({ allergies }: AllergiesProps) {
  if (!allergies?.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No known allergies
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="text-red-500" size={20} />
        <h3 className="font-medium">Known Allergies</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {allergies.map((allergy, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
          >
            {allergy}
          </span>
        ))}
      </div>
    </div>
  );
}