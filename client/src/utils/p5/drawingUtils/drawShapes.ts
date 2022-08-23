import { P5Instance } from "react-p5-wrapper";

import { Circle, Rectangle, Row } from "../../../constants/types";

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
