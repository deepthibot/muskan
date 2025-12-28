
export interface FloatingButton {
  id: string;
  x: number;
  y: number;
  isFake: boolean;
  scale: number;
  rotation: number;
}

export enum GameStage {
  WELCOME = 0,
  ROAST = 1,
  FACT = 2,
  REASONS = 3,
  SHAYARI = 4,
  CELEBRATION = 5,
  IMPACT = 6,
  AI_WISH = 7
}
