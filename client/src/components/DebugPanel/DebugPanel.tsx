import "./DebugPanel.css";

import { FC, useCallback, useEffect, useState } from "react";

import {
  ADDITIONAL_ELEMENTS_MODIFIER,
  COLOR_MODIFIER,
  MOVEMENT_MODIFIER,
  PIXEL_MODIFIER,
} from "../../constants/enums";
import { AnimationModifierState } from "../../constants/types";
interface IDebugPanelProps {
  nfcID: number;
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
        if (confirm("Clean local storage to removed all IDs?") == true) {
          localStorage.removeItem("connected_IDs");
        }
      } else if (event.key === "d") {
        setShowPanel(!showPanel);
      }
    },
    [showPanel]
  );

  useEffect(() => {
    console.log(showPanel);
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return showPanel ? (
    <div className="debugPanel">
      <label htmlFor="colorworm">
        Additional Elements Mod.
        <select
          id="colorworm"
          value={animationModifierState.additionalElementsModifier}
          onChange={(e) => {
            console.log(e.target.value);
            setAnimationModifierState({
              ...animationModifierState,
              additionalElementsModifier: e.target
                .value as ADDITIONAL_ELEMENTS_MODIFIER,
            });
          }}
        >
          <option value={ADDITIONAL_ELEMENTS_MODIFIER.NO_MODIFIER}>
            No Modifier
          </option>
          <option value={ADDITIONAL_ELEMENTS_MODIFIER.SHOW_COLOR_WORM}>
            Show Color Worm
          </option>
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
          <option value={COLOR_MODIFIER.NO_MODIFIER}>No Modifier</option>
          <option value={COLOR_MODIFIER.FILL_CIRCLES}>Fill Circles</option>
          <option value={COLOR_MODIFIER.EMOJIS}>Emojis</option>
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
          <option value={MOVEMENT_MODIFIER.NO_MODIFIER}>No Modifier</option>
          <option value={MOVEMENT_MODIFIER.DYNAMIC_ROW_HEIGHT}>
            Dynamic Row Heights
          </option>
          <option value={MOVEMENT_MODIFIER.SINE_WAVE}> Sine Wave</option>
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
          <option value={PIXEL_MODIFIER.NO_MODIFIER}>No Modifier</option>
          <option value={PIXEL_MODIFIER.PIXEL_SHIFT}>Pixel Shifting</option>
        </select>
      </label>
      <br />
      <b>NFC TAG ID: {nfcID}</b>
    </div>
  ) : null;
};

export default DebugPanel;
