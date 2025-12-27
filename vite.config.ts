import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx' // 启用 TSX/JSX 支持
import viteESLint from '@ehutch79/vite-eslint'
import { createStyleImportPlugin, AndDesignVueResolve } from 'vite-plugin-style-import'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import {resolve} from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteESLint({'include': ['src/**/*.vue', 'src/**/*.tsx', 'src/**/*.ts']}),
    vueJsx({}),
    // 自动按需引入 AntD 组件（无需手动 import）
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: 'less', // 用 less 样式（可选，需安装 less）
          resolveIcons: true // 自动引入图标
        })
      ]
    }),
    createStyleImportPlugin({
      resolves: [
        AndDesignVueResolve()
      ],
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'], // 支持 TSX 后缀
  },
  build: {
    // 输出目录（默认 dist，可自定义）
    outDir: 'dist',
    // 静态资源目录（默认 assets）
    assetsDir: 'assets',

    // 代码压缩
    minify: 'esbuild', // Vite 默认，比 terser 更快
    // 拆分代码（减小单文件体积）
    rollupOptions: {
      output: {
        // 按模块拆分 chunk
        // manualChunks: {
        //   // 将 AntD 单独拆分为一个 chunk
        //   antd: ['ant-design-vue'],
        //   // 将 Vue 相关单独拆分
        //   vue: ['vue', 'vue-router']
        // },
        // 静态资源哈希命名规则（避免缓存）
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // 生产环境移除 console.log（可选）
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  base: './'
})
