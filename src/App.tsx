import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import QRGenerator from './components/QRGenerator';
import MedicalCard from './components/MedicalCard';
import { ThemeToggle } from './components/ThemeToggle';
import { Modal } from './components/ui/Modal';

function App() {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col bg-background font-sans antialiased">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <Heart className="h-6 w-6 text-pink-500 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-semibold text-lg">
              RYA Medical
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-screen-2xl">
        <Routes>
          <Route path="/" element={<QRGenerator />} />
          <Route path="/medical/:id" element={<MedicalCard />} />
        </Routes>
      </main>

      <footer className="mt-auto border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                <h3 className="font-semibold">RYA Medical</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Secure medical information sharing through QR codes.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold">Quick Links</h3>
              <nav className="flex flex-col space-y-2">
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Generate QR Code
                </Link>
                <button 
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => setShowTerms(true)}
                  className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </button>
              </nav>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold">Contact</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Email: support@ryamedical.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Hours: Mon-Fri 9:00 AM - 5:00 PM EST</p>
              </div>
            </div>
          </div>
          
          <div className="border-t py-6">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} RYA Medical. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <Modal
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
        title="Privacy Policy"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">1. Information Collection</h3>
          <p>
            We collect medical information that you voluntarily provide when using our QR code generation service. This includes but is not limited to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Personal identification information</li>
            <li>Medical history and conditions</li>
            <li>Emergency contact details</li>
            <li>Vital statistics and measurements</li>
          </ul>

          <h3 className="text-lg font-semibold">2. Data Security</h3>
          <p>
            We implement industry-standard security measures to protect your medical information:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>End-to-end encryption for data transmission</li>
            <li>Secure storage with regular backups</li>
            <li>Access controls and authentication</li>
            <li>Regular security audits and updates</li>
          </ul>

          <h3 className="text-lg font-semibold">3. Information Usage</h3>
          <p>
            Your medical information is used solely for generating QR codes that enable quick access to critical medical data in emergency situations.
          </p>

          <h3 className="text-lg font-semibold">4. Data Sharing</h3>
          <p>
            We do not share your medical information with third parties except when:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Required by law</li>
            <li>Necessary for emergency medical services</li>
            <li>Explicitly authorized by you</li>
          </ul>
        </div>
      </Modal>

      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms of Service"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">1. Service Description</h3>
          <p>
            RYA Medical provides a QR code generation service for storing and accessing medical information. By using our service, you agree to these terms.
          </p>

          <h3 className="text-lg font-semibold">2. User Responsibilities</h3>
          <p>
            As a user of our service, you are responsible for:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Providing accurate medical information</li>
            <li>Maintaining the confidentiality of your QR codes</li>
            <li>Updating your information as needed</li>
            <li>Using the service in compliance with applicable laws</li>
          </ul>

          <h3 className="text-lg font-semibold">3. Limitations of Liability</h3>
          <p>
            RYA Medical is not liable for:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Inaccurate information provided by users</li>
            <li>Service interruptions or technical issues</li>
            <li>Unauthorized access to QR codes shared by users</li>
            <li>Medical decisions made based on provided information</li>
          </ul>

          <h3 className="text-lg font-semibold">4. Service Modifications</h3>
          <p>
            We reserve the right to modify or discontinue our service at any time, with or without notice. Changes to these terms will be effective upon posting to our website.
          </p>

          <h3 className="text-lg font-semibold">5. Governing Law</h3>
          <p>
            These terms are governed by and construed in accordance with applicable laws, without regard to conflicts of law principles.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default App;