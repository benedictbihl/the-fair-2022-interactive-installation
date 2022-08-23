import { COLOR_MODIFIER, COLORS } from "../../../constants/enums";
import { Row } from "../../../constants/types";

export function colorModifier(
  colorModifierState: COLOR_MODIFIER,
  rows: Row[]
): Row[] {
  switch (colorModifierState) {
    case COLOR_MODIFIER.FILL_CIRCLES: {
      const colorValues = Object.keys(COLORS);

      rows.forEach((row, rowIndex) => {
        row.rectangles.forEach((rectangle, rectIndex) => {
          rectangle.circles.forEach((circle, circleIndex) => {
            circle.color =
              COLORS[
                Object.keys(COLORS)[
                  Math.floor(Math.random() * Object.keys(COLORS).length)
                ] as keyof typeof COLORS
              ];
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
