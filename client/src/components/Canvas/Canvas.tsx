import "./Canvas.css";

import { FC, useEffect, useState } from "react";
import { P5Instance, ReactP5Wrapper } from "react-p5-wrapper";

import {
  ADDITIONAL_ELEMENTS_MODIFIER,
  COLOR_MODIFIER,
  COLORS,
  MOVEMENT_MODIFIER,
  SHAPE_MODIFIER,
} from "../../constants/enums";
import { AnimationModifierState, CanvasSettings } from "../../constants/types";
import { additionalElementsModifier } from "../../utils/p5/animationStateUtils/additionalElementsModifier";
import { drawRow } from "../../utils/p5/drawingUtils/drawShapes";

interface ICanvasProps {
  nfcID: number;
}
const Canvas: FC<ICanvasProps> = ({ nfcID }) => {
  const canvasSettings: CanvasSettings = {
    scaleFactor: 5,
    rowCount: 15,
    gap: 10,
    get padding() {
      return 4 * this.scaleFactor;
    },
    get circleSize() {
      return 12 * this.scaleFactor;
    },
    get canvasWidth() {
      return (
        this.padding * 2 +
        this.circleSize * (this.rowCount - 1) * 0.6 +
        this.circleSize
      );
    },
    canvasHeight: 540,
    circleOffset: 0.6,
  };

  let count = 0;

  const [animationModifierState, setAnimationModifierState] =
    useState<AnimationModifierState>({
      colorModifier: COLOR_MODIFIER.NO_MODIFIER,
      shapeModifier: SHAPE_MODIFIER.NO_MODIFIER,
      movementModifier: MOVEMENT_MODIFIER.NO_MODIFIER,
      additionalElementsModifier: ADDITIONAL_ELEMENTS_MODIFIER.NO_MODIFIER,
    });

  useEffect(() => {
    const values = Object.keys(COLORS);
    const randomColor = values[Math.floor(Math.random() * values.length)];
    // setColor(COLORS[randomColor as keyof typeof COLORS]);
  }, [nfcID]);

  function sketch(p5: P5Instance) {
    p5.setup = () => {
      p5.createCanvas(canvasSettings.canvasWidth, canvasSettings.canvasHeight);
      p5.noStroke();
      p5.background(0, 0, 0);
    };

    p5.draw = () => {
      let heightTopRow;
      let yPosMidRow;
      let heightMidRow;
      let yPosBotRow;
      let heightBotRow;
      if (
        animationModifierState.movementModifier ===
        MOVEMENT_MODIFIER.DYNAMIC_ROWS
      ) {
        count += 0.02;
        // Height, in terms of how many circles fit vertically into the row > min. 2

        heightTopRow = 2.5 + p5.cos(count) / 2;
        // Calculating yPos of the middle row
        yPosMidRow =
          heightTopRow * canvasSettings.circleSize + canvasSettings.gap;
        heightMidRow = 2.5 + p5.sin(count) / 2;
        // Calculating yPos of the bottom row
        yPosBotRow =
          yPosMidRow +
          heightMidRow * canvasSettings.circleSize +
          canvasSettings.gap;
        heightBotRow = 7.7 - heightMidRow - heightTopRow;
      } else {
        heightTopRow = 2;
        // Calculating yPos of the middle row
        yPosMidRow =
          heightTopRow * canvasSettings.circleSize + canvasSettings.gap;
        heightMidRow = 4;
        // Calculating yPos of the bottom row
        yPosBotRow =
          yPosMidRow +
          heightMidRow * canvasSettings.circleSize +
          canvasSettings.gap;
        heightBotRow = 2;
      }

      drawRow(p5, canvasSettings, animationModifierState, {
        ypos: 0,
        height: heightTopRow,
        topRadius: 0,
        botRadius: 200,
      });

      drawRow(p5, canvasSettings, animationModifierState, {
        ypos: yPosMidRow,
        height: heightMidRow,
        topRadius: 200,
        botRadius: 200,
      });

      drawRow(p5, canvasSettings, animationModifierState, {
        ypos: yPosBotRow,
        height: heightBotRow,
        topRadius: 200,
        botRadius: 0,
      });

      additionalElementsModifier(
        p5,
        canvasSettings,
        animationModifierState.additionalElementsModifier
      );
    };
  }

  return (
    <>
      <label htmlFor="colorworm">
        Color Worm
        <input
          type="checkbox"
          id="colorworm"
          onChange={(e) => {
            setAnimationModifierState({
              ...animationModifierState,
              additionalElementsModifier: e.target.checked
                ? ADDITIONAL_ELEMENTS_MODIFIER.SHOW_COLOR_WORM
                : ADDITIONAL_ELEMENTS_MODIFIER.NO_MODIFIER,
            });
          }}
        />
      </label>
      <label htmlFor="fillCircles">
        Fill Circles
        <input
          type="checkbox"
          id="fillCircles"
          onChange={(e) => {
            setAnimationModifierState({
              ...animationModifierState,
              colorModifier: e.target.checked
                ? COLOR_MODIFIER.FILL_SHAPES
                : COLOR_MODIFIER.NO_MODIFIER,
            });
          }}
        />
      </label>
      <label htmlFor="dynrowheights">
        Dynamic Row Heights
        <input
          type="checkbox"
          id="dynrowheights"
          onChange={(e) => {
            setAnimationModifierState({
              ...animationModifierState,
              movementModifier: e.target.checked
                ? MOVEMENT_MODIFIER.DYNAMIC_ROWS
                : MOVEMENT_MODIFIER.NO_MODIFIER,
            });
          }}
        />
      </label>

      <ReactP5Wrapper sketch={sketch} />
    </>
  );
};

export default Canvas;
