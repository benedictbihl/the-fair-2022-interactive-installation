import { P5Instance } from "react-p5-wrapper";

import { COLOR_MODIFIER } from "../../../constants/enums";
import {
  AnimationModifierState,
  CanvasSettings,
  Circle,
  Rectangle,
  Row,
} from "../../../constants/types";

export const drawRow = (
  p5: P5Instance,
  canvasSettings: CanvasSettings,
  animationModifierState: AnimationModifierState,
  row: Row
) => {
  for (let i = 0; i < canvasSettings.rowCount; i++) {
    const circleX =
      canvasSettings.circleSize / 2 +
      canvasSettings.padding +
      i * canvasSettings.circleSize * canvasSettings.circleOffset;

    const circleY =
      canvasSettings.padding + canvasSettings.circleSize / 2 + row.ypos;
    const circleYBot =
      circleY +
      canvasSettings.circleSize * row.height -
      canvasSettings.circleSize;

    // DRAWS CIRCLES
    // Every second column is drawn with a thinner stroke

    drawCircle(
      p5,
      canvasSettings,
      {
        x: circleX,
        y: circleY,
        r: canvasSettings.circleSize,
        line: i % 2 == 0 ? 1 : 0.3,
      },
      animationModifierState.colorModifier === COLOR_MODIFIER.FILL_SHAPES
    );
    drawCircle(
      p5,
      canvasSettings,
      {
        x: circleX,
        y: circleYBot,
        r: canvasSettings.circleSize,
        line: i % 2 == 0 ? 1 : 0.3,
      },
      animationModifierState.colorModifier === COLOR_MODIFIER.FILL_SHAPES
    );

    const rectX =
      canvasSettings.padding +
      i * (canvasSettings.circleSize * canvasSettings.circleOffset);
    const rectY = canvasSettings.padding + row.ypos;

    // DRAWS RECTANGLES
    // Every second column is drawn with a thinner stroke
    // The outer rectangles are drawn with rounded borders
    if (i == 0 || i == canvasSettings.rowCount - 1) {
      if (i % 2 == 0) {
        drawRect(p5, canvasSettings, {
          x: rectX,
          y: rectY,
          w: canvasSettings.circleSize,
          h: canvasSettings.circleSize * row.height,
          rTop: row.topRadius,
          rBot: row.botRadius,
          line: 1,
        });
      } else {
        drawRect(p5, canvasSettings, {
          x: rectX,
          y: rectY,
          w: canvasSettings.circleSize,
          h: canvasSettings.circleSize * row.height,
          rTop: row.topRadius,
          rBot: row.botRadius,
          line: 0.4,
        });
      }
    } else {
      if (i % 2 == 0) {
        drawRect(p5, canvasSettings, {
          x: rectX,
          y: rectY,
          w: canvasSettings.circleSize,
          h: canvasSettings.circleSize * row.height,
          rTop: 0,
          rBot: 0,
          line: 1,
        });
      } else {
        drawRect(p5, canvasSettings, {
          x: rectX,
          y: rectY,
          w: canvasSettings.circleSize,
          h: canvasSettings.circleSize * row.height,
          rTop: 0,
          rBot: 0,
          line: 0.4,
        });
      }
    }
  }
};

const drawCircle = (
  p5: P5Instance,
  canvasSettings: CanvasSettings,
  circle: Circle,
  filled: boolean
) => {
  if (filled) {
    p5.noStroke();
    p5.fill(255, 255, 255);
  } else {
    p5.noFill();
    p5.stroke(255);
  }

  p5.strokeWeight(circle.line);
  p5.ellipse(circle.x, circle.y, circle.r);
};

const drawRect = (
  p5: P5Instance,
  canvasSettings: CanvasSettings,
  rect: Rectangle
) => {
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
