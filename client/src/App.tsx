/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from "react";
import io from "socket.io-client";
import Sketch from "react-p5";
import P5Types from "p5";
import "./App.css";

const host = import.meta.env.PROD ? window.location.host : "localhost:8080";

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [nfcID, setnfcID] = useState(0);

  const setup = (p5: P5Types, canvasParentRef: Element) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
  };

  const draw = (p5: P5Types) => {
    p5.background(0);
    p5.fill(nfcID / 3, nfcID * 1.3, nfcID);
    p5.ellipse(p5.width / 2, p5.height / 2, nfcID / 2);
  };

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

    socket.on("pong", function (data: any) {
      console.log("pong");
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
      <Sketch setup={setup} draw={draw} />
      <div className="nfc">
        <p>Connected: {"" + isConnected}</p>
        <div>NFC TAG ID: {nfcID}</div>
      </div>
    </>
  );
};

export default App;
