import { P5Instance } from "react-p5-wrapper";

import { MOVEMENT_MODIFIER } from "../../../constants/enums";
import { CanvasSettings } from "../../../constants/types";

export function additionalElementsModifier(
  p5: P5Instance,
  canvasSettings: CanvasSettings,
  additionalElementsModifierState: MOVEMENT_MODIFIER
) {
  switch (additionalElementsModifierState) {
    case MOVEMENT_MODIFIER.DYNAMIC_ROWS:
      // return dynamicRows(p5, canvasSettings);
      break;
    default:
      return null;
  }
}
