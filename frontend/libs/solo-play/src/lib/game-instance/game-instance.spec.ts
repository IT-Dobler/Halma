import {
  BoardDimensions,
  BoardPiece,
  GameInstance,
  GameStateUtil,
  Position
} from "./game-instance";
import {describe, expect} from "vitest";

describe('GameInstance', () => {





  it('should render successfully', () => {
    const instance = GameInstance.claudioHalma(["player1Id"], );
    expect(instance.players).toStrictEqual(1);
  });

  it('blocked positions', () => {
    const dimensions = new BoardDimensions(8, 8, 2);
    console.log(dimensions.blockedPositions);
  });
});


describe('BoardDimensions', () => {
  it('should not block positions when corner size 0', () => {
    const dimensions = new BoardDimensions(8, 8, 0);
    expect(dimensions.blockedPositions.length).toEqual(0);
  });
  it('should error out when the corner is too big', () => {
    expect(() => new BoardDimensions(8, 8, 4)).toThrowError();
  });
  it('blocked positions', () => {
    const dimensions = new BoardDimensions(8, 8, 1);

    const expected = [
        new Position(0, 0),
        new Position(0, 8),
        new Position(8, 0),
        new Position(8, 8),
    ];

    expect(dimensions.blockedPositions).toHaveLength(expected.length);
    for (const posititon of expected) {
      expect(dimensions.blockedPositions).toContainEqual(posititon);
    }
  });
});

describe('GameState', () => {
  it('initializes correctly for 1 Player', () => {
    const dimensions = new BoardDimensions(4, 4, 1);
    const gameState = GameStateUtil.initClaudioHalmaBoard(["0"], dimensions);


    const expected = [
        new BoardPiece(new Position(0, 1), "0"),
        new BoardPiece(new Position(0, 2), "0"),
        new BoardPiece(new Position(1, 1), "0"),
        new BoardPiece(new Position(1, 2), "0"),
    ];

    expect(gameState.pieces).toHaveLength(4);
    for (const piece of expected) {
      expect(gameState.pieces).toContainEqual(piece);
    }
  });

  it('initializes correctly for 2 Players', () => {
    const dimensions = new BoardDimensions(4, 4, 1);
    const gameState = GameStateUtil.initClaudioHalmaBoard(["0", "1"], dimensions);


    const expected = [
      new BoardPiece(new Position(0, 1), "0"),
      new BoardPiece(new Position(0, 2), "0"),
      new BoardPiece(new Position(1, 1), "0"),
      new BoardPiece(new Position(1, 2), "0"),

      new BoardPiece(new Position(3, 1), "1"),
      new BoardPiece(new Position(3, 2), "1"),
      new BoardPiece(new Position(2, 1), "1"),
      new BoardPiece(new Position(2, 2), "1"),
    ];

    expect(gameState.pieces).toHaveLength(8);
    for (const piece of expected) {
      expect(gameState.pieces).toContainEqual(piece);
    }
  });

});

// describe('GameEngine', () => {
//   it('denies moves not made by owning player', () => {
//     const gameEngine = new GameEngine();
//
//     const piece = new BoardPiece(new Position(0, 0), 0);
//     const gameState = new GameState([]);
//
//     const canMove = gameEngine.isValidMove(piece, gameState);
//
//     expect(canMove).toEqual(true);
//   });
//
// });