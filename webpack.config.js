const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: argv.mode || 'development',
    
    entry: {
      code: './code.js',
      ui: './ui.html'
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: isProduction
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.html$/i,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]',
          },
        },
      ],
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './ui.html',
        filename: 'ui.html',
        chunks: [], // HTMLファイルはそのまま出力
        inject: false
      })
    ],

    devtool: isProduction ? false : 'inline-source-map',

    watch: !isProduction,

    // Figmaプラグイン用の最適化
    optimization: {
      minimize: isProduction,
      splitChunks: false // Figmaプラグインは単一ファイルが必要
    },

    // 外部依存関係を除外（Figma環境では利用不可）
    externals: {
      // 必要に応じて外部ライブラリを指定
    }
  };
};