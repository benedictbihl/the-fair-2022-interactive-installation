import memoizeOne from "memoize-one";

import { COLOR_MODIFIER, COLORS } from "../../../constants/enums";
import { Row } from "../../../constants/types";

// generate random colors beforehand and memoize the result to avoid color flickering on each redraw
function colorMap() {
  const randomColors = [];
  for (let i = 0; i < 150; i++) {
    // random length, enough to fill the screen
    randomColors.push(
      COLORS[
        Object.keys(COLORS)[
          Math.floor(Math.random() * Object.keys(COLORS).length)
        ] as keyof typeof COLORS
      ]
    );
  }
  return randomColors;
}

const memoizedColorMap = memoizeOne(colorMap);

/**
 * Function to modify the color of the circles and rectangles on the canvas.
 *
 * @param  {P5Instance} p5 - The p5 instance
 * @param  {COLOR_MODIFIER} colorModifierState - Slice of the AnimationState that contains the color modifier state
 * @param  {Row[]} rows - The rows we want to perform the manipulations on
 * @returns Row - The modified rows
 */
export function colorModifier(
  colorModifierState: COLOR_MODIFIER | undefined,
  rows: Row[]
): Row[] {
  switch (colorModifierState) {
    case COLOR_MODIFIER.FILL_CIRCLES: {
      let counter = 0;
      rows.forEach((row, rowIndex) => {
        counter++;
        row.rectangles.forEach((rectangle, rectIndex) => {
          counter++;
          rectangle.circles.forEach((circle, circleIndex) => {
            counter++;
            circle.color = memoizedColorMap()[counter];
          });
        });
      });
      break;
    }
    case COLOR_MODIFIER.EMOJIS: {
      /*
       *EXAMPLE VERSION WITH RANDOM EMOJIS EVERYWHERE
       */
      // rows.forEach((row, rowIndex) => {
      //   row.rectangles.forEach((rectangle, rectIndex) => {
      //     rectangle.circles.forEach((circle, circleIndex) => {
      //       circle.emoji = String.fromCodePoint(
      //         0x1f600 + Math.floor(Math.random() * (0x1f64f - 0x1f600))
      //       );
      //     });
      //   });
      // });
      /*
       * VERSION WITH TARGETING SPECIFIC CIRCLES
       */
      rows[0].rectangles[3].circles[0].emoji = "💩";
      rows[1].rectangles[6].circles[1].emoji = "💩";
      rows[2].rectangles[8].circles[0].emoji = "💩";
      break;
    }
    default: {
      break;
    }
  }

  return rows;
}
