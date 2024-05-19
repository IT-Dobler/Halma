import { HFENtoGameSetup, toHFEN } from './halma-fen';
import { emptyGameConfig } from './game-config-functions';
import { emptyCurrentMove } from './current-move-functions';
import { Color } from './models/color';
import { GameConfig } from './models/game-config';
import { CurrentMove } from './models/current-move';
import { Node, NodeType } from './models/node';

describe('Halma FEN: Board to H-FEN', () => {
    let gameConfig: GameConfig;
    let currentMove: CurrentMove;

    beforeEach(() => {
        gameConfig = emptyGameConfig();
        currentMove = emptyCurrentMove();
    });

    test('empty board', () => {
        // Setup
        const nodes: Node[] = [
            { id: 'A:2', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'B:2', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'A:1', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'B:1', type: NodeType.EMPTY, color: Color.NONE },
        ];
        currentMove.colorToMove = Color.NONE;

        // Act
        const hfenString = toHFEN(nodes, gameConfig, currentMove);

        // Assert
        expect(hfenString).toEqual('2/2 -');
    });

    test('Blocked positions', () => {
        // Setup
        const nodes: Node[] = [
            { id: 'A:4', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'B:4', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'A:3', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'B:3', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'A:2', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'B:2', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'A:1', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'B:1', type: NodeType.BLOCKED, color: Color.NONE },
        ];
        currentMove.colorToMove = Color.NONE;

        // Act
        const hfenString = toHFEN(nodes, gameConfig, currentMove);

        // Assert
        expect(hfenString).toEqual('1x/1x/x1/1x -');
    });

    test('Blocked positions with gaps', () => {
        // Setup
        const nodes: Node[] = [
            { id: 'A:2', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'B:2', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'C:2', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'D:2', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'A:1', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'B:1', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'C:1', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'D:1', type: NodeType.BLOCKED, color: Color.NONE },
        ];
        currentMove.colorToMove = Color.NONE;

        // Act
        const hfenString = toHFEN(nodes, gameConfig, currentMove);

        // Assert
        expect(hfenString).toEqual('1x1x/x2x -');
    });

    test('Player turn "y"', () => {
        // Setup
        currentMove.colorToMove = Color.YELLOW;

        // Act
        const hfenString = toHFEN([], gameConfig, currentMove);

        // Assert
        expect(hfenString).toEqual('y');
    });

    test('Player turn "b"', () => {
        // Setup
        currentMove.colorToMove = Color.BLUE;

        // Act
        const hfenString = toHFEN([], gameConfig, currentMove);

        // Assert
        expect(hfenString).toEqual('b');
    });

    test('Player turn "r"', () => {
        // Setup
        currentMove.colorToMove = Color.RED;

        // Act
        const hfenString = toHFEN([], gameConfig, currentMove);

        // Assert
        expect(hfenString).toEqual('r');
    });

    test('Player turn "g"', () => {
        // Setup
        currentMove.colorToMove = Color.GREEN;

        // Act
        const hfenString = toHFEN([], gameConfig, currentMove);

        // Assert
        expect(hfenString).toEqual('g');
    });

    test('Player colors', () => {
        // Setup
        const nodes: Node[] = [
            { id: 'A:2', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'B:2', type: NodeType.PIECE, color: Color.BLUE },
            { id: 'C:2', type: NodeType.PIECE, color: Color.RED },
            { id: 'D:2', type: NodeType.PIECE, color: Color.GREEN },
            { id: 'A:1', type: NodeType.PIECE, color: Color.GREEN },
            { id: 'B:1', type: NodeType.PIECE, color: Color.GREEN },
            { id: 'C:1', type: NodeType.PIECE, color: Color.GREEN },
            { id: 'D:1', type: NodeType.PIECE, color: Color.GREEN },
        ];

        currentMove.colorToMove = Color.YELLOW;

        // Act
        const hfenString = toHFEN(nodes, gameConfig, currentMove);

        // Assert
        expect(hfenString).toEqual('ybrg/gggg y');
    });
});

describe('Halma FEN: H-FEN to Board', () => {
    let gameConfig: GameConfig;
    let expectedCurrentMove: CurrentMove;

    beforeEach(() => {
        gameConfig = emptyGameConfig();
        expectedCurrentMove = emptyCurrentMove();
    });

    test('minimal board', () => {
        // Setup
        expectedCurrentMove.colorToMove = Color.NONE;

        // Act
        const { nodes, currentMove } = HFENtoGameSetup('1 -');

        // Assert
        expect(nodes).toStrictEqual<Node[]>([{ id: 'A:1', type: NodeType.EMPTY, color: Color.NONE }]);
        expect(currentMove).toStrictEqual(expectedCurrentMove);
    });

    test('multiple empty rows', () => {
        // Setup
        expectedCurrentMove.colorToMove = Color.NONE;

        // Act
        const { nodes, currentMove } = HFENtoGameSetup('2/2 -');

        // Assert
        expect(nodes).toStrictEqual<Node[]>([
            { id: 'A:2', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'B:2', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'A:1', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'B:1', type: NodeType.EMPTY, color: Color.NONE },
        ]);
        expect(currentMove).toStrictEqual(expectedCurrentMove);
    });

    test('two rows of a player', () => {
        // Setup
        expectedCurrentMove.colorToMove = Color.NONE;

        // Act
        const { nodes, currentMove } = HFENtoGameSetup('yy/yy -');

        // Assert
        expect(nodes).toStrictEqual<Node[]>([
            { id: 'A:2', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'B:2', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'A:1', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'B:1', type: NodeType.PIECE, color: Color.YELLOW },
        ]);
        expect(currentMove).toStrictEqual(expectedCurrentMove);
    });

    test('two rows of a player', () => {
        // Setup
        expectedCurrentMove.colorToMove = Color.NONE;

        // Act
        const { nodes, currentMove } = HFENtoGameSetup('yy/gg -');

        // Assert
        expect(nodes).toStrictEqual<Node[]>([
            { id: 'A:2', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'B:2', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'A:1', type: NodeType.PIECE, color: Color.GREEN },
            { id: 'B:1', type: NodeType.PIECE, color: Color.GREEN },
        ]);
        expect(currentMove).toStrictEqual(expectedCurrentMove);
    });

    test('minimal board, y to move', () => {
        // Setup
        expectedCurrentMove.colorToMove = Color.YELLOW;

        // Act
        const { nodes, currentMove } = HFENtoGameSetup('y y');

        // Assert
        expect(nodes).toStrictEqual<Node[]>([{ id: 'A:1', type: NodeType.PIECE, color: Color.YELLOW }]);
        expect(currentMove).toStrictEqual(expectedCurrentMove);
    });

    test('One player with blocks and empty pieces', () => {
        // Setup
        expectedCurrentMove.colorToMove = Color.RED;

        // Act
        const { nodes, currentMove } = HFENtoGameSetup('3/xyx/xyx r');

        // Assert
        expect(nodes).toStrictEqual<Node[]>([
            { id: 'A:3', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'B:3', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'C:3', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'A:2', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'B:2', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'C:2', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'A:1', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'B:1', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'C:1', type: NodeType.BLOCKED, color: Color.NONE },
        ]);
        expect(currentMove).toStrictEqual(expectedCurrentMove);
    });
});
