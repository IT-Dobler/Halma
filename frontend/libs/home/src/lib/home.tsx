/* eslint-disable-next-line */
import { StandardPageLayout } from 'ui';
import { Link } from 'wouter';

export interface HomeProps {}

export function Home(props: HomeProps) {
  return (
    <StandardPageLayout>
      <div>
        <div className="grid grid-cols-2 mt-20">
          <div className="flex items-center flex-col">
            <div className="prose">
              <h2 className="mt-40 text-center">
                Halma42 is a free, open source Halma platform.
              </h2>
            </div>
            <button
              className="btn btn-outline btn-block max-w-lg mt-40"
              disabled={true}
            >
              DONATE
            </button>
          </div>
          <div className="flex items-center flex-col justify-between">
            <Link href={'/solo-play'}>
              <button className="btn btn-outline btn-block max-w-lg">
                PLAY
              </button>
            </Link>
            <button
              className="btn btn-outline btn-block max-w-lg"
              disabled={true}
            >
              PLAY WITH A FRIEND
            </button>
            <button
              className="btn btn-outline btn-block max-w-lg"
              disabled={true}
            >
              PLAY WITH THE COMPUTER
            </button>
          </div>
        </div>
      </div>
    </StandardPageLayout>
  );
}

export default Home;
