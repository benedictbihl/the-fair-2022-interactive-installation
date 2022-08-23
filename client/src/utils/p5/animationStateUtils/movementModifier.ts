import { P5Instance } from "react-p5-wrapper";

import { MOVEMENT_MODIFIER } from "../../../constants/enums";
import { CanvasSettings, Row } from "../../../constants/types";

let count = 0;

const assembleRows = (
  canvasSettings: CanvasSettings,
  topRowSkeleton: Row,
  midRowSkeleton: Row,
  botRowSkeleton: Row
): Row[] => {
  // iterate over canvasSettings.columnCount and draw a rectangle and two circles for each column
  for (let i = 0; i < canvasSettings.columnCount; i++) {
    topRowSkeleton.rectangles.push({
      x:
        canvasSettings.padding +
        i * (canvasSettings.circleSize * canvasSettings.circleOffset) +
        topRowSkeleton.xpos,
      y: canvasSettings.padding + topRowSkeleton.ypos,
      w: canvasSettings.circleSize,
      h: canvasSettings.circleSize * topRowSkeleton.height,
      rTop: topRowSkeleton.topRadius,
      rBot: topRowSkeleton.botRadius,
      line: i % 2 === 0 ? 1 : 0.4,
      circles: [
        {
          x:
            canvasSettings.circleSize / 2 +
            canvasSettings.padding +
            i * canvasSettings.circleSize * canvasSettings.circleOffset +
            topRowSkeleton.xpos,
          y:
            canvasSettings.padding +
            canvasSettings.circleSize / 2 +
            topRowSkeleton.ypos,
          r: canvasSettings.circleSize,
          line: i % 2 === 0 ? 1 : 0.3,
        },
        {
          x:
            canvasSettings.circleSize / 2 +
            canvasSettings.padding +
            i * canvasSettings.circleSize * canvasSettings.circleOffset +
            topRowSkeleton.xpos,
          y:
            canvasSettings.padding +
            canvasSettings.circleSize / 2 +
            topRowSkeleton.ypos +
            canvasSettings.circleSize * topRowSkeleton.height -
            canvasSettings.circleSize,
          r: canvasSettings.circleSize,
          line: i % 2 === 0 ? 1 : 0.3,
        },
      ],
    });

    midRowSkeleton.rectangles.push({
      x:
        canvasSettings.padding +
        i * (canvasSettings.circleSize * canvasSettings.circleOffset) +
        midRowSkeleton.xpos,
      y: canvasSettings.padding + midRowSkeleton.ypos,
      w: canvasSettings.circleSize,
      h: canvasSettings.circleSize * midRowSkeleton.height,
      rTop: midRowSkeleton.topRadius,
      rBot: midRowSkeleton.botRadius,
      line: i % 2 === 0 ? 1 : 0.4,
      circles: [
        {
          x:
            canvasSettings.circleSize / 2 +
            canvasSettings.padding +
            i * canvasSettings.circleSize * canvasSettings.circleOffset +
            midRowSkeleton.xpos,
          y:
            canvasSettings.padding +
            canvasSettings.circleSize / 2 +
            midRowSkeleton.ypos,
          r: canvasSettings.circleSize,
          line: i % 2 === 0 ? 1 : 0.3,
        },
        {
          x:
            canvasSettings.circleSize / 2 +
            canvasSettings.padding +
            i * canvasSettings.circleSize * canvasSettings.circleOffset +
            midRowSkeleton.xpos,
          y:
            canvasSettings.padding +
            canvasSettings.circleSize / 2 +
            midRowSkeleton.ypos +
            canvasSettings.circleSize * midRowSkeleton.height -
            canvasSettings.circleSize,
          r: canvasSettings.circleSize,
          line: i % 2 === 0 ? 1 : 0.3,
        },
      ],
    });

    botRowSkeleton.rectangles.push({
      x:
        canvasSettings.padding +
        i * (canvasSettings.circleSize * canvasSettings.circleOffset) +
        botRowSkeleton.xpos,
      y: canvasSettings.padding + botRowSkeleton.ypos,
      w: canvasSettings.circleSize,
      h: canvasSettings.circleSize * botRowSkeleton.height,
      rTop: botRowSkeleton.topRadius,
      rBot: botRowSkeleton.botRadius,
      line: i % 2 === 0 ? 1 : 0.4,
      circles: [
        {
          x:
            canvasSettings.circleSize / 2 +
            canvasSettings.padding +
            i * canvasSettings.circleSize * canvasSettings.circleOffset +
            botRowSkeleton.xpos,
          y:
            canvasSettings.padding +
            canvasSettings.circleSize / 2 +
            botRowSkeleton.ypos,
          r: canvasSettings.circleSize,
          line: i % 2 === 0 ? 1 : 0.3,
        },
        {
          x:
            canvasSettings.circleSize / 2 +
            canvasSettings.padding +
            i * canvasSettings.circleSize * canvasSettings.circleOffset +
            botRowSkeleton.xpos,
          y:
            canvasSettings.padding +
            canvasSettings.circleSize / 2 +
            botRowSkeleton.ypos +
            canvasSettings.circleSize * botRowSkeleton.height -
            canvasSettings.circleSize,
          r: canvasSettings.circleSize,
          line: i % 2 === 0 ? 1 : 0.3,
        },
      ],
    });
  }
  return [topRowSkeleton, midRowSkeleton, botRowSkeleton];
};

