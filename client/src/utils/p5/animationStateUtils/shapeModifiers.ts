import { SHAPE_MODIFIER } from "../../../constants/enums";
import { Row } from "../../../constants/types";

let count = 0;
let zOffCircles: number[] = [];

for (let i = 0; i < 45; i++) {
  zOffCircles[i] = i;
}
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
  shapeModifierState: SHAPE_MODIFIER | undefined,
  rows: Row[]
): Row[] {
  switch (shapeModifierState) {
    case SHAPE_MODIFIER.PERLIN_NOISE: {
      count += 0.01;
      let i = 0;

      rows[0].rectangles.forEach((rectangle, rectIndex) => {
        rectangle.circles[0].zOff = zOffCircles[i] + count;
        rectangle.circles[1].zOff = zOffCircles[i] + count;
        i++;
      });
      rows[1].rectangles.forEach((rectangle, rectIndex) => {
        rectangle.circles[0].zOff = zOffCircles[i] + count;
        rectangle.circles[1].zOff = zOffCircles[i] + count;
        i++;
      });
      rows[2].rectangles.forEach((rectangle, rectIndex) => {
        rectangle.circles[0].zOff = zOffCircles[i] + count;
        rectangle.circles[1].zOff = zOffCircles[i] + count;
        i++;
      });

      return rows;
    }
    default: {
      return rows;
    }
  }
}
