import { P5Instance } from "react-p5-wrapper";

import { MOVEMENT_MODIFIER } from "../../../constants/enums";
import { CanvasSettings, Row } from "../../../constants/types";
import { assembleRows } from "../drawingUtils/drawShapes";

let count = 0;

let angles: number[] = [];
let angleV: number[] = [];

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
  movementModifierState: MOVEMENT_MODIFIER,
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
    /*
     *EXAMPLE CASE: IF YOU WANT TO ACCESS THE CIRCLES OR RECTANGLES AT THIS POINT IN THE CODE
     */

    case MOVEMENT_MODIFIER.SINE_CIRCLES: {
      count += 0.02; //get things moving

      let circleX = 20 * p5.sin(count); //access the circles in the rows how you want

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

    default: {
      return rows;
    }
  }
}
