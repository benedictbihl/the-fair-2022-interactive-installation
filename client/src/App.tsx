import "./App.css";

import { useEffect, useState } from "react";
import io from "socket.io-client";

import BottomContent from "./components/BottomContent";
import Canvas from "./components/Canvas";
import DebugPanel from "./components/DebugPanel";
import TopContent from "./components/TopContent";
import Artists from "./constants/artists.json";
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

  const [IDArtistNameMap, setIDArtistNameMap] = useState<Map<number, string>>(
    new Map(JSON.parse(localStorage.getItem("IDArtistNameMap") ?? "[]"))
  );

  const [usedModifiers, setUsedModifiers] = useState(
    JSON.parse(localStorage.getItem("usedModifiers") ?? "[]")
  );

  const [numberOfInteractions, setNumberOfInteractions] = useState(
    parseInt(localStorage.getItem("numberOfInteractions") ?? "0")
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

  useEffect(() => {
    // socket-io stuff
    socket.on("message", function (data: number) {
      console.log("Received an ID from the server: ", data);
      setCurrentID(data);
      setNumberOfInteractions(
        (numberOfInteractions) => numberOfInteractions + 1
      );

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
        setIDArtistNameMap((prev) =>
          new Map(prev).set(data, Artists[IDModifierMap.size].Name)
        );
      }
    });

    // save the state to local storage
    localStorage.setItem(
      "IDModifierMap",
      JSON.stringify(Array.from(IDModifierMap.entries()))
    );
    localStorage.setItem(
      "IDArtistNameMap",
      JSON.stringify(Array.from(IDArtistNameMap.entries()))
    );
    localStorage.setItem(
      "animationModifierState",
      JSON.stringify(animationModifierState)
    );
    localStorage.setItem(
      "numberOfInteractions",
      JSON.stringify(numberOfInteractions)
    );

    return () => {
      socket.off("message");
    };
  }, [IDModifierMap, animationModifierState]);

  //reset the additional elements modifier after 5 minutes
  useEffect(() => {
    let timer1 = setTimeout(
      () =>
        setAnimationModifierState((animationModifierState) => ({
          ...animationModifierState,
          additionalElementsModifier: undefined,
        })),
      5 * 60 * 1000
    );
    return () => {
      clearTimeout(timer1);
    };
  }, [animationModifierState.additionalElementsModifier]);

  return (
    <>
      <DebugPanel
        nfcID={currentID}
        animationModifierState={animationModifierState}
        setAnimationModifierState={setAnimationModifierState}
      />
      <TopContent />
      <Canvas animationModifierState={animationModifierState} />
      <BottomContent
        currentArtistName={currentID ? IDArtistNameMap.get(currentID) : ""}
        animationModifierState={animationModifierState}
        numberOfInteractions={numberOfInteractions}
      />
    </>
  );
};

export default App;
