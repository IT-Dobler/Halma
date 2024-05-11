import { Color } from './color';

export interface Node {
    id: string;
    type: NodeType;
    color: Color;
}

export enum NodeType {
    EMPTY = 'EMPTY',
    BLOCKED = 'BLOCKED',
    PIECE = 'PIECE',
    SELECTED = 'SELECTED',
    POSSIBLE_MOVE = 'POSSIBLE_MOVE',
}
