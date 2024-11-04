import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Calendar, Activity, Clock, FileText, AlertTriangle, Syringe, FlaskConical, Phone, Mail } from 'lucide-react';
import { cn } from '../lib/utils';
import VitalStats from './VitalStats';
import LabResults from './LabResults';
import MedicalTimeline from './MedicalTimeline';
import Allergies from './Allergies';
import Immunizations from './Immunizations';
import EmergencyContacts from './EmergencyContacts';
import { getMockMedicalData } from '../utils/mockData';

export default function MedicalCard() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchMedicalData = async () => {
      try {
        // Use mock data for all routes
        const mockData = getMockMedicalData();
        setData(mockData);
      } catch (error) {
        console.error('Failed to fetch medical data:', error);
        setError('Failed to load medical record. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h1 className="text-2xl font-semibold">Medical Record Not Found</h1>
        <p className="text-muted-foreground">
          {error || 'The requested medical record could not be found.'}
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="h-4 w-4" /> },
    { id: 'vitals', label: 'Vitals', icon: <Activity className="h-4 w-4" /> },
    { id: 'labs', label: 'Lab Results', icon: <FlaskConical className="h-4 w-4" /> },
    { id: 'history', label: 'History', icon: <Clock className="h-4 w-4" /> },
    { id: 'allergies', label: 'Allergies', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'immunizations', label: 'Immunizations', icon: <Syringe className="h-4 w-4" /> },
    { id: 'contacts', label: 'Emergency Contacts', icon: <Phone className="h-4 w-4" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{data.patientName}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>DOB: {new Date(data.dateOfBirth).toLocaleDateString()}</span>
          <span>Blood Type: {data.bloodType}</span>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <a href={`tel:${data.contact.phone}`} className="hover:text-foreground">
              {data.contact.phone}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <a href={`mailto:${data.contact.email}`} className="hover:text-foreground">
              {data.contact.email}
            </a>
          </div>
        </div>
      </div>

      <div className="mb-8 border-b overflow-x-auto">
        <nav className="flex space-x-4 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-8">
        {activeTab === 'overview' && (
          <div className="grid gap-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Current Conditions</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {data.conditions.map((condition, index) => (
                  <div key={index} className="bg-card p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium mb-2">{condition.name}</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Diagnosed: </span>
                        {new Date(condition.diagnosedDate).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Severity: </span>
                        <span className="capitalize">{condition.severity}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Status: </span>
                        <span className="capitalize">{condition.status}</span>
                      </p>
                      <p className="text-muted-foreground">{condition.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Current Medications</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {data.medications.map((medication, index) => (
                  <div key={index} className="bg-card p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium mb-2">{medication.name}</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Dosage: </span>
                        {medication.dosage}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Frequency: </span>
                        {medication.frequency}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Purpose: </span>
                        {medication.purpose}
                      </p>
                      <div>
                        <span className="text-muted-foreground">Side Effects: </span>
                        <span>{medication.sideEffects.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'vitals' && (
          <VitalStats readings={data.vitalReadings} />
        )}

        {activeTab === 'labs' && (
          <LabResults results={data.labResults} />
        )}

        {activeTab === 'history' && (
          <MedicalTimeline
            events={data.conditions.map(condition => ({
              date: condition.diagnosedDate,
              type: 'diagnosis',
              title: condition.name,
              description: condition.notes,
              doctor: 'Dr. Smith',
              facility: 'Medical Center'
            }))}
          />
        )}

        {activeTab === 'allergies' && (
          <Allergies
            allergies={data.allergies.map(a => a.allergen)}
          />
        )}

        {activeTab === 'immunizations' && (
          <Immunizations
            immunizations={data.immunizations.map(i => ({
              name: i.name,
              date: i.date,
              dueDate: i.nextDueDate,
              provider: i.administeredBy
            }))}
          />
        )}

        {activeTab === 'contacts' && (
          <EmergencyContacts
            contacts={[
              {
                name: "Michael Anderson",
                relationship: "Spouse",
                phone: "+1 (555) 987-6543",
                email: "michael.anderson@email.com"
              },
              {
                name: "Jennifer Wilson",
                relationship: "Sister",
                phone: "+1 (555) 456-7890",
                email: "jennifer.wilson@email.com"
              }
            ]}
          />
        )}
      </div>
    </div>
  );
}