import { render } from '@testing-library/react';

import SettingsDialog from './settings-dialog';
import {useRef} from "react";

describe('SettingsDialog', () => {
  it('should render successfully', () => {
    const ref = useRef<HTMLDialogElement>(null);
    const { baseElement } = render(<SettingsDialog modal={ref} />);
    expect(baseElement).toBeTruthy();
  });
});
