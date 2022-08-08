/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";
import Canvas from "./components/Canvas";

const host = import.meta.env.PROD ? window.location.host : "localhost:8080";

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [nfcID, setnfcID] = useState(0);

  useEffect(() => {
    //@ts-ignore
    const socket = io("http://" + host, { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("connected");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      setIsConnected(false);
    });

    socket.on("message", function (data: any) {
      console.log("Received a message from the server!", data);
      setnfcID(data);
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
    };
  }, []);

  return (
    <>
      <Canvas nfcID={nfcID} />
      <div className="nfc">
        <p>Connected: {"" + isConnected}</p>
        <div>NFC TAG ID: {nfcID}</div>
      </div>
    </>
  );
};

export default App;
