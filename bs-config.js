module.exports = {
    server: {
        baseDir: ".",
        serveStaticOptions: {
            extensions: ["html"]
        }
    },
    files: ["**/*.html", "**/*.css", "**/*.js"],
    port: 8000,
    open: false,
    notify: false,
    https: true
};
