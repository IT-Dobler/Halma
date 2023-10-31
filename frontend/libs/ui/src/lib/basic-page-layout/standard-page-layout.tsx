import { PropsWithChildren } from 'react';
import NavBar from '../nav-bar/nav-bar';

export function StandardPageLayout(props: PropsWithChildren) {
  return (
    <div>
      <NavBar />
      {props.children}
    </div>
  );
}

export default StandardPageLayout;
