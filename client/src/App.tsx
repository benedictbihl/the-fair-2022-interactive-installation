/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from "react";
import io from "socket.io-client";

const host = import.meta.env.PROD ? window.location.host : "localhost:8080";

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [nfcID, setnfcID] = useState("");

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

  // Sends a message to the server via sockets
  // function send(message: any) {
  //   socket.emit("msg", message);
  // }

  return (
    <>
      <p>Connected: {"" + isConnected}</p>

      {/* <button onClick={() => send("HALLLO I BIMS")}>Say Hello</button> */}
      <div>NFC TAG ID: {nfcID}</div>
    </>
  );
};

export default App;
