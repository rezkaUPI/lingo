import React, { useState, useRef } from 'react';

const CaptureVoice = () => {
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  const handleStartRecording = () => {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!recognitionRef.current) {
      recognitionRef.current = new window.SpeechRecognition();
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.addEventListener('result', (event) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
      });

      recognitionRef.current.addEventListener('end', recognitionRef.current.start);
    }
    recognitionRef.current.start();
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.removeEventListener('end', recognitionRef.current.start);
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }

  return (
    <div>
      <button onClick={handleStartRecording}>Start Recording</button>
      <button onClick={handleStopRecording}>Stop Recording</button>
      <p>{transcript}</p>
    </div>
  );
}

export default CaptureVoice;