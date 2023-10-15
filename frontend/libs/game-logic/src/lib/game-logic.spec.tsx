import { render } from '@testing-library/react';

import GameLogic from './game-logic';

describe('GameLogic', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GameLogic />);
    expect(baseElement).toBeTruthy();
  });
});
