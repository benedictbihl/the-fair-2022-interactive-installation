import "./TopContent.css";

import Marquee from "react-fast-marquee";

import { ReactComponent as Circle } from "../../assets/icons/circle.svg";
import { canvasSettings } from "../../constants/canvasSettings";

const TopContent = () => {
  return (
    <div
      style={{ gridTemplateColumns: `1fr ${canvasSettings.canvasWidth}px 1fr` }}
      className="topContentWrapper"
    >
      <div className="headlineContainer">
        <h1>THE FAIR</h1> <Circle />
      </div>
      <div className="scrollingTextContainer">
        <Marquee speed={40} gradientColor={[0, 0, 0]}>
          Berlin • Hamburg • Frankfurt • Munich • Vienna • Zuerich • Berlin •
          Hamburg • Frankfurt • Munich • Vienna • Zuerich • Berlin • Hamburg •
          Frankfurt • Munich • Vienna • Zuerich • Berlin • Hamburg • Frankfurt •
          Munich • Vienna • Zuerich •
        </Marquee>
      </div>
    </div>
  );
};

export default TopContent;
