import {
  ADDITIONAL_ELEMENTS_MODIFIER,
  COLOR_MODIFIER,
  MOVEMENT_MODIFIER,
  PIXEL_MODIFIER,
  SHAPE_MODIFIER,
} from "../../../constants/enums";
import { AnimationModifierState } from "../../../constants/types";

const pickLeastUsedModifier = (usedModifiers: string[], values: string[]) => {
  //sort values by their number of occurences in usedModifiers
  const sortedValues = values.sort((a, b) => {
    return (
      usedModifiers.filter((modifier) => modifier === a).length -
      usedModifiers.filter((modifier) => modifier === b).length
    );
  });
  return sortedValues[0]; //return the value with the least occurences
};

/**
 * Functions picks a random modifier from a part of the modifier state based on the IDs already registered.
 * That way, we can avoid the same modifier being picked multiple times in a row
 * @param {Map} modifierMap - the modifierMap storing the modifiers and their IDs
 * @param {string[]} usedModifiers - the modifiers already used - we don't want to pick the same one twice in a row
 * @param {function} setUsedModifiers - the function to update the usedModifiers array
 * @returns any
 */
export const pickModifier = (
  modifierMap: Map<number, Partial<AnimationModifierState>>,
  usedModifiers: string[],
  setUsedModifiers: (usedModifiers: string[]) => void
): any => {
  //if its the first ID, or the 5th one for example
  if (modifierMap.size % 5 === 0) {
    const values = Object.keys(MOVEMENT_MODIFIER);
    const enumKey = pickLeastUsedModifier(usedModifiers, values);
    const updatedUsedModifiers = [...usedModifiers, enumKey];
    setUsedModifiers([...usedModifiers, enumKey]);
    localStorage.setItem("usedModifiers", JSON.stringify(updatedUsedModifiers));
    return {
      movementModifier:
        MOVEMENT_MODIFIER[enumKey as keyof typeof MOVEMENT_MODIFIER],
    };
  }

  //if its the second ID, or the 6th one for example
  if (modifierMap.size % 5 === 1) {
    const values = Object.keys(COLOR_MODIFIER);
    const enumKey = pickLeastUsedModifier(usedModifiers, values);
    const updatedUsedModifiers = [...usedModifiers, enumKey];
    setUsedModifiers([...usedModifiers, enumKey]);
    localStorage.setItem("usedModifiers", JSON.stringify(updatedUsedModifiers));
    return {
      colorModifier: COLOR_MODIFIER[enumKey as keyof typeof COLOR_MODIFIER],
    };
  }

  //if its the third ID, or the 7th one for example
  if (modifierMap.size % 5 === 2) {
    const values = Object.keys(SHAPE_MODIFIER);
    const enumKey = pickLeastUsedModifier(usedModifiers, values);
    const updatedUsedModifiers = [...usedModifiers, enumKey];
    setUsedModifiers([...usedModifiers, enumKey]);
    localStorage.setItem("usedModifiers", JSON.stringify(updatedUsedModifiers));
    return {
      shapeModifier: SHAPE_MODIFIER[enumKey as keyof typeof SHAPE_MODIFIER],
    };
  }

  //if its the fourth ID, or the 8th one for example
  if (modifierMap.size % 5 === 3) {
    const values = Object.keys(PIXEL_MODIFIER);
    const enumKey = pickLeastUsedModifier(usedModifiers, values);
    const updatedUsedModifiers = [...usedModifiers, enumKey];
    setUsedModifiers([...usedModifiers, enumKey]);
    localStorage.setItem("usedModifiers", JSON.stringify(updatedUsedModifiers));
    return {
      pixelModifier: PIXEL_MODIFIER[enumKey as keyof typeof PIXEL_MODIFIER],
    };
  }

  // if its the fifth ID, or the 9th one for example
  if (modifierMap.size % 5 === 4) {
    if (Math.random() < 0.7) {
      //70% chance of getting an additional element - we want this somewhat rare
      const values = Object.keys(ADDITIONAL_ELEMENTS_MODIFIER);
      const enumKey = pickLeastUsedModifier(usedModifiers, values);
      const updatedUsedModifiers = [...usedModifiers, enumKey];
      setUsedModifiers([...usedModifiers, enumKey]);
      localStorage.setItem(
        "usedModifiers",
        JSON.stringify(updatedUsedModifiers)
      );
      return {
        additionalElementsModifier:
          ADDITIONAL_ELEMENTS_MODIFIER[
            enumKey as keyof typeof ADDITIONAL_ELEMENTS_MODIFIER
          ],
      };
    } else {
      const values = Object.keys(MOVEMENT_MODIFIER);
      const enumKey = pickLeastUsedModifier(usedModifiers, values);
      const updatedUsedModifiers = [...usedModifiers, enumKey];
      setUsedModifiers([...usedModifiers, enumKey]);
      localStorage.setItem(
        "usedModifiers",
        JSON.stringify(updatedUsedModifiers)
      );
      return {
        movementModifier:
          MOVEMENT_MODIFIER[enumKey as keyof typeof MOVEMENT_MODIFIER],
      };
    }
  }
};
