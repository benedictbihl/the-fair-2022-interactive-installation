import {
  ADDITIONAL_ELEMENTS_MODIFIER,
  COLOR_MODIFIER,
  MOVEMENT_MODIFIER,
  PIXEL_MODIFIER,
  SHAPE_MODIFIER,
} from "../../../constants/enums";

/**
 * Functions picks a random modifier from a part of the modifier state based on the IDs already registered.
 * That way, we can avoid the same modifier being picked multiple times in a row
 * @param  {number} mapSize - the length of the map storing the IDs
 * @returns any
 */
export const pickModifier = (mapSize: number): any => {
  //if its the first ID, or the 5th one for example
  if (mapSize % 5 === 0) {
    console.log("first");
    const values = Object.keys(COLOR_MODIFIER);
    const enumKey = values[Math.floor(Math.random() * values.length)];
    return {
      colorModifier: COLOR_MODIFIER[enumKey as keyof typeof COLOR_MODIFIER],
    };
  }

  //if its the second ID, or the 6th one for example
  if (mapSize % 5 === 1) {
    const values = Object.keys(MOVEMENT_MODIFIER);
    const enumKey = values[Math.floor(Math.random() * values.length)];
    return {
      movementModifier:
        MOVEMENT_MODIFIER[enumKey as keyof typeof MOVEMENT_MODIFIER],
    };
  }

  //if its the third ID, or the 7th one for example
  if (mapSize % 5 === 2) {
    const values = Object.keys(PIXEL_MODIFIER);
    const enumKey = values[Math.floor(Math.random() * values.length)];
    return {
      pixelModifier: PIXEL_MODIFIER[enumKey as keyof typeof PIXEL_MODIFIER],
    };
  }

  //if its the fourth ID, or the 8th one for example
  if (mapSize % 5 === 3) {
    const values = Object.keys(ADDITIONAL_ELEMENTS_MODIFIER);
    const enumKey = values[Math.floor(Math.random() * values.length)];
    return {
      additionalElementsModifier:
        ADDITIONAL_ELEMENTS_MODIFIER[
          enumKey as keyof typeof ADDITIONAL_ELEMENTS_MODIFIER
        ],
    };
  }

  // if its the fifth ID, or the 9th one for example
  if (mapSize % 5 === 4) {
    const values = Object.keys(SHAPE_MODIFIER);
    const enumKey = values[Math.floor(Math.random() * values.length)];
    return {
      shapeModifier: SHAPE_MODIFIER[enumKey as keyof typeof SHAPE_MODIFIER],
    };
  }
};
