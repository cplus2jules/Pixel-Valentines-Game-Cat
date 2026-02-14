import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '../lib/gameEngine';
import { GameState } from '../constants';
import { Trophy, RefreshCcw } from 'lucide-react';

interface GameCanvasProps {
  onGameOver: (score: number) => void;
  onVictory: (score: number) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ onGameOver, onVictory }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const requestRef = useRef<number>(0);
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);

  const animate = useCallback(() => {
    if (engineRef.current) {
      // Pass the playing state to update loop
      const isPlaying = gameState === GameState.PLAYING;
      engineRef.current.update(isPlaying);
      engineRef.current.draw();
      setScore(engineRef.current.score);

      if (engineRef.current.victory && gameState !== GameState.VICTORY) {
        setGameState(GameState.VICTORY);
        onVictory(engineRef.current.score);
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [gameState, onVictory]);

  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      // Initialize canvas size
      canvasRef.current.width = 800;
      canvasRef.current.height = 400;
      engineRef.current = new GameEngine(canvasRef.current);
    }

    // Start loop
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  const handleJump = useCallback(() => {
    if (engineRef.current) {
      if (gameState === GameState.START) {
        setGameState(GameState.PLAYING);
      }
      engineRef.current.jump();
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleJump]);

  const handleRestart = () => {
    if (engineRef.current) {
      engineRef.current.reset();
      setGameState(GameState.START);
      setScore(0);
    }
  };

  return (
    <div className="relative w-full max-w-[800px] mx-auto bg-black rounded-lg overflow-hidden shadow-2xl border-4 border-val-pink">
      <canvas
        ref={canvasRef}
        className="w-full h-auto cursor-pointer block"
        onClick={handleJump}
        onTouchStart={handleJump}
      />

      {/* UI Overlay */}
      <div className="absolute top-4 right-4 text-white font-pixel text-xl drop-shadow-md z-10">
        SCORE: {score.toString().padStart(5, '0')}
      </div>

      {gameState === GameState.START && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white animate-pulse z-20">
          <p className="font-pixel text-xl md:text-2xl text-center mb-4 text-val-pink drop-shadow-md">PRESS SPACE TO START</p>
          <p className="font-pixel text-xs text-center drop-shadow-sm">Help Bart & Jules collect hearts!</p>
        </div>
      )}

      {gameState === GameState.VICTORY && (
        // Reduced opacity to bg-black/40 so fireworks are visible
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white z-20 backdrop-blur-[2px]">
          <Trophy className="w-16 h-16 text-val-gold mb-4 animate-bounce drop-shadow-lg" />
          <h2 className="font-pixel text-xl md:text-2xl text-val-pink mb-4 text-center px-4 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">HAPPY VALENTINE'S DAY!</h2>
          <div className="bg-black/50 p-6 rounded-lg mb-6 max-w-md mx-4 border-2 border-val-pink shadow-xl">
            <p className="font-pixel text-xs md:text-sm text-center leading-relaxed text-white">
              Happy valentines day babi! <br /> Lets be kittons forever :3
            </p>
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 bg-val-pink hover:bg-red-600 text-white font-pixel py-3 px-6 rounded border-2 border-white/50 transition-transform hover:scale-105"
          >
            <RefreshCcw size={16} /> REPLAY
          </button>
        </div>
      )}
    </div>
  );
};