import { P5Instance } from "react-p5-wrapper";

import { MOVEMENT_MODIFIER } from "../../../constants/enums";
import { CanvasSettings, Row } from "../../../constants/types";

let count = 0;

export function movementModifier(
  p5: P5Instance,
  canvasSettings: CanvasSettings,
  movementModifierState: MOVEMENT_MODIFIER
): { topRow: Row; midRow: Row; botRow: Row } {
  let heightTopRow = 2;
  let yPosMidRow =
    heightTopRow * canvasSettings.circleSize + canvasSettings.gap;
  let heightMidRow = 4;
  let yPosBotRow =
    yPosMidRow + heightMidRow * canvasSettings.circleSize + canvasSettings.gap;
  let heightBotRow = 2;
  let xposBotRow = 0;
  let xposMidrow = 0;
  let xposTopRow = 0;

  switch (movementModifierState) {
    case MOVEMENT_MODIFIER.DYNAMIC_ROW_HEIGHT: {
      count += 0.02; //get things moving
      heightTopRow = 2.5 + p5.cos(count) / 2;
      yPosMidRow =
        heightTopRow * canvasSettings.circleSize + canvasSettings.gap;
      heightMidRow = 2.5 + p5.sin(count) / 2;
      yPosBotRow =
        yPosMidRow +
        heightMidRow * canvasSettings.circleSize +
        canvasSettings.gap;
      heightBotRow = 7.7 - heightMidRow - heightTopRow;

      return {
        topRow: {
          ypos: 0,
          xpos: 0,
          height: heightTopRow,
          topRadius: 0,
          botRadius: 200,
        },
        midRow: {
          ypos: yPosMidRow,
          xpos: 0,
          height: heightMidRow,
          topRadius: 200,
          botRadius: 200,
        },
        botRow: {
          ypos: yPosBotRow,
          xpos: 0,
          height: heightBotRow,
          topRadius: 200,
          botRadius: 0,
        },
      };
    }
    case MOVEMENT_MODIFIER.SINE_WAVE: {
      count += 0.03; //get things moving
      xposTopRow = 5 * p5.sin(count);
      xposMidrow = 5 * p5.cos(count);
      xposBotRow = 5 * p5.sin(count);
      return {
        topRow: {
          ypos: 0,
          xpos: xposTopRow,
          height: heightTopRow,
          topRadius: 0,
          botRadius: 200,
        },
        midRow: {
          ypos: yPosMidRow,
          xpos: xposMidrow,
          height: heightMidRow,
          topRadius: 200,
          botRadius: 200,
        },
        botRow: {
          ypos: yPosBotRow,
          xpos: xposBotRow,
          height: heightBotRow,
          topRadius: 200,
          botRadius: 0,
        },
      };
    }
    default: {
      return {
        topRow: {
          ypos: 0,
          xpos: 0,
          height: heightTopRow,
          topRadius: 0,
          botRadius: 200,
        },
        midRow: {
          ypos: yPosMidRow,
          xpos: 0,
          height: heightMidRow,
          topRadius: 200,
          botRadius: 200,
        },
        botRow: {
          ypos: yPosBotRow,
          xpos: 0,
          height: heightBotRow,
          topRadius: 200,
          botRadius: 0,
        },
      };
    }
  }
}
