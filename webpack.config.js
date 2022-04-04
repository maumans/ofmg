const path = require('path');

module.exports = {
    resolve: {
        alias: {
            '@': path.resolve('resources/js'),
        },
        fallback: {
            "stream": require.resolve("stream-browserify"),
            "zlib": require.resolve("browserify-zlib")
        }
    },
};
