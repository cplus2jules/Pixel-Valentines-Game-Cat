export const GAME_CONSTANTS = {
  GRAVITY: 0.8,
  JUMP_FORCE: -14,
  GROUND_Y_OFFSET: 100,
  SCROLL_SPEED_BASE: 6,
  JULES_FOLLOW_DISTANCE: 60,
  JUMP_DELAY: 150,
  WIN_SCORE: 350,
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,
};

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY',
}

export const HEART_PATTERNS = [
  { type: 'single', hearts: [{ y: 0 }] },
  { type: 'double', hearts: [{ y: 0 }, { y: 0, x: 120 }] },
  { type: 'high_low', hearts: [{ y: -60 }, { y: 0 }] },
  { type: 'triple', hearts: [{ y: 0 }, { y: 0, x: 100 }, { y: 0, x: 200 }] },
  { type: 'floating', hearts: [{ y: -50 }] },
  { type: 'stairs_up', hearts: [{ y: 0 }, { y: -45, x: 80 }, { y: -90, x: 160 }] },
  { type: 'stairs_down', hearts: [{ y: -90 }, { y: -45, x: 80 }, { y: 0, x: 160 }] },
  { type: 'wave', hearts: [{ y: 0 }, { y: -50, x: 70 }, { y: 0, x: 140 }, { y: -50, x: 210 }] },
  { type: 'tight_double', hearts: [{ y: 0 }, { y: 0, x: 80 }] }
];

export const GAP_BETWEEN_PATTERNS = [200, 250, 300, 350];

export const JULES_MESSAGES = [
  "im always here for you babi!",
  "you always have me babi!",
  "you're doing amazing babi!",
  "i love u mi <3 babi!",
  "keep going babi!",
  "my heart is yours babiiiii",
  "forever us babi <3",
  "running with u is fun babi!",
  "you're the best!",
  "together forever babi!",
  "yay hearts look at those babs",
  "always proud of u babi!",
  "we got this babi!",
  "look at us go babi!",
  "<3 <3 <3 mi babi",
  "we're the best team ever babi!"
];