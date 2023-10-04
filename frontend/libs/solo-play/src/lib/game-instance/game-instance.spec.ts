import {BoardDimensions, BoardPiece, GameEngine, GameInstance, GameState, Position} from "./game-instance";
import {describe, expect} from "vitest";

describe('GameInstance', () => {





  it('should render successfully', () => {
    const instance = GameInstance.claudioHalma(1, );
    expect(instance.numberOfPlayers).toStrictEqual(2);
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

describe('GameEngine', () => {
  it('denies moves not made by owning player', () => {
    const gameEngine = new GameEngine();

    const piece = new BoardPiece(new Position(0, 0), 0);
    const gameState = new GameState([]);

    const canMove = gameEngine.isValidMove(piece, gameState);

    expect(canMove).toEqual(true);
  });

});