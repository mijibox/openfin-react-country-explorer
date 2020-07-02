const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const {
    NODE_ENV = 'development',
} = process.env;
const isProduction = NODE_ENV === 'production';

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
           
            {
                test: /\.css$/,
                use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
            },
            
            {
                test: /\.scss$/,
                use: [
                  isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                  {
                    loader: 'css-loader',
                    options: {
                      modules: true,
                      localIdentName: '[name]__[local]___[hash:base64:5]',
                      sourceMap: !isProduction
                    }
                  },
                  {
                    loader: 'sass-loader',
                    options: {
                      sourceMap: !isProduction
                    }
                  }
               ],
            }        
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.[hash]-[name].css'
        }),
        new CopyPlugin([
            { from: 'public/', to: 'dist/' },
        ]),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    }    
};