// File: client/src/useSpeech.js
import { useState, useEffect, useRef } from 'react';

const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);

  // Stop speaking when the component unmounts (closes)
  useEffect(() => {
    return () => {
      if (synth) synth.cancel();
    };
  }, [synth]);

  const speak = (text, lang = 'en-US') => {
    if (!synth || !text) return;

    // 1. Cancel current speech
    synth.cancel();

    // 2. Configure the new speech
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Map our simple language names to actual BCP 47 tags
    const langMap = {
      'English': 'en-US',
      'Spanish': 'es-ES',
      'French': 'fr-FR',
      'Arabic': 'ar-SA',
      'Mandarin': 'zh-CN'
    };
    utterance.lang = langMap[lang] || 'en-US';
    
    utterance.rate = 0.9; // Slightly slower is easier to understand
    utterance.pitch = 1.0;

    // 3. Handle events
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // 4. Speak
    synth.speak(utterance);
  };

  const stop = () => {
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  };

  return { speak, stop, isSpeaking };
};

export default useSpeech;