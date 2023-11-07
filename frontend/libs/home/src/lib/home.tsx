/* eslint-disable-next-line */
import { StandardPageLayout } from 'ui';
import { Link } from 'wouter';

export function Home() {
  return (
    <StandardPageLayout>
      <div>
        <div className="grid grid-cols-2 mt-20">
          <div className="flex items-center flex-col">
            <div className="prose">
              <h2 className="mt-40 text-center">
                Halma42 is a free, open source Halma platform.
              </h2>
              <span>Contributions welcome: </span>
              <a target={'_blank'} href="https://github.com/dobler-it/Halma">
                GitHub
              </a>
            </div>
            <div
              className="tooltip btn-block max-w-lg mt-40"
              data-tip="Coming Soon!"
            >
              <button
                className="btn btn-outline btn-block max-w-lg"
                disabled={true}
              >
                DONATE
              </button>
            </div>
          </div>
          <div className="flex items-center flex-col justify-between">
            <Link href={'/solo-play'}>
              <button className="btn btn-outline btn-block max-w-lg">
                PLAY
              </button>
            </Link>
            <div
              className="tooltip btn-block max-w-lg"
              data-tip="Coming Soon(TM)!"
            >
              <button
                className="btn btn-outline btn-block max-w-lg"
                disabled={true}
              >
                PLAY WITH A FRIEND
              </button>
            </div>
            <div
              className="tooltip btn-block max-w-lg"
              data-tip="Hopefully one day..."
            >
              <button
                className="btn btn-outline btn-block max-w-lg"
                disabled={true}
              >
                PLAY WITH THE COMPUTER
              </button>
            </div>
          </div>
        </div>
      </div>
    </StandardPageLayout>
  );
}

export default Home;
