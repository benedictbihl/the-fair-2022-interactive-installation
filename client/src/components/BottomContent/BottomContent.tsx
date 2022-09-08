import "./BottomContent.css";

import { AnimatePresence, motion } from "framer-motion";
import { FC, useEffect, useRef, useState } from "react";

import { AnimationModifierState } from "../../constants/types";

const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const BottomContent: FC<{
  nfcID?: number;
  numberOfInteractions: number;
  animationModifierState: AnimationModifierState;
}> = ({ nfcID, numberOfInteractions, animationModifierState }) => {
  const [currentAnimationModifierState, setCurrentAnimationModifierState] =
    useState(animationModifierState);
  const previousAnimationModifierState = usePrevious(
    currentAnimationModifierState
  );
  const [lastChangedModifier, setLastChangedModifier] = useState<any>();
  const numberOfInteractionsWithLeadingZeros =
    "0" + "0" + numberOfInteractions.toString();
  useEffect(() => {
    if (animationModifierState && previousAnimationModifierState) {
      Object.keys(animationModifierState).forEach((key) => {
        if (
          animationModifierState[key as keyof AnimationModifierState] !==
          previousAnimationModifierState[key as keyof AnimationModifierState]
        ) {
          setLastChangedModifier(key);
        }
      });

      setCurrentAnimationModifierState(animationModifierState);

      setTimeout(() => {
        setLastChangedModifier("");
      }, 6000);
    }
  }, [animationModifierState]);

  return (
    <div className="bottomContentWrapper">
      <p className="lastModified">
        Last modified by <span>{nfcID}</span>
      </p>
      <ul>
        <li
          className={`${
            lastChangedModifier === "movementModifier" && "orangeGlow"
          }`}
        >
          {animationModifierState.movementModifier
            ? animationModifierState.movementModifier
            : "..."}
        </li>
        <li
          className={`${
            lastChangedModifier === "colorModifier" && "orangeGlow"
          }`}
        >
          {animationModifierState.colorModifier
            ? animationModifierState.colorModifier
            : "..."}
        </li>
        <li
          className={`${
            lastChangedModifier === "pixelModifier" && "orangeGlow"
          }`}
        >
          {animationModifierState.pixelModifier
            ? animationModifierState.pixelModifier
            : "..."}
        </li>
        <li
          className={`${
            lastChangedModifier === "shapeModifier" && "orangeGlow"
          }`}
        >
          {animationModifierState.shapeModifier
            ? animationModifierState.shapeModifier
            : "..."}
        </li>
        <li
          className={`${
            lastChangedModifier === "additionalElementsModifier" && "orangeGlow"
          }`}
        >
          {animationModifierState.additionalElementsModifier
            ? animationModifierState.additionalElementsModifier
            : "..."}
        </li>
      </ul>
      <p className="totalMods">
        Total Modifications:{" "}
        {Array.from(
          String(numberOfInteractionsWithLeadingZeros.slice(-3)), //take only last 3 digits, that way > 10 the leading zeros are not shown
          Number
        ).map((digit, index) => (
          <span key={"wrapper" + digit + index} className="digit">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={digit + index}
                exit={{ y: "-100%", opacity: 0, position: "absolute" }}
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  ease: "easeOut",
                  duration: 0.5,
                }}
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          </span>
        ))}
      </p>
    </div>
  );
};

export default BottomContent;
