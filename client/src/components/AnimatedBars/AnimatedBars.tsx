import "./AnimatedBars.css";

import { FC, useEffect, useState } from "react";

import { ColorPair } from "../../constants/types";
const AnimatedBars: FC<{ colorPair: ColorPair | undefined }> = ({
  colorPair,
}) => {
  //empty array of length 25 to iterate over
  const [coloredBars, setColoredBars] = useState([12, 17]);
  //in an interval of 0.2 seconds, set coloredBars to a number between 16 and 20

  useEffect(() => {
    const timer = setInterval(() => {
      setColoredBars([
        Math.floor(Math.random() * (20 - 16 + 1)) + 16,
        Math.floor(Math.random() * (20 - 16 + 1)) + 16,
      ]);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const bars = Array.from({ length: 25 }, () => 0);
  const Bar: FC<{ color?: string; coloredBars: number }> = ({
    color,
    coloredBars,
  }) => {
    return (
      <div className="bar">
        {bars.map((bar, index) => {
          return (
            <div
              style={{
                backgroundColor: coloredBars < index ? "transparent" : color,
              }}
              key={index}
              className="barSegment"
            ></div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="barContainer">
      <Bar color={colorPair?.primary} coloredBars={coloredBars[0]} />
      <Bar color={colorPair?.secondary} coloredBars={coloredBars[1]} />
    </div>
  );
};

export default AnimatedBars;
