import { P5Instance } from "react-p5-wrapper";

import {
  CanvasSettings,
  Circle,
  Rectangle,
  Row,
} from "../../../constants/types";

/**
 * function to draw a row of circles and rectangles on the canvas.
 *
 * @param  {P5Instance}  - The p5 instance
 * @param  {Row} row - The row specification
 * @param  {AnimationModifierState} animationModifierState - The animation modifier state - used to modify the base sketch
 */
export const drawRows = (p5: P5Instance, rows: Row[]) => {
  rows.forEach((row) => {
    row.rectangles.forEach((rectangle) => {
      rectangle.circles.forEach((circle) => {
        _drawCircle(
          p5,
          circle
          // shapeModification.get(JSON.stringify({ pos: 0, row: i }))
          //i + 1 optional, use to output the circle number
        );
      });
      _drawRect(p5, rectangle);
    });
  });
};

/**
 * function to draw a circle on the canvas
 *
 * @param  {P5Instance} p5 - The p5 instance
 * @param  {Circle} circle - The circle specification
 * @param  {ShapeModification} shapeModification - Whether the circle should be filled with one of the brand colors (hexcode)
 * @param  {number} coords  - Can be used for debugging purposes to output the circle number
 */
const _drawCircle = (p5: P5Instance, circle: Circle, coords?: number) => {
  p5.stroke(255);
  circle.color && !circle.emoji ? p5.fill(circle.color) : p5.noFill();
  p5.strokeWeight(circle.line);
  p5.ellipse(circle.x, circle.y, circle.r);
  circle.emoji && p5.text(circle.emoji, circle.x, circle.y, circle.r);

  if (coords) {
    p5.text(coords, circle.x, circle.y, circle.r);
  }
};

/**
 * function to draw the rectangles behind the circles on the canvas
 *
 * @param  {P5Instance} p5 - The p5 instance
 * @param  {Rectangle} rect - The rectangle specification
 */
const _drawRect = (p5: P5Instance, rect: Rectangle) => {
  p5.noFill();
  p5.stroke(255);
  p5.strokeWeight(rect.line);
  p5.rect(
    rect.x,
    rect.y,
    rect.w,
    rect.h,
    rect.rTop,
    rect.rTop,
    rect.rBot,
    rect.rBot
  );
};

/**
 * function to put all data together before the rows get drawn. runs initally once every frame
 * in p5.draw() and then possibly again within movementModifier()
 *
 * @param  {CanvasSettings} canvasSettings - The canvas settings containing the column count we need
 * @param  {Row} topRowSkeleton - The top row skeleton containing the position for the entire row
 * @param  {Row} midRowSkeleton - The mid row skeleton containing the position for the entire row
 * @param  {Row} botRowSkeleton - The bot row skeleton containing the position for the entire row
 * @returns Row[] - The array of rows containing all data to draw the base sketch
 */
export const assembleRows = (
  canvasSettings: CanvasSettings,
  topRowSkeleton: Row,
  midRowSkeleton: Row,
  botRowSkeleton: Row
): Row[] => {
  //clean up before assembling the rows
  topRowSkeleton.rectangles = [];
  midRowSkeleton.rectangles = [];
  botRowSkeleton.rectangles = [];

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
