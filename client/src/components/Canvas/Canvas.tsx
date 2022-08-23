import "./Canvas.css";

import { FC, useState } from "react";
import { P5Instance, ReactP5Wrapper } from "react-p5-wrapper";

import {
  ADDITIONAL_ELEMENTS_MODIFIER,
  COLOR_MODIFIER,
  MOVEMENT_MODIFIER,
  PIXEL_MODIFIER,
} from "../../constants/enums";
import {
  AnimationModifierState,
  CanvasSettings,
  Row,
} from "../../constants/types";
import { additionalElementsModifier } from "../../utils/p5/animationStateUtils/additionalElementsModifier";
import { colorModifier } from "../../utils/p5/animationStateUtils/colorModifier";
import { movementModifier } from "../../utils/p5/animationStateUtils/movementModifier";
import { pixelModifier } from "../../utils/p5/animationStateUtils/pixelModifier";
import { assembleRows, drawRows } from "../../utils/p5/drawingUtils/drawShapes";
import DebugPanel from "../DebugPanel";

export const canvasSettings: CanvasSettings = {
  scaleFactor: 5,
  columnCount: 15,
  rowCount: 3,
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
      this.circleSize * (this.columnCount - 1) * 0.6 +
      this.circleSize
    );
  },
  canvasHeight: 540,
  circleOffset: 0.6,
};

const Canvas: FC<{ nfcID: number }> = ({ nfcID }) => {
  const [animationModifierState, setAnimationModifierState] =
    useState<AnimationModifierState>({
      colorModifier: COLOR_MODIFIER.NO_MODIFIER,
      pixelModifier: PIXEL_MODIFIER.NO_MODIFIER,
      movementModifier: MOVEMENT_MODIFIER.DYNAMIC_ROW_HEIGHT,
      additionalElementsModifier: ADDITIONAL_ELEMENTS_MODIFIER.NO_MODIFIER,
    });

  // draw the base sketch
  function sketch(p5: P5Instance) {
    p5.setup = () => {
      p5.createCanvas(canvasSettings.canvasWidth, canvasSettings.canvasHeight);
      p5.noStroke();
    };

    p5.draw = () => {
      p5.background(0, 0, 0);

      // set up the row skeletons without rectangles or circles
      const heightTopRow = 2;
      const yPosMidRow =
        heightTopRow * canvasSettings.circleSize + canvasSettings.gap;
      const heightMidRow = 4;
      const yPosBotRow =
        yPosMidRow +
        heightMidRow * canvasSettings.circleSize +
        canvasSettings.gap;
      const heightBotRow = 2;

      const topRowSkeleton: Row = {
        ypos: 0,
        xpos: 0,
        height: heightTopRow,
        topRadius: 0,
        botRadius: 200,
        rectangles: [],
      };

      const midRowSkeleton: Row = {
        ypos: yPosMidRow,
        xpos: 0,
        height: heightMidRow,
        topRadius: 200,
        botRadius: 200,
        rectangles: [],
      };

      const botRowSkeleton: Row = {
        ypos: yPosBotRow,
        xpos: 0,
        height: heightBotRow,
        topRadius: 200,
        botRadius: 0,
        rectangles: [],
      };

      // iterate over canvasSettings.columnCount and draw a rectangle and two circles for each column
      const rows = assembleRows(
        canvasSettings,
        topRowSkeleton,
        midRowSkeleton,
        botRowSkeleton
      );

      //hand those rows to the movementModifier to add movement to circles and rectangles
      const rowsWithMovementMod = movementModifier(
        p5,
        canvasSettings,
        animationModifierState.movementModifier,
        rows
      );

      //hand those rows with movement mods to the colorModifier to add color to circles and rectangles
      const rowsWithMovementAndColorMod = colorModifier(
        animationModifierState.colorModifier,
        rowsWithMovementMod
      );

      //do the actual drawing of the shapes
      drawRows(p5, rowsWithMovementAndColorMod);

      //this modifier does not draw elements directly, but works on a pixel base
      // -> we only call it after the drawing is finished
      pixelModifier(p5, animationModifierState.pixelModifier);
    };
  }

  // add additional elements like the colorworm on top of the base sketch
  function additionalElements(p5: P5Instance) {
    p5.setup = () => {
      p5.createCanvas(canvasSettings.canvasWidth, canvasSettings.canvasHeight);
      p5.noStroke();
      p5.clear(0, 0, 0, 0); // transparent background as this canvas lies on top of the base sketch
    };

    p5.draw = () => {
      additionalElementsModifier(
        p5,
        canvasSettings,
        animationModifierState.additionalElementsModifier
      );
    };
  }

  return (
    <>
      <DebugPanel
        nfcID={nfcID}
        animationModifierState={animationModifierState}
        setAnimationModifierState={setAnimationModifierState}
      />
      <div className="canvasWrapper">
        <ReactP5Wrapper sketch={sketch} />
        <ReactP5Wrapper sketch={additionalElements} />
      </div>
    </>
  );
};

export default Canvas;
