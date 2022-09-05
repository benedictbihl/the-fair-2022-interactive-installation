import "./App.css";

import { useEffect, useState } from "react";
import io from "socket.io-client";

import Canvas from "./components/Canvas";
import DebugPanel from "./components/DebugPanel";
import { AnimationModifierState } from "./constants/types";
import { pickModifier } from "./utils/p5/randomizing/pickModifier";

const hostname = window.location.hostname;
const socket = io("http://" + hostname + ":8080", {
  transports: ["websocket"],
});

const App = () => {
  const [animationModifierState, setAnimationModifierState] =
    useState<AnimationModifierState>(
      JSON.parse(localStorage.getItem("animationModifierState") ?? "{}")
    );

  const [IDModifierMap, setIDModifierMap] = useState<
    Map<number, Partial<AnimationModifierState>>
  >(new Map(JSON.parse(localStorage.getItem("IDModifierMap") ?? "[]")));

  const [usedModifiers, setUsedModifiers] = useState(
    JSON.parse(localStorage.getItem("usedModifiers") ?? "[]")
  );

  const [currentID, setCurrentID] = useState<number | undefined>();
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  // save the state to local storage
  useEffect(() => {
    socket.on("message", function (data: number) {
      console.log("Received an ID from the server: ", data);
      setCurrentID(data);

      //go here if the IDs has already been mapped to a modifier
      if (IDModifierMap?.get(data)) {
        console.log("known ID, assigend mod: ", IDModifierMap.get(data));
        let modifierKey = Object.keys(IDModifierMap!.get(data)!)[0];
        // if the modifier to be applied is already set, remove it and set that part of the state to undefined
        // this way, people can turn their modifier off and on again
        if (
          animationModifierState[
            modifierKey as keyof AnimationModifierState
          ] ===
          IDModifierMap!.get(data)![modifierKey as keyof AnimationModifierState]
        ) {
          setAnimationModifierState({
            ...animationModifierState,
            [modifierKey]: undefined,
          });
        } else {
          setAnimationModifierState({
            ...animationModifierState,
            ...IDModifierMap.get(data),
          });
        }
      } else {
        // go here if the IDs has not been mapped to a modifier yet
        const newModifier = pickModifier(
          IDModifierMap,
          usedModifiers,
          setUsedModifiers
        );
        console.log("new ID, assigned mod: ", newModifier);
        setIDModifierMap((prev) =>
          new Map(prev).set(data, {
            ...newModifier,
          })
        );
        setAnimationModifierState({
          ...animationModifierState,
          ...newModifier,
        });
      }
    });

    localStorage.setItem(
      "IDModifierMap",
      JSON.stringify(Array.from(IDModifierMap.entries()))
    );
    localStorage.setItem(
      "animationModifierState",
      JSON.stringify(animationModifierState)
    );

    return () => {
      socket.off("message");
    };
  }, [IDModifierMap, animationModifierState]);

  return (
    <>
      <DebugPanel
        nfcID={currentID}
        animationModifierState={animationModifierState}
        setAnimationModifierState={setAnimationModifierState}
      />
      <Canvas animationModifierState={animationModifierState} />
    </>
  );
};

export default App;
