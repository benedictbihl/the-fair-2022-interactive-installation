import P5Types from "p5";

export type Bar = {
  x: number;
  y: number;
  w: number;
  h: number;
  radiusTop: number;
  radiusBot: number;
};

export type Beat = {
  x: number;
  y: number;
  r: number;
};

export type Rgb = {
  r: number;
  g: number;
  b: number;
};

export enum COLORS {
  ORANGE_FUZZ = "#f15623",
  REVERB_BLUE = "#704cfe",
  PURPLE_NOISE = "#460073",
  VANILLA_PHASER = "#ece3d0",
  BLACK = "#000000",
  GOLD_TUNE = "#cd9e3c",
}

export const drawBar = (p: P5Types, bar: Bar) => {
  p.noStroke();
  p.fill(112, 76, 254);
  p.rect(
    bar.x,
    bar.y,
    bar.w,
    bar.h,
    bar.radiusTop,
    bar.radiusTop,
    bar.radiusBot,
    bar.radiusBot
  );
};

export const drawBeat = (p: P5Types, beat: Beat, color: COLORS) => {
  p.fill(color);
  p.noStroke();
  p.ellipse(beat.x, beat.y, beat.r);
};
