const path = require('path');

module.exports = {
    entry: './src/main/main.ts',// Electron 메인 프로세스
    target: 'electron-main',
    mode: 'production', // 개발 모드 변환 => decvelopment, // 개발 모드 설정 ('production'으로 변경 가능
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
};
