const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/renderer/index.tsx', // React 엔트리 포인트
    target: 'web',
    mode: 'production', // 개발 모드 변환 => decvelopment, // 개발 모드 설정 ('production'으로 변경 가능)
    output: {
        filename: 'renderer.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        fallback :{
            "crypto": false,
            "os": false,
            "path": false
            
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'], // TailwindCSS 처리
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html', // 원본 HTML 템플릿 경로
            filename: 'index.html', // dist 디렉토리에 복사될 파일 이름
        }),
    ],
};
