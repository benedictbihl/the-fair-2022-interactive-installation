import { P5Instance } from "react-p5-wrapper";

import { canvasSettings } from "../../../constants/canvasSettings";
import { COLOR_MODIFIER, COLORS } from "../../../constants/enums";
import { ColorPair, Row } from "../../../constants/types";

const colorPairings: ColorPair[] = [
  {
    primary: COLORS.VANILLA_PHASER,
    secondary: COLORS.GOLD_TUNE,
  },
  {
    primary: COLORS.REVERB_BLUE,
    secondary: COLORS.ORANGE_FUZZ,
  },
  {
    primary: COLORS.PURPLE_NOISE,
    secondary: COLORS.VANILLA_PHASER,
  },
  {
    primary: COLORS.PURPLE_NOISE,
    secondary: COLORS.GOLD_TUNE,
  },
  {
    primary: COLORS.REVERB_BLUE,
    secondary: COLORS.VANILLA_PHASER,
  },
  {
    primary: COLORS.ORANGE_FUZZ,
    secondary: COLORS.PURPLE_NOISE,
  },
];

let randomColorPair: ColorPair;
let currentModifier: COLOR_MODIFIER | undefined;
let counter = 0;
let gapCount = Math.floor(Math.random() * (12 - 8) + 8);

/**
 * Function to modify the color of the circles! and rectangles on the canvas.
 *
 * @param  {P5Instance} p5 - The p5 instance
 * @param  {COLOR_MODIFIER} colorModifierState - Slice of the AnimationState that contains the color modifier state
 * @param  {Row[]} rows - The rows we want to perform the manipulations on
 * @returns Row - The modified rows
 */
export function colorModifier(
  p5: P5Instance,
  colorModifierState: COLOR_MODIFIER | undefined,
  rows: Row[]
): { rows: Row[]; colorPair: ColorPair } {
  // only generate new colors if the modifier has changed
  if (colorModifierState !== currentModifier) {
    counter++;
    currentModifier = colorModifierState;
    randomColorPair =
      colorPairings[Math.floor(Math.random() * colorPairings.length)];
    gapCount = Math.floor(Math.random() * (12 - 8) + 8);
  }
  p5.randomSeed(counter); // set the seed to the counter to avoid flickering, but still have new random positions each time the modifier changes
  switch (colorModifierState) {
    case COLOR_MODIFIER.FILL_CIRCLES: {
      rows.forEach((row) => {
        row.rectangles.forEach((rectangle, colIndex) => {
          rectangle.circles!.forEach((circle) => {
            if (colIndex % 2 === 0) {
              if (p5.random() >= 0.4) {
                circle.color = randomColorPair.primary;
              } else if (p5.random() <= 0.2) {
                circle.color = randomColorPair.secondary;
              }
            } else {
              if (p5.random() <= 0.3) {
                circle.color = randomColorPair.secondary;
              }
            }
          });
        });
      });
      break;
    }
    case COLOR_MODIFIER.FILL_RECTS_AND_CIRCLES: {
      rows.forEach((row) => {
        row.rectangles.forEach((rectangle, colIndex) => {
          if (p5.random() >= 0.7 && colIndex % 2 === 0) {
            rectangle.color = randomColorPair.primary;
            rectangle.circles![0].color = randomColorPair.secondary;
            rectangle.circles![1].color = randomColorPair.secondary;
          } else if (p5.random() <= 0.3 && colIndex % 2 === 1) {
            rectangle.color = randomColorPair.secondary;
            rectangle.circles![0].color = randomColorPair.primary;
            rectangle.circles![1].color = randomColorPair.primary;
          }
        });
      });
      break;
    }
    case COLOR_MODIFIER.FILL_GAPS_RECTS_AND_CIRCLES: {
      rows.forEach((row) => {
        row.gaps.forEach((gap, gapIndex) => {
          if (gapIndex > gapCount) {
            gap.color = randomColorPair.secondary;
            gap.line = gapIndex % 2 === 0 ? 0.4 : 1;
          }
        });
        row.rectangles.forEach((rectangle, colIndex) => {
          if (colIndex < gapCount && colIndex % 2 === 1) {
            rectangle.color = randomColorPair.primary;
            rectangle.circles![0].color = randomColorPair.primary;
            rectangle.circles![1].color = randomColorPair.primary;
          }
        });
      });
      break;
    }
    default: {
      break;
    }
  }

  return { rows: rows, colorPair: randomColorPair };
}
