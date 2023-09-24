import { render } from '@testing-library/react';

import SoloPlay from './solo-play';

describe('SoloPlay', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SoloPlay />);
    expect(baseElement).toBeTruthy();
  });
});
