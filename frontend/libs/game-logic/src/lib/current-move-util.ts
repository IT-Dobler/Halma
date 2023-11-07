import {CurrentMove} from "./model/current-move";

export class CurrentMoveUtil {
  public static hasMoved(currentMove: CurrentMove): boolean {
    return currentMove.lastMovedNodeId !== undefined;

  }

  // Has made a progressing move
  public static hasProgressed(currentMove: CurrentMove): boolean {
    return currentMove.lastMovedNodeId !== currentMove.initiallySelectedNodeId;
  }
}