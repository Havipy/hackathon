import React from 'react';
import { Phone, Mail, User, Heart } from 'lucide-react';

interface Contact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

interface EmergencyContactsProps {
  contacts: Contact[];
}

export default function EmergencyContacts({ contacts }: EmergencyContactsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-foreground">
        <Heart className="text-pink-500" size={24} />
        <h2 className="text-lg font-semibold">Emergency Contacts</h2>
      </div>
      <div className="bg-accent/50 rounded-lg p-4 space-y-4">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className="bg-card p-4 rounded-lg shadow-sm"
          >
            <div className="flex items-center space-x-3 mb-2">
              <User className="text-pink-500 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-medium text-foreground">
                  {contact.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {contact.relationship}
                </p>
              </div>
            </div>
            <div className="space-y-2 ml-8">
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center space-x-2 text-pink-500 hover:text-pink-600 transition-colors"
              >
                <Phone size={16} className="flex-shrink-0" />
                <span>{contact.phone}</span>
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center space-x-2 text-pink-500 hover:text-pink-600 transition-colors"
              >
                <Mail size={16} className="flex-shrink-0" />
                <span>{contact.email}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}