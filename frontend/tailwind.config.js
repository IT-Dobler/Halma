const {createGlobPatternsForDependencies} = require('@nx/react/tailwind');
const {join} = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        join(
            __dirname,
            '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
        ),
        ...createGlobPatternsForDependencies(__dirname),
    ],
    theme: {
        colors: {
            "dark-green": "#546F01",
            "black": "#181F0D",
            "disabled-grey": "#929292"
        },
        extend: {},
    },
    plugins: [],
};
