import React from 'react';
import { GameCanvas } from './components/GameCanvas';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-8 px-4 font-pixel">
      <header className="mb-8 text-center">
        <h1 className="text-2xl md:text-4xl text-val-pink mb-4 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] uppercase leading-relaxed">
          BART AND JULES<br />THE KITTON RUNNER
        </h1>
        <p className="text-white text-xs md:text-sm opacity-80 text-val-light">
          A Valentine's Adventure
        </p>
      </header>

      <main className="w-full max-w-[800px]">
        <GameCanvas
          onGameOver={(score) => console.log('Game Over', score)}
          onVictory={(score) => console.log('Victory', score)}
        />
      </main>

      <footer className="mt-8 text-gray-500 text-[10px] text-center max-w-lg leading-relaxed space-y-2">
        <p className="drop-shadow-sm font-pixel opacity-80">
          You can use the Spacebar or Tap to jump.<br /> Reach 350 points for a surprise!
        </p>
        <div className="pt-4 border-t border-gray-800/50">
          <p className="mb-1 font-pixel opacity-70">made with <span className="text-val-pink animate-pulse drop-shadow-[0_0_5px_rgba(255,20,147,0.8)]">&lt;3</span> by your jules. Play this whenever you miss me and needed a little cheering!</p>
        </div>
      </footer>
    </div>
  );
}