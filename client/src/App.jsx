import React from 'react';
import MedicationScanner from './MedicationScanner';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: '#2563eb', color: 'white', padding: '1rem' }}>
        <h1 style={{ margin: 0, textAlign: 'center' }}>🛡️ MedGuard AI</h1>
      </nav>

      {/* Main App */}
      <div style={{ padding: '20px' }}>
        <MedicationScanner />
      </div>
    </div>
  );
}

export default App;