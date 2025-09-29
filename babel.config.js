module.exports = {
    presets: [
        '@babel/preset-env',
        ['@babel/preset-react', { runtime: 'automatic' }], // React 17/18 新 JSX
        '@babel/preset-typescript'
    ],
    plugins: [
        [
            'import',
            {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: 'css', // 可以改成 'true' 使用 less
            },
            'antd'
        ]
    ]
}
