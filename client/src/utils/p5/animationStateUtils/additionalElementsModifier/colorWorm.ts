import { P5Instance } from "react-p5-wrapper";
import ShadeGenerator, { Shade } from "shade-generator";

import {
  ADDITIONAL_ELEMENTS_MODIFIER,
  COLORS,
} from "../../../../constants/enums";
import { CanvasSettings } from "../../../../constants/types";

let currentModifier: ADDITIONAL_ELEMENTS_MODIFIER | undefined;
let colorMap = ShadeGenerator.hue(
  COLORS[
    Object.keys(COLORS)[
      Math.floor(Math.random() * Object.keys(COLORS).length)
    ] as keyof typeof COLORS
  ]
).shadesMap("hex");
let direction = "right";
let xCor: number[] = [];
let yCor: number[] = [];
let xStart: number; //starting x coordinate for worm
let yStart: number; //starting y coordinate for worm
let diff: number;

export function drawColorWorm(
  p5: P5Instance,
  canvasSettings: CanvasSettings,
  additionalElementsModifierState: ADDITIONAL_ELEMENTS_MODIFIER | undefined
) {
  if (additionalElementsModifierState !== currentModifier) {
    currentModifier = additionalElementsModifierState;
    colorMap = ShadeGenerator.hue(
      COLORS[
        Object.keys(COLORS)[
          Math.floor(Math.random() * Object.keys(COLORS).length)
        ] as keyof typeof COLORS
      ]
    ).shadesMap("hex");

    xStart = 0; //starting x coordinate for worm
    yStart = p5.width / 2; //starting y coordinate for worm
    diff = canvasSettings.circleSize / 2;
    for (let i = 0; i < Object.keys(colorMap).length; i++) {
      xCor.push(xStart + i * diff);
      yCor.push(yStart);
    }
  }

  let count = 0;
  for (const key of Object.keys(colorMap)) {
    count++;
    // were only interested in the first half of the shades up until the original color
    if (count < Object.keys(colorMap).length / 2) {
      p5.noStroke();
      p5.fill(colorMap[key as Shade]);
      p5.ellipse(xCor[count], yCor[count], canvasSettings.circleSize);
    }
  }

  p5.frameCount % 8 === 0 && updateWormCoordinates(p5); // update the worm coordinates every 8 frames
  //if Math.random() > 0.95, change direction between left and right and up and down
  if (Math.random() > 0.95) {
    if (direction === "right") {
      direction =
        Math.floor(Math.random() * 3) === 0
          ? "left"
          : Math.floor(Math.random() * 3) === 1
          ? "up"
          : "down";
    } else if (direction === "up") {
      direction =
        Math.floor(Math.random() * 3) === 0
          ? "left"
          : Math.floor(Math.random() * 3) === 1
          ? "right"
          : "down";
    } else if (direction === "left") {
      direction =
        Math.floor(Math.random() * 3) === 0
          ? "right"
          : Math.floor(Math.random() * 3) === 1
          ? "up"
          : "down";
    } else if (direction === "down") {
      direction =
        Math.floor(Math.random() * 3) === 0
          ? "left"
          : Math.floor(Math.random() * 3) === 1
          ? "up"
          : "right";
    }
  }
}

function updateWormCoordinates(p5: P5Instance) {
  const circlesAmount = Object.keys(colorMap).length;
  for (let i = 0; i < circlesAmount - 1; i++) {
    xCor[i] = xCor[i + 1];
    yCor[i] = yCor[i + 1];
  }

  if (xCor[xCor.length - 1] > p5.width) {
    // randomly select a direction to move in except the one currently in use
    direction =
      Math.floor(Math.random() * 3) === 0
        ? "left"
        : Math.floor(Math.random() * 3) === 1
        ? "up"
        : "down";
  }
  if (xCor[xCor.length - 1] < 0) {
    direction =
      Math.floor(Math.random() * 3) === 0
        ? "right"
        : Math.floor(Math.random() * 3) === 1
        ? "up"
        : "down";
  }
  if (yCor[yCor.length - 1] > p5.height) {
    direction =
      Math.floor(Math.random() * 3) === 0
        ? "right"
        : Math.floor(Math.random() * 3) === 1
        ? "up"
        : "left";
  }
  if (yCor[yCor.length - 1] < 0) {
    Math.floor(Math.random() * 3) === 0
      ? "right"
      : Math.floor(Math.random() * 3) === 1
      ? "left"
      : "down";
  }

  switch (direction) {
    case "right":
      xCor[circlesAmount - 1] = xCor[circlesAmount - 2] + diff;
      yCor[circlesAmount - 1] = yCor[circlesAmount - 2];
      break;
    case "up":
      xCor[circlesAmount - 1] = xCor[circlesAmount - 2];
      yCor[circlesAmount - 1] = yCor[circlesAmount - 2] - diff;
      break;
    case "left":
      xCor[circlesAmount - 1] = xCor[circlesAmount - 2] - diff;
      yCor[circlesAmount - 1] = yCor[circlesAmount - 2];
      break;
    case "down":
      xCor[circlesAmount - 1] = xCor[circlesAmount - 2];
      yCor[circlesAmount - 1] = yCor[circlesAmount - 2] + diff;
      break;
  }
}
