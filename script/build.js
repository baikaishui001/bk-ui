/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs')
// 引入vite导出的build方法，用它来创建
const { defineConfig, build } = require('vite')
const vue = require('@vitejs/plugin-vue')
const vueJsx = require('@vitejs/plugin-vue-jsx')
const fsExtra = require('fs-extra')

// 入口文件
const entryFile = path.resolve(__dirname, './entry.ts')
// 组件目录
const componentsDir = path.resolve(__dirname, '../src')
// 输出目录
const outputDir = path.resolve(__dirname, '../build')

//基础配置
const baseConfig = defineConfig({
  configFile: false,
  publicDir: false,
  plugins: [vue(), vueJsx()]
})
//rollup配置
const rollupOptions = {
  //外置
  external: ['vue', 'vue-router'],
  output: {
    globals: {
      vue: 'Vue'
    }
  }
}
// 创建 package.json
const createPackageJSON = name => {
  const fileStr = `{
    "name": "${name ? name : 'bk-ui'}",
    "version": "0.0.1",
    "main": "${name ? 'index.umd.js' : 'sheep-ui.umd.js'}",
    "module": "${name ? 'index.umd.js' : 'sheep-ui.es.js'}",
    "author": "白开水",
    "description": "这时白开水第一个库希望他愈发强大！！",
    "repository": {
      "type": "git",
      "url": "https://github.com/baikaishui001/bk-ui"
    },
    "keywords": ["vue3", "组件库", "tsx", "UI"],
    "license": "ISC",
    "bugs": {
      "url": "https://github.com/baikaishui001/bk-ui/issues"
    }
  }`
  if (name) {
    console.log('按需打包')
  } else {
    fsExtra.outputFile(
      path.resolve(outputDir, 'package.json'),
      fileStr,
      'utf-8'
    )
  }
}
//全量构建
const buildAll = async () => {
  await build(
    defineConfig({
      ...baseConfig,
      build: {
        rollupOptions,
        lib: {
          entry: entryFile,
          name: 'bk-ui',
          fileName: 'bk-ui',
          formats: ['es', 'umd']
        },
        outDir: outputDir
      }
    })
  )
}

//但组件按需构建
const buildSingle = async name => {
  await build(
    defineConfig({
      ...baseConfig,
      build: {
        rollupOptions,
        lib: {
          entry: path.resolve(componentsDir, name),
          name: 'bk-ui',
          fileName: 'bk-ui',
          formats: ['es', 'umd']
        },
        outDir: path.resolve(outputDir, name)
      }
    })
  )
}
const buildLib = async () => {
  await buildAll()
  createPackageJSON()
  fs.readdirSync(componentsDir)
    .filter(name => {
      const componentDir = path.resolve(componentsDir, name)
      const isDir = fs.lstatSync(componentDir).isDirectory()
      return isDir && fs.readdirSync(componentDir).includes('index.ts')
    })
    .forEach(name => {
      buildSingle(name)
      createPackageJSON(name)
    })
}
buildLib()
