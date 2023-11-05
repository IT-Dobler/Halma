import { render } from '@testing-library/react';

import GameCell from './game-cell';

describe('GameCell', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GameCell id={0} />);
    expect(baseElement).toBeTruthy();
  });
});
