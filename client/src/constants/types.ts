import {
  ADDITIONAL_ELEMENTS_MODIFIER,
  COLOR_MODIFIER,
  COLORS,
  MOVEMENT_MODIFIER,
  SHAPE_MODIFIER,
} from "./enums";

/* TYPINGS FOR SHAPES */

export type Row = {
  ypos: number;
  xpos: number;
  height: number;
  topRadius: number;
  botRadius: number;
};

export type Circle = {
  x: number;
  y: number;
  r: number;
  line: number;
};

export type Rectangle = {
  x: number;
  y: number;
  w: number;
  h: number;
  rTop: number;
  rBot: number;
  line: number;
};

/* TYPINGS FOR P5 SPECIFIC STUFF */

export type Rgb = {
  r: number;
  g: number;
  b: number;
};

export type CanvasSettings = {
  scaleFactor: number;
  columnCount: number;
  gap: number;
  padding: number;
  circleSize: number;
  canvasWidth: number;
  canvasHeight: number;
  circleOffset: number;
};

/* TYPINGS FOR ANIMATION MODIFIER */

export type AnimationModifierState = {
  colorModifier: COLOR_MODIFIER;
  shapeModifier: SHAPE_MODIFIER;
  movementModifier: MOVEMENT_MODIFIER;
  additionalElementsModifier: ADDITIONAL_ELEMENTS_MODIFIER;
};

export type CircleModification = {
  color?: COLORS;
  emoji?: string;
};

export type RectangleModification = {
  color?: COLORS;
};

export type ShapeModification = {
  circle?: CircleModification;
  rectangle?: RectangleModification;
};
