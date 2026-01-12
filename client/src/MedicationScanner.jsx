import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Upload, FileText, AlertTriangle, CheckCircle, Loader } from 'lucide-react';

export default function MedicationScanner() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [scannedText, setScannedText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Upload an image to begin');

  // 1. Handle File Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setScannedText('');
      setAnalysisResult(null);
      setStatus('Image loaded. Click "Analyze Medication" to start.');
    }
  };

  // 2. Perform OCR (Extract Text)
  const processImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setStatus('Reading text from image...');

    try {
      const result = await Tesseract.recognize(
        selectedImage,
        'eng',
        { logger: (m) => console.log(m) } // Check console for progress
      );

      const text = result.data.text;
      setScannedText(text);
      
      if (!text.trim()) {
        setStatus('No text found. Please try a clearer image.');
        setLoading(false);
        return;
      }

      // 3. Send to Backend API
      verifySafety(text);

    } catch (err) {
      console.error(err);
      setStatus('Error reading image. Try again.');
      setLoading(false);
    }
  };

  // 4. API Call Logic
  const verifySafety = async (text) => {
    setStatus('Checking medication safety...');

    try {
      // MAKE SURE this matches your backend URL/Port!
      const response = await fetch('http://localhost:3000/api/analyze', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text }) // Sending the OCR text
      });

      const data = await response.json();
      setAnalysisResult(data);
      setStatus('Analysis complete.');

    } catch (error) {
      console.error("API Error:", error);
      setStatus('Error connecting to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Medication Scanner</h1>

      {/* Upload Section */}
      <div style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          style={{ display: 'none' }} 
          id="file-upload"
        />
        <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {selectedImage ? (
            <img src={selectedImage} alt="Upload" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} />
          ) : (
            <>
              <Upload size={48} color="#666" />
              <p>Click to Upload Medication Image</p>
            </>
          )}
        </label>
      </div>

      {/* Action Button */}
      <button 
        onClick={processImage} 
        disabled={loading || !selectedImage}
        style={{ 
          width: '100%', 
          padding: '12px', 
          backgroundColor: loading ? '#ccc' : '#2563eb', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {loading ? <span style={{display:'flex', justifyContent:'center', gap:'10px'}}><Loader className="animate-spin"/> Processing...</span> : 'Analyze Medication'}
      </button>

      {/* Status Message */}
      <p style={{ textAlign: 'center', color: '#666', marginTop: '10px' }}>{status}</p>

      {/* Results Display */}
      {analysisResult && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {analysisResult.safe ? <CheckCircle color="green" /> : <AlertTriangle color="red" />}
            {analysisResult.safe ? 'Safe to Use' : 'Caution Advised'}
          </h3>
          <p>{analysisResult.message || "No additional details provided."}</p>
          
          {scannedText && (
            <details style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
              <summary>View Scanned Text</summary>
              <pre style={{ whiteSpace: 'pre-wrap', background: '#eee', padding: '10px' }}>{scannedText}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
