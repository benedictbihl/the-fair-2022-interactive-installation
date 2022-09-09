import { P5Instance } from "react-p5-wrapper";

import { canvasSettings } from "../../../constants/canvasSettings";
import { MOVEMENT_MODIFIER } from "../../../constants/enums";
import { Row } from "../../../constants/types";
import { assembleRows } from "../drawingUtils/drawShapes";

let count = 0;

let angles: number[] = [];
let angleV: number[] = [];

let perlinVal: number[] = [];
let perlinValV: number[] = [];

let savedPositions: any[] = [];
let savedRowPositions: any[] = [[], [], []];

for (let i = 0; i < canvasSettings.columnCount; i++) {
  angles.push(0);
  angleV.push(0.01 + i / 700);
  perlinVal.push(0);
  perlinValV.push(0.007 + i / 7000);
}
/**
 * Function to modify the movement of the circles and rectangles on the canvas.
 *
 * @param  {P5Instance} p5 - The p5 instance
 * @param  {MOVEMENT_MODIFIER} movementModifierState - Slice of the AnimationState that contains the movement modifier state
 * @param  {Row[]} rows - The rows we want to perform the manipulations on
 * @returns Row - The modified rows
 */

export function movementModifier(
  p5: P5Instance,
  movementModifierState: MOVEMENT_MODIFIER | undefined,
  rows: Row[]
): Row[] {
  switch (movementModifierState) {
    case MOVEMENT_MODIFIER.DYNAMIC_ROW_HEIGHT_PERLIN: {
      //Calculating values for Top Row
      let RectTopMinHeight = canvasSettings.circleSize * 2;
      let RectTopMaxHeight =
        canvasSettings.canvasHeight / 2 -
        canvasSettings.padding -
        canvasSettings.gap -
        canvasSettings.circleSize;

      let calcCircleMinTop = rows[0].rectangles[0].circles![1].y;
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

      //Calculating values for Mid Row
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

      //Calculating values for Bot Row
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
        rectangle.circles![1].y = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          calcCircleMinTop,
          calcCircleMaxTop
        );

        perlinVal[colIndex] += perlinValV[colIndex];
      });

      rows[0].gaps.forEach((gap, colIndex) => {
        gap.h = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          RectTopMinHeight,
          RectTopMaxHeight
        );
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

        rectangle.circles![0].y = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          Circle1MidMinY,
          Circle1MidMaxY
        );
        rectangle.circles![1].y = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          Circle2MidMaxY,
          Circle2MidMinY
        );
      });

      rows[1].gaps.forEach((gap, colIndex) => {
        gap.h = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          RectMidMaxHeight,
          RectMidMinHeight
        );
        gap.y = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          RectMidMinY,
          RectMidMaxY
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

        rectangle.circles![0].y = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          Circle1BotMinY,
          Circle1BotMaxY
        );
      });

      rows[2].gaps.forEach((gap, colIndex) => {
        gap.h = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          RectBotMinHeight,
          RectBotMaxHeight
        );
        gap.y = p5.map(
          p5.noise(perlinVal[colIndex]),
          0.25,
          0.75,
          RectBotMinY,
          RectBotMaxY
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

      let calcCircleMinTop = rows[0].rectangles[0].circles![1].y;
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
        rectangle.circles![1].y = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          calcCircleMinTop,
          calcCircleMaxTop
        );
        angles[colIndex] += angleV[colIndex];
      });

      rows[0].gaps.forEach((gap, colIndex) => {
        gap.h = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          RectTopMinHeight,
          RectTopMaxHeight
        );
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

        rectangle.circles![0].y = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          Circle1MidMinY,
          Circle1MidMaxY
        );
        rectangle.circles![1].y = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          Circle2MidMaxY,
          Circle2MidMinY
        );
        //angles[colIndex] += angleV[colIndex];
      });

      rows[1].gaps.forEach((gap, colIndex) => {
        gap.h = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          RectMidMaxHeight,
          RectMidMinHeight
        );
        gap.y = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          RectMidMinY,
          RectMidMaxY
        );
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

      let Circle2BotMinY = rows[2].rectangles[0].circles![1].y;
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

        rectangle.circles![0].y = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          Circle1BotMinY,
          Circle1BotMaxY
        );
        //angles[colIndex] += angleV[colIndex];
      });
      rows[2].gaps.forEach((gap, colIndex) => {
        gap.h = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          RectBotMinHeight,
          RectBotMaxHeight
        );
        gap.y = p5.map(
          p5.sin(angles[colIndex]),
          -1,
          1,
          RectBotMinY,
          RectBotMaxY
        );
      });
      return rows;
    }

    case MOVEMENT_MODIFIER.SINE_CIRCLES: {
      count += 0.02; //get things moving

      let calcMaxTop = rows[1].rectangles[0].circles![0].y;
      let calcMaxBot = rows[1].rectangles[0].circles![1].y;

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

        rectangle.circles![0].y = circleYSinTop;
        rectangle.circles![1].y = circleYSinBot;

        angles[rectIndex] += angleV[rectIndex];
      });

      return rows;
    }

    case MOVEMENT_MODIFIER.SPECTRUM: {
      const speed = 0.82; // speed 0-1
      const traceMin = -20; // min distance of following bubble
      const traceMax = 20; // max distance of following bubble

      let calcMaxTop = rows[0].rectangles[0].circles![0].y - traceMin * 5;
      let calcMaxBot = rows[2].rectangles[0].circles![1].y - traceMax * 5;

      rows[1].rectangles.forEach((rectangle, rectIndex) => {
        const r = Math.floor(Math.random() * 1001);
        const randomPositionY = p5.map(r, 0, 1000, calcMaxTop, calcMaxBot);

        let currentPosY = savedPositions[rectIndex];
        if (typeof currentPosY === "undefined") currentPosY = calcMaxBot;

        const currentSpeed = currentPosY / p5.map(speed, 0.1, 1, 500, 1);
        let newPositionY = currentPosY + currentSpeed;

        if (currentPosY >= calcMaxBot) newPositionY = randomPositionY;

        const trace = p5.map(
          newPositionY,
          calcMaxTop,
          calcMaxBot,
          traceMin,
          traceMax
        );

        rows[0].rectangles[rectIndex].circles![0].y = newPositionY;
        rows[0].rectangles[rectIndex].circles![1].y = newPositionY + trace;

        rectangle.circles![0].y = newPositionY + trace * 2;
        rectangle.circles![1].y = newPositionY + trace * 3;

        rows[2].rectangles[rectIndex].circles![0].y = newPositionY + trace * 4;
        rows[2].rectangles[rectIndex].circles![1].y = newPositionY + trace * 5;

        savedPositions[rectIndex] = newPositionY;
      });

      return rows;
    }

    case MOVEMENT_MODIFIER.FUNKY: {
      count += 0.04;
      const dynamicSpeed = 4 + p5.sin(count) * 2 * p5.cos(count * 2) * 5;

      rows.forEach((row, rowIndex) => {
        row.rectangles.forEach((rectangle, rectIndex) => {
          let currentPositionX = savedRowPositions[rowIndex][rectIndex];
          if (typeof currentPositionX === "undefined") {
            currentPositionX = rectangle.x;
          }

          // set different speed per row
          let newPositionX = currentPositionX + dynamicSpeed;
          if (rowIndex === 1) {
            newPositionX = currentPositionX + dynamicSpeed * 2;
          }
          if (rowIndex === 2) {
            newPositionX = currentPositionX + dynamicSpeed * 2.5;
          }

          // check if element goes beyond right side of canvas
          if (currentPositionX >= p5.width - canvasSettings.padding + 1) {
            newPositionX = canvasSettings.padding;
          }

          // check if element goes beyond left side of canvas
          if (currentPositionX <= -1) {
            newPositionX = p5.width - canvasSettings.padding;
          }

          rectangle.x = newPositionX;

          const circleOffset = canvasSettings.circleSize / 2;
          rectangle.circles![0].x = newPositionX + circleOffset;
          rectangle.circles![1].x = newPositionX + circleOffset;

          savedRowPositions[rowIndex][rectIndex] = newPositionX;
        });
      });

      return rows;
    }

    default: {
      return rows;
    }
  }
}
