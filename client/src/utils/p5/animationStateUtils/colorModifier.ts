import { COLOR_MODIFIER, COLORS } from "../../../constants/enums";
import { Row } from "../../../constants/types";

// generate random colors beforehand  to avoid color flickering on each redraw
const randomRectColors = new Map<number, COLORS>();
const randomCircleColors = new Map<number, COLORS>();
const randomEmoji = new Map<number, string>();
let numberOfCircles = 3 * 15 * 2; // rows * columns * 2 circles per row
let randomIndex = Math.floor(Math.random() * numberOfCircles);

for (let i = 0; i < 50; i++) {
  randomIndex = Math.floor(Math.random() * numberOfCircles);

  randomRectColors.set(
    randomIndex,
    COLORS[
      Object.keys(COLORS)[
        Math.floor(Math.random() * Object.keys(COLORS).length)
      ] as keyof typeof COLORS
    ]
  );
  randomCircleColors.set(
    randomIndex,
    COLORS[
      Object.keys(COLORS)[
        Math.floor(Math.random() * Object.keys(COLORS).length)
      ] as keyof typeof COLORS
    ]
  );

  randomEmoji.set(
    randomIndex,
    String.fromCodePoint(
      0x1f600 + Math.floor(Math.random() * (0x1f64f - 0x1f600))
    )
  );
}

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
      let lastFilledColumn = 0;
      rows.forEach((row) => {
        row.rectangles.forEach((rectangle, colIndex) => {
          rectangle.circles.forEach((circle) => {
            counter++;
            if (
              randomCircleColors.has(counter) &&
              lastFilledColumn !== colIndex - 1
            ) {
              circle.color = randomCircleColors.get(counter);
              lastFilledColumn = colIndex;
            }
          });
        });
      });
      break;
    }
    case COLOR_MODIFIER.FILL_RECTS_AND_CIRCLES: {
      let counter = 0;
      let lastFilledColumn = 0;
      const [, randomRectColor] = [...randomRectColors].at(-1) || []; // get the last random color
      const [, randomCircleColor] = [...randomCircleColors].at(-1) || []; // get the last random color

      rows.forEach((row) => {
        row.rectangles.forEach((rectangle, colIndex) => {
          rectangle.circles.forEach((circle) => {
            counter++;
            if (
              randomCircleColors.has(counter) &&
              lastFilledColumn !== colIndex - 1
            ) {
              rectangle.color = randomRectColor;
              circle.color = randomCircleColor;
              lastFilledColumn = colIndex;
            }
          });
        });
      });
      break;
    }
    case COLOR_MODIFIER.EMOJIS: {
      let counter = 0;
      let lastFilledColumn = 0;
      rows.forEach((row) => {
        row.rectangles.forEach((rectangle, colIndex) => {
          rectangle.circles.forEach((circle) => {
            counter++;
            if (randomEmoji.has(counter) && lastFilledColumn !== colIndex - 1) {
              circle.emoji = randomEmoji.get(counter);
              lastFilledColumn = colIndex;
            }
          });
        });
      });

      break;
    }
    default: {
      break;
    }
  }

  return rows;
}
