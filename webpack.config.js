module.exports = {
    context: __dirname,
    entry: {
        javascript: "./src/appRoot.js",
        html: "./index.html"
    },

    output: {
        filename: "app.js",
        path: __dirname + "/dist"
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ["babel-loader"]
            },
            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]"
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }
        ]
    }
};
