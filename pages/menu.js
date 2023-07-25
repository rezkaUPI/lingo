import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';


export default function Menu() {
  const [playerName, setPlayerName] = useState('');
  const [readyToPlay, setReadyToPlay] = useState(null);
  const [text, setText] = useState('');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [startRecording, setStartRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false); 
  const [speechRecognitionOutput, setSpeechRecognitionOutput] = useState("");
  const [recording, setRecording] = useState(false); 
  const [showRecordingButtons, setShowRecordingButtons] = useState(false);
  const [typeTimeout, setTypeTimeout] = useState(null);

  const messages = [
    `   Hi, my name is Guru. I'll guide you throughout the game.`,
    `  Please activate the microphone by pressing the mic button and say "Hello".`,
    `  You will be asked to pronounce some words to gain points. These points will be shown on the left side of the game with <img src="heart.svg" alt="Heart Emoji" />`,
    `  Collect 5 heart emojis by collecting 100 points for each game.`,
    `  So, ${playerName}, are you ready to play?`,
  ];

  const recognitionRef = useRef(null);

  useEffect(() => {
    setPlayerName(localStorage.getItem('playerName') || '');
  }, []);

  useEffect(() => {
    if (playerName !== '' || currentMessageIndex === 1) {
      typeWriterEffect();
    }
  }, [playerName, currentMessageIndex]);
  

  useEffect(() => {
    if (currentMessageIndex === 1 && !isTyping) {
      setShowRecordingButtons(true);
      setStartRecording(true);
    }
    else {
      setShowRecordingButtons(false);
    }
  }, [isTyping]);

  const typeWriterEffect = () => {
    setIsTyping(true); // start of typing
    let i = 0;
    const speed = 50;
  
    const typewriterText = messages[currentMessageIndex];
  
    const typeNextCharacter = () => {
      setText((prevText) => prevText + typewriterText.charAt(i));
      i++;
      if (i < typewriterText.length) {
        setTypeTimeout(setTimeout(typeNextCharacter, speed)); // Use setTimeout and save it in state
      } else {
        setIsTyping(false); // end of typing
      }
    };
    typeNextCharacter();
  };

  useEffect(() => {
    if (currentMessageIndex === 1 && !isTyping) {
      setStartRecording(true);
    }
  }, [isTyping]);

  const handleNextMessage = () => {
    clearTimeout(typeTimeout); // Clear the current timeout
    setText(''); // Clear the text
    setIsTyping(true); // Start typing before updating current message index
    setCurrentMessageIndex((prevMessageIndex) => prevMessageIndex + 1);
  };
  

  

  useEffect(() => {
    if (startRecording) {
      handleStartRecording();
    }
  }, [startRecording]);

  useEffect(() => {
    if (speechRecognitionOutput.toLowerCase().trim() === "hello") {
      setSpeechRecognitionOutput('');
    }
  }, [speechRecognitionOutput]);

  const handleStartRecording = () => {
    if (recording) return; // Prohibit starting record twice
    setRecording(true); // Update recording state
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!recognitionRef.current) {
      setSpeechRecognitionOutput('');
      recognitionRef.current = new window.SpeechRecognition();
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.addEventListener('result', (event) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setSpeechRecognitionOutput(text); // Set the recognized text to the state
        // handleStopRecording();
      });

      recognitionRef.current.addEventListener('end', recognitionRef.current.start);
    }
    recognitionRef.current.start();
  };

  const handleStopRecording = () => {
    if (!recording) return; // If not recording, don't proceed with stopping
    setRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.removeEventListener('end', recognitionRef.current.start);
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setStartRecording(false);
    }
    setSpeechRecognitionOutput(''); // Clear the speech recognition output
  };
  

  if (readyToPlay === false) {
    window.location.href = "/";
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-2 text-white bg-gradient-linear overflow-hidden">
      <img className="absolute bottom-0 w-full h-1/4 z-0" style={{bottom: '-4%'}} src="ground.svg" alt="Ground SVG" />
      <img className="absolute right-0 bottom-0 z-10" style={{bottom: '21%'}} src="bush.svg" alt="Bush SVG" />
      <div className="absolute top-10 flex flex-col items-center">
        <img className="z-10" src="/guru.png" alt="Guru PNG" />
        <div className="mt-4 p-4 rounded-xl bg-white text-black z-10">
          <p dangerouslySetInnerHTML={{ __html: text }} />
          {currentMessageIndex !== messages.length - 1 && (
            <button className="px-4 py-1 text-white rounded-md shadow-lg bg-black" style={{boxShadow: '8px 8px 0px 0px #3E250D'}} onClick={handleNextMessage}> {'>>'} </button>
          )}

          {currentMessageIndex === messages.length - 1 && readyToPlay === null && (
            <div className="flex z-10 space-x-4 mt-4">
              <button className="px-4 py-1 text-white rounded-md shadow-lg bg-black" style={{boxShadow: '8px 8px 0px 0px #3E250D'}} onClick={() => setReadyToPlay(true)}>Yes</button>
              <button className="px-4 py-1 text-white rounded-md shadow-lg bg-black" style={{boxShadow: '8px 8px 0px 0px #3E250D'}} onClick={() => setReadyToPlay(false)}>No</button>
            </div>
          )}
        </div>
        {/* Update Recording buttons */}
        {showRecordingButtons && (
          <>
            {!recording && (
              <button className="px-4 py-1 text-white rounded-md shadow-lg bg-black" style={{boxShadow: '8px 8px 0px 0px #3E250D'}} onClick={handleStartRecording}>Start Record</button>
            )}
            {recording && (
              <button className="px-4 py-1 text-white rounded-md shadow-lg bg-black" style={{boxShadow: '8px 8px 0px 0px #3E250D'}} onClick={handleStopRecording}>Stop Record</button>
            )}
          </>
        )}
      </div>
      <p>{speechRecognitionOutput}</p>
      {readyToPlay === true && playerName && (
        <div className="flex flex-col space-y-4 z-10 items-center">
          <h2 className="text-1xl mb-4">Select the words you want to learn!</h2>
          <Link href="animals">
            <span className="cursor-pointer px-8 py-2 text-white rounded-md bg-cover" 
                  style={{ backgroundImage: `url('placeholder-2.svg')` }}>Animals</span>
          </Link>
          <Link href="objects">
            <span className="cursor-pointer px-8 py-2 text-white rounded-md bg-cover" 
                  style={{ backgroundImage: `url('placeholder-2.svg')` }}>Objects</span>
          </Link>
          <Link href="places">
            <span className="cursor-pointer px-8 py-2 text-white rounded-md bg-cover" 
                  style={{ backgroundImage: `url('placeholder-2.svg')` }}>Places</span>
          </Link>
          <Link href="activities">
            <span className="cursor-pointer px-8 py-2 text-white rounded-md bg-cover" 
                  style={{ backgroundImage: `url('placeholder-2.svg')` }}>Activities</span>
          </Link>
  </div>
)}

    </div>
  );
}
