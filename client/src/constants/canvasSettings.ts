import { CanvasSettings } from "./types";

export const canvasSettings: CanvasSettings = {
  scaleFactor: 5,
  columnCount: 15,
  rowCount: 3,
  gap: 10,
  get padding() {
    return 4 * this.scaleFactor;
  },
  get circleSize() {
    return 12 * this.scaleFactor;
  },
  get canvasWidth() {
    return (
      this.padding * 2 +
      this.circleSize * (this.columnCount - 1) * 0.6 +
      this.circleSize
    );
  },
  canvasHeight: 650,
  circleOffset: 0.6,
};
