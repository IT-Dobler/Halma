import { render } from '@testing-library/react';

import VictoryDialog from './victory-dialog';
import {useRef} from "react";

describe('VictoryDialog', () => {
  it('should render successfully', () => {
    const ref = useRef<HTMLDialogElement>(null);
    const { baseElement } = render(<VictoryDialog  modal={ref}/>);
    expect(baseElement).toBeTruthy();
  });
});
