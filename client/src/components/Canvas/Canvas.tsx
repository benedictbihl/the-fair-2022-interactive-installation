import "./Canvas.css";

import { FC } from "react";
import { P5Instance, ReactP5Wrapper } from "react-p5-wrapper";

import { canvasSettings } from "../../constants/canvasSettings";
import { AnimationModifierState, Row } from "../../constants/types";
import { additionalElementsModifier } from "../../utils/p5/animationStateUtils/additionalElementsModifier";
import { colorModifier } from "../../utils/p5/animationStateUtils/colorModifier";
import { movementModifier } from "../../utils/p5/animationStateUtils/movementModifier";
import { pixelModifier } from "../../utils/p5/animationStateUtils/pixelModifier";
import { shapeModifier } from "../../utils/p5/animationStateUtils/shapeModifiers";
import { assembleRows, drawRows } from "../../utils/p5/drawingUtils/drawShapes";

const Canvas: FC<{ animationModifierState: AnimationModifierState }> = ({
  animationModifierState,
}) => {
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

      const heightMidRow =
        (canvasSettings.canvasHeight -
          canvasSettings.padding * 2 -
          canvasSettings.circleSize * 4 -
          canvasSettings.gap * 2) /
        canvasSettings.circleSize;

      const yPosBotRow =
        canvasSettings.canvasHeight -
        canvasSettings.padding * 2 -
        canvasSettings.circleSize * 2;

      const heightBotRow = 2;

      const topRowSkeleton: Row = {
        ypos: 0,
        xpos: 0,
        height: heightTopRow,
        topRadius: 0,
        botRadius: 200,
        rectangles: [],
        gaps: [],
      };

      const midRowSkeleton: Row = {
        ypos: yPosMidRow,
        xpos: 0,
        height: heightMidRow,
        topRadius: 200,
        botRadius: 200,
        rectangles: [],
        gaps: [],
      };

      const botRowSkeleton: Row = {
        ypos: yPosBotRow,
        xpos: 0,
        height: heightBotRow,
        topRadius: 200,
        botRadius: 0,
        rectangles: [],
        gaps: [],
      };

      // iterate over canvasSettings.columnCount and draw a rectangle and two circles for each column
      const rows = assembleRows(topRowSkeleton, midRowSkeleton, botRowSkeleton);

      //hand those rows to the movementModifier to add movement to circles and rectangles
      const rowsWithMovementMod = movementModifier(
        p5,
        animationModifierState.movementModifier,
        rows
      );

      //hand those rows with movement mods to the colorModifier to add color to circles and rectangles
      const rowsWithMovementAndColorMod = colorModifier(
        p5,
        animationModifierState.colorModifier,
        rowsWithMovementMod
      );

      const rowsWithMovementAndColorModAndShapeMod = shapeModifier(
        p5,
        animationModifierState.shapeModifier,
        rowsWithMovementAndColorMod
      );

      //do the actual drawing of the shapes
      drawRows(p5, rowsWithMovementAndColorModAndShapeMod);

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
      p5.clear(0, 0, 0, 0);

      additionalElementsModifier(
        p5,
        canvasSettings,
        animationModifierState.additionalElementsModifier
      );
    };
  }

  return (
    <>
      <div className="canvasWrapper">
        <ReactP5Wrapper sketch={sketch} />
        <ReactP5Wrapper sketch={additionalElements} />
      </div>
    </>
  );
};

export default Canvas;
