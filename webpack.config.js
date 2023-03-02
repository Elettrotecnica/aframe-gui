const config = {
    entry: {
        js: './src/index.js',
    },
    output: {
        path: __dirname,
        filename: './dist/aframe-gui.js',
    },
    module: {},
    plugins: [],
};

module.exports = { default: config }
