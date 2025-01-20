/**
 * FEN Notation for Halma:
 *
 * For the same reason that FEN is useful in Chess, FEN will be useful in Halma.
 * This file attempts to specify the specification of Halma FEN (H-FEN)
 *
 * We attempt to stick closely to the original FEN specifications.
 *
 * A H-FEN String is separated into sections. Sections are separated using a space (' ') character.
 *
 *      The first section is called "rows" and indicates for every position on every row, what type of node is present.
 *      The following characters are used:
 *      - Blocked space is indicated by an 'x'.
 *      - Empty space is annotated via a number indicating how many subsequent empty spaces there are on the given line
 *          reading from left to right.
 *      - Pieces are annotated by 'y', 'r', 'b', 'g' respectively, depending on the color.
 *      - Each row of the board is separated by a '/' symbol.
 *
 *      The second section is called "turn" and indicates which colors turn it is: 'y', 'r', 'b', 'g' respectively.
 *
 * Empty sections are always annotated with '-'. This is to make parsing and recognition more consistent.
 *
 * TODO: Work in progress as the requirements grow :)
 * - Since the game does not end immediately when one player finishes or leaves the game, the number of turns can be
 *      different per player. This is indicated by the next field, showing a turn count per player as such: 'y35/r35/B34'.
 *      A capital letter indicates the player has
 */
import { toId, toPosition } from './position-functions';
import { Color, colorMap, colorWheelInitialization } from './models/color';
import { GameConfig } from './models/game-config';
import { CurrentMove } from './models/current-move';
import { Node, NodeType } from './models/node';
import { emptyCurrentMove } from './current-move-functions';

const BLOCKED_NODE_CHAR = 'x';
const SINGLE_EMPTY_NODE_CHAR = '1';
const ROW_SEPARATOR_CHAR = '/';
const SECTION_SEPARATOR_CHAR = ' ';
const EMPTY_SECTION_CHAR = '-';

export function HFENtoGameSetup(hfenNotation: string): {
    nodes: Node[];
    currentMove: CurrentMove;
    config: GameConfig;
} {
    const splits = hfenNotation.split(SECTION_SEPARATOR_CHAR);
    const nodes: Node[] = [];
    const rowsString = splits[0].split(ROW_SEPARATOR_CHAR).reverse();
    let cornerSize = 0;
    // Run over backwards to start "top-left", so the largest row.
    for (let i = rowsString.length - 1; i >= 0; i--) {
        const row = rowsString[i];
        let expandedRowString = '';
        for (let j = 0; j < row.length; j++) {
            const char = row[j];
            if (isNaN(Number(char))) {
                expandedRowString += char;
            } else {
                // max = 99
                let emptyFields = row[j];
                const nextChar = row[j + 1];
                if (!isNaN(Number(nextChar))) {
                    emptyFields += parseInt(nextChar);
                    j++;
                }
                for (let jj = 0; jj < Number(emptyFields); jj++) {
                    expandedRowString += SINGLE_EMPTY_NODE_CHAR;
                }
            }
        }
        // Iterate over normally to add the columns left-to-right

        for (let j = 0; j < expandedRowString.length; j++) {
            const char = expandedRowString[j];
            const id = toId({ row: i, col: j });

            const { type, color } = parseHfenChar(char);
            nodes.push({
                id,
                type,
                color: color,
            });
            cornerSize += i === 0 && type === NodeType.BLOCKED ? 1 : 0;
        }
    }
    const config: GameConfig = {
        bounds: {
            width: rowsString[0].length,
            height: rowsString.length,
            cornerSize: cornerSize / 2,
        },
        players: [],
    };
    const currentMove = emptyCurrentMove();
    currentMove.colorToMove = splits[1] === EMPTY_SECTION_CHAR ? Color.NONE : colorMap[splits[1].toUpperCase()];

    return { nodes, currentMove, config };
}

