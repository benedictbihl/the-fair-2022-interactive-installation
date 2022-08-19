import { P5Instance } from "react-p5-wrapper";

import { ADDITIONAL_ELEMENTS_MODIFIER } from "../../../constants/enums";
import { CanvasSettings } from "../../../constants/types";

let xoff1 = 0;
let xoff2 = 1000;
let sinGrow = 0;

export function additionalElementsModifier(
  p5: P5Instance,
  canvasSettings: CanvasSettings,
  additionalElementsModifierState: ADDITIONAL_ELEMENTS_MODIFIER
) {
  switch (additionalElementsModifierState) {
    case ADDITIONAL_ELEMENTS_MODIFIER.SHOW_COLOR_WORM:
      return drawColorWorm(p5, canvasSettings);
    default:
      return null;
  }
}

function drawColorWorm(p5: P5Instance, canvasSettings: CanvasSettings) {
  const x = p5.map(
    p5.noise(xoff1),
    0,
    1,
    canvasSettings.padding + canvasSettings.circleSize / 2,
    p5.width - (canvasSettings.padding + canvasSettings.circleSize / 2)
  );
  const y = p5.map(
    p5.noise(xoff2),
    0,
    1,
    canvasSettings.padding + canvasSettings.circleSize / 2,
    p5.height - (canvasSettings.padding - canvasSettings.circleSize / 2)
  );

  p5.noStroke();
  p5.fill(p5.random(255), p5.random(255), p5.random(255));
  //TODO Random fill shall pick between the 5 Brand Colors
  p5.ellipse(y, x, canvasSettings.circleSize * p5.sin(sinGrow));
  //TODO z-index of color worm needs to be fixed. Needs to stay on top of tnhe grid

  xoff1 += 0.01;
  xoff2 += 0.01;

  sinGrow += 0.1;
}
