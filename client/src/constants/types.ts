import {
  ADDITIONAL_ELEMENTS_MODIFIER,
  COLOR_MODIFIER,
  COLORS,
  MOVEMENT_MODIFIER,
  PIXEL_MODIFIER,
  SHAPE_MODIFIER,
} from "./enums";

/* TYPINGS FOR SHAPES */

export type Row = {
  ypos: number;
  xpos: number;
  height: number;
  topRadius: number;
  botRadius: number;
  rectangles: Rectangle[];
};

export type Circle = {
  x: number;
  y: number;
  r: number;
  zOff?: number;
  line: number;
  color?: COLORS;
  emoji?: string;
};

export type Rectangle = {
  x: number;
  y: number;
  w: number;
  h: number;
  rTop: number;
  rBot: number;
  line: number;
  color?: COLORS;
  circles: Circle[];
};

/* TYPINGS FOR P5 SPECIFIC STUFF */

export type CanvasSettings = {
  scaleFactor: number;
  columnCount: number;
  rowCount: number;
  gap: number;
  padding: number;
  circleSize: number;
  canvasWidth: number;
  canvasHeight: number;
  circleOffset: number;
};

/* TYPINGS FOR ANIMATION MODIFIER */

export type AnimationModifierState = {
  shapeModifier: SHAPE_MODIFIER | undefined;
  colorModifier: COLOR_MODIFIER | undefined;
  pixelModifier: PIXEL_MODIFIER | undefined;
  movementModifier: MOVEMENT_MODIFIER | undefined;
  additionalElementsModifier: ADDITIONAL_ELEMENTS_MODIFIER | undefined;
};
