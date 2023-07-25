import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Animals() {
  
  const [recording, setRecording] = useState(false);
  const [speechRecognitionOutput, setSpeechRecognitionOutput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false); 
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [love, setLove] = useState(0);
  const [completed, setCompleted] = useState(false); // <---- Added this
  const recognitionRef = useRef(null);

  const words = ["Act", "Bake", "Climb", "Dance", "Eat", "Fly", 
                "Garden", "Hike", "Invent", "Jump", "Kick", "Laugh", 
                "Move", "Navigate", "Observe", "Paint", "Question", "Read", 
                "Sing", "Talk", "Unpack", "Venture", "Write", "Xerox",
                "Yawn", "Zoom"];

  useEffect(() => {
    typeWriterEffect();
  }, [currentWordIndex]);

  const typeWriterEffect = async () => {
    setIsTyping(true);
    let i = 0;
    const speed = 50;
    const letter = words[currentWordIndex].charAt(0);
    const typewriterText = `${(currentWordIndex + 1) % 5 === 0 ? 'GAHAHAHA YOURE GREAT, BUT ' : ''}  Can you pronounce this word for me? It starts with the letter "${letter}" which is the ${currentWordIndex + 1}${currentWordIndex === 0 ? 'st' : currentWordIndex === 1 ? 'nd' : currentWordIndex === 2 ? 'rd' : 'th'} letter in the alphabet. The word is "${words[currentWordIndex]}"`;
  
    setText(''); // Reset the text here
    while (i < typewriterText.length) {
      await new Promise((resolve) => setTimeout(resolve, speed));
      setText((prevText) => prevText + typewriterText.charAt(i));
      i++;
    }
    setIsTyping(false);
  };
  
  

  useEffect(() => {
    if (!isTyping && isCorrect !== null) {
      handleStartRecording();
    }
  }, [isTyping, isCorrect]);

  useEffect(() => {
    if (!recording) return;
    setTimeout(() => {
      if (speechRecognitionOutput.toLowerCase().trim() === words[currentWordIndex].toLowerCase()) {
        setSpeechRecognitionOutput('');
        setText('Good job!');
        setScore(prevScore => {
          const newScore = prevScore + 20;
          if(newScore % 100 === 0){
            setLove(prevLove => prevLove + 1);
          }
          return newScore;
        }); 
        setIsCorrect(true);
        if(currentWordIndex !== words.length - 1) {
          setTimeout(() => {
            setCurrentWordIndex(prevWordIndex => prevWordIndex + 1);
            setIsCorrect(null);
          }, 2000);
        } else {
            setText('Well done! You have finished all the words!');
            setCompleted(true); // <---- Added this
          }
      } else if (speechRecognitionOutput !== '') {
        setText(`Sorry, that's incorrect, try again. Word to pronounce is "${words[currentWordIndex]}"`);
        setIsCorrect(false);
      }
    }, 2000);
  }, [speechRecognitionOutput, recording]);

  const handleStartRecording = () => {
    if (recognitionRef.current) return;
    setSpeechRecognitionOutput('');
    setRecording(true);
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
    if (!recognitionRef.current) {
      recognitionRef.current = new window.SpeechRecognition();
      recognitionRef.current.interimResults = false; 
      recognitionRef.current.lang = 'en-US';
  
      recognitionRef.current.addEventListener('result', (event) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setSpeechRecognitionOutput(text);
      });
  
      recognitionRef.current.addEventListener('end', recognitionRef.current.start);
    }
    recognitionRef.current.start();
  };
  

  const handleStopRecording = () => {
    setRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.removeEventListener('end', recognitionRef.current.start);
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-2 text-white bg-gradient-linear overflow-hidden">
      <div className="absolute top-0 left-0 p-4">
      <Link href="/menu">
          <div className="text-xs font-bold text-black cursor-pointer">{'>>'} Back to Menu</div>
      </Link>
    </div>
      <div 
            className="absolute left-0 bottom-10 z-10 flex flex-col items-start space-y-2" 
            style={{bottom: '21%'}}
            >
            <p>Pts: {score}</p>
            <div className="flex space-x-2">
                {Array.from({length: love}).map((_, index) => (
                <img key={index} src="/heart.svg" alt="Love SVG" className="w-4 h-4" />
                ))}
            </div>
            </div>
      <img className="absolute bottom-0 w-full h-1/4 z-0" style={{bottom: '-4%'}} src="ground.svg" alt="Ground SVG" />
      <img className="absolute right-0 bottom-0 z-10" style={{bottom: '21%'}} src="bush.svg" alt="Bush SVG" />

      <div className="absolute right-0 top-10 flex flex-col items-center">
      <img 
            className="z-10" 
            src={((currentWordIndex + 1) % 5 === 0) ? "villain.png" : "guru.png"} 
            alt="Character PNG" 
            />
        <div className="mt-4 p-4 rounded-xl bg-white text-black z-10">
          <p>{text}</p>
        </div>
      </div>

      <div className="absolute bottom-30 flex items-center">
        <img className="z-10" src="/raya.png" alt="Raya PNG" />
        <div className="ml-4 p-4 rounded-xl bg-white text-black z-10">
          {isCorrect !== null && <p>{isCorrect ? "Correct!" : "Try again"}</p>}
          <p>Word: {speechRecognitionOutput}</p>
          <button className="px-2 py-1 text-xs text-white rounded-md shadow-lg bg-black" style={{boxShadow: '8px 8px 0px 0px #3E250D'}} onClick={handleStopRecording}>Stop Record</button>
          <button className="px-2 py-1 text-xs text-white rounded-md shadow-lg bg-black ml-2" style={{boxShadow: '8px 8px 0px 0px #3E250D'}} onClick={handleStartRecording}>Start Record</button>
        </div>
      </div>
      {completed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-60">
          <p className="text-2xl font-bold">Congratulations!</p>
          <div className="flex space-x-4 my-4">
            {Array.from({length: 5}).map((_, index) => (
              <img key={index} src="/heart.svg" alt="Love SVG" className="w-12 h-12" />
            ))}
          </div>
          <Link href="/menu">
                <div className="px-4 py-2 mt-4 text-xl font-bold text-white rounded-md bg-red-600 cursor-pointer">Back to Menu</div>
            </Link>

        </div>
      )}
    </div>
  );
}
