import express from 'express';
import cors from 'cors';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

const medicalRecords = new Map();

const generateMedicalData = () => {
  return {
    patientName: "Sarah Elizabeth Anderson",
    dateOfBirth: "1985-06-15",
    bloodType: "A+",
    contact: {
      phone: "+1 (555) 123-4567",
      email: "sarah.anderson@email.com",
      address: {
        street: "742 Maple Avenue",
        city: "Springfield",
        state: "IL",
        zipCode: "62701",
        country: "United States"
      }
    },
    conditions: [
      {
        name: "Type 2 Diabetes",
        diagnosedDate: "2020-03-15",
        severity: "moderate",
        status: "managed",
        notes: "Well controlled with medication and lifestyle changes"
      },
      {
        name: "Hypertension",
        diagnosedDate: "2019-11-22",
        severity: "mild",
        status: "managed",
        notes: "Responding well to current treatment plan"
      },
      {
        name: "Asthma",
        diagnosedDate: "2015-08-10",
        severity: "moderate",
        status: "managed",
        notes: "Triggered by seasonal allergies and exercise"
      }
    ],
    medications: [
      {
        name: "Metformin",
        dosage: "1000mg",
        frequency: "Twice daily with meals",
        purpose: "Diabetes management",
        startDate: "2020-03-20",
        endDate: "ongoing",
        sideEffects: ["Nausea", "Decreased appetite"]
      },
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        purpose: "Blood pressure control",
        startDate: "2019-12-01",
        endDate: "ongoing",
        sideEffects: ["Dry cough", "Dizziness"]
      },
      {
        name: "Albuterol Inhaler",
        dosage: "2 puffs",
        frequency: "As needed",
        purpose: "Asthma relief",
        startDate: "2015-08-15",
        endDate: "ongoing",
        sideEffects: ["Tremors", "Rapid heartbeat"]
      }
    ],
    emergencyContacts: [
      {
        name: "Michael Anderson",
        relationship: "Spouse",
        phone: "+1 (555) 987-6543",
        email: "michael.anderson@email.com",
        address: "742 Maple Avenue, Springfield, IL 62701",
        isPrimaryContact: true
      },
      {
        name: "Jennifer Wilson",
        relationship: "Sister",
        phone: "+1 (555) 456-7890",
        email: "jennifer.wilson@email.com",
        address: "123 Oak Street, Springfield, IL 62701",
        isPrimaryContact: false
      },
      {
        name: "Robert Anderson",
        relationship: "Father",
        phone: "+1 (555) 234-5678",
        email: "robert.anderson@email.com",
        address: "456 Pine Road, Springfield, IL 62701",
        isPrimaryContact: false
      }
    ],
    medicalHistory: [
      {
        date: "2023-09-15",
        type: "surgery",
        title: "Laparoscopic Appendectomy",
        description: "Emergency appendectomy performed due to acute appendicitis",
        doctor: "Dr. James Mitchell",
        facility: "Springfield General Hospital",
        outcome: "Successful with no complications",
        followUp: "Follow-up appointment scheduled for wound check in 2 weeks"
      },
      {
        date: "2022-07-20",
        type: "diagnosis",
        title: "Initial Diabetes Diagnosis",
        description: "Diagnosed following elevated A1C levels",
        doctor: "Dr. Sarah Smith",
        facility: "Springfield Medical Center",
        outcome: "Treatment plan initiated",
        followUp: "Regular monitoring of blood sugar levels"
      },
      {
        date: "2021-03-10",
        type: "surgery",
        title: "Knee Arthroscopy",
        description: "Minimally invasive procedure to repair meniscus tear",
        doctor: "Dr. David Jones",
        facility: "Springfield Orthopedic Center",
        outcome: "Successful repair",
        followUp: "Physical therapy for 8 weeks"
      }
    ],
    vitalReadings: [
      {
        date: "2024-03-15",
        time: "09:30",
        bloodPressure: {
          systolic: 128,
          diastolic: 82,
          position: "sitting"
        },
        heartRate: 72,
        temperature: 36.8,
        respiratoryRate: 16,
        bloodSugar: {
          value: 110,
          type: "fasting"
        },
        weight: 68,
        height: 165,
        bmi: 25.0,
        oxygenSaturation: 98
      },
      {
        date: "2024-02-15",
        time: "10:00",
        bloodPressure: {
          systolic: 130,
          diastolic: 84,
          position: "sitting"
        },
        heartRate: 75,
        temperature: 36.7,
        respiratoryRate: 16,
        bloodSugar: {
          value: 115,
          type: "fasting"
        },
        weight: 69,
        height: 165,
        bmi: 25.3,
        oxygenSaturation: 97
      },
      {
        date: "2024-01-15",
        time: "08:45",
        bloodPressure: {
          systolic: 132,
          diastolic: 86,
          position: "sitting"
        },
        heartRate: 78,
        temperature: 36.9,
        respiratoryRate: 18,
        bloodSugar: {
          value: 118,
          type: "fasting"
        },
        weight: 70,
        height: 165,
        bmi: 25.7,
        oxygenSaturation: 98
      }
    ],
    appointments: [
      {
        date: "2024-04-15",
        time: "14:30",
        doctor: "Dr. Sarah Smith",
        specialty: "Endocrinology",
        department: "Diabetes Care",
        location: "Springfield Medical Center, Suite 300",
        purpose: "Quarterly diabetes check-up",
        notes: "Bring blood sugar logs",
        preparation: "Fasting blood work required"
      },
      {
        date: "2024-05-01",
        time: "10:00",
        doctor: "Dr. Michael Brown",
        specialty: "Cardiology",
        department: "Cardiovascular Health",
        location: "Heart Care Center, Building B",
        purpose: "Blood pressure follow-up",
        notes: "Bring blood pressure logs",
        preparation: "No special preparation needed"
      },
      {
        date: "2024-05-15",
        time: "11:30",
        doctor: "Dr. Lisa Chen",
        specialty: "Pulmonology",
        department: "Respiratory Care",
        location: "Springfield Medical Center, Suite 400",
        purpose: "Annual asthma review",
        notes: "Bring inhaler for technique check",
        preparation: "Complete peak flow diary"
      }
    ],
    prescriptions: [
      {
        medication: "Metformin",
        genericName: "Metformin Hydrochloride",
        dosage: "1000mg tablets",
        frequency: "Twice daily with meals",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        prescribedBy: "Dr. Sarah Smith",
        pharmacy: {
          name: "Springfield Pharmacy",
          phone: "+1 (555) 234-5678",
          address: "100 Main Street, Springfield, IL 62701"
        },
        refillsRemaining: 3,
        instructions: "Take with food to minimize stomach upset",
        sideEffects: ["Nausea", "Diarrhea", "Loss of appetite"],
        interactions: ["Alcohol", "Iodinated contrast materials"]
      },
      {
        medication: "Lisinopril",
        genericName: "Lisinopril",
        dosage: "10mg tablets",
        frequency: "Once daily",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        prescribedBy: "Dr. Michael Brown",
        pharmacy: {
          name: "Springfield Pharmacy",
          phone: "+1 (555) 234-5678",
          address: "100 Main Street, Springfield, IL 62701"
        },
        refillsRemaining: 5,
        instructions: "Take in the morning",
        sideEffects: ["Dry cough", "Dizziness", "Headache"],
        interactions: ["NSAIDs", "Potassium supplements"]
      }
    ],
    insurance: {
      provider: "HealthCare Plus",
      policyNumber: "HCP123456789",
      groupNumber: "GRP987654",
      type: "PPO",
      coverageStart: "2024-01-01",
      coverageEnd: "2024-12-31",
      primaryHolder: "Sarah Anderson",
      relationship: "Self",
      copay: {
        primaryCare: 25,
        specialist: 40,
        emergency: 150,
        prescription: 10
      },
      deductible: {
        individual: 1500,
        family: 3000,
        remaining: 750
      }
    },
    allergies: [
      {
        allergen: "Penicillin",
        type: "medication",
        severity: "severe",
        reaction: "Anaphylaxis",
        diagnosedDate: "2010-05-15",
        notes: "Requires immediate medical attention if exposed"
      },
      {
        allergen: "Tree Nuts",
        type: "food",
        severity: "moderate",
        reaction: "Hives and difficulty breathing",
        diagnosedDate: "2015-08-22",
        notes: "Carries EpiPen"
      },
      {
        allergen: "Pollen",
        type: "environmental",
        severity: "mild",
        reaction: "Sneezing, watery eyes",
        diagnosedDate: "2012-03-10",
        notes: "Seasonal - worst in spring"
      }
    ],
    immunizations: [
      {
        name: "Influenza Vaccine",
        date: "2023-10-15",
        type: "Inactivated influenza",
        doseNumber: 1,
        totalDoses: 1,
        manufacturer: "Sanofi Pasteur",
        lotNumber: "IN23456",
        administeredBy: "Dr. James Wilson",
        location: "Springfield Medical Center",
        nextDueDate: "2024-10-15",
        notes: "Annual flu shot"
      },
      {
        name: "COVID-19 Vaccine",
        date: "2023-09-01",
        type: "mRNA",
        doseNumber: 4,
        totalDoses: 4,
        manufacturer: "Pfizer-BioNTech",
        lotNumber: "PB98765",
        administeredBy: "Dr. Maria Garcia",
        location: "Springfield Medical Center",
        nextDueDate: "2024-09-01",
        notes: "Annual booster"
      },
      {
        name: "Tetanus/Diphtheria/Pertussis",
        date: "2020-05-15",
        type: "Tdap",
        doseNumber: 1,
        totalDoses: 1,
        manufacturer: "GlaxoSmithKline",
        lotNumber: "TD45678",
        administeredBy: "Dr. James Wilson",
        location: "Springfield Medical Center",
        nextDueDate: "2030-05-15",
        notes: "10-year booster"
      }
    ],
    labResults: [
      {
        date: "2024-03-01",
        time: "08:30",
        category: "Diabetes Monitoring",
        type: "HbA1c",
        result: "6.8",
        unit: "%",
        normalRange: "4.0-5.6",
        status: "abnormal",
        orderedBy: "Dr. Sarah Smith",
        performedBy: "John Davis, MT",
        facility: "Springfield Medical Lab",
        notes: "Improved from previous reading of 7.2%",
        interpretation: "Indicates good diabetes control"
      },
      {
        date: "2024-03-01",
        time: "08:30",
        category: "Lipid Panel",
        type: "Total Cholesterol",
        result: "185",
        unit: "mg/dL",
        normalRange: "<200",
        status: "normal",
        orderedBy: "Dr. Sarah Smith",
        performedBy: "John Davis, MT",
        facility: "Springfield Medical Lab",
        notes: "Within normal range",
        interpretation: "Optimal level"
      },
      {
        date: "2024-03-01",
        time: "08:30",
        category: "Kidney Function",
        type: "Creatinine",
        result: "0.9",
        unit: "mg/dL",
        normalRange: "0.6-1.2",
        status: "normal",
        orderedBy: "Dr. Sarah Smith",
        performedBy: "John Davis, MT",
        facility: "Springfield Medical Lab",
        notes: "Within normal range",
        interpretation: "Normal kidney function"
      }
    ],
    familyHistory: [
      {
        relationship: "Father",
        condition: "Type 2 Diabetes",
        diagnosedAge: 45,
        status: "living",
        notes: "Well managed with medication and diet"
      },
      {
        relationship: "Mother",
        condition: "Hypertension",
        diagnosedAge: 50,
        status: "living",
        notes: "Controlled with medication"
      },
      {
        relationship: "Paternal Grandfather",
        condition: "Coronary Artery Disease",
        diagnosedAge: 60,
        status: "deceased",
        notes: "Passed away at age 72 from heart attack"
      }
    ],
    lifestyle: {
      smoking: {
        status: "never",
        frequency: "N/A",
        quitDate: null
      },
      alcohol: {
        status: "occasional",
        frequency: "1-2 drinks per month",
        amount: "1 drink per occasion"
      },
      exercise: {
        frequency: "3-4 times per week",
        type: ["Walking", "Swimming", "Yoga"],
        duration: "30-45 minutes"
      },
      diet: {
        type: "Low-carb",
        restrictions: ["Refined sugars", "Processed foods"],
        notes: "Following diabetic diet plan"
      }
    }
  };
};

app.post('/api/generate-medical-card', async (req, res) => {
  try {
    const recordId = uuidv4();
    const medicalData = generateMedicalData();
    
    medicalRecords.set(recordId, medicalData);
    
    const qrUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/medical/${recordId}`;
    const qrCode = await QRCode.toDataURL(qrUrl);
    
    res.json({ qrUrl, qrCode });
  } catch (error) {
    console.error('Error generating medical card:', error);
    res.status(500).json({ error: 'Failed to generate medical card' });
  }
});

app.get('/api/medical-card/:id', (req, res) => {
  try {
    const { id } = req.params;
    const medicalData = medicalRecords.get(id);
    
    if (!medicalData) {
      return res.status(404).json({ error: 'Medical record not found' });
    }
    
    res.json(medicalData);
  } catch (error) {
    console.error('Error retrieving medical card:', error);
    res.status(500).json({ error: 'Failed to retrieve medical card' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});