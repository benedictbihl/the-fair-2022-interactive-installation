import { P5Instance } from "react-p5-wrapper";

import { COLORS } from "../../../constants/enums";
import {
  CanvasSettings,
  Circle,
  Rectangle,
  Row,
  ShapeModification,
} from "../../../constants/types";

/**
 * function to draw a row of circles and rectangles on the canvas.
 *
 * @param  {P5Instance}  - The p5 instance
 * @param  {CanvasSettings} canvasSettings - The canvas settings, containing the circle size, gap, padding, etc.
 * @param  {AnimationModifierState} animationModifierState - The animation modifier state - used to modify the base sketch
 * @param  {Row} row - The row specification
 */
export const drawRow = (
  p5: P5Instance,
  canvasSettings: CanvasSettings,
  shapeModification: Map<string, ShapeModification>,
  row: Row
) => {
  for (let i = 0; i < canvasSettings.columnCount; i++) {
    const circleX =
      canvasSettings.circleSize / 2 +
      canvasSettings.padding +
      i * canvasSettings.circleSize * canvasSettings.circleOffset +
      row.xpos;
    const circleY =
      canvasSettings.padding + canvasSettings.circleSize / 2 + row.ypos;
    const circleYBot =
      circleY +
      canvasSettings.circleSize * row.height -
      canvasSettings.circleSize;
    const rectX =
      canvasSettings.padding +
      i * (canvasSettings.circleSize * canvasSettings.circleOffset) +
      row.xpos;
    const rectY = canvasSettings.padding + row.ypos;

    _drawCircle(
      p5,
      {
        x: circleX + row.xpos,
        y: circleY,
        r: canvasSettings.circleSize,
        line: i % 2 === 0 ? 1 : 0.3, // Every second column is drawn with a thinner stroke
      },
      shapeModification.get(JSON.stringify({ pos: 0, row: i }))
      //i + 1 optional, use to output the circle number
    );
    _drawCircle(
      p5,
      {
        x: circleX,
        y: circleYBot,
        r: canvasSettings.circleSize,
        line: i % 2 === 0 ? 1 : 0.3,
      },
      shapeModification.get(JSON.stringify({ pos: 1, row: i }))
      //i + 1 optional, use to output the circle number
    );

    // The outer rectangles are drawn with rounded borders
    if (i === 0 || i === canvasSettings.columnCount - 1) {
      _drawRect(p5, {
        x: rectX,
        y: rectY,
        w: canvasSettings.circleSize,
        h: canvasSettings.circleSize * row.height,
        rTop: row.topRadius,
        rBot: row.botRadius,
        line: i % 2 === 0 ? 1 : 0.4, // Every second column is drawn with a thinner stroke
      });
    } else {
      _drawRect(p5, {
        x: rectX + row.xpos,
        y: rectY,
        w: canvasSettings.circleSize,
        h: canvasSettings.circleSize * row.height,
        rTop: 0,
        rBot: 0,
        line: i % 2 === 0 ? 1 : 0.4, // Every second column is drawn with a thinner stroke
      });
    }
  }
};

/**
 * function to draw a circle on the canvas
 *
 * @param  {P5Instance} p5 - The p5 instance
 * @param  {Circle} circle - The circle specification
 * @param  {COLORS | false} color - Whether the circle should be filled with one of the brand colors (hexcode)
 * @param  {number} coords  - Can be used for debugging purposes to output the circle number
 */
const _drawCircle = (
  p5: P5Instance,
  circle: Circle,
  shapeModification?: ShapeModification,
  coords?: number
) => {
  p5.stroke(255);
  shapeModification?.circle?.color && !shapeModification.circle.emoji
    ? p5.fill(shapeModification.circle?.color)
    : p5.noFill();
  p5.strokeWeight(circle.line);
  p5.ellipse(circle.x, circle.y, circle.r);
  shapeModification?.circle?.emoji &&
    p5.text(shapeModification.circle.emoji, circle.x, circle.y, circle.r);

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
