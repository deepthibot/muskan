
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Cake, Sparkles, Heart, Gift, MessageCircleHeart, RotateCcw, Quote, Info, Moon, Star, Globe, 
  Sun, Smile, Zap, Music, Camera, Book, Coffee, Rocket, Palette, HeartHandshake, Compass, 
  Trophy, Gem, Flower2, PartyPopper, Languages, ChevronRight
} from 'lucide-react';
import { GameStage, FloatingButton } from './types';
import { generateBirthdayWish, generateReasonsToCelebrate } from './services/geminiService';
import Confetti from './components/Confetti';

const ICONS = [
  Heart, Star, Sun, Smile, Zap, Music, Camera, Book, Coffee, Rocket, Palette, 
  HeartHandshake, Compass, Trophy, Gem, Flower2, PartyPopper, Sparkles, Gift
];

const MAX_CLICKS_PER_PAGE = 25;

const App: React.FC = () => {
  const [stage, setStage] = useState<GameStage>(GameStage.WELCOME);
  const [floatingButtons, setFloatingButtons] = useState<FloatingButton[]>([]);
  const [aiWish, setAiWish] = useState<string>('');
  const [reasons, setReasons] = useState<string[]>([]);
  const [isLoadingWish, setIsLoadingWish] = useState(false);
  const [isLoadingReasons, setIsLoadingReasons] = useState(false);
  const [wishType, setWishType] = useState<'heartfelt' | 'funny' | 'roast'>('heartfelt');
  const [stageClickCount, setStageClickCount] = useState(0);

  const name = "Muskaan";
  const age = 24;

  const generateButtons = useCallback(() => {
    const buttons: FloatingButton[] = [];
    // The prank is now only on the first page
    for (let i = 0; i < 15; i++) {
      buttons.push({
        id: `btn-${i}-${Math.random()}`,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        isFake: Math.random() > 0.1, // 10% chance to be the real one
        scale: Math.random() * 0.4 + 0.8,
        rotation: Math.random() * 40 - 20
      });
    }
    setFloatingButtons(buttons);
  }, []);

  useEffect(() => {
    setStageClickCount(0);
    
    // Prank buttons ONLY on the first page (WELCOME)
    if (stage === GameStage.WELCOME) {
      generateButtons();
    } else {
      setFloatingButtons([]);
    }

    if (stage === GameStage.REASONS && reasons.length === 0) {
      const fetchReasons = async () => {
        setIsLoadingReasons(true);
        const res = await generateReasonsToCelebrate(name, age);
        setReasons(res);
        setIsLoadingReasons(false);
      };
      fetchReasons();
    }
  }, [stage, generateButtons, reasons.length]);

  // Safety net: Automatically progress after 25 clicks
  useEffect(() => {
    if (stageClickCount >= MAX_CLICKS_PER_PAGE) {
      if (stage !== GameStage.CELEBRATION && stage !== GameStage.AI_WISH && stage !== GameStage.IMPACT) {
        setStage(prev => prev + 1);
      }
    }
  }, [stageClickCount, stage]);

  const handlePrankButtonClick = (id: string) => {
    setStageClickCount(prev => prev + 1);
    const clickedButton = floatingButtons.find(b => b.id === id);
    if (!clickedButton?.isFake) {
      setStage(GameStage.ROAST);
    } else {
      setFloatingButtons(prev => prev.map(btn => ({
        ...btn,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        rotation: Math.random() * 360
      })));
    }
  };

  const handleGenerateWish = async (type: 'heartfelt' | 'funny' | 'roast') => {
    setStageClickCount(prev => prev + 1);
    setIsLoadingWish(true);
    setWishType(type);
    const wish = await generateBirthdayWish(name, age, type);
    setAiWish(wish);
    setIsLoadingWish(false);
    setStage(GameStage.AI_WISH);
  };

  const reset = () => {
    setStage(GameStage.WELCOME);
    setAiWish('');
    setReasons([]);
    setStageClickCount(0);
  };

  const incrementClicks = () => setStageClickCount(prev => prev + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-fuchsia-100 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden" onClick={incrementClicks}>
      <div className="absolute top-10 left-10 text-pink-300 opacity-20 animate-float">
        <Cake size={120} />
      </div>
      <div className="absolute bottom-20 right-10 text-purple-300 opacity-20 animate-float" style={{ animationDelay: '2s' }}>
        <Heart size={150} />
      </div>

      {/* Prank Buttons - ONLY rendered on the first page */}
      {stage === GameStage.WELCOME && floatingButtons.map(btn => (
        <button
          key={btn.id}
          onClick={(e) => {
            e.stopPropagation();
            handlePrankButtonClick(btn.id);
          }}
          className="fixed bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-50 whitespace-nowrap"
          style={{
            left: `${btn.x}%`,
            top: `${btn.y}%`,
            transform: `translate(-50%, -50%) rotate(${btn.rotation}deg) scale(${btn.scale})`,
          }}
        >
          {btn.isFake ? "Click Me!" : "Start Surprises"}
        </button>
      ))}

      <div className="w-full max-w-4xl z-40 my-8" onClick={(e) => e.stopPropagation()}>
        {stage === GameStage.WELCOME && (
          <div className="glass-card rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl animate-in fade-in zoom-in duration-500 max-w-2xl mx-auto border-2 border-white/50">
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Cake className="w-12 h-12 text-pink-500 animate-bounce" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
              Hello <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 font-cursive text-5xl md:text-6xl">{name}</span>!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              I heard it's a very special day. Can you catch the <span className="font-bold text-pink-600">Start Surprises</span> button to begin?
            </p>
            <div className="p-3 bg-white/40 rounded-xl text-gray-500 text-sm italic">
              Clicks used: {stageClickCount} / {MAX_CLICKS_PER_PAGE}
            </div>
          </div>
        )}

        {stage === GameStage.ROAST && (
          <div className="glass-card rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl animate-in slide-in-from-bottom duration-500 max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <Quote className="w-16 h-16 text-purple-400 rotate-180" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-6 leading-relaxed">
              Did you know Muskaan that a gorilla's penis is the smallest in the animal kingdom in comparison to its body size?
            </h3>
            <div className="bg-purple-100 p-6 rounded-2xl mb-8 transform -rotate-1 border-2 border-purple-200">
               <p className="text-3xl font-bold text-purple-700 leading-relaxed font-cursive">
                Turns out you're smaller than a gorilla's penis... get it? Cause you're barely 3 feet tall!
              </p>
            </div>
            <button
              onClick={() => {
                incrementClicks();
                setStage(GameStage.FACT);
              }}
              className="group relative inline-flex items-center justify-center px-10 py-3 font-bold text-white transition-all duration-200 bg-gray-800 rounded-full hover:bg-black"
            >
              Okay, next fact!
              <ChevronRight className="ml-1 w-5 h-5" />
            </button>
          </div>
        )}

        {stage === GameStage.FACT && (
          <div className="glass-card rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl animate-in zoom-in duration-500 relative overflow-hidden max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Moon className="w-12 h-12 text-indigo-500" />
            </div>
            <p className="text-2xl text-gray-700 mb-8 leading-relaxed font-medium">
              You can fit all the other planets in our solar system in the space between the Earth and the Moon with room to spare.
            </p>
            <div className="py-6 border-t border-indigo-100">
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500 font-cursive leading-tight">
                My heart still has more space for you.
              </p>
            </div>
            <button
              onClick={() => {
                incrementClicks();
                setStage(GameStage.REASONS);
              }}
              className="mt-8 bg-indigo-600 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-all hover:scale-105"
            >
              Show me more
            </button>
          </div>
        )}

        {stage === GameStage.REASONS && (
          <div className="glass-card rounded-[2.5rem] p-8 md:p-10 text-center shadow-2xl animate-in zoom-in duration-500 w-full max-h-[85vh] overflow-hidden flex flex-col">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex-shrink-0">
              24 Reasons to Celebrate You
            </h2>
            <div className="flex-grow overflow-y-auto px-2 py-4 custom-scrollbar">
              {isLoadingReasons ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                  {Array(24).fill(0).map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-2xl"></div>)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {reasons.map((reason, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/40 border border-white/50 shadow-sm flex flex-col items-center justify-center text-center">
                      <div className="text-xs font-bold text-gray-400 mb-1">#{i + 1}</div>
                      <p className="text-sm font-semibold text-gray-700 leading-tight">{reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="pt-6 mt-4 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => {
                  incrementClicks();
                  setStage(GameStage.SHAYARI);
                }}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-10 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105"
              >
                Almost done...
              </button>
            </div>
          </div>
        )}

        {stage === GameStage.SHAYARI && (
          <div className="glass-card rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl animate-in zoom-in duration-500 max-w-2xl mx-auto border-4 border-orange-100 relative">
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-orange-400 rounded-tl-[2rem] opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-orange-400 rounded-br-[2rem] opacity-30"></div>
            
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Languages className="w-10 h-10 text-orange-600" />
            </div>

            <div className="space-y-6">
              <p className="text-2xl md:text-3xl font-bold text-gray-800 font-serif italic leading-relaxed">
                "तोहार 'मुस्कान' रहे सदा अइसहीं,<br/>
                खुशियन से भरल रहे जहान तोहार।"
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 font-serif italic leading-relaxed">
                "जनमदिन के ढेर सारी बधाई,<br/>
                खुश रहऽ तू हरदम अइसहीं!"
              </p>
            </div>

            <div className="mt-12 flex flex-col items-center">
              <button
                onClick={() => {
                  incrementClicks();
                  setStage(GameStage.CELEBRATION);
                }}
                className="bg-orange-600 text-white px-12 py-4 rounded-full font-bold shadow-xl hover:bg-orange-700 transition-all hover:scale-105"
              >
                Let's Party!
                <PartyPopper className="ml-2 inline-block" />
              </button>
            </div>
          </div>
        )}

        {stage === GameStage.CELEBRATION && (
          <div className="glass-card rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl animate-in zoom-in duration-700 max-w-2xl mx-auto border-4 border-pink-200">
            <Confetti />
            <div className="flex justify-center mb-6">
              <Heart className="w-20 h-20 text-red-500 animate-pulse fill-red-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Happy Birthday, <span className="font-cursive text-pink-600">Muskaan!</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              May your 24th year be as vibrant and joyful as your name suggests.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <button onClick={() => handleGenerateWish('heartfelt')} className="flex flex-col items-center p-4 bg-pink-50 rounded-2xl hover:bg-pink-100 border border-pink-100 transition-all hover:scale-105">
                <MessageCircleHeart className="text-pink-500 mb-2" />
                <span className="font-semibold text-pink-700 text-sm">Heartfelt</span>
              </button>
              <button onClick={() => handleGenerateWish('funny')} className="flex flex-col items-center p-4 bg-purple-50 rounded-2xl hover:bg-purple-100 border border-purple-100 transition-all hover:scale-105">
                <Gift className="text-purple-500 mb-2" />
                <span className="font-semibold text-purple-700 text-sm">Funny Wish</span>
              </button>
              <button onClick={() => handleGenerateWish('roast')} className="flex flex-col items-center p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 border border-orange-100 transition-all hover:scale-105">
                <RotateCcw className="text-orange-500 mb-2" />
                <span className="font-semibold text-orange-700 text-sm">Last Roast</span>
              </button>
            </div>
            
            <button
              onClick={() => {
                incrementClicks();
                setStage(GameStage.IMPACT);
              }}
              className="w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all mb-4"
            >
              {/* Replaced non-existent UserHeart with HeartHandshake */}
              <HeartHandshake size={20} />
              Wait, one more thing...
            </button>
          </div>
        )}

        {stage === GameStage.IMPACT && (
          <div className="glass-card rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl animate-in zoom-in duration-1000 max-w-3xl mx-auto border-2 border-rose-300 relative">
            <div className="absolute -top-6 -left-6 text-rose-300 opacity-40">
              <Heart size={64} fill="currentColor" />
            </div>
            <div className="absolute -bottom-6 -right-6 text-rose-300 opacity-40">
              <Heart size={64} fill="currentColor" />
            </div>

            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              {/* Replaced non-existent UserHeart with HeartHandshake */}
              <HeartHandshake className="w-10 h-10 text-rose-600" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 font-serif leading-tight">
              To the girl who defines her name...
            </h2>

            <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed font-medium italic">
              <p>
                "Muskaan, beyond all the jokes and the roasts, I wanted to tell you something real. Knowing you has been one of the most wonderful things to happen to me."
              </p>
              <p>
                "Your kindness, your spirit, and that namesake 'Muskaan' (smile) of yours have a way of lighting up even the darkest days. You've taught me so much about resilience and joy just by being exactly who you are."
              </p>
              <p className="text-rose-600 font-bold text-2xl md:text-3xl not-italic mt-8">
                "Thank you for the impact you've had on my life—it's bigger than any galaxy we could talk about."
              </p>
            </div>

            <div className="mt-12">
              <p className="text-gray-400 text-sm mb-6 uppercase tracking-[0.2em]">Happy 24th Birthday</p>
              <button
                onClick={reset}
                className="bg-gray-100 text-gray-500 px-8 py-3 rounded-full text-sm font-bold hover:bg-gray-200 transition-all"
              >
                Back to Start
              </button>
            </div>
          </div>
        )}

        {stage === GameStage.AI_WISH && (
          <div className="glass-card rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl animate-in fade-in max-h-[80vh] overflow-y-auto max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => setStage(GameStage.CELEBRATION)} className="p-2 hover:bg-gray-100 rounded-full">
                <RotateCcw size={20} className="text-gray-500" />
              </button>
              <h3 className="text-xl font-bold text-gray-800 capitalize">{wishType} Message</h3>
              <div className="w-8"></div>
            </div>
            <div className="bg-white/50 p-6 md:p-10 rounded-3xl border border-white/50 text-left relative">
              <Quote className="absolute top-4 left-4 text-pink-200 w-12 h-12 -z-10" />
              {isLoadingWish ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-medium italic">{aiWish}</p>
              )}
            </div>
            {!isLoadingWish && (
              <div className="mt-10 flex gap-4 justify-center">
                <button onClick={() => handleGenerateWish(wishType)} className="bg-white border-2 border-pink-500 text-pink-500 px-8 py-3 rounded-full font-bold">Regenerate</button>
                <button onClick={() => setStage(GameStage.CELEBRATION)} className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold">Back</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
