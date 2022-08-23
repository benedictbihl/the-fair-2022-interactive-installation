import { P5Instance } from "react-p5-wrapper";

import { PIXEL_MODIFIER } from "../../../constants/enums";

/**
 * Function to modify the canvas drawings on a pixel base by turning the Canvas contents into an image.
 *
 * @param  {P5Instance} p5 - The p5 instance
 * @param  {PIXEL_MODIFIER} pixelModifierState - Slice of the AnimationState that contains the pixel modifier state
 * @returns null - Nothing needs to be returned as the canvas is modified in place
 */
export function pixelModifier(
  p5: P5Instance,
  pixelModifierState: PIXEL_MODIFIER
) {
  switch (pixelModifierState) {
    case PIXEL_MODIFIER.PIXEL_SHIFT:
      applyPixelShift(p5);
      break;
    default:
      return null;
  }
}

const applyPixelShift = (p5: P5Instance) => {
  let img = p5.get(0, 0, p5.width, p5.height);

  // Tell p5 we're working with pixels
  img.loadPixels();

  const newPixels = [];

  // Loop through the pixels
  for (let y = 0; y < p5.height; y++) {
    for (let x = 0; x < p5.width; x++) {
      // Get the index for our current pixel
      const index = (y * p5.width + x) * 4;

      // And the index for one pixel to the right
      let nextIndex = (y * p5.width + x) * 4 + 4 * p5.int(p5.random(-3, 3));
      nextIndex = nextIndex % (p5.width * p5.height * 4);

      const r = img.pixels[nextIndex + 0];
      const g = img.pixels[nextIndex + 1];
      const b = img.pixels[nextIndex + 2];

      newPixels.push(r, g, b, 255);
    }
  }

  for (let i = 0; i < newPixels.length; i++) {
    img.pixels[i] = newPixels[i];
  }

  // We're finished working with pixels
  img.updatePixels();

  // Draw the images
  p5.image(img, 0, 0);
};
