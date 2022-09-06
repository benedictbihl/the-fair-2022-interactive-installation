import { P5Instance } from "react-p5-wrapper";

import { canvasSettings } from "../../../constants/canvasSettings";
import { PIXEL_MODIFIER } from "../../../constants/enums";
let count = 0;

/**
 * Function to modify the canvas drawings on a pixel base by turning the Canvas contents into an image.
 *
 * @param  {P5Instance} p5 - The p5 instance
 * @param  {PIXEL_MODIFIER} pixelModifierState - Slice of the AnimationState that contains the pixel modifier state
 * @returns null - Nothing needs to be returned as the canvas is modified in place
 */
export function pixelModifier(
  p5: P5Instance,
  pixelModifierState: PIXEL_MODIFIER | undefined
) {
  document.querySelector("canvas")?.classList.remove();
  p5.drawingContext.setLineDash([]);

  switch (pixelModifierState) {
    case PIXEL_MODIFIER.WAVY_MODE: {
      let img = p5.get(0, 0, p5.width, p5.height);
      if (p5.frameCount % 5 === 0) count += 0.6; //get things moving
      let slices = canvasSettings.columnCount * 1.5;
      for (let i = 0; i < slices; i++) {
        p5.copy(
          img, // source image
          0, // source x
          (p5.height / slices) * i, // source y
          p5.width, // source width
          p5.height / slices, // source height
          p5.sin(count + i), // target x
          (p5.height / slices) * i, // target y
          p5.width, // target width
          p5.height / slices // target height
        );
      }
      break;
    }
    case PIXEL_MODIFIER.SLICED_CANVAS: {
      let img = p5.get(0, 0, p5.width, p5.height);

      p5.background(0, 0, 0);
      count += 0.03; //get things moving
      let slices = 8;
      for (let i = 0; i < slices; i++) {
        p5.copy(
          img, // source image
          0, // source x
          (p5.height / slices) * i, // source y
          p5.width, // source width
          p5.height / slices, // source height
          p5.sin(count + i) * 50, // target x
          (p5.height / slices) * i, // target y
          p5.width, // target width
          p5.height / slices // target height
        );
      }
      break;
    }
    case PIXEL_MODIFIER.DOTTED_LINES: {
      p5.drawingContext.setLineDash([8, 3, 3]);

      break;
    }
    case PIXEL_MODIFIER.INVERT_COLORS: {
      document.querySelector("canvas")?.classList.add("invert");
      break;
    }
    case PIXEL_MODIFIER.BLUR_FILTER: {
      document.querySelector("canvas")?.classList.add("blur");
      break;
    }
    default: {
      break;
    }
  }
}
