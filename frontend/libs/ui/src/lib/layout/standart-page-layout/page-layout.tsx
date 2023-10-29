import React from 'react';
import styles from './page-layout.module.scss';

/* eslint-disable-next-line */
export interface PageLayoutProps {
}

export function PageLayout(props: PageLayoutProps) {
    return (
            <div className={styles['container']}>
                <h1>Welcome to PageLayout!</h1>
            </div>
    );
}

export default PageLayout;
