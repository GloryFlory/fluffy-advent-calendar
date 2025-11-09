'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const earlyTasks = [
  "Memory Snapshot – Sri Lanka\nSend me a photo or short video of a place in Sri Lanka that made you smile today – I want to see the world through your eyes.",
  "Anchor Object\nFind a small object where you are that can be your 'Flo-anchor' (stone, shell, leaf). Every time you see it, remember: you're loved from far away. Send me a picture of it.",
  "Body & Breath Check-In\nTake 5 slow breaths with one hand on your heart and one on your belly. Ask your body: 'What do you need from me today?' Send me the answer in a short message.",
  "Cheeky Throwback\nFind an old photo or video of us that makes you laugh or blush a little. Send it to me with one sentence: 'I love this because…'",
  "Fluffy Prompts Moment\nWrite (in your journal or notes) answers to:\n\n- What am I proud of this month?\n- What am I scared of right now?\n- Where do I feel most supported?\n\nShare as much or as little as you want with me.",
  "Gratitude Ping-Pong\nWrite down 3 things you're grateful for about yourself this year. Then send me 1 voice note telling me 3 things you're grateful for about us.",
  "Sensual Self-Care\nGive your body 15 minutes of loving attention – stretch, self-massage, oil, or a delicious shower. Afterwards, send me one line: 'My body feels…'",
  "Mini Meditation Together\nSet a timer for 5 minutes. Sit, breathe, and imagine we're cuddling in one of our favourite spots. Afterwards, send me one word that describes how you feel.",
  "Dark Forest / Light Flicker\nWrite down 3 hard things from this year and 3 ways you've grown because of them. If it feels safe, share one 'growth' insight with me.",
  "Flirty Photo Challenge\nTake a playful, flirty, or cosy photo where you feel good in your body. Send it to me with a caption: 'This is me, feeling…'",
  "Tiny Act of Courage\nDo one tiny brave thing today (say no, ask for help, try something new). Tell me what you did and how it felt.",
  "Favourite Spot, Full Story\nChoose your absolute favourite spot in Sri Lanka so far. Send me a photo and 5–10 sentences about what makes it special to you.",
  "Future You Love Letter\nWrite a short love letter to 'Future Maria – 1 year from now'. Take a photo or snippet and send it to me.",
  "Design Our Future Date (Sri Lanka Edition)\nImagine we have one full day together somewhere in Sri Lanka. Write a rough 'date itinerary' from morning to night and send it to me.",
  "Croissant / Pastry Heaven\nFind your favourite croissant or pastry place nearby. Send me a picture of your treat and tell me how it compares to our European standards. Be brutally honest. 🥐",
  "Street Soundscape\nRecord a short audio clip of the street / nature / temple sounds where you are and send it to me like a tiny sound postcard.",
  "If You Had Me for an Hour…\nImagine I suddenly appear next to you for one hour. Where would you take me right now and what would we do? Describe it in a message or voice note.",
  "Sensory Sri Lanka\nShare 3 sensory details you love about where you are: one smell, one taste, one thing you love to touch or feel on your skin. Send them to me.",
  "Little Guided Tour\nRecord a short video walking me through a place you love there – like a mini guided tour. Talk to the camera as if I'm walking next to you.",
  "Five Things For Our 2026\nWrite a list of 5 things you want us to experience together in 2026 (they can be tiny or huge). Send me the list."
];

const lateTasks = [
  "Where Do You Want to Be Held?\nJournal: 'Where in my life do I most wish to feel held right now?' If it feels okay, share one sentence of that with me.",
  "Three Things That Turn You On About Me\nSend me 3 things that turn you on about me – 1 physical, 1 emotional, 1 playful. No filter. 😏",
  "If You Had Me There Tonight…\nMake a list of things you'd do to me if I was there with you tonight – as sweet, spicy, or detailed as you feel comfortable. You can send the whole list or just your favourite 3. 😈"
];

interface Door {
  day: number;
  isOpen: boolean;
  prompt: string;
  gridClass: string;
  randomOrder: number;
}

interface ModalData {
  day: number;
  prompt: string;
  imageSrc: string;
  mediaType?: 'image' | 'video';
}

