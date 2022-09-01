import { P5Instance } from "react-p5-wrapper";
import ShadeGenerator, { Shade } from "shade-generator";

import {
  ADDITIONAL_ELEMENTS_MODIFIER,
  COLORS,
} from "../../../../constants/enums";
import { CanvasSettings } from "../../../../constants/types";
import { Ball, drawCollidingCircles } from "./circleCollision";
import { drawColorWorm } from "./colorWorm";

/**
 * Function to add elements to the scene in a separate canvas to the main one.
 *
 * @param  {P5Instance} p5 - The p5 instance
 * @param  {CanvasSettings} canvasSettings - The canvas settings containing different base values we base our calculations on
 * @param  {ADDITIONAL_ELEMENTS_MODIFIER} additionalElementsModifierState - Slice of the AnimationState that contains the additional elements modifier state
 * @returns null - Nothing needs to be returned as we only draw on a new canvas
 */
export function additionalElementsModifier(
  p5: P5Instance,
  canvasSettings: CanvasSettings,
  additionalElementsModifierState: ADDITIONAL_ELEMENTS_MODIFIER | undefined
) {
  switch (additionalElementsModifierState) {
    case ADDITIONAL_ELEMENTS_MODIFIER.SHOW_COLOR_WORM: {
      drawColorWorm(p5, canvasSettings, additionalElementsModifierState); // draw the color worm
      break;
    }
    case ADDITIONAL_ELEMENTS_MODIFIER.CIRCLE_COLLIDE: {
      let balls = [new Ball(100, 400, 20), new Ball(50, 300, 80)];
      drawCollidingCircles(p5, balls);
      break;
    }
    default:
      break;
  }
}
