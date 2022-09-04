import { P5Instance } from "react-p5-wrapper";

import { canvasSettings } from "../../../components/Canvas";
import { MOVEMENT_MODIFIER } from "../../../constants/enums";
import { CanvasSettings, Row } from "../../../constants/types";
import { assembleRows } from "../drawingUtils/drawShapes";

let count = 0;

let angles: number[] = [];
let angleV: number[] = [];

let perlinVal: number[] = [];
let perlinValV: number[] = [];

let savedPositions: number[] = [];

/**
 * Function to modify the movement of the circles and rectangles on the canvas.
 *
 * @param  {P5Instance} p5 - The p5 instance
 * @param  {CanvasSettings} canvasSettings - The canvas settings containing different base values we base our calculations on
 * @param  {MOVEMENT_MODIFIER} movementModifierState - Slice of the AnimationState that contains the movement modifier state
 * @param  {Row[]} rows - The rows we want to perform the manipulations on
 * @returns Row - The modified rows
 */

export function movementModifier(
  p5: P5Instance,
  canvasSettings: CanvasSettings,
  movementModifierState: MOVEMENT_MODIFIER | undefined,
  rows: Row[]
): Row[] {
  for (let i = 0; i < canvasSettings.columnCount; i++) {
    angles.push(0);
    angleV.push(0.01 + i / 700);
    perlinVal.push(0);
    perlinValV.push(0.007 + i / 7000);
  }

  switch (movementModifierState) {
    case MOVEMENT_MODIFIER.DYNAMIC_ROW_HEIGHT_PERLIN: {
      //Caluclating values for Top Row
      let RectTopMinHeight = canvasSettings.circleSize * 2;
      let RectTopMaxHeight =
        canvasSettings.canvasHeight / 2 -
        canvasSettings.padding -
        canvasSettings.gap -
        canvasSettings.circleSize;

      let calcCircleMinTop = rows[0].rectangles[0].circles[1].y;
      let calcCircleMaxTop =
        canvasSettings.canvasHeight / 2 -
        canvasSettings.gap -
        canvasSettings.circleSize -
        canvasSettings.circleSize / 2;

      let RectMidMinHeight = canvasSettings.circleSize * 2;
      let RectMidMaxHeight =
        canvasSettings.canvasHeight -
        canvasSettings.padding * 2 -
        canvasSettings.gap * 2 -
        canvasSettings.circleSize * 4;

      //Caluclating values for Mid Row
      let RectMidMinY =
        RectTopMinHeight + canvasSettings.gap + canvasSettings.padding;
      let RectMidMaxY =
        RectTopMaxHeight + canvasSettings.gap + canvasSettings.padding;

      let Circle1MidMinY = RectMidMinY + canvasSettings.circleSize / 2;
      let Circle1MidMaxY =
        canvasSettings.canvasHeight / 2 - canvasSettings.circleSize / 2;

      let Circle2MidMinY =
        canvasSettings.canvasHeight / 2 + canvasSettings.circleSize / 2;
      let Circle2MidMaxY =
        canvasSettings.canvasHeight -
        canvasSettings.gap -
        canvasSettings.padding -
        canvasSettings.circleSize * 2 -
        canvasSettings.circleSize / 2;

      //Caluclating values for Bot Row
      let RectBotMinHeight = canvasSettings.circleSize * 2;
      let RectBotMaxHeight =
        canvasSettings.canvasHeight / 2 -
        canvasSettings.padding -
        canvasSettings.gap -
        canvasSettings.circleSize;

      let RectBotMinY =
        canvasSettings.canvasHeight - RectBotMinHeight - canvasSettings.padding;
      let RectBotMaxY =
        canvasSettings.canvasHeight - RectBotMaxHeight - canvasSettings.padding;

      let Circle1BotMinY = RectBotMinY + canvasSettings.circleSize / 2;
      let Circle1BotMaxY =
        canvasSettings.canvasHeight / 2 +
        canvasSettings.circleSize +
        canvasSettings.gap +
        canvasSettings.circleSize / 2;

      rows[0].rectangles.forEach((rectangle, colIndex) => {
        rectangle.h = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          RectTopMinHeight,
          RectTopMaxHeight
        );
        rectangle.circles[1].y = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          calcCircleMinTop,
          calcCircleMaxTop
        );

        perlinVal[colIndex] += perlinValV[colIndex];
      });

      rows[1].rectangles.forEach((rectangle, colIndex) => {
        rectangle.h = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          RectMidMaxHeight,
          RectMidMinHeight
        );
        rectangle.y = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          RectMidMinY,
          RectMidMaxY
        );

        rectangle.circles[0].y = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          Circle1MidMinY,
          Circle1MidMaxY
        );
        rectangle.circles[1].y = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          Circle2MidMaxY,
          Circle2MidMinY
        );
      });

      rows[2].rectangles.forEach((rectangle, colIndex) => {
        rectangle.h = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          RectBotMinHeight,
          RectBotMaxHeight
        );
        rectangle.y = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          RectBotMinY,
          RectBotMaxY
        );

        rectangle.circles[0].y = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          Circle1BotMinY,
          Circle1BotMaxY
        );
      });

      return rows;
    }

    case MOVEMENT_MODIFIER.DYNAMIC_ROW_HEIGHT: {
      let RectTopMinHeight = canvasSettings.circleSize * 2;
      let RectTopMaxHeight =
        canvasSettings.canvasHeight / 2 -
        canvasSettings.padding -
        canvasSettings.gap -
        canvasSettings.circleSize;

      let calcCircleMinTop = rows[0].rectangles[0].circles[1].y;
      let calcCircleMaxTop =
        canvasSettings.canvasHeight / 2 -
        canvasSettings.gap -
        canvasSettings.circleSize -
        canvasSettings.circleSize / 2;

      rows[0].rectangles.forEach((rectangle, colIndex) => {
        rectangle.h = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          RectTopMinHeight,
          RectTopMaxHeight
        );
        rectangle.circles[1].y = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          calcCircleMinTop,
          calcCircleMaxTop
        );
        angles[colIndex] += angleV[colIndex];
      });

      let RectMidMinHeight = canvasSettings.circleSize * 2;
      let RectMidMaxHeight =
        canvasSettings.canvasHeight -
        canvasSettings.padding * 2 -
        canvasSettings.gap * 2 -
        canvasSettings.circleSize * 4;

      let RectMidMinY =
        RectTopMinHeight + canvasSettings.gap + canvasSettings.padding;
      let RectMidMaxY =
        RectTopMaxHeight + canvasSettings.gap + canvasSettings.padding;

      let Circle1MidMinY = RectMidMinY + canvasSettings.circleSize / 2;
      let Circle1MidMaxY =
        canvasSettings.canvasHeight / 2 - canvasSettings.circleSize / 2;

      let Circle2MidMinY =
        canvasSettings.canvasHeight / 2 + canvasSettings.circleSize / 2;
      let Circle2MidMaxY =
        canvasSettings.canvasHeight -
        canvasSettings.gap -
        canvasSettings.padding -
        canvasSettings.circleSize * 2 -
        canvasSettings.circleSize / 2;

      rows[1].rectangles.forEach((rectangle, colIndex) => {
        rectangle.h = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          RectMidMaxHeight,
          RectMidMinHeight
        );
        rectangle.y = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          RectMidMinY,
          RectMidMaxY
        );

        rectangle.circles[0].y = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          Circle1MidMinY,
          Circle1MidMaxY
        );
        rectangle.circles[1].y = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          Circle2MidMaxY,
          Circle2MidMinY
        );
        //angles[colIndex] += angleV[colIndex];
      });

      let RectBotMinHeight = canvasSettings.circleSize * 2;
      let RectBotMaxHeight =
        canvasSettings.canvasHeight / 2 -
        canvasSettings.padding -
        canvasSettings.gap -
        canvasSettings.circleSize;

      let RectBotMinY =
        canvasSettings.canvasHeight - RectBotMinHeight - canvasSettings.padding;
      let RectBotMaxY =
        canvasSettings.canvasHeight - RectBotMaxHeight - canvasSettings.padding;

      let Circle1BotMinY = RectBotMinY + canvasSettings.circleSize / 2;
      let Circle1BotMaxY =
        canvasSettings.canvasHeight / 2 +
        canvasSettings.circleSize +
        canvasSettings.gap +
        canvasSettings.circleSize / 2;

      let Circle2BotMinY = rows[2].rectangles[0].circles[1].y;
      let Circle2BotMaxY =
        canvasSettings.canvasHeight -
        canvasSettings.gap -
        canvasSettings.padding -
        canvasSettings.circleSize * 2 -
        canvasSettings.circleSize / 2;

      rows[2].rectangles.forEach((rectangle, colIndex) => {
        rectangle.h = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          RectBotMinHeight,
          RectBotMaxHeight
        );
        rectangle.y = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          RectBotMinY,
          RectBotMaxY
        );

        rectangle.circles[0].y = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          Circle1BotMinY,
          Circle1BotMaxY
        );
        //angles[colIndex] += angleV[colIndex];
      });

      return rows;
    }

    case MOVEMENT_MODIFIER.SINE_CIRCLES: {
      count += 0.02; //get things moving

      let calcMaxTop = rows[1].rectangles[0].circles[0].y;
      let calcMaxBot = rows[1].rectangles[0].circles[1].y;

      rows[1].rectangles.forEach((rectangle, rectIndex) => {
        let circleYSinTop = p5.map(
          p5.sin(angles[rectIndex]),
          -1,
          1,
          calcMaxTop,
          calcMaxBot
        );
        let circleYSinBot = p5.map(
          p5.sin(angles[rectIndex]),
          1,
          -1,
          calcMaxTop,
          calcMaxBot
        );

        rectangle.circles[0].y = circleYSinTop;
        rectangle.circles[1].y = circleYSinBot;

        angles[rectIndex] += angleV[rectIndex];
      });

      return rows; //return the rows with the modified circles
    }

    case MOVEMENT_MODIFIER.SPECTRUM: {
      const speed = 0.8; // speed 0-1
      const randomPushUp = 0.1; // randomly push bubbles up 0-1
      const traceMin = 5; // min distance of following bubble
      const traceMax = 50; // max distance of following bubble

      let calcMaxTop = rows[1].rectangles[0].circles[0].y;
      let calcMaxBot = rows[1].rectangles[0].circles[1].y;

      rows[1].rectangles.forEach((rectangle, rectIndex) => {
        const r = p5.random(0, 100);
        const randomPositionY = p5.map(r, 0, 100, calcMaxTop, calcMaxBot);

        let currentPosY = savedPositions[rectIndex];
        if (typeof currentPosY === "undefined") currentPosY = calcMaxBot;

        const currentSpeed = currentPosY / p5.map(speed, 0.1, 1, 500, 1);
        let newPositionY = currentPosY + currentSpeed;

        let pushUp = false;
        if (
          p5.random(0.1, 1) <= randomPushUp &&
          currentPosY > randomPositionY
        ) {
          pushUp = true;
        }

        if (currentPosY >= calcMaxBot || pushUp) newPositionY = randomPositionY;

        const trace = p5.map(
          newPositionY,
          calcMaxTop,
          calcMaxBot,
          traceMin,
          traceMax
        );

        rectangle.circles[0].y = newPositionY;
        rectangle.circles[1].y = newPositionY - trace;

        savedPositions[rectIndex] = newPositionY;
      });

      return rows; //return the rows with the modified circles
    }

    default: {
      return rows;
    }
  }
}
