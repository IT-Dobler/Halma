import { NodeTypeTS } from './node-type';
import { GameInstanceState } from 'game-logic';

export interface NodeEntity {
  id: string;
  type: NodeTypeTS;
  owningPlayerId?: string;
}

export class NodeEntityUtil {
  public static getSelectedNode(state: GameInstanceState): NodeEntity {
    const selectedNode = Object.values(state.gameState.entities).find(
      (value) => value?.type === NodeTypeTS.SELECTED,
    );

    return selectedNode!;
  }
}
