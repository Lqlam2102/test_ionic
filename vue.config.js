module.exports = {
    transpileDependencies: ["@vueform"],
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    configureWebpack: {
        devServer: {
            client: {
                overlay: {
                    warnings: false,
                    errors: true,
                },
            },
        },
    },
}