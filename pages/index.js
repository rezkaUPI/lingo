import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();

  const audioRef = useRef(); // Create a ref for the audio component
  const [isPlaying, setIsPlaying] = useState(false); // Create a state for play status

  const handlePlay = () => {
    if(isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(name.trim() !== '') {
      localStorage.setItem('playerName', name);  // Add this line to store the name
      router.push('/menu');
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-2 text-white bg-gradient-linear overflow-hidden">
      <img className="absolute top-0 left-0" src="cloud_1.svg" alt="Cloud Animation" />
      <img className="absolute top-0 right-0" src="cloud_2.svg" alt="Cloud Animation" />
      <img className="absolute bottom-0 w-full h-1/4 z-0" style={{bottom: '-5%'}} src="ground.svg" alt="Ground SVG" />

      {/* Add the audio component */}
      <audio ref={audioRef} src="index.wav" loop />

      {/* Add Play/Pause button */}
      <button 
        onClick={handlePlay} 
        style={{
          position: 'absolute', 
          bottom: '-1px', 
          left: '10px', 
          fontSize: '10px', 
          padding: '5px'
        }}
      >
        {isPlaying ? "Pause Sound" : "Play Sound"}
      </button>

      <h1 className="text-2xl mb-4 z-10 self-center golden-text">PGSD Lingo</h1>
      <div className="relative mb-4 z-10 mx-4 py-4">
        <img src="placeholder.svg" alt="Your SVG" />
        <p className="absolute top-0 left-0 text-center text-black mx-4 my-4 text-sm" style={{ top: '50%', transform: 'translateY(-50%)' }}>
            1. Masukkan nama anda<br/>
            2. Pastikan microfon anda tersambung untuk memainkan game ini<br/>
            3. Anda akan mendapatkan point untuk setiap ucapan yang benar<br/>
            4. Mainkan game ini bersama guru anda
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center z-10 pb-10 mt-4">
        <div className="py-2 px-2 bg-white rounded-md mb-4">
          <div className="py-2 px-2 bg-blue-100 rounded-md">
            <div className="py-2 px-2 bg-blue-100 rounded-md">
              <input 
                className="w-full rounded-md text-black bg-transparent outline-none"
                type="text" 
                placeholder="Masukkan nama anda" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <button className="px-8 py-2 mt-4 text-white rounded-md w-72 shadow-lg bg-black z-20" style={{boxShadow: '8px 8px 0px 0px #3E250D'}} type="submit">Start</button>
      </form>

      {/* Add the copyright footer */}
      <div className="absolute bottom-0 right-0 mb-2 mr-2 text-xs text-white">
      <span className="text-xxs">PGSDxMKB UPI PWK 2023 </span>
      <img src="logo_upi.svg" alt="UPI Logo" className="inline-block h-4 w-auto" />
      </div>
    </div>
  );
}
