import { toId } from './position-functions';
import { EntityMap } from '@ngrx/signals/entities';
import { PlayDirection } from './models/play-direction';
import { Color } from './models/color';
import { GameConfig } from './models/game-config';
import { Player } from './models/player';
import { Node, NodeType } from './models/node';
import { GameBounds } from './models/game-bounds';

export function initGameBoard(config: GameConfig): Node[] {
    // Init empty grid
    const emptyNodes = initEmptyGrid(config.bounds);
    // Set blocked positions
    const emptyBlockedNodes = initBlockedNodes(emptyNodes, config.bounds);
    // Set player pieces
    // TODO Consider changing piece generation to scale with corner size
    const completeBoard = initPieces(emptyBlockedNodes, config);
    return Object.values(completeBoard);
}

function initEmptyGrid(bounds: GameBounds): EntityMap<Node> {
    const nodes: EntityMap<Node> = {};
    for (let row = bounds.height - 1; row > -1; row--) {
        for (let col = 0; col < bounds.width; col++) {
            const id = toId({ col, row });
            nodes[id] = {
                id,
                type: NodeType.EMPTY,
                color: Color.NONE,
            };
        }
    }
    return nodes;
}

function initBlockedNodes(
    nodes: EntityMap<Node>,
    bounds: GameBounds
): EntityMap<Node> {
    for (let i = bounds.cornerSize; 0 < i; i--) {
        for (let j = i; 0 < j; j--) {
            const zeroAdjustedRow = bounds.cornerSize - i;
            const zeroAdjustedCol = j - 1;
            const zeroAdjustedHeight = bounds.height - 1;
            const zeroAdjustedWidth = bounds.width - 1;

            // Top right corner
            const id1 = toId({
                row: zeroAdjustedHeight - zeroAdjustedRow,
                col: zeroAdjustedWidth - zeroAdjustedCol,
            });
            nodes[id1].type = NodeType.BLOCKED;

            // Top left corner
            const id2 = toId({
                row: zeroAdjustedHeight - zeroAdjustedRow,
                col: zeroAdjustedCol,
            });
            nodes[id2].type = NodeType.BLOCKED;

            // Bottom right corner
            const id3 = toId({
                row: zeroAdjustedRow,
                col: zeroAdjustedWidth - zeroAdjustedCol,
            });
            nodes[id3].type = NodeType.BLOCKED;

            // Bottom left corner
            const id4 = toId({
                row: zeroAdjustedRow,
                col: zeroAdjustedCol,
            });
            nodes[id4].type = NodeType.BLOCKED;
        }
    }
    return nodes;
}

function initPieces(
    nodes: EntityMap<Node>,
    config: GameConfig
): EntityMap<Node> {
    for (const player of config.players) {
        nodes = setPlayerPieces(nodes, player, config.bounds);
    }

    return nodes;
}

function setPlayerPieces(
    nodes: EntityMap<Node>,
    player: Player,
    bounds: GameBounds
): EntityMap<Node> {
    switch (player.playDirection) {
        case PlayDirection.RIGHT_TO_LEFT:
            return rightToLeftPieces(nodes, bounds);
        case PlayDirection.LEFT_TO_RIGHT:
            return leftToRightPieces(nodes, bounds);
        case PlayDirection.BOTTOM_TO_TOP:
            return bottomToTopPieces(nodes, bounds);
        case PlayDirection.TOP_TO_BOTTOM:
            return topToBottomPieces(nodes, bounds);
    }
}

function bottomToTopPieces(
    nodes: EntityMap<Node>,
    bounds: GameBounds
): EntityMap<Node> {
    for (
        let col = bounds.cornerSize;
        col < bounds.width - bounds.cornerSize;
        col++
    ) {
        const id1 = toId({ row: 0, col });
        setPlayerNode(nodes[id1], Color.YELLOW);

        const id2 = toId({ row: 1, col });
        setPlayerNode(nodes[id2], Color.YELLOW);
    }

    return nodes;
}

function topToBottomPieces(
    nodes: EntityMap<Node>,
    bounds: GameBounds
): EntityMap<Node> {
    const zeroAdjustedHeight = bounds.height - 1;
    for (
        let col = bounds.cornerSize;
        col < bounds.width - bounds.cornerSize;
        col++
    ) {
        const id1 = toId({ row: zeroAdjustedHeight, col });
        setPlayerNode(nodes[id1], Color.RED);

        const id2 = toId({ row: zeroAdjustedHeight - 1, col });
        setPlayerNode(nodes[id2], Color.RED);
    }

    return nodes;
}

function rightToLeftPieces(
    nodes: EntityMap<Node>,
    bounds: GameBounds
): EntityMap<Node> {
    for (
        let row = bounds.cornerSize;
        row < bounds.height - bounds.cornerSize;
        row++
    ) {
        const id1 = toId({ row, col: bounds.width - 1 });
        setPlayerNode(nodes[id1], Color.BLUE);

        const id2 = toId({ row, col: bounds.width - 2 });
        setPlayerNode(nodes[id2], Color.BLUE);
    }

    return nodes;
}

function leftToRightPieces(
    nodes: EntityMap<Node>,
    bounds: GameBounds
): EntityMap<Node> {
    for (
        let row = bounds.cornerSize;
        row < bounds.height - bounds.cornerSize;
        row++
    ) {
        const id1 = toId({ row, col: 0 });
        setPlayerNode(nodes[id1], Color.GREEN);

        const id2 = toId({ row, col: 1 });
        setPlayerNode(nodes[id2], Color.GREEN);
    }

    return nodes;
}

function setPlayerNode(node: Node, color: Color) {
    node.type = NodeType.PIECE;
    node.color = color;
}
