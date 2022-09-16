import { P5Instance } from "react-p5-wrapper";

import { canvasSettings } from "../../../constants/canvasSettings";
import { SHAPE_MODIFIER } from "../../../constants/enums";
import { Row } from "../../../constants/types";

let count = 0;
let zOffCircles: number[] = [];

for (let i = 0; i < canvasSettings.columnCount * canvasSettings.rowCount; i++) {
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
  p5: P5Instance,
  shapeModifierState: SHAPE_MODIFIER | undefined,
  rows: Row[]
): Row[] {
  switch (shapeModifierState) {
    case SHAPE_MODIFIER.PERLIN_NOISE: {
      count += 0.01;
      let i = 0;

      rows[0].rectangles.forEach((rectangle, rectIndex) => {
        rectangle.circles![0].zOff = zOffCircles[i] + count;
        rectangle.circles![1].zOff = zOffCircles[i] + count;
        i++;
      });
      rows[1].rectangles.forEach((rectangle, rectIndex) => {
        rectangle.circles![0].zOff = zOffCircles[i] + count;
        rectangle.circles![1].zOff = zOffCircles[i] + count;
        i++;
      });
      rows[2].rectangles.forEach((rectangle, rectIndex) => {
        rectangle.circles![0].zOff = zOffCircles[i] + count;
        rectangle.circles![1].zOff = zOffCircles[i] + count;
        i++;
      });

      return rows;
    }
    case SHAPE_MODIFIER.DYNAMIC_SIZE_CENTER: {
      const maxCircleSize = canvasSettings.circleSize - 4;
      const minCircleSize = 10;

      const getNewCircleSize = (x: number, y: number) => {
        const distance = p5.dist(p5.width / 2, p5.height / 2, x, y);
        const maxDistance = p5.dist(
          maxCircleSize - 8,
          maxCircleSize - 8,
          p5.width / 2,
          p5.height / 2
        );
        return p5.map(
          distance,
          // switch 0 and maxDistance to invert the size effect
          0,
          maxDistance,
          minCircleSize,
          maxCircleSize
        );
      };

      rows.forEach((row) => {
        row.rectangles.forEach((rectangle) => {
          rectangle.circles!.forEach((circle) => {
            circle.r = getNewCircleSize(circle.x, circle.y);
          });
        });
      });

      return rows;
    }
    case SHAPE_MODIFIER.DYNAMIC_SIZE_VERTICAL: {
      const maxCircleSize = canvasSettings.circleSize - 4;
      const minCircleSize = 10;

      const getNewCircleSize = (y: number) => {
        const distance = p5.dist(0, p5.height / 2, 0, y);
        const maxDistance = p5.dist(0, maxCircleSize - 8, 0, p5.height / 2);
        return p5.map(
          distance,
          // switch 0 and maxDistance to invert the size effect
          0,
          maxDistance,
          minCircleSize,
          maxCircleSize
        );
      };

      rows.forEach((row) => {
        row.rectangles.forEach((rectangle) => {
          rectangle.circles!.forEach((circle) => {
            circle.r = getNewCircleSize(circle.y);
          });
        });
      });

      return rows;
    }
    case SHAPE_MODIFIER.DYNAMIC_SIZE_HORIZONTAL: {
      const maxCircleSize = canvasSettings.circleSize - 4;
      const minCircleSize = 10;

      const getNewCircleSize = (x: number) => {
        const distance = p5.dist(p5.width / 2, 0, x, 0);
        const maxDistance = p5.dist(maxCircleSize - 8, 0, p5.width / 2, 0);
        return p5.map(
          distance,
          // switch 0 and maxDistance to invert the size effect
          0,
          maxDistance,
          minCircleSize,
          maxCircleSize
        );
      };

      rows.forEach((row) => {
        row.rectangles.forEach((rectangle) => {
          rectangle.circles!.forEach((circle) => {
            circle.r = getNewCircleSize(circle.x);
          });
        });
      });

      return rows;
    }
    default: {
      return rows;
    }
  }
}
