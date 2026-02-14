export interface CatObject {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity_y: number;
  isJumping: boolean;
  color: string;
  name: string;
  patches?: boolean; // For Jules
  message?: string;
  messageTimer?: number;
}

export interface HeartObject {
  x: number;
  y: number; // Offset from ground
  width: number;
  height: number;
  collected: boolean;
  color: string;
  baseY: number; // Original Y for bobbing
  bobOffset: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export interface CloudObject {
  x: number;
  y: number;
  width: number;
  speed: number;
}

export interface SceneryObject {
  type: 'tree' | 'castle' | 'vine_tree' | 'village_house';
  x: number;
  y: number; // Base Y position
  width: number;
  height: number;
  color: string;
  details?: any; // For orchids etc
}

export interface ButterflyObject {
  x: number;
  y: number;
  baseY: number;
  speed: number;
  color: string;
  offset: number;
}

export interface BirdObject {
  x: number;
  y: number;
  speed: number;
  color: string;
  wingOffset: number;
}