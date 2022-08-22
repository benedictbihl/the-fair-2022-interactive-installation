import "./Canvas.css";

import { FC, useState } from "react";
import { P5Instance, ReactP5Wrapper } from "react-p5-wrapper";

import {
  ADDITIONAL_ELEMENTS_MODIFIER,
  COLOR_MODIFIER,
  MOVEMENT_MODIFIER,
  SHAPE_MODIFIER,
} from "../../constants/enums";
import { AnimationModifierState, CanvasSettings } from "../../constants/types";
import { additionalElementsModifier } from "../../utils/p5/animationStateUtils/additionalElementsModifier";
import { colorModifier } from "../../utils/p5/animationStateUtils/colorModifier";
import { movementModifier } from "../../utils/p5/animationStateUtils/movementModifier";
import { shapeModifier } from "../../utils/p5/animationStateUtils/shapeModifier";
import { drawRow } from "../../utils/p5/drawingUtils/drawShapes";
import DebugPanel from "../DebugPanel";

const canvasSettings: CanvasSettings = {
  scaleFactor: 5,
  columnCount: 15,
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
      shapeModifier: SHAPE_MODIFIER.NO_MODIFIER,
      movementModifier: MOVEMENT_MODIFIER.DYNAMIC_ROW_HEIGHT,
      additionalElementsModifier: ADDITIONAL_ELEMENTS_MODIFIER.NO_MODIFIER,
    });

  // draw the base sketch
  function sketch(p5: P5Instance) {
    p5.setup = () => {
      p5.createCanvas(canvasSettings.canvasWidth, canvasSettings.canvasHeight);

      p5.noStroke();
      p5.background(0, 0, 0);
    };

    p5.draw = () => {
      p5.background(0, 0, 0); // Clear the canvas

      const { topRowPositionMod, midRowPositionMod, botRowPositionMod } =
        movementModifier(
          p5,
          canvasSettings,
          animationModifierState.movementModifier
        );

      const { topRowColorMod, midRowColorMod, botRowColorMod } = colorModifier(
        canvasSettings,
        animationModifierState.colorModifier
      );

      drawRow(p5, canvasSettings, topRowColorMod, {
        ...topRowPositionMod,
      });

      drawRow(p5, canvasSettings, midRowColorMod, {
        ...midRowPositionMod,
      });

      drawRow(p5, canvasSettings, botRowColorMod, {
        ...botRowPositionMod,
      });

      shapeModifier(p5, animationModifierState.shapeModifier);
    };
  }

  // add additional elements like the colorworm on top
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
