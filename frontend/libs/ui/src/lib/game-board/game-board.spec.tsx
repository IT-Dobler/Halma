import { render } from '@testing-library/react';

import GameBoard from './game-board';

describe('GameBoard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GameBoard />);
    expect(baseElement).toBeTruthy();
  });
});
