import "./DebugPanel.css";

import { FC, useCallback, useEffect, useState } from "react";

import {
  ADDITIONAL_ELEMENTS_MODIFIER,
  COLOR_MODIFIER,
  MOVEMENT_MODIFIER,
  PIXEL_MODIFIER,
  SHAPE_MODIFIER,
} from "../../constants/enums";
import { AnimationModifierState } from "../../constants/types";
interface IDebugPanelProps {
  nfcID?: number;
  animationModifierState: AnimationModifierState;
  setAnimationModifierState: (
    animationModifierState: AnimationModifierState
  ) => void;
}

const DebugPanel: FC<IDebugPanelProps> = ({
  nfcID,
  animationModifierState,
  setAnimationModifierState,
}) => {
  const [showPanel, setShowPanel] = useState(true);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "c") {
        if (
          confirm(
            "Clean local storage to remove all IDs and the animationState?"
          ) == true
        ) {
          localStorage.removeItem("IDModifierMap");
          localStorage.removeItem("animationModifierState");
          localStorage.removeItem("usedModifiers");
          // reload page to reset state
          window.location.reload();
        }
      } else if (event.key === "d") {
        setShowPanel(!showPanel);
      }
    },
    [showPanel]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return showPanel ? (
    <div className="debugPanel">
      <label htmlFor="shape">
        Shape Modifier
        <select
          id="shape"
          value={animationModifierState.shapeModifier}
          onChange={(e) => {
            setAnimationModifierState({
              ...animationModifierState,
              shapeModifier: e.target.value as SHAPE_MODIFIER,
            });
          }}
        >
          <option value={undefined}>No Modifier</option>
          {Object.values(SHAPE_MODIFIER).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="colorworm">
        Additional Elements Mod.
        <select
          id="colorworm"
          value={animationModifierState.additionalElementsModifier}
          onChange={(e) => {
            setAnimationModifierState({
              ...animationModifierState,
              additionalElementsModifier: e.target
                .value as ADDITIONAL_ELEMENTS_MODIFIER,
            });
          }}
        >
          <option value={undefined}>No Modifier</option>
          {Object.values(ADDITIONAL_ELEMENTS_MODIFIER).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="fillCircles">
        Color Mod.
        <select
          value={animationModifierState.colorModifier}
          id="fillCircles"
          onChange={(e) => {
            setAnimationModifierState({
              ...animationModifierState,
              colorModifier: e.target.value as COLOR_MODIFIER,
            });
          }}
        >
          <option value={undefined}>No Modifier</option>
          {Object.values(COLOR_MODIFIER).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="dynrowheights">
        Movement Mod.
        <select
          value={animationModifierState.movementModifier}
          id="dynrowheights"
          onChange={(e) => {
            setAnimationModifierState({
              ...animationModifierState,
              movementModifier: e.target.value as MOVEMENT_MODIFIER,
            });
          }}
        >
          <option value={undefined}>No Modifier</option>
          {Object.values(MOVEMENT_MODIFIER).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="shape-mod">
        Pixel Mod.
        <select
          value={animationModifierState.pixelModifier}
          id="shape-mod"
          onChange={(e) => {
            setAnimationModifierState({
              ...animationModifierState,
              pixelModifier: e.target.value as PIXEL_MODIFIER,
            });
          }}
        >
          <option value={undefined}>No Modifier</option>
          {Object.values(PIXEL_MODIFIER).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <br />
      <b>NFC TAG ID: {nfcID}</b>
    </div>
  ) : null;
};

export default DebugPanel;
