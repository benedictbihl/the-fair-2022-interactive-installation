import { COLOR_MODIFIER, COLORS } from "../../../constants/enums";
import {
  CanvasSettings,
  CircleModification,
  ShapeModification,
} from "../../../constants/types";

let topRowColorMod = new Map<string, ShapeModification>();
let midRowColorMod = new Map<string, ShapeModification>();
let botRowColorMod = new Map<string, ShapeModification>();

export function colorModifier(
  canvasSettings: CanvasSettings,
  colorModifierState: COLOR_MODIFIER
): {
  topRowColorMod: Map<string, ShapeModification>;
  midRowColorMod: Map<string, ShapeModification>;
  botRowColorMod: Map<string, ShapeModification>;
} {
  switch (colorModifierState) {
    case COLOR_MODIFIER.FILL_CIRCLES: {
      const values = Object.keys(COLORS);
      // for each row
      for (let i = 0; i < canvasSettings.columnCount; i++) {
        // for each position in the row (only concerns circles)
        for (let j = 0; j < 2; j++) {
          const colors = new Array<Partial<CircleModification> | null>(3) //pick 3 random colors
            .fill(null)
            .map(() => values[Math.floor(Math.random() * values.length)]);

          // set colors for each row, only if they are not already set (to avoid flickering on each frame)
          if (!topRowColorMod.get(JSON.stringify({ pos: j, row: i }))) {
            topRowColorMod.set(JSON.stringify({ pos: j, row: i }), {
              circle: { color: COLORS[colors[0] as keyof typeof COLORS] },
            });
            midRowColorMod.set(JSON.stringify({ pos: j, row: i }), {
              circle: { color: COLORS[colors[1] as keyof typeof COLORS] },
            });
            botRowColorMod.set(JSON.stringify({ pos: j, row: i }), {
              circle: { color: COLORS[colors[2] as keyof typeof COLORS] },
            });
          }
        }
      }
      return {
        topRowColorMod,
        midRowColorMod,
        botRowColorMod,
      };
    }
    case COLOR_MODIFIER.EMOJIS: {
      topRowColorMod.clear();
      midRowColorMod.clear();
      botRowColorMod.clear();
      // for each row
      for (let i = 0; i < canvasSettings.columnCount; i++) {
        // for each position in the row (only concerns circles)
        for (let j = 0; j < 2; j++) {
          if (i === 4 && j === 1)
            topRowColorMod.set(JSON.stringify({ pos: j, row: i }), {
              circle: { emoji: "🤔" },
            });
          if (i === 12 && j === 0)
            midRowColorMod.set(JSON.stringify({ pos: j, row: i }), {
              circle: { emoji: "🤨" },
            });
          if (i === 8 && j === 1)
            botRowColorMod.set(JSON.stringify({ pos: j, row: i }), {
              circle: { emoji: "🤯" },
            });
        }
      }

      return {
        topRowColorMod,
        midRowColorMod,
        botRowColorMod,
      };
    }
    default: {
      topRowColorMod.clear();
      midRowColorMod.clear();
      botRowColorMod.clear();
      return {
        topRowColorMod,
        midRowColorMod,
        botRowColorMod,
      };
    }
  }
}