export function movementModifier(
  p5: P5Instance,
  canvasSettings: CanvasSettings,
  movementModifierState: MOVEMENT_MODIFIER,
  topRowSkeleton: Row,
  midRowSkeleton: Row,
  botRowSkeleton: Row
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

      topRowSkeleton.height = heightTopRow;
      midRowSkeleton.height = heightMidRow;
      botRowSkeleton.height = heightBotRow;
      midRowSkeleton.ypos = yPosMidRow;
      botRowSkeleton.ypos = yPosBotRow;
      return assembleRows(
        canvasSettings,
        topRowSkeleton,
        midRowSkeleton,
        botRowSkeleton
      );
    }
    case MOVEMENT_MODIFIER.SINE_WAVE: {
      count += 0.02; //get things moving
      let xposTopRow = 3 * p5.sin(count);
      let xposMidrow = 4 * p5.cos(count);
      let xposBotRow = 3 * p5.sin(count);

      topRowSkeleton.xpos = xposTopRow;
      midRowSkeleton.xpos = xposMidrow;
      botRowSkeleton.xpos = xposBotRow;
      return assembleRows(
        canvasSettings,
        topRowSkeleton,
        midRowSkeleton,
        botRowSkeleton
      );
    }
    /*
     *EXAMPLE CASE: IF YOU WANT TO ACCESS THE CIRCLES OR RECTANGLES AT THIS POINT IN THE CODE, CALL assembleRows() FIRST, OTHERWISE THOSE ELEMENTS WONT BE AVAILABLE
     */
    // case MOVEMENT_MODIFIER.EXAMPLE: {
    //   const rows = assembleRows( //call this first
    //     canvasSettings,
    //     topRowSkeleton,
    //     midRowSkeleton,
    //     botRowSkeleton
    //   );
    //   count += 0.02; //get things moving

    //   let circleX = 20 * p5.sin(count); //access the circles in the rows how you want
    //   rows.forEach((row) => {
    //     row.rectangles.forEach((rectangle, rectIndex) => {
    //       if (rectIndex % 2 === 0) {
    //         rectangle.circles[1].x += circleX;
    //       }
    //     });
    //   });
    //   return rows; //return the rows with the modified circles
    // }
    default: {
      return assembleRows(
        canvasSettings,
        topRowSkeleton,
        midRowSkeleton,
        botRowSkeleton
      );
    }
  }
}
