import { P5Instance } from "react-p5-wrapper";

import { SHAPE_MODIFIER } from "../../../constants/enums";
import { CanvasSettings, Row } from "../../../constants/types";
import { assembleRows } from "../drawingUtils/drawShapes";

let count = 0;

/**
 * Function to modify the movement of the circles and rectangles on the canvas.
 *
 * @param  {P5Instance} p5 - The p5 instance
 * @param  {CanvasSettings} canvasSettings - The canvas settings containing different base values we base our calculations on
 * @param  {SHAPE_MODIFIER} shapeModifierState - Slice of the AnimationState that contains the movement modifier state
 * @param  {Row[]} rows - The rows we want to perform the manipulations on
 * @returns Row - The modified rows
 */

export function shapeModifier(
  p5: P5Instance,
  canvasSettings: CanvasSettings,
  shapeModifierState: SHAPE_MODIFIER | undefined,
  rows: Row[]
): Row[] {
  switch (shapeModifierState) {
    case SHAPE_MODIFIER.SINE_GROW_SHRINK: {
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

    default: {
      return rows;
    }
  }
}
