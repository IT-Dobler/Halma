/* eslint-disable-next-line */
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FooterProps {
}

export function Footer(props: FooterProps) {
    return (
        <div>
            <div className="fixed bottom-0 w-full">
                <p className="text-center text-black">IMPRESSUM</p>
            </div>
        </div>
    );
}