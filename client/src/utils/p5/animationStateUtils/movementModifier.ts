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


      let calcRecMinTop = canvasSettings.circleSize*2;
      let calcRecMaxTop = canvasSettings.circleSize*4;

      let calcCircleMinTop = rows[0].rectangles[0].circles[1].y;
      let calcCircleMaxTop = calcCircleMinTop + canvasSettings.circleSize*2;

      rows[0].rectangles.forEach((rectangle, colIndex) => {
        rectangle.h = p5.map(p5.sin(angles[colIndex]), -1, 1, calcRecMinTop, calcRecMaxTop);
        rectangle.circles[1].y = p5.map(p5.sin(angles[colIndex]), -1, 1, calcCircleMinTop, calcCircleMaxTop);
        angles[colIndex] += angleV[colIndex];
      });

      
      let RectMidMinHeight = canvasSettings.circleSize*2;
      let RectMidMaxHeight = canvasSettings.circleSize*3;

      let RectMidMinY = calcRecMinTop + canvasSettings.gap + canvasSettings.padding;
      let RectMidMaxY = calcRecMaxTop + canvasSettings.gap + canvasSettings.padding;

      let Circle1MidMinY = RectMidMinY + canvasSettings.circleSize/2;
      let Circle1MidMaxY = Circle1MidMinY + canvasSettings.circleSize*2;

      let Circle2MidMinY = Circle1MidMinY + canvasSettings.circleSize;
      let Circle2MidMaxY = Circle2MidMinY + canvasSettings.circleSize*3;


      rows[1].rectangles.forEach((rectangle, colIndex) => {

        rectangle.h = p5.map(p5.sin(angles[colIndex]), -1, 1, RectMidMinHeight, RectMidMaxHeight);
        rectangle.y = p5.map(p5.sin(angles[colIndex]), -1, 1, RectMidMinY, RectMidMaxY);

        rectangle.circles[0].y = p5.map(p5.sin(angles[colIndex]), -1, 1, Circle1MidMinY, Circle1MidMaxY);
        rectangle.circles[1].y = p5.map(p5.sin(angles[colIndex]), -1, 1, Circle2MidMinY, Circle2MidMaxY);
        //angles[colIndex] += angleV[colIndex];
      });


      return rows;
      
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
