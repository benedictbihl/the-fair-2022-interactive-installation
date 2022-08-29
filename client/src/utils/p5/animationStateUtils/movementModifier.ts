import { P5Instance } from "react-p5-wrapper";

import { MOVEMENT_MODIFIER } from "../../../constants/enums";
import { CanvasSettings, Row } from "../../../constants/types";
import { assembleRows } from "../drawingUtils/drawShapes";

let count = 0;

let angles: number[] = [];
let angleV: number[] = [];

let savedPositions: number[] = [];

for (let i = 0; i < 15; i++) {
  angles.push(0);
  angleV.push(0.01 + i / 700);
}

/**
 * Function to modify the movement of the circles and rectangles on the canvas.
 *
 * @param  {P5Instance} p5 - The p5 instance
 * @param  {CanvasSettings} canvasSettings - The canvas settings containing different base values we base our calculations on
 * @param  {MOVEMENT_MODIFIER} movementModifierState - Slice of the AnimationState that contains the movement modifier state
 * @param  {Row[]} rows - The rows we want to perform the manipulations on
 * @returns Row - The modified rows
 */

export function movementModifier(
  p5: P5Instance,
  canvasSettings: CanvasSettings,
  movementModifierState: MOVEMENT_MODIFIER | undefined,
  rows: Row[]
): Row[] {
  switch (movementModifierState) {
    case MOVEMENT_MODIFIER.DYNAMIC_ROW_HEIGHT: {
      count += 0.02; //get things moving
      let heightTopRow = 2.5 + p5.cos(count) / 2;
      let heightMidRow = 2.5 + p5.sin(count) / 2;
      let heightBotRow = 7.7 - heightMidRow - heightTopRow;
      let yPosMidRow =
        heightTopRow * canvasSettings.circleSize + canvasSettings.gap;
      let yPosBotRow =
        yPosMidRow +
        heightMidRow * canvasSettings.circleSize +
        canvasSettings.gap;

      rows[0].height = heightTopRow;
      rows[1].height = heightMidRow;
      rows[2].height = heightBotRow;
      rows[1].ypos = yPosMidRow;
      rows[2].ypos = yPosBotRow;
      return assembleRows(canvasSettings, rows[0], rows[1], rows[2]);
    }

    case MOVEMENT_MODIFIER.SINE_WAVE: {
      count += 0.02; //get things moving
      let xposTopRow = 3 * p5.sin(count);
      let xposMidrow = 4 * p5.cos(count);
      let xposBotRow = 3 * p5.sin(count);

      rows[0].xpos = xposTopRow;
      rows[1].xpos = xposMidrow;
      rows[2].xpos = xposBotRow;
      return assembleRows(canvasSettings, rows[0], rows[1], rows[2]);
    }

    case MOVEMENT_MODIFIER.SINE_CIRCLES: {
      count += 0.02; //get things moving

      let calcMaxTop = rows[1].rectangles[0].circles[0].y;
      let calcMaxBot = rows[1].rectangles[0].circles[1].y;

      rows[1].rectangles.forEach((rectangle, rectIndex) => {
        let circleYSinTop = p5.map(
          p5.sin(angles[rectIndex]),
          -1,
          1,
          calcMaxTop,
          calcMaxBot
        );
        let circleYSinBot = p5.map(
          p5.sin(angles[rectIndex]),
          1,
          -1,
          calcMaxTop,
          calcMaxBot
        );

        rectangle.circles[0].y = circleYSinTop;
        rectangle.circles[1].y = circleYSinBot;

        angles[rectIndex] += angleV[rectIndex];
      });

      return rows; //return the rows with the modified circles
    }

    case MOVEMENT_MODIFIER.SPECTRUM: {
      const speed = 0.8; // speed 0-1
      const randomPushUp = 0.1; // randomly push bubbles up 0-1
      const traceMin = 5; // min distance of following bubble
      const traceMax = 50; // max distance of following bubble

      let calcMaxTop = rows[1].rectangles[0].circles[0].y;
      let calcMaxBot = rows[1].rectangles[0].circles[1].y;

      rows[1].rectangles.forEach((rectangle, rectIndex) => {
        const r = p5.random(0, 100);
        const randomPositionY = p5.map(r, 0, 100, calcMaxTop, calcMaxBot);

        let currentPosY = savedPositions[rectIndex];
        if (typeof currentPosY === "undefined") currentPosY = calcMaxBot;

        const currentSpeed = currentPosY / p5.map(speed, 0.1, 1, 500, 1);
        let newPositionY = currentPosY + currentSpeed;

        let pushUp = false;
        if (
          p5.random(0.1, 1) <= randomPushUp &&
          currentPosY > randomPositionY
        ) {
          pushUp = true;
        }

        if (currentPosY >= calcMaxBot || pushUp) newPositionY = randomPositionY;

        const trace = p5.map(
          newPositionY,
          calcMaxTop,
          calcMaxBot,
          traceMin,
          traceMax
        );

        rectangle.circles[0].y = newPositionY;
        rectangle.circles[1].y = newPositionY - trace;

        savedPositions[rectIndex] = newPositionY;
      });

      return rows; //return the rows with the modified circles
    }

    default: {
      return rows;
    }
  }
}
