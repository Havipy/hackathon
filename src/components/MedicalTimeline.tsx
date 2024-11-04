import React from 'react';
import { Calendar } from 'lucide-react';

interface TimelineEvent {
  date: string;
  type: 'surgery' | 'diagnosis' | 'treatment' | 'vaccination';
  title: string;
  description: string;
  doctor: string;
  facility: string;
}

interface MedicalTimelineProps {
  events: TimelineEvent[];
}

export default function MedicalTimeline({ events }: MedicalTimelineProps) {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'surgery':
        return '🏥';
      case 'diagnosis':
        return '🔍';
      case 'treatment':
        return '💊';
      case 'vaccination':
        return '💉';
      default:
        return '📋';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-foreground">
        <Calendar className="text-pink-500" size={24} />
        <h2 className="text-lg font-semibold">Medical History Timeline</h2>
      </div>
      <div className="bg-accent/50 rounded-lg p-4">
        <div className="relative">
          {events.map((event, index) => (
            <div key={index} className="mb-8 flex items-start last:mb-0">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center shadow-md">
                  <span role="img" aria-label={event.type}>
                    {getEventIcon(event.type)}
                  </span>
                </div>
                {index !== events.length - 1 && (
                  <div className="w-0.5 h-full bg-border mt-2" />
                )}
              </div>
              <div className="ml-4 flex-1">
                <div className="bg-card p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-foreground">
                      {event.title}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm mb-2 text-muted-foreground">
                    {event.description}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <p>Doctor: {event.doctor}</p>
                    <p>Facility: {event.facility}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}