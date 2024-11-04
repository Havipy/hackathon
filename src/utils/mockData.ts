export const getMockMedicalData = () => {
  const generateVitalReadings = () => {
    const readings = [];
    const now = new Date();
    const sixWeeksAgo = new Date(now);
    sixWeeksAgo.setDate(now.getDate() - 42); // 1.5 months (42 days)

    // Add specific readings for November 4th
    const nov4Readings = [
      {
        date: '2023-11-04',
        time: '08:00',
        bloodPressure: {
          systolic: 122,
          diastolic: 78
        },
        heartRate: 74,
        temperature: 36.7,
        bloodSugar: {
          value: 105,
          type: 'fasting'
        },
        weight: 69.5
      },
      {
        date: '2023-11-04',
        time: '12:00',
        bloodPressure: {
          systolic: 125,
          diastolic: 80
        },
        heartRate: 76,
        temperature: 36.8,
        bloodSugar: {
          value: 128,
          type: 'post-lunch'
        },
        weight: 69.5
      },
      {
        date: '2023-11-04',
        time: '16:00',
        bloodPressure: {
          systolic: 124,
          diastolic: 79
        },
        heartRate: 75,
        temperature: 36.9,
        bloodSugar: {
          value: 118,
          type: 'afternoon'
        },
        weight: 69.6
      },
      {
        date: '2023-11-04',
        time: '20:00',
        bloodPressure: {
          systolic: 120,
          diastolic: 77
        },
        heartRate: 72,
        temperature: 36.8,
        bloodSugar: {
          value: 115,
          type: 'evening'
        },
        weight: 69.6
      }
    ];

    // Generate daily readings for the last 6 weeks
    for (let date = new Date(sixWeeksAgo); date <= now; date.setDate(date.getDate() + 1)) {
      // Skip November 4th as we have specific readings for it
      if (date.toISOString().split('T')[0] === '2023-11-04') {
        readings.push(...nov4Readings);
        continue;
      }

      // Generate 4 readings per day
      ['08:00', '12:00', '16:00', '20:00'].forEach(time => {
        const dayProgress = parseInt(time.split(':')[0]) / 24;
        const dayVariation = Math.sin(date.getTime() / (1000 * 60 * 60 * 24) * Math.PI) * 5;
        const randomVariation = (Math.random() - 0.5) * 4;
        
        // Base values with natural variations
        const systolic = Math.round(120 + dayVariation + randomVariation);
        const diastolic = Math.round(80 + (dayVariation + randomVariation) * 0.6);
        const heartRate = Math.round(72 + dayVariation + randomVariation);
        const temperature = Number((36.6 + (dayVariation + randomVariation) * 0.02).toFixed(1));
        const bloodSugar = Math.round(100 + dayVariation + randomVariation * 2);
        
        // Weight with a slight trend and weekly variation
        const weeklyVariation = Math.sin(date.getTime() / (1000 * 60 * 60 * 24 * 7) * Math.PI) * 0.5;
        const weightTrend = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 42) * 1; // 1kg change over 6 weeks
        const weight = Number((70 + weightTrend + weeklyVariation + (Math.random() - 0.5) * 0.2).toFixed(1));

        readings.push({
          date: date.toISOString().split('T')[0],
          time: time,
          bloodPressure: {
            systolic,
            diastolic
          },
          heartRate,
          temperature,
          bloodSugar: {
            value: bloodSugar,
            type: time === '08:00' ? 'fasting' : 
                  time === '12:00' ? 'post-lunch' :
                  time === '16:00' ? 'afternoon' : 'evening'
          },
          weight
        });
      });
    }

    return readings.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  };

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
      }
    ],
    allergies: [
      {
        allergen: "Penicillin",
        type: "medication",
        severity: "severe",
        reaction: "Anaphylaxis"
      },
      {
        allergen: "Tree Nuts",
        type: "food",
        severity: "moderate",
        reaction: "Hives and difficulty breathing"
      }
    ],
    immunizations: [
      {
        name: "Influenza Vaccine",
        date: "2023-10-15",
        type: "Inactivated influenza",
        nextDueDate: "2024-10-15",
        administeredBy: "Dr. James Wilson"
      },
      {
        name: "COVID-19 Vaccine",
        date: "2023-09-01",
        type: "mRNA",
        nextDueDate: "2024-09-01",
        administeredBy: "Dr. Maria Garcia"
      }
    ],
    vitalReadings: generateVitalReadings(),
    labResults: [
      {
        date: "2024-03-01",
        type: "HbA1c",
        result: "6.8",
        normalRange: "4.0-5.6",
        status: "abnormal",
        notes: "Improved from previous reading"
      },
      {
        date: "2024-03-01",
        type: "Total Cholesterol",
        result: "185",
        normalRange: "<200",
        status: "normal",
        notes: "Within normal range"
      }
    ]
  };
};