export default function FluffyAdventCalendar() {
  const [doors, setDoors] = useState<Door[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [scratchProgress, setScratchProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [actualMediaType, setActualMediaType] = useState<'image' | 'video'>('image');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRevealedBanner, setShowRevealedBanner] = useState(true);

  // Auto-hide revealed banner after 1 second
  useEffect(() => {
    if (scratchProgress > 70 && showRevealedBanner) {
      const timer = setTimeout(() => {
        setShowRevealedBanner(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [scratchProgress, showRevealedBanner]);

  useEffect(() => {
    setIsClient(true);
    
    // Check if we have saved open states only
    const savedDoors = localStorage.getItem('adventCalendarDoors');
    const savedOpenStates = savedDoors ? JSON.parse(savedDoors).reduce((acc: {[key: number]: boolean}, door: Door) => {
      acc[door.day] = door.isOpen;
      return acc;
    }, {}) : {};
    
    // Always shuffle layout, but keep prompts tied to day numbers
    const allPrompts = [...earlyTasks, ...lateTasks];
    
    // Create a shuffled array of day numbers (1-24) for random positioning
    const shuffledDays = Array.from({length: 24}, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    
    const newDoors: Door[] = [];
  
    // Process days in the shuffled order
    shuffledDays.forEach((day, index) => {
      let prompt = "";
      
      if (day === 24) {
        prompt = "Merry Christmas, Zampettina. 🎄\n\nYou've shown me Sri Lanka through your eyes, your stories, and your love. Now it's my turn to gift you something special — not a message, not a memory, but a moment.";
      } else {
        // Assign prompts based on day number (day 1 = prompt 0, day 2 = prompt 1, etc.)
        prompt = allPrompts[day - 1];
      }
      
      // Assign varied sizes
      // Mobile: mostly uniform to avoid gaps
      // Desktop: more variety
      let gridClass;
      if (day === 24) {
        gridClass = 'col-span-2 row-span-2'; // Large Christmas door
      } else {
        // Different patterns for mobile vs desktop
        const position = index % 8;
        // Mobile (4 cols): simpler pattern, Desktop (6 cols): more variety
        if (position === 0) {
          gridClass = 'col-span-2 row-span-1'; // Wide
        } else if (position === 7) {
          gridClass = 'col-span-1 row-span-2'; // Tall
        } else {
          gridClass = 'col-span-1 row-span-1'; // Small square (most common)
        }
      }
      
      newDoors.push({
        day,
        isOpen: savedOpenStates[day] || false, // Restore open state if it exists
        prompt,
        gridClass,
        randomOrder: index
      });
    });
    
    setDoors(newDoors);
    localStorage.setItem('adventCalendarDoors', JSON.stringify(newDoors));
  }, []);

  const toggleDoor = (dayNumber: number) => {
    const door = doors.find(d => d.day === dayNumber);
    if (!door) return;

    // TESTING MODE: All doors unlocked for testing deployment
    const isDoorUnlocked = true;
    
    /* PRODUCTION MODE: Uncomment before December 1st
    const today = new Date();
    const currentMonth = today.getMonth(); // 0 = January, 11 = December
    const currentDay = today.getDate();
    const currentYear = today.getFullYear();
    
    // Only allow opening if:
    // 1. It's December (month 11) AND the day has arrived
    // 2. OR it's past December of the current year (all doors unlocked)
    const isDecember = currentMonth === 11;
    const isPastDecember = currentMonth > 11 || (currentMonth === 11 && currentDay > 24);
    const isNextYear = today.getFullYear() > currentYear;
    
    const isDoorUnlocked = (isDecember && currentDay >= dayNumber) || isPastDecember || isNextYear;
    */
    
    if (!isDoorUnlocked && !door.isOpen) {
      // Show a locked message
      alert(`🔒 This door will unlock on December ${dayNumber}!`);
      return;
    }

    if (!door.isOpen) {
      setModalData({
        day: dayNumber,
        prompt: door.prompt,
        imageSrc: `/scratch-media/day-${dayNumber}`, // Will check for video/image
        mediaType: 'video'
      });
    }

    const updatedDoors = doors.map(door => 
      door.day === dayNumber ? { ...door, isOpen: !door.isOpen } : door
    );
    setDoors(updatedDoors);
    localStorage.setItem('adventCalendarDoors', JSON.stringify(updatedDoors));
  };

  const closeModal = () => {
    setModalData(null);
    setScratchProgress(0);
    setActualMediaType('image');
    setIsFullscreen(false);
    setShowRevealedBanner(true); // Reset banner for next modal
    // Re-enable body scroll
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    if (modalData) {
      // Prevent body scroll when modal is open on desktop, allow on mobile
      if (typeof window !== 'undefined' && window.innerWidth > 640) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalData]);

  useEffect(() => {
    if (modalData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Draw scratch-off layer
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add festive pattern
      ctx.fillStyle = '#c5a028';
      for (let i = 0; i < canvas.width; i += 20) {
        for (let j = 0; j < canvas.height; j += 20) {
          if ((i + j) % 40 === 0) {
            ctx.fillRect(i, j, 10, 10);
          }
        }
      }

      // Add text
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Scratch to reveal!', canvas.width / 2, canvas.height / 2);
      ctx.font = '16px sans-serif';
      ctx.fillText('✨ Use your finger or mouse ✨', canvas.width / 2, canvas.height / 2 + 30);
    }
  }, [modalData]);

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isScratching) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    // Scale for device pixel ratio
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    x *= scaleX;
    y *= scaleY;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratch progress
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }
    
    const progress = (transparent / (pixels.length / 4)) * 100;
    setScratchProgress(progress);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading your advent calendar...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-yellow-400 mb-8 drop-shadow-2xl">
          🎄 Fluffy Advent Calendar 🎄
        </h1>
        
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3 max-w-5xl mx-auto bg-red-800/30 p-3 sm:p-6 rounded-xl border-2 border-yellow-500/50" style={{ gridAutoRows: '100px' }}>
          {doors.map((door) => {
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentDay = today.getDate();
            const isDecember = currentMonth === 11;
            const isPastDecember = currentMonth > 11;
            const isDoorUnlocked = (isDecember && currentDay >= door.day) || isPastDecember || door.isOpen;
            
            return (
            <div
              key={door.day}
              className={`${door.gridClass} bg-gradient-to-br from-red-600 to-red-700 rounded-lg border-2 sm:border-3 border-yellow-400 shadow-xl transition-all duration-500 ${
                isDoorUnlocked ? 'cursor-pointer hover:shadow-2xl hover:from-red-500 hover:to-red-600' : 'cursor-not-allowed'
              } ${
                door.isOpen ? 'ring-4 ring-green-400' : ''
              }`}
              style={{ 
                zIndex: door.isOpen ? 10 : 1,
              }}
              onClick={() => toggleDoor(door.day)}
            >
              <div className="h-full flex flex-col items-center justify-center p-0.5 sm:p-1.5 relative overflow-hidden">
                {door.isOpen && (
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-green-600 to-green-700"></div>
                )}
                
                {!isDoorUnlocked && !door.isOpen && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="text-2xl sm:text-4xl">🔒</div>
                  </div>
                )}
                
                <div className="relative z-10 text-center w-full h-full flex flex-col items-center justify-center" style={{ gap: '1px' }}>
                  <div className={`transition-all duration-1000 leading-none ${
                    door.isOpen 
                      ? 'text-lg sm:text-3xl md:text-4xl' 
                      : 'text-base sm:text-2xl md:text-3xl'
                  }`}>
                    {door.isOpen ? '🎁' : '🎄'}
                  </div>
                  
                  <div className={`text-sm sm:text-lg md:text-xl font-bold transition-all duration-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-none ${
                    door.isOpen ? 'text-white' : 'text-yellow-400'
                  }`}>
                    {door.day}
                  </div>
                  
                  {door.isOpen && (
                    <div className="text-[8px] sm:text-xs text-white/90 leading-none mt-[1px]">
                      ✓
                    </div>
                  )}
                </div>
              </div>
            </div>
            );
          })}
        </div>
        
        <div className="text-center mt-8 text-yellow-400">
          <p className="text-lg">Click on each door to reveal your daily prompt! 🎄</p>
        </div>
      </div>

      {modalData && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 overflow-y-auto"
          onClick={closeModal}
        >
          <div className="min-h-full flex items-center justify-center p-2 sm:p-4">
            <div 
              className="bg-white rounded-xl max-w-2xl w-full shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 flex gap-2">
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors text-lg font-bold"
                    title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
                  >
                    {isFullscreen ? '−' : '⛶'}
                  </button>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                
                <div className={`relative bg-gradient-to-br from-green-500 to-green-600 transition-all duration-300 rounded-t-xl overflow-auto ${
                  isFullscreen ? 'max-h-[80vh]' : 'h-48 sm:h-64 md:h-80'
                }`}>
                <video
                  src={`${modalData.imageSrc}.mp4`}
                  className={`w-full ${isFullscreen ? 'h-auto object-contain' : 'h-full object-cover'}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onLoadedData={() => setActualMediaType('video')}
                  onError={(e) => {
                    // Fallback to JPG
                    const videoEl = e.target as HTMLVideoElement;
                    const parent = videoEl.parentElement;
                    if (parent) {
                      const img = document.createElement('img');
                      img.src = `${modalData.imageSrc}.jpg`;
                      img.className = `w-full ${isFullscreen ? 'h-auto object-contain' : 'h-full object-cover'}`;
                      img.onload = () => setActualMediaType('image');
                      img.onerror = () => {
                        // Try PNG
                        const img2 = document.createElement('img');
                        img2.src = `${modalData.imageSrc}.png`;
                        img2.className = `w-full ${isFullscreen ? 'h-auto object-contain' : 'h-full object-cover'}`;
                        img2.onload = () => setActualMediaType('image');
                        img2.onerror = () => {
                          // Try GIF
                          const img3 = document.createElement('img');
                          img3.src = `${modalData.imageSrc}.gif`;
                          img3.className = `w-full ${isFullscreen ? 'h-auto object-contain' : 'h-full object-cover'}`;
                          img3.onload = () => setActualMediaType('image');
                          img3.onerror = () => {
                            // Show emoji fallback
                            if (parent) {
                              parent.style.background = 'linear-gradient(135deg, #059669, #16a34a)';
                              parent.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 6rem;">${
                                ['🎄', '⭐', '🎁', '❄️', '🔔', '🕯️'][modalData.day % 6]
                              }</div>`;
                            }
                          };
                          img2.replaceWith(img3);
                        };
                        img.replaceWith(img2);
                      };
                      videoEl.replaceWith(img);
                    }
                  }}
                />
                
                {/* Scratch-off overlay */}
                <canvas
                  ref={canvasRef}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-500 z-10 ${
                    scratchProgress > 70 ? 'opacity-0 pointer-events-none' : 'cursor-grab active:cursor-grabbing'
                  }`}
                  onMouseDown={() => setIsScratching(true)}
                  onMouseUp={() => setIsScratching(false)}
                  onMouseLeave={() => setIsScratching(false)}
                  onMouseMove={scratch}
                  onTouchStart={(e) => {
                    setIsScratching(true);
                  }}
                  onTouchEnd={() => setIsScratching(false)}
                  onTouchMove={(e) => {
                    scratch(e);
                  }}
                />
              </div>
              
              {scratchProgress > 70 && showRevealedBanner && (
                <div className="bg-green-50 border-t-4 border-green-500 p-3 text-center transition-opacity duration-500">
                  <div className="text-green-600 font-semibold text-sm sm:text-base">
                    🎉 Revealed! 🎉
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 sm:p-6 md:p-8">
              <div className="mb-4 sm:mb-6">
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-red-700 mb-2">
                  Day {modalData.day}
                </div>
              </div>
              
              <div className="prose prose-sm sm:prose-base max-w-none">
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {modalData.prompt.split('\n').map((line, index) => {
                    // First line is the header - make it bold
                    if (index === 0) {
                      return <strong key={index} className="block mb-2">{line}</strong>;
                    }
                    return <span key={index}>{line}{index < modalData.prompt.split('\n').length - 1 && <br />}</span>;
                  })}
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
