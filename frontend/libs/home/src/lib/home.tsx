/* eslint-disable-next-line */
import {Footer, Header} from 'ui';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HomeProps {
}

export function Home(props: HomeProps) {
    return (
        <div>
            <Header/>
            <div className="flex justify-between items-center">

                <div className="">
                    <h1 className="ml-6 mt-20 text-brown text-5xl font-bold leading-relaxed">
                        Halma42: Open-source platform<br/>
                        for Halma gaming and<br/>
                        development
                    </h1>
                    <h2 className="ml-6 mt-5 text-brown text-3xl font-bold">
                        Free from ads:
                        <a className="ml-2 text-light-green underline"> Über Halma42... </a>
                    </h2>
                </div>

                <div className="mr-40">
                    <div className="mb-10 mt-60">
                        <button
                            className="bg-light-yellow hover:bg-light-green text-black text-2xl font-medium py-5 w-80 rounded">
                            PLAY
                        </button>
                    </div>

                    <div className="mb-10">
                        <button
                            className="bg-light-yellow hover:bg-light-green text-black text-2xl font-medium py-5 w-80 mr-20 rounded">
                            PLAY WITH A FRIEND
                        </button>
                    </div>

                    <div className="mb-10">
                        <button
                            className="bg-light-yellow hover:bg-light-green text-black text-2xl font-medium py-5 w-80 rounded">
                            PLAY WITH THE COMPUTER
                        </button>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Home;
