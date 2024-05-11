import { emptyGameConfig } from './game-config-functions';
import { initGameBoard } from './game-init-functions';
import { Color } from './models/color';
import { Node, NodeType } from './models/node';
import { PlayDirection } from './models/play-direction';

describe('GameInitFunctions', () => {
    const gameConfig = emptyGameConfig();

    test('no blocked corners, no players', () => {
        // Setup
        gameConfig.bounds = { cornerSize: 0, height: 2, width: 2 };

        // Act
        const nodes = initGameBoard(gameConfig);

        // Assert
        expect(nodes).toStrictEqual<Node[]>([
            { id: 'A:2', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'B:2', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'A:1', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'B:1', type: NodeType.EMPTY, color: Color.NONE },
        ]);
    });

    test('minimal blocked corner, no players', () => {
        // Setup
        gameConfig.bounds = { cornerSize: 1, height: 3, width: 3 };

        // Act
        const nodes = initGameBoard(gameConfig);

        // Assert
        expect(nodes).toStrictEqual<Node[]>([
            { id: 'A:3', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'B:3', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'C:3', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'A:2', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'B:2', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'C:2', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'A:1', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'B:1', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'C:1', type: NodeType.BLOCKED, color: Color.NONE },
        ]);
    });

    test('Everything blocked, no players', () => {
        // Setup
        gameConfig.bounds = { cornerSize: 1, height: 2, width: 2 };

        // Act
        const nodes = initGameBoard(gameConfig);

        // Assert
        expect(nodes).toStrictEqual<Node[]>([
            { id: 'A:2', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'B:2', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'A:1', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'B:1', type: NodeType.BLOCKED, color: Color.NONE },
        ]);
    });

    test('Some blocked, no players', () => {
        // Setup
        gameConfig.bounds = { cornerSize: 1, height: 3, width: 3 };

        // Act
        const nodes = initGameBoard(gameConfig);

        // Assert
        expect(nodes).toStrictEqual<Node[]>([
            { id: 'A:3', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'B:3', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'C:3', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'A:2', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'B:2', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'C:2', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'A:1', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'B:1', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'C:1', type: NodeType.BLOCKED, color: Color.NONE },
        ]);
    });

    test('2x2 - 1 player, no blocks', () => {
        // Setup
        gameConfig.bounds = { cornerSize: 0, height: 2, width: 2 };
        gameConfig.players.push({
            id: 'player1',
            playDirection: PlayDirection.BOTTOM_TO_TOP,
            color: Color.YELLOW,
            moveOrder: 1,
        });

        // Act
        const nodes = initGameBoard(gameConfig);

        // Assert
        expect(nodes).toStrictEqual<Node[]>([
            { id: 'A:2', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'B:2', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'A:1', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'B:1', type: NodeType.PIECE, color: Color.YELLOW },
        ]);
    });

    test('3x2 - 1 player, no blocks', () => {
        // Setup
        gameConfig.bounds = { cornerSize: 0, height: 3, width: 2 };
        gameConfig.players.push({
            id: 'player1',
            playDirection: PlayDirection.BOTTOM_TO_TOP,
            color: Color.YELLOW,
            moveOrder: 1,
        });

        // Act
        const nodes = initGameBoard(gameConfig);

        // Assert
        expect(nodes).toStrictEqual<Node[]>([
            { id: 'A:3', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'B:3', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'A:2', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'B:2', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'A:1', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'B:1', type: NodeType.PIECE, color: Color.YELLOW },
        ]);
    });

    test('4x2 - 2 player, no blocks', () => {
        // Setup
        gameConfig.bounds = { cornerSize: 0, height: 4, width: 2 };
        gameConfig.players.push({
            id: 'player1',
            playDirection: PlayDirection.BOTTOM_TO_TOP,
            color: Color.YELLOW,
            moveOrder: 1,
        });
        gameConfig.players.push({
            id: 'player2',
            playDirection: PlayDirection.TOP_TO_BOTTOM,
            color: Color.RED,
            moveOrder: 2,
        });

        // Act
        const nodes = initGameBoard(gameConfig);

        // Assert
        expect(nodes).toStrictEqual<Node[]>([
            { id: 'A:4', type: NodeType.PIECE, color: Color.RED },
            { id: 'B:4', type: NodeType.PIECE, color: Color.RED },
            { id: 'A:3', type: NodeType.PIECE, color: Color.RED },
            { id: 'B:3', type: NodeType.PIECE, color: Color.RED },
            { id: 'A:2', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'B:2', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'A:1', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'B:1', type: NodeType.PIECE, color: Color.YELLOW },
        ]);
    });

    test('4x3 - 2 player, with corners', () => {
        // Setup
        gameConfig.bounds = { cornerSize: 1, height: 4, width: 3 };
        gameConfig.players.push({
            id: 'player1',
            playDirection: PlayDirection.BOTTOM_TO_TOP,
            color: Color.YELLOW,
            moveOrder: 1,
        });
        gameConfig.players.push({
            id: 'player2',
            playDirection: PlayDirection.TOP_TO_BOTTOM,
            color: Color.RED,
            moveOrder: 2,
        });

        // Act
        const nodes = initGameBoard(gameConfig);

        // Assert
        expect(nodes).toStrictEqual<Node[]>([
            { id: 'A:4', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'B:4', type: NodeType.PIECE, color: Color.RED },
            { id: 'C:4', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'A:3', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'B:3', type: NodeType.PIECE, color: Color.RED },
            { id: 'C:3', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'A:2', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'B:2', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'C:2', type: NodeType.EMPTY, color: Color.NONE },
            { id: 'A:1', type: NodeType.BLOCKED, color: Color.NONE },
            { id: 'B:1', type: NodeType.PIECE, color: Color.YELLOW },
            { id: 'C:1', type: NodeType.BLOCKED, color: Color.NONE },
        ]);
    });
});
