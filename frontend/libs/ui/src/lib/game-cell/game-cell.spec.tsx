import { render } from '@testing-library/react';

import GameCell from './game-cell';

describe('GameCell', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GameCell />);
    expect(baseElement).toBeTruthy();
  });
});
