import "./App.css";

import { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";

import Canvas from "./components/Canvas";

const hostname = window.location.hostname;

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedIDs, setConnectedIDs] = useState<number[]>(
    JSON.parse(localStorage.getItem("connected_IDs") ?? "[]") ?? []
  );

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === "c") {
      if (confirm("Clean local storage to removed all IDs?") == true) {
        localStorage.removeItem("connected_IDs");
        setConnectedIDs([]);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    const socket = io("http://" + hostname + ":8080", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("connected");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      setIsConnected(false);
    });

    socket.on("message", function (data: number) {
      console.log("Received a message from the server!", data);
      !connectedIDs.includes(data) &&
        setConnectedIDs((connectedIDs) => [...connectedIDs, data]);
    });

    setInterval(() => {
      const start = Date.now();

      socket.emit("ping", () => {
        const duration = Date.now() - start;
        console.log(duration);
      });
    }, 1000);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    console.log(connectedIDs);
    localStorage.setItem("connected_IDs", JSON.stringify(connectedIDs));
  }, [connectedIDs]);

  return (
    <>
      <Canvas nfcID={connectedIDs[connectedIDs.length - 1]} />
      <div className="nfc">
        <p>Connected: {"" + isConnected}</p>
        <div>NFC TAG ID: {connectedIDs[connectedIDs.length - 1]}</div>
      </div>
    </>
  );
};

export default App;
