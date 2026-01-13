import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Upload, AlertTriangle, CheckCircle, Loader, Info, Type, Globe, ALargeSmall } from 'lucide-react';
import useSpeech from './useSpeech';

export default function MedicationScanner() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('Ready to scan');
  
  // SETTINGS
  const [language, setLanguage] = useState('English');
  const [fontSize, setFontSize] = useState(1.1);
  const { speak, stop } = useSpeech();

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
      setResult(null);
      setStatus('Image loaded. Click Analyze.');
    }
  };

  const processImage = async () => {
    if (!selectedImage) return;
    setLoading(true);
    setStatus('Reading text...');
    stop(); 

    try {
      // 1. OCR
      const ocrResult = await Tesseract.recognize(selectedImage, 'eng');
      const text = ocrResult.data.text;

      // 2. Backend Call
      setStatus(`Translating to ${language}...`);
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text, language: language }) 
      });
      
      const data = await response.json();
      setResult(data);
      setStatus('Complete.');
      
      // Auto-speak
      if (data.data && data.data.warning) {
        speak(`Attention. ${data.title}. ${data.data.warning}`, language);
      }

    } catch (err) {
      console.error(err);
      setStatus('Error. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  // STYLE: Black text for readability
  const textStyle = { 
    fontSize: `${fontSize}rem`, 
    lineHeight: 1.5, 
    color: '#000000', 
    marginTop: '5px'
  };

  return (
    // --- 1. PAGE WRAPPER (Forces Centering) ---
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      paddingTop: '20px',
      paddingBottom: '50px'
    }}>
      
      {/* --- 2. MAIN CONTAINER (Limits Width) --- */}
      <div style={{ width: '100%', maxWidth: '1100px', padding: '0 20px' }}>

        {/* --- SETTINGS BAR --- */}
        <div style={{ 
          display: 'flex', 
          gap: '30px', 
          marginBottom: '25px', 
          background: '#fff', 
          padding: '25px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          alignItems: 'center'
        }}>
          
          {/* Language Selector */}
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', color: '#334155' }}>
              <Globe size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} color="#2563eb"/> 
              Translation Language
            </label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', cursor: 'pointer' }}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="Arabic">Arabic (العربية)</option>
              <option value="Mandarin">Chinese (Mandarin)</option>
            </select>
          </div>

          {/* Font Size Slider */}
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', color: '#334155' }}>
              <ALargeSmall size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} color="#2563eb" /> 
              Text Size
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Type size={16} color="#64748b" />
              <input 
                type="range" 
                min="1" max="1.8" step="0.1" 
                value={fontSize} 
                onChange={(e) => setFontSize(parseFloat(e.target.value))}
                style={{ flex: 1, cursor: 'pointer', accentColor: '#2563eb' }} 
              />
              <Type size={28} color="#64748b" />
            </div>
          </div>
        </div>

        {/* --- MAIN GRID LAYOUT --- */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
          
          {/* COLUMN 1: SCANNER */}
          <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
             <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1e293b' }}>📸 Scan Bottle</h2>
             
             <label style={{ display: 'block', cursor: 'pointer', border: '3px dashed #cbd5e1', borderRadius: '16px', padding: '40px', textAlign: 'center', marginBottom: '25px', background: '#f8fafc', transition: 'all 0.2s' }}>
               <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
               {selectedImage ? 
                 <img src={selectedImage} style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '12px', objectFit: 'contain' }} /> : 
                 <div style={{ color: '#64748b' }}>
                   <Upload size={50} style={{ marginBottom: '15px', opacity: 0.5 }} />
                   <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Tap to Upload Photo</p>
                 </div>
               }
             </label>
             
             <button onClick={processImage} disabled={loading || !selectedImage} 
               style={{ width: '100%', padding: '18px', background: loading ? '#94a3b8' : '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.2rem', fontWeight: '600', cursor: loading || !selectedImage ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' }}>
               {loading ? <><Loader className="animate-spin"/> Analyzing...</> : 'Analyze Safety'}
             </button>
             <p style={{ textAlign: 'center', color: '#64748b', marginTop: '15px', fontSize: '0.9rem' }}>{status}</p>
          </div>

          {/* COLUMN 2: RESULTS (Min Height Fix) */}
          <div style={{ minHeight: '500px' }}> 
            
            {/* PLACEHOLDER */}
            {!result && (
              <div style={{ 
                height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                border: '3px dashed #e2e8f0', borderRadius: '20px', color: '#94a3b8', background: '#f8fafc', padding: '40px', textAlign: 'center' 
              }}>
                <Info size={64} style={{ marginBottom: '20px', opacity: 0.3 }} />
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#64748b', marginBottom: '10px' }}>Results Area</h3>
                <p style={{ maxWidth: '300px', margin: '0 auto', lineHeight: '1.6' }}>
                  Upload a photo of a medication label to see the translated instructions, dosage, and safety warnings here.
                </p>
              </div>
            )}

            {/* RESULTS CARD */}
            {result && (
              <div style={{ 
                padding: '30px', borderRadius: '20px', background: 'white',
                borderTop: `10px solid ${result.color === 'red' ? '#ef4444' : result.color === 'yellow' ? '#eab308' : '#22c55e'}`,
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
              }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9', color: result.color === 'red' ? '#b91c1c' : result.color === 'yellow' ? '#854d0e' : '#15803d' }}>
                  {result.color === 'green' ? <CheckCircle size={48} /> : <AlertTriangle size={48} />}
                  <h2 style={{ margin: 0, fontSize: '2rem', lineHeight: '1' }}>{result.title}</h2>
                </div>

                {/* Data Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  
                  {/* DRUG NAME */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', borderLeft: '6px solid #334155' }}>
                    <span style={{ fontWeight: '700', color: '#64748b', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>MEDICATION NAME</span>
                    <div style={{ fontSize: `${fontSize * 1.4}rem`, fontWeight: '800', color: '#0f172a', marginTop: '8px' }}>{result.data.drug}</div>
                  </div>

                  {/* USAGE */}
                  <div>
                     <span style={{ fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <Info size={20}/> Usage
                     </span>
                     <p style={textStyle}>{result.data.usage}</p>
                  </div>

                  {/* DOSAGE */}
                  <div>
                     <span style={{ fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Type size={20}/> Instructions
                     </span>
                     <p style={textStyle}>{result.data.dosage}</p>
                  </div>

                  {/* WARNING */}
                  <div style={{ background: '#fef2f2', padding: '25px', borderRadius: '16px', border: '1px solid #fee2e2' }}>
                     <span style={{ fontWeight: '800', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <AlertTriangle size={20}/> Critical Warning
                     </span>
                     <p style={{ ...textStyle, color: '#991b1b', fontWeight: '600' }}>{result.data.warning}</p>
                  </div>

                </div>

                {/* FDA FOOTER */}
                <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #f1f5f9', fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                  <Globe size={16} /> {result.fda}
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}