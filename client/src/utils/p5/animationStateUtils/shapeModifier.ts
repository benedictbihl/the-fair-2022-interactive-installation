import { P5Instance } from "react-p5-wrapper";

import { SHAPE_MODIFIER } from "../../../constants/enums";

export function shapeModifier(
  p5: P5Instance,
  shapeModifierState: SHAPE_MODIFIER
) {
  switch (shapeModifierState) {
    case SHAPE_MODIFIER.PIXEL_SHIFT:
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
