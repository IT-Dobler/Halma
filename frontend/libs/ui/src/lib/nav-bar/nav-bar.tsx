import { Link } from 'wouter';

/* eslint-disable-next-line */
export interface NavBarProps {}

export function NavBar(props: NavBarProps) {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link href={'/'}>
          <a className="btn btn-ghost normal-case text-xl">Halma42.com</a>
        </Link>

        <ul className="menu menu-horizontal px-4">
          <li>
            <Link href={'/solo-play'}>
              <a>PLAY</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-none"></div>
    </div>
  );
}

export default NavBar;
