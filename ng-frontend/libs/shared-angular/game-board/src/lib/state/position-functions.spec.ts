import { toId, toPosition } from './position-functions';
import { Position } from './models/position';

describe('Position functions', () => {
    test('Simplest position toId', () => {
        const position: Position = { col: 0, row: 0 };

        const id = toId(position);

        expect(id).toEqual('A:1');
    });

    test('2 digit row toId', () => {
        const position: Position = { col: 0, row: 10 };

        const id = toId(position);

        expect(id).toEqual('A:11');
    });

    test('2 digit col toId', () => {
        const position: Position = { col: 11, row: 0 };

        const id = toId(position);

        expect(id).toEqual('L:1');
    });

    test('id to position', () => {
        const id = 'A:1';

        const position = toPosition(id);

        expect(position).toEqual({ col: 0, row: 0 });
    });

    test('id to position, 2 digit col', () => {
        const id = 'A:99';

        const position = toPosition(id);

        expect(position).toEqual({ col: 0, row: 98 });
    });

    test('id to position, 2 digit row', () => {
        const id = 'Z:1';

        const position = toPosition(id);

        expect(position).toEqual({ col: 25, row: 0 });
    });
});
