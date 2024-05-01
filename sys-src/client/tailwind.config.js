module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            spacing: {
                128: '32rem',
                256: '40rem',
                300: '50rem',
            },
            screens: {
                tablet: '640px',
                // => @media (min-width: 640px) { ... }

                tabLaptop: '825px',
                // => @media (min-width: 640px) { ... }

                laptop: '1024px',
                // => @media (min-width: 1024px) { ... }

                desktop: '1280px',
                // => @media (min-width: 1280px) { ... }

                big: '1600px',
                // => @media (min-width: 1600px) { ... }
            },
        },
    },
    plugins: [require('@tailwindcss/line-clamp')],
};