export function toHFEN(nodes: Node[], config: GameConfig, currentMove: CurrentMove): string {
    // Filter nodes by rows

    // Extract column count
    const columnCount = Math.max(...nodes.map((node) => toPosition(node.id).col)) + 1;

    // Split by row
    const nodeSplits = chunkArray(nodes, columnCount);

    const hfenString: Record<string, string> = {};

    if (nodeSplits.length > 0) {
        const rowStrings: Record<number, string> = {};
        for (const split of nodeSplits) {
            let rowString = '';
            for (const node of split) {
                if (node.type === NodeType.BLOCKED) {
                    rowString += BLOCKED_NODE_CHAR;
                } else if (node.type === NodeType.PIECE) {
                    rowString += node.color;
                } else if (node.type === NodeType.EMPTY) {
                    rowString += SINGLE_EMPTY_NODE_CHAR;
                }

                const { row } = toPosition(node.id);
                rowStrings[row] = rowString;
            }
        }

        hfenString['rowStrings'] = Object.values(rowStrings).reverse().map(consolidateEmptyNodesToNumber()).join('/');
    }

    hfenString['turn'] = currentMove.colorToMove === Color.NONE ? EMPTY_SECTION_CHAR : currentMove.colorToMove;

    return Object.values(hfenString).join(SECTION_SEPARATOR_CHAR).toLowerCase();
}

function chunkArray<T>(array: T[], size: number): T[][] {
    if (array.length === 0) {
        return [];
    }
    return array.length > size ? [array.slice(0, size), ...chunkArray(array.slice(size), size)] : [array];
}

function parseHfenChar(char: string) {
    if (char === BLOCKED_NODE_CHAR) {
        return { type: NodeType.BLOCKED, color: Color.NONE };
    } else if (char === SINGLE_EMPTY_NODE_CHAR) {
        return { type: NodeType.EMPTY, color: Color.NONE };
    } else {
        return { type: NodeType.PIECE, color: colorMap[char.toUpperCase()] };
    }
}

function consolidateEmptyNodesToNumber() {
    return (rowString: string) => {
        let n = 0;
        let newChar = '';
        for (const char of rowString) {
            if (char === SINGLE_EMPTY_NODE_CHAR) {
                n++;
            } else {
                if (n !== 0) {
                    newChar += n;
                    n = 0;
                }

                newChar += char;
            }
        }

        if (n !== 0) {
            newChar += n;
        }

        return newChar;
    };
}

export function HFENFromGameConfig(gameConfig: GameConfig) {
    const cornerSize: number = gameConfig.bounds.cornerSize;
    const width: number = gameConfig.bounds.width;
    const height: number = gameConfig.bounds.height;
    const playerCount: number = gameConfig.players.length;

    let hfen: string = '';

    if (width - 2 * cornerSize > 0) {
        for (let h: number = 1, c: number = cornerSize; h <= height; h++) {
            if (cornerSize > 0 && (h > 1 || h >= height - cornerSize)) {
                if (h > height - cornerSize) {
                    c++;
                } else if (h <= cornerSize + 1) {
                    c--;
                }
            }
            let sum: number = 0;
            for (let w: number = 1; w <= width; w++) {
                if (cornerSize > 0 && (h <= cornerSize || h >= height - cornerSize) && (w <= c || w >= width - c + 1)) {
                    if (w <= c || w >= width - c + 1) {
                        hfen += sum > 0 ? sum : '';
                        sum = 0;
                        hfen += BLOCKED_NODE_CHAR;
                    } else {
                        sum++;
                    }
                } else if (h < 3 || h >= height - 1) {
                    // colors red & yellow
                    hfen +=
                        h >= height - 1 && w > cornerSize && w < width - cornerSize + 1
                            ? colorWheelInitialization[0].toLowerCase()
                            : h < 3 && playerCount > 1 && w > cornerSize && w < width - cornerSize + 1
                            ? colorWheelInitialization[1].toLowerCase()
                            : SINGLE_EMPTY_NODE_CHAR;
                } else if (playerCount < 3) {
                    // free
                    if (w < width) {
                        sum++;
                    } else {
                        hfen += sum > 0 ? sum + 1 : '';
                    }
                } else {
                    if (playerCount > 3 && w <= 2 && h > cornerSize && h <= height - cornerSize) {
                        // color green
                        hfen += colorWheelInitialization[3].toLowerCase();
                        hfen += sum > 0 ? sum : '';
                        sum = 0;
                    } else if (w > width - 2 && h > cornerSize && h <= height - cornerSize) {
                        // color blue
                        hfen += sum > 0 ? sum : '';
                        sum = 0;
                        hfen += colorWheelInitialization[2].toLowerCase();
                    } else {
                        sum++;
                    }
                }
            }
            hfen +=
                h < height ? ROW_SEPARATOR_CHAR : SECTION_SEPARATOR_CHAR + colorWheelInitialization[0].toLowerCase();
        }
    }
    return hfen;
}

export function getColorFromHfen(hfenNotation: string) {
    const splits = hfenNotation.split(SECTION_SEPARATOR_CHAR).reverse();
    return splits[0];
}
