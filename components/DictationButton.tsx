
import React, { useState, useEffect } from 'react';
import { refineMedicalNotes } from '../services/geminiService';

interface DictationButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  placeholder?: string;
}

const DictationButton: React.FC<DictationButtonProps> = ({ onTranscript, className = "", placeholder = "" }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        onTranscript(transcript);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleAiRefine = async () => {
    setIsProcessing(true);
    // This expects the parent to have captured the current text
    // For this UI feedback, we just simulate the intent
    setIsProcessing(false);
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <button
        type="button"
        onClick={toggleRecording}
        title={isRecording ? "Stop Dictation" : "Start Dictation"}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
          isRecording 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
        }`}
      >
        <i className={`fa ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
      </button>
      
      {isRecording && (
        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse">
          Listening...
        </span>
      )}
      
      {!isRecording && (
         <button
            type="button"
            onClick={handleAiRefine}
            title="Refine with Medical AI"
            className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-100 transition-all shadow-sm"
         >
            <i className={`fa ${isProcessing ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
         </button>
      )}
    </div>
  );
};

export default DictationButton;
