module.exports = {
    // 根据环境变量加载不同预设
    presets: (() => {
        // Taro 项目环境：启动命令中会设置 PROJECT_TYPE=Taro
        if (process.env.PROJECT_TYPE === 'Taro') {
            return [
                ['taro', {
                    framework: 'react', // Taro 基于 React
                    ts: true // 你的项目用 TypeScript
                }]
            ];
        }
        // React 项目环境（默认）
        return [
            '@babel/preset-env',
            ['@babel/preset-react', { runtime: 'automatic' }], // React 17+/18 JSX
            '@babel/preset-typescript'
        ];
    })(),
    // 根据环境变量加载不同插件
    plugins: (() => {
        const basePlugins = [
            // 两个项目共用：antd 按需加载
            [
                'import',
                {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: 'css'
                },
                'antd'
            ]
        ];

        // Taro 项目额外需要：MobX 必需的装饰器插件
        if (process.env.PROJECT_TYPE === 'Taro') {
            basePlugins.push(
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-proposal-class-properties', { loose: true }]
            );
        }

        return basePlugins;
    })()
}
