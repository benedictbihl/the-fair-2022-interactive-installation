import "./Canvas.css";

import { FC } from "react";
import { P5Instance, ReactP5Wrapper } from "react-p5-wrapper";

import { ReactComponent as CutMark } from "../../assets/icons/cutmark.svg";
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

      if (animationModifierState.movementModifier === "Funky") {
        const black = p5.color("rgba(0,0,0, 1)");
        const transparent = p5.color("rgba(0,0,0, 0)");
        const width = 200;
        const height = p5.height;
        setGradient(p5, 0, 0, width, height, black, transparent);
        setGradient(p5, p5.width - width, 0, width, height, transparent, black);
      }
    };
  }

  // add additional elements like the colorworm on top of the base sketch
  function additionalElements(p5: P5Instance) {
    p5.setup = () => {
      p5.createCanvas(window.innerWidth, window.innerHeight);
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

  function setGradient(
    p5: P5Instance,
    x: number,
    y: number,
    w: number,
    h: number,
    c1: any,
    c2: any
  ) {
    p5.push();
    p5.noFill();

    for (let i = x; i <= x + w; i++) {
      let inter = p5.map(i, x, x + w, 0, 1);
      let c = p5.lerpColor(c1, c2, inter);
      p5.stroke(c);
      p5.line(i, y, i, y + h);
    }
    p5.pop();
  }

  return (
    <>
      <div
        style={{
          width: canvasSettings.canvasWidth + 63,
          height: canvasSettings.canvasHeight + 63,
        }}
        className="cutMarksWrapper"
      >
        <CutMark className="cutmark topleft" />
        <CutMark className="cutmark topright" />
        <CutMark className="cutmark bottomleft" />
        <CutMark className="cutmark bottomright" />
      </div>
      <ReactP5Wrapper sketch={sketch}></ReactP5Wrapper>
      <ReactP5Wrapper sketch={additionalElements} />
    </>
  );
};

export default Canvas;
