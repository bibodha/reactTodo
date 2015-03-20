module.exports = {
    entry: "./public/javascripts/todo.jsx",
    output: {
        filename: "./public/javascripts/todo.js"
    },
    module: {
        loaders: [
            { test: /\.jsx$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};
