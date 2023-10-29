/* eslint-disable-next-line */
import {Footer, Header} from 'ui';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HomeProps {
}

export function Home(props: HomeProps) {
    return (
        <div>
            <Header/>
            <h1>Welcome to Home!</h1>
            <Footer/>
        </div>
    );
}

export default Home;
