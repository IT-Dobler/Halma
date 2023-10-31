import { render } from '@testing-library/react';

import StepCounter from './step-counter';

describe('StepCounter', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StepCounter />);
    expect(baseElement).toBeTruthy();
  });
});
