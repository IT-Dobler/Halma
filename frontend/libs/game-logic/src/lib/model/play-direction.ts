export enum PlayDirection {
  BOTTOM_TO_TOP = 'BOTTOM_TO_TOP',
  RIGHT_TO_LEFT = 'RIGHT_TO_LEFT',
  TOP_TO_BOTTOM = 'TOP_TO_BOTTOM',
  LEFT_TO_RIGHT = 'LEFT_TO_RIGHT',
}

export const directionsOfPlay = [
  PlayDirection.BOTTOM_TO_TOP,
  PlayDirection.RIGHT_TO_LEFT,
  PlayDirection.TOP_TO_BOTTOM,
  PlayDirection.LEFT_TO_RIGHT,
];

export const directionOfInit = [
  PlayDirection.BOTTOM_TO_TOP,
  PlayDirection.TOP_TO_BOTTOM,
  PlayDirection.RIGHT_TO_LEFT,
  PlayDirection.LEFT_TO_RIGHT,
];
