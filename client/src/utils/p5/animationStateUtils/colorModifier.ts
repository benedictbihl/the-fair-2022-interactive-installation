import { COLOR_MODIFIER, COLORS } from "../../../constants/enums";
import { CanvasSettings } from "../../../constants/types";

let topRowColors = new Map<number, COLORS>();
let midRowColors = new Map<number, COLORS>();
let botRowColors = new Map<number, COLORS>();

export function colorModifier(
  canvasSettings: CanvasSettings,
  colorModifierState: COLOR_MODIFIER
): {
  topRowColors: Map<number, COLORS>;
  midRowColors: Map<number, COLORS>;
  botRowColors: Map<number, COLORS>;
} {
  switch (colorModifierState) {
    case COLOR_MODIFIER.FILL_SHAPES: {
      const values = Object.keys(COLORS);
      for (let i = 0; i < canvasSettings.rowCount; i++) {
        const randomColor = values[Math.floor(Math.random() * values.length)];
        !topRowColors.get(i) &&
          topRowColors.set(i, COLORS[randomColor as keyof typeof COLORS]);
        !midRowColors.get(i) &&
          midRowColors.set(i, COLORS[randomColor as keyof typeof COLORS]);
        !botRowColors.get(i) &&
          botRowColors.set(i, COLORS[randomColor as keyof typeof COLORS]);
      }

      return {
        topRowColors,
        midRowColors,
        botRowColors,
      };
    }
    default:
      topRowColors.clear();
      midRowColors.clear();
      botRowColors.clear();
      return {
        topRowColors,
        midRowColors,
        botRowColors,
      };
  }
}
