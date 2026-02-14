import React from 'react';
import { GameCanvas } from './components/GameCanvas';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-8 px-4 font-pixel">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-2xl md:text-4xl text-val-pink mb-4 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] uppercase leading-relaxed">
          BART AND JULES<br />THE CAT RUNNER
        </h1>
        <p className="text-white text-xs md:text-sm opacity-80 text-val-light">
          A Valentine's Adventure
        </p>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[800px]">
        <GameCanvas
          onGameOver={(score) => console.log('Game Over', score)}
          onVictory={(score) => console.log('Victory', score)}
        />
      </main>

      {/* Footer */}
      <footer className="mt-12 text-gray-400 text-xs text-center max-w-lg leading-loose space-y-4">
        <p className="drop-shadow-sm font-pixel">
          You can use the Spacebar or Tap to jump.<br /> Reach 350 points for a surprise!
        </p>
        <div className="pt-8 border-t border-gray-800">
          <p className="mb-2 font-pixel">made with <span className="text-val-pink animate-pulse drop-shadow-[0_0_5px_rgba(255,20,147,0.8)]">&lt;3</span> by your jules</p>
          <p className="text-val-light opacity-80 font-pixel">play it when u get sad babi</p>
        </div>
      </footer>
    </div>
  );
}