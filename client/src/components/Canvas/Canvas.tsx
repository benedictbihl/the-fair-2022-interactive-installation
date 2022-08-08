import { useState, useEffect } from "react";
import Sketch from "react-p5";
import P5Types from "p5";
import { drawBar, drawBeat, COLORS } from "../../utils/p5/barsAndBeats";

import "./Canvas.css";

interface ICanvasProps {
  nfcID: number;
}
const Canvas: React.FC<ICanvasProps> = ({ nfcID }) => {
  const padding = 20;
  const barW = 100;
  const barH = 200;
  const rows = 2;
  const cols = 4;
  let test;
  const [color, setColor] = useState<COLORS>(COLORS.ORANGE_FUZZ);

  useEffect(() => {
    const values = Object.keys(COLORS);
    const randomColor = values[Math.floor(Math.random() * values.length)];
    setColor(COLORS[randomColor as keyof typeof COLORS]);
  }, [nfcID]);

  const setup = (p5: P5Types, canvasParentRef: Element) => {
    p5.createCanvas(470, 470).parent(canvasParentRef);
    p5.background(236, 227, 208);
  };

  const draw = (p5: P5Types) => {
    for (let i = 0; i < rows; i++) {
      for (let l = 0; l < cols; l++) {
        const calcX = padding + l * (barW + padding / 2);
        const calcY = padding + i * (barH + padding / 2);

        const calcRTop = (0 + (i + l) * 100) % 200;
        const calcRBot = (100 + (i + l) * 100) % 200;

        drawBar(p5, {
          x: calcX,
          y: calcY,
          w: barW,
          h: barH,
          radiusTop: calcRTop,
          radiusBot: calcRBot,
        });

        const calcBX = padding + barW / 2 + (padding / 2 + barW) * l;

        if ((l + i) % 2 == 0) {
          test = 1;
        } else {
          test = -1;
        }

        const calcBY =
          padding + barH / 2 + (padding / 2 + barH) * i + (barW / 2) * test;

        drawBeat(p5, { x: calcBX, y: calcBY, r: barW }, color);
      }
    }
  };

  return <Sketch setup={setup} draw={draw} />;
};

export default Canvas;
