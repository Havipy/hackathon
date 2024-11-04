import React from 'react';
import { Syringe } from 'lucide-react';

interface Immunization {
  name: string;
  date: string;
  dueDate: string;
  provider: string;
}

interface ImmunizationsProps {
  immunizations: Immunization[];
}

export default function Immunizations({ immunizations }: ImmunizationsProps) {
  if (!immunizations?.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No immunization records found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {immunizations.map((immunization, index) => (
        <div key={index} className="bg-card p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Syringe className="text-pink-500" size={16} />
            <h3 className="font-medium">{immunization.name}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Date Received</p>
              <p className="font-medium">{new Date(immunization.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Next Due Date</p>
              <p className="font-medium">{new Date(immunization.dueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Provider</p>
              <p className="font-medium">{immunization.provider}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}