## 2025年最新前端工程化面试攻略

## 1. [Webpack] 配置代码太多，达到数千行，这个时候该如何优化配置代码【热度: 186】

当 Webpack 配置代码变得冗长和难以管理时，可以采取以下方法来优化配置：

##### 配置文件拆分

将配置文件分成多个部分，每个文件只负责一部分逻辑。比如基础配置、开发环境配置、生产环境配置等。

```javascript
// webpack.base.js - 存放共同的配置项
// webpack.dev.js - 开发环境特定的配置项
// webpack.prod.js - 生产环境特定的配置项
```

##### • 使用环境变量

通过环境变量来区分不同的配置环境，使用 webpack-merge 或 env-cmd 这样的库来合并配置。

```javascript
// 通过环境变量确定不同的配置文件
const env = process.env.NODE_ENV;

let config;
if (env === "production") {
    config = require("./webpack.prod.js");
} else {
    config = require("./webpack.dev.js");
}

module.exports = config;
```

##### 模块化配置

将常用的 loader、plugins、entry 等配置项封装成函数或者模块，然后在主配置文件中引入。

```javascript
// loaders.js - 存放所有loader的配置
// plugins.js - 存放所有plugins的配置
// entries.js - 存放入口文件配置

const loaders = require("./loaders");
const plugins = require("./plugins");
const entries = require("./entries");

module.exports = {
    module: {
        rules: loaders.getRules(),
    },
    plugins: plugins.getPlugins(),
    entry: entries.getEntries(),
    // ...
};
```

##### • 使用 webpack-merge 抽离通用配置

检查配置中的重复部分，将它们抽象成共用的配置，再使用 webpack-merge 来合并多个配置文件，保持配置的清晰和可维护性。

```javascript
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const devConfig = require("./webpack.dev.js");

module.exports = merge(baseConfig, devConfig);
```

##### 统一管理插件和加载器

如果项目中使用了大量插件和加载器，请考虑将它们的实例化和配置逻辑封装在单独的函数或文件中。然后根据不同的环境，直接 pick 不同的配置即可。可以达到配置的 loader 和 plugin 集中管理。

## 2. [Webpack] 你用过哪些可以提高效率的插件？【热度: 179】

• webpack-dashboard：可以更友好的展示相关打包信息。

• webpack-merge：提取公共配置，减少重复配置代码

• speed-measure-webpack-plugin：简称 SMP，分析出 Webpack 打包过程中 Loader 和 Plugin 的耗时，有助于找到构建过程中的性能瓶颈。

• size-plugin：监控资源体积变化，尽早发现问题

• HotModuleReplacementPlugin：模块热替换

• webpack.ProgressPlugin：打包进度分析

• webpack-bundle-analyzer: 打包结果分析

• friendly-errors-webpack-plugin：代码源码编译报错友好提示

## 3. 在做 eslint 和 commitlint 的时候，可以使用 --no-verify 跳过，这种情况下该如何强制卡点【热度: 233】

跳过 eslint 和 commitlint 的钩子，使用 --no-verify（对于 git commit 来说是 -n），的确是一个容许开发者在紧急情况下超越钩子检查的手段。然而，这也削弱了代码质量保证的制度。以下是一些方法，可以用来加强这些卡点的靠谱办法：

- CI/CD 流水线中增加检查：在你的 CI/CD 流程中增加 eslint 和 commitlint 的检查步骤。如果检查失败，则阻止代码合并或部署。

- 强制挂钩：虽然开发者可能在本地禁用钩子，但你不能控制别人的本地环境。相反，你可以编写服务器端的钩子，比如在 Git 仓库的服务器上使用 pre-receive 钩子，来拒绝不符合规范的提交。

- 定期自动化检查：定期运行一个自动化的脚本或 GitHub Action，检查代码库的 eslint 与 commitlint 违规情况，并自动创建一个修复问题的 issue 或拉取请求。

你可以最大限度地减少绕过 eslint 和 commitlint 检查的情况。然而，值得记住的是，在极少数情况下，可能存在合法的理由需要紧急提交代码。因此，为了灵活性和效率，完全禁止 --no-verify 可能不是一个最佳的选择。好的实践中应该找到安全和灵活性之间的平衡，核心在于建立一个质量意识，制定明智的操作规范。

## 4. 如何做 commit lint 【热度: 425】

Commit lint 是一种实践，用于在代码库中规范化提交信息的格式。这种做法通常有助于团队成员理解代码库的历史记录，以及自动化生成变更日志。下面是实施 Commit lint 的一些基本步骤：

1. 选择 Commit 信息规范：首先，你需要选择一个提交信息的规范，最常见的是 Conventional Commits，它具有明确的结构和规则。

2. 配置 Linter 工具：commitlint 是一个流行的工具，用于检查提交信息是否符合规定的格式。安装 commitlint，通常是作为项目的开发依赖。

```javascript
npm install --save-dev @commitlint/{config-conventional,cli}
```

3. 设置 commitlint 配置：在你的项目根目录下创建一个名为 commitlint.config.js 的文件，并且导入你选择的规范：

```javascript
module.exports = { extends: ["@commitlint/config-conventional"] };
```

4. 安装钩子（Hook）管理工具：Husky 是一个钩子管理工具，它可以助你轻松的在 Git 挂钩中添加脚本（例如，在 commit 之前检查提交信息格式）。

```bash
npm install husky --save-dev
```

##### 1. 配置 Husky 来使用 commitlint:

☐ 初始化 husky:

```bash
npx husky install
```

添加 commit-msg 钩子来使用 commitlint。执行非交互式的命令配置钩子脚本：

```bash
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

这行代码会在 .husky/commit-msg 文件中创建一个钩子，并且在你试图创建提交时，会调用 commitlint 来检查你的提交信息。

5. 提交代码：当你提交代码时，Husky 会触发 commit-msg 钩子调用 commitlint 检查提交信息。如果信息不符合规范，提交将被拒绝，并显示错误信息。

6. 配置 CI/CD 流水线：为了确保规范被强制执行，可以在 CI/CD 流水线中添加一步来执行 commitlint。这样，如果提交的信息不符合规范，构建将会失败。

## 5. 编写 npm 包的时候，可以办法自动生成 changlog 与自动更新 tag【热度: 455】

在编写 npm 包时，可以使用自动化工具来生成 changelog 和自动更新 tag。以下是你可以使用的一些流行的工具以及它们的基本用法。

1. semantic-release: 这是一个全自动的版本管理和包发布工具。它能根据 commit 信息来自动决定版本号、生成变更日志（changelog）以及发布。

2. 要使用 semantic-release，你需要按照以下步骤操作：

☐ 安装 semantic-release 工具：

```bash
npm install -D semantic-release
```

在项目中添加配置文件(semantic-release.config.js)或在 package.json 中配置

☐ 在 CI 工具中（例如 GitHub Actions、Travis CI）配置发布脚本。

遵循规范化的 commit 消息风格（如 Angular 规范），因为 semantic-release 会根据 commit 消息来确定版本号和生成 changelog。

3. standard-version: 如果你更希望进行半自动化的版本管理，standard-version 是一个很好的替代选择。它可以自动地根据 commit 记录来生成 changelog。

4. 使用 standard-version 的大致步骤如下:

☐ 安装 standard-version 工具：

```bash
npm install --save-dev standard-version
```

在 package.json 中配置脚本：

```json
{
    "scripts": {
        "release": "standard-version"
    }
}
```

当你准备发布新版本时，运行以下命令：

```bash
npm run release
```

standard-release 会自动根据 commit 消息创建一个新的 tag，并更新 changelog。然后，你可以手动推送这些改动到仓库。

在这两种情况下，都推荐使用遵循某种规范的 commit 消息，如 Conventional Commits 规范，这样可以让工具更准确地解析 commit 消息来进行版本管理。此外确保你的 CI/CD 系统有足够的权限来推送 tags 到远程仓库。

## 6. [Webpack] ts 编写的库，在使用 webpack 构建的时候，如何对外提供 d.ts 【热度: 224】

在 TypeScript (TS) 中使用 Webpack 构建并为库提供 .d.ts 类型声明文件，需要遵循以下步骤：

1. 配置 TypeScript 编译选项：

在库项目的根目录下创建或编辑 tsconfig.json 文件确保编译器配置选项如下：

```json
{
    "compilerOptions": {
        "declaration": true,
        "declarationDir": "types",
        "outDir": "lib",
        "include": ["src/**/*"],
        "exclude": ["node_modules"]
    }
}
```

☐ declaration: 这个选项会告诉 TypeScript 编译器为每个 .ts 文件生成相应的 .d.ts 声明文件。

☐ declarationDir: 这是指定声明文件的输出目录。

##### 2. 配置 Webpack

在我们的 Webpack 配置中（通常是 webpack.config.js），我们需要设置 output 以指向我们的输出目录，同时可能需要使用一些加载器(loader)如 ts-loader 或 babel-loader 来处理 TypeScript 文件。

一个简单的 webpack 配置示例可能如下:

```javascript
const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "your-library.js",
        path: path.resolve(__dirname, "lib"),
        libraryTarget: "umd",
        globalObject: "this",
    },
};
```

##### 3. 发布包：

当你发布你的库时，你需要确保 package.json 文件中包含 types 或 typings 字段指向入口 .d.ts 文件。

例如：

```json
{
    "name": "your-library",
    "version": "1.0.0",
    "main": "lib/your-library.js",
    "typings": "types/index.d.ts"
}
```

这告诉你用你库的 TypeScript 用户，在哪里可以找到类型声明文件。

4. 保证类型声明文件的发布：

如果你的 npm 发布流程排除了 types 目录，你需要更新 .npmignore 文件来确保 .d.ts 文件会被包含在发布的 npm 包中。

完成这些配置后，当你用 webpack 构建并发布你的库时，用户将能够获得与 JavaScript 文件关联的 TypeScript 类型声明，以便在他们的 TypeScript 项目中获得类型检查和智能提示。

## 7. 测试前端代码覆盖率一般有什么手段？【热度: 550】

前端代码的测试覆盖率通常是指衡量在测试过程中有多少代码被执行了的一个指标。测试覆盖率有助于了解测试的全面性，以下是测试前端代码覆盖率常用的手段：

1. 单元测试：

☐ 使用测试框架（例如 Jest, Mocha, Jasmine 等）编写单元测试。

利用测试框架或插件生成覆盖率报告（例如 Istanbul/nyc 工具可以与这些框架集成以生成覆盖率数据）。

2. 集成测试：

☐ 使用测试工��（��如 Cypress, Selenium 等）编写集成测试来模拟用户操作。

通常这些工具也支持收集代码覆盖率信息。

3. 手动测试与覆盖率工具结合：

在手动测试过程中，可以开启浏览器的覆盖率工具（如 Chrome DevTools 中的 Coverage Tab）记录覆盖率。

可以通过浏览器扩展程序或者自动化脚本来启动这些工具。

4. 测试覆盖率服务：

☐ 使用像 Codecov 或 Coveralls 这样的服务，在 CI/CD 流程中集成覆盖率测试和报告。

## 8. [Webpack] 如何提取复用代码给多个 entry 使用？【热度: 292】

在 Webpack 中提取源码里被多个入口点复用的代码，例如一个 utils 文件，可以通过配置 optimization.splitChunks 来实现。Webpack 会将这些频繁复用的模块提取出来，打包到一个独立的 chunk 中，使得浏览器可以单独缓存这部分代码，并在多个页面间共享使用，优化加载性能。

使用 splitChunks 的基本配置如下:

```javascript
module.exports = {
    // ...其他配置...
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: 2,
                    minSize: 0,
                },
            },
        },
    },
};
```

##### 这个配置的含义是：

- chunks: 'all' 指定要优化的 chunk 类型，这里设置为 all 代表所有的 chunk，不管是动态还是非动态加载的模块。

- cacheGroups 是一个对象，用于定义缓存组，可以继承和/或覆盖 splitChunks 的任何选项。每个缓存组可以有自己的配置，将不同的模块提取到不同的文件中。

- cacheGroups.commons 定义了一个缓存组，专门用于提取 initial chunk（最初依赖的模块）中被至少两个 chunk 所共享的模块。

- name: 'commons' 为生成的文件定义了一个自定义名称。

• minChunks：2 表示模块至少被两个入口点引用时，才会被��取。

• minSize: 0 指定模块的最小体积是 0，即任意大小的模块都被提取。

这会让任何从 node_modules 目录导入，并在至少两个入口点中使用的模块，都会被打包到一个名为 commons.js 的文件中（当然，实际的文件名会受到 output 配置的影响，例如是否包含哈希值等）。

正确配置这些参数后，utils 这样的模块就会被自动提取并共享，而不是在每个入口点的 bundle 中重复包含。这样做的好处是，任何更新业务逻辑的时候，只要 utils 没有发生变化，用户浏览器上已缓存的 commons.js 文件就不需要重新下载。

## 9. [Webpack] 如何将一些通用的依赖打包成一个独立的 bundle 【热度: 643】

在 Webpack 中，将一些通用的依赖，如 React、React DOM、React Router 等库和框架，打包成一个独立的 bundle，通常是为了长期缓存和减少每次部署更新的下载量。这可以通过 "代码分割" (code splitting) 和 "优化" (optimization) 配置来实现。

以下是 Webpack 中分离通用依赖的几个步骤：

1. 使用 entry 来定义不同的入口点:可以通过配置一个额外的入口来创建一个只包含通用库的 bundle，也就是所谓的 "vendor" bundle。

```javascript
module.exports = {
    entry: {
        main: "./src/index.js",
        vendor: ["react", "react-dom", "react-router"],
    },
};
```

2. 使用 SplitChunksPlugin: 这个插件可以将共享代码分割成不同的 chunks，并可以通过配置将其从业务代码中分离出来。在 Webpack 4 及之后的版本中，默认内置了 optimization.splitChunks，就是这个插件的配置方法。

```javascript
module.exports = {
    // ...
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\/]node_modules[\/]/,
                    name: "vendors",
                    chunks: "all",
                },
            },
        },
    },
};
```

3. 配置 output:虽然不是必须的，你还可以可以在 output 中定义 filename 和 chunkFilename ，来控制主入口和非主入口 chunks 的文件名。

```javascript
output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js'
}
```

通过这样的配置，Webpack 在打包时会自动将 node_modules 中的依赖和业务代码分离开来，业务代码会被打包到 main chunk 中，而第三方库则会打包到 vendors chunk。

## 10. [Webpack] output 配置里面，chunkFilename 和 filename 区别是什么？【热度: 210】

在 Webpack 中的 output 配置对象中，filename 和 chunkFilename 是用来指定输出文件的命名方式的关键属性。它们之间的区别主要涉及到最终生成的 JavaScript 文件的类型。

1. filename: filename 属性用于指定输出的 bundle 的名称。当你的应用只有一个入口点时，可以直接使用一个固定名称。如果有多个入口点，那么你可以使用占位符来确保每个文件具有唯一的名称，如使用 name 来对应每个入口点的名称。 filename 主要与入口点相关联的那些文件有关。

```javascript
output: {
    filename: "bundle.js",
    // 或者
    filename: "[name].bundle.js",
}
```

2. chunkFilename: chunkFilename 属性用于指定非入口的 chunk（通常是动态加载的模块）的名称。这些 chunk 文件通常是由于代码分割产生的。当使用如 import() 这样的动态导入语法时，Webpack 会分割代码到新的 chunk 中，这时候 chunkFilename 的命名规则就会被应用。

```javascript
output: {
    chunkFilename: "[name].chunk.js",
}
```

这意味着如果你有一个动态加载的模块（例如懒加载模块），Webpack 会使用 chunkFilename 的规则来生成这些额外的文���。���样，你也可以在 chunkFilename 中使用占位符来保持文件名的唯一性。常用的占位符有 [id]，[name]，[chunkhash] 等。

使用这两个属性使得 Webpack 能够区分出入口文件和其他类型的文件，从而允许开发者更好地控制输出资源的命名和缓存。

## 11. [Webpack] 多入口打包共享模块【热度: 337】

默认情况下，每个入口 chunk 保存了全部其用的模块(modules)。使用 dependOn 选项你可以与另一个入口 chunk 共享模块:

```javascript
module.exports = {
    entry: {
        app: { import: "./app.js", dependOn: "react-vendors" },
        "react-vendors": ["react", "react-dom", "prop-types"],
    },
};
```

app 这个 chunk 就不会包含 react-vendors 拥有的模块了.

dependOn 选项的也可以为字符串数组：

```javascript
module.exports = {
    entry: {
        moment: { import: "moment-mini", runtime: "runtime" },
        "react-vendors": { import: ["react", "react-dom"], runtime: "runtime" },
        testapp: { import: "./wwwroot/component/TestApp.tsx" },
        dependOn: ["react-vendors", "moment"]
    },
};
```

此外，你还可以使用数组为每个入口指定多个文件：

```javascript
module.exports = {
    entry: {
        app: {
            import: ["./app.js", "./app2.js"],
            dependOn: "react-vendors"
        },
        "react-vendors": ["react", "react-dom", "prop-types"]
    },
};
```

##### 看一个完整案例

```javascript
module.exports = {
    entry: {
        home: "./home.js",
        shared: ["react", "react-dom", "redux", "react-redux"],
        catalog: {
            import: "./catalog.js",
            filename: "pages/catalog.js",
            dependOn: "shared",
            chunkLoading: false,
        },
        personal: {
            import: "./personal.js",
            filename: "pages/personal.js",
            dependOn: "shared",
            chunkLoading: "jsonp",
            asyncChunks: true,
            layer: "name of layer",
        },
    },
};
```

## 12. [Webpack] 如何使用 ts 来编写配置文件？【热度: 251】

要使用 Typescript 来编写 webpack 配置，你需要先安装必要的依赖，比如 Typescript 以及其相应的类型声明，类型声明可以从 DefinitelyTyped 项目中获取，依赖安装如下所示：

```bash
npm install --save-dev typescript ts-node @types/node @types/webpack
```

如果使用版本低于 v4.7.0 的webpack-dev-server，还需要安装以下依赖

```bash
npm install --save-dev @types/webpack-dev-server
```

完成依赖安装后便可以开始编写配置文件，示例如下：

```typescript
import * as path from "path";
import * as webpack from "webpack";

// in case you run into any typescript error when configuring devServer
import "webpack-dev-server";

const config: webpack.Configuration = {
    mode: "production",
    entry: "./foo.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "foo.bundle.js",
    },
};

export default config;
```

该示例需要 typescript 版本在 2.7 及以上，并在 tsconfig.json 文件的 compilerOptions 中添加 esModuleInterop 和 allowSyntheticDefaultImports 两个配置项。

值得注意的是你需要确保 tsconfig.json 的 compilerOptions 中 module 选项的值为 commonjs,否则 webpack 的运行会失败报错，因为 ts-node 不支持 commonjs 以外的其他模块规范。

你可以通过三个途径来完成 module 的设置：

• 直接修改 tsconfig.json 文件

修改 tsconfig.json 并且添加 ts-node 的设置。

• 使用 tsconfig-paths

第一种方法就是打开你的 tsconfig.json 文件，找到 compilerOptions 的配置，然后设置 target 和 module 的选项分别为 "ES5" 和 "CommonJs" (在 target 设置为 es5 时你也可以不显示编写 module 配置)。

第二种方法就是添加 ts-node 设置：

你可以为 tsc 保持 "module": "ESNext" 配置，如果你是用 webpack 或者其他构建工具的话，为 ts-node 设置一个重载（override）。ts-node 配置项

```json
{
    "compilerOptions": {
        "module": "ESNext"
    },
    "ts-node": {
        "compilerOptions": {
            "module": "CommonJS"
        }
    }
}
```

第三种方法需要先安装 tsconfig-paths 这个 npm 包，如下所示：

```bash
npm install --save-dev tsconfig-paths
```

安装后你可以为 webpack 配置创建一个单独的 TypeScript 配置文件，示例如下:

创建 tsconfig-for-webpack-config.json：

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "esModuleInterop": true
    }
}
```

##### 提示

ts-node 可以根据 tsconfig-paths 提供的环境变量 process.env.TS_NODE_PROJECT 来找到 tsconfig.json 文件路径。

process.env.TS_NODE_PROJECT 变量的设置如下所示:

在 package.json 中配置：

```json
{
    "scripts": {
        "build": "cross-env TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack"
    }
}
```

之所以要添加 cross-env，是因为我们在直接使用 TS_NODE_PROJECT 时遇到过 "TS_NODE_PROJECT" unrecognized command 报错的反馈，添加 cross-env 之后该问题也似乎得到了解决

## 13. [Webpack] 内部执行原理【热度: 668】

这部分可��直接转官网，官网讲得非常好：

https://www.webpackjs.com/concepts/under-the-hood/

## 14. [Webpack] 为何不支持 CMD 模块化【热度: 255】

1. CMD 是国内产品，webpack 是国外产品，而且 CMD 还没有火起来的时候，就已经被 ESM 替代了

2. CMD 是更加懒惰，是依赖就近，延迟执行。也就是说，在模块中需要用到依赖时，才去引入依赖。这和 Webpack 的理念以及模块收集和打包机制不兼容

CMD（Common Module Definition）是一种深受国内前端开发者喜爱的模块定义规范，主要被用在了 Sea.js 这个模块加载器中。CMD 是国内开发者提出的规范，它和 AMD 很相似，但是更符合国内开发者的习惯，需要时可以延迟执行。

Webpack 本身是围绕 NPM 生态和标准化模块格式（如 ES Modules 和 CommonJS）构建的，而 NPM 生态主要使用的是 CommonJS 形式。因此，对于大多数使用 NPM 之 Webpack 的用户来说，这些就足够用了。而 ES Modules 作为 JavaScript 官方的模块系统标准，越来越多地在现代应用中被采用。

面对 CMD，Webpack 的社区并没有广泛地采用或者需要支持这种模块定义。CMD 在模块定义时依赖于具体的 API 和加载时机，这和 Webpack 的理念以及模块收集和打包机制不完全兼容。Webpack 鼓励在编译时就确定模块依赖，而 CMD 更倾向于运行时动态确定。

尽管如此，理论上是可以通过一些插件或 loader 来实现对 CMD 模块的支持的，但是官方并没有集成这样的功能，因为需求没有那么大，同时现有的模块加载机制已经可以满足绝大多数场景的需要。随着前端工程化的深入，标准化的模块定义（如 ES Modules）更加受到青睐，而特定的模块定义（如 CMD）则逐渐被边缘化。因此，Webpack 没有默认支持 CMD，也反映了当前前端模块化开发的趋势和实践。

## 15. [Webpack] 支持哪些模块化加载? 【热度: 154】

Webpack 支持以下几种模块化标准：

1. ESM (ECMAScript Modules): 这是 JavaScript ES6 中引入的官方标准模块系统。使用 import 和 export 语句来导入和导出模块。

2. CommonJS: 主要用于 Node.js，允许使用 require() 来加载模块和 module.exports 来导出模块。

3. AMD (Asynchronous Module Definition): 用于异步加载模块，并使用 define 方法来定义模块。

4. UMD (Universal Module Definition): 结合了 AMD 和 CommonJS 的特点，并支持全局变量定义的方式，使得模块可以在客户端和服务端上运行。

除此之外，Webpack 还可以处理非 JavaScript 文件并将它们视为模块，例如 CSS, LESS, SASS, 图像文件(PNG, JPG, GIF, SVG 等)，字体(OTF, TTF, WOFF, WOFF2, EOT), HTML 以及任何其他类型的文件。这通过使用相应的 loader 来实现，如 style-loader, css-loader, file-loader 等。这些 loader 会将非 JavaScript 文件转换为可以被 Webpack 处理的模块。

## 16. 前端视角 - 如何保证系统稳定性【热度: 566】

前端视角来做稳定性，本是一个开放性话题，这里没有统一的解法，作者在此提供几个思路和方向：

1. 静态资源多备份（需要有备份）

2. 首屏请求缓存

3. 请求异常报警

4. 页面崩溃报警

5. E2E 定时全量跑用例

## 17. webpack 的主要配置项有哪些【热度: 766】

Webpack 是一个现代 JavaScript 应用程序的静态模块打包器。配置文件名通常为 webpack.config.js，它提供了一种配置 Webpack 的方式。下面是一些主要的 Webpack 配置选项：

1. entry: 入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。可以指定一个或多个入口起点。

2. output: output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist。

3. module: module 属性���于���定如何处理项目中的不同类型的模块。

• rules: 配置模块的读取和解析规则，通常用来配置 loader。

4. resolve: 配置模块如何解析。

☐ extensions: 自动解析确定的扩展，此选项能够使用户在引入模块时不带扩展。

5. plugins: 插件是用来扩展webpack功能的。它们会在构建流程中的特定时机注入运行逻辑来改变构建结果或做你想要的事情。

6. devServer: 通过来自 webpack-dev-server 的这些选项能够对开发服务器的行为进行控制。

7. devtool: 此选项控制是否生成，以及如何生成 source map。

8. mode: 通过设置 development 或 production 之中的一个，来为流程提供相应模式下的内置优化。

9. optimization: 包含一组可用来调整构建输出的选项。

```javascript
splitChunks: 配置模块的拆分，可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。
```

• runtimeChunk: 为每个 entry 创建一个运行时文件。

10. performance: 允许 webpack 根据某些参数，控制资产和入口起点的最大大小。

11. externals: 防止将某些 import 包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖。

每个项目的具体需求不同，Webpack的配置也会有所不同。这些选项提供了强大的配置能力和灵活性，可以用来定制Webpack的打包、加载和转换行为。

## 18. [webpack] optimize 配置中，分割代码配置 splitChunks 怎么使用【热度: 546】

在webpack中，splitChunks选项是optimization对象的一个属性，可以用来定义如何分割代码块。默认情况下，webpack会将所有来自node_modules的模块分割到一个叫做vendors的chunk中，并且将共享或来自异步请求的模块分割成不同的chunks。通过配置splitChunks选项，你可以控制这些行为，创建更细致的代码分割策略。以下是如何使用splitChunks来优化你的bundle。

#### 基本配置

```javascript
module.exports = {
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
};
```

在这个配置中，chunks：'all'指示webpack对同步和异步引入的模块都进行分割。webpack会根据内部的一些默认标准（如模块大小、请求的chunks数目等）来决定是否分割一个模块。

#### 基础属性配置

下面的表格详细描述了 splitChunks 配置选项及其作用：

| 配置选项 | 类型 | 默认值 | 说明 |
|---------|------|--------|------|
| chunks | 'all', 'async', 'initial' | 'async' | 设置优化哪些类型的chunk。 |
| minSize | Number | 20000 (20kb) | 生成 chunk 的最小体积（以字节为单位）。 |
| maxSize | Number | 0 | 尝试将chunk分割成不大于指定体积的块。此选项正在实验中，并可能在将来的webpack版本中更改。 |
| minChunks | Number | 1 | 模块被分享到的最少chunk数。 |
| maxAsyncRequests | Number | 5 | 最大的异步加载请求数。 |
| maxInitialRequests | Number | 3 | 最大的初始入口请求数。 |
| cacheGroups | Object | | 定义缓存组。 |

以下是针对上述表格中提及的某些属性的进一步说明：

• chunks 选项指定是对哪些 chunks 应用这些优化措施。它可以是三个值之一：'all'会影响所有的 chunks，这使得在异步和非异步 chunks 之间共享模块成为可能；'async'仅仅影响被异步加载的 chunks；'initial'仅影响初始加载的 chunks。

• minSize 和 maxSize 用于控制 webpack 试图以多大的 chunk 为目标。minSize 可以避免 chunks 过小，而 maxSize 可以帮助进一步分割大的 chunks。

• cacheGroups 是配置高度定制化的代码分割策略的地方。默认情况下 webpack 会将来自 node_modules 文件夹的代码分割到一个叫做 vendors 的 chunk 中，另外 webpack 会将重��引��的代码分割到一个叫做 default 的 chunk 中。在这里可以覆盖这些默认设置，或是增加新的缓存组。

使用实例：

```javascript
module.exports = {
    optimization: {
        splitChunks: {
            chunks: "all",
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: "~",
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\/]node_modules[\/]/,
                    priority: -10,
                    name(module) {
                        const packageName = module.context.match(/[\/]node_modules[\/](.*?)([\/]|$)/)[1];
                        return `vendor.${packageName.replace("@", "")}`;
                    },
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
};
```

#### 高级配置 - 缓存组

缓存组（cacheGroups）能让你对分割出来的 chunks 进一步细分和控制。

```javascript
module.exports = {
    optimization: {
        splitChunks: {
            chunks: "all",
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\/]node_modules[\/]/,
                    name(module) {
                        const packageName = module.context.match(/[\/]node_modules[\/](.*?)([\/]|$)/)[1];
                        return `npm.${packageName.replace("@", "")}`;
                    },
                },
            },
        },
    },
};
```

这个配置创建了一个缓存组 vendor，它会将所有从 node_modules 目录导入的模块分割到不同的 chunk 中，并为每个包创建一个以 npm 开头的 chunk 名。例如，如果你的应用依赖于 lodash 和 react，应用中就会有 npm.lodash 和 npm.react 两个额外的 chunks。

#### 动态导入

当你使用像 import() 这样的动态导入语法时，splitChunks 插件会自动进行代码分割。

```javascript
function getComponent() {
    return import("lodash").then(({ default: _ }) => {
        const element = document.createElement("div");
        element.innerHTML = _.join(["Hello", "webpack"], " ");
        return element;
    });
}

getComponent().then((component) => {
    document.body.appendChild(component);
});
```

在这个例子中，lodash会被分成一个单独的 chunk。当 getComponent 函数执行并调用 import() 时，lodash库会作为一个单独的异步 chunk 加载进来。

通过 splitChunks 的适当配置，我们可以大幅度减小初始加载所需的时间，并确保用户只下载当前真正需要的代码，这样就可以加快应用程序的交互速度。

## 19. [webpack] optimize 配置有哪些作用【热度: 280】

Webpack 的 optimize 选项是在指定 Webpack 配置对象时，用于配置优化选项的一个属性。该属性下包含了一系列用于调整构建输出质量和性能的设置。这里是一些 optimize 属性中可能包含的选项：

• splitChunks：这用于代码分割，可以将公共的依赖模块提取到已有的入口 chunk 中，或者产生一个新的 chunk。这可以被用来得到更小的 bundle 体积，优化加载时间，或者更好的缓存利用。

• runtimeChunk：该选项将 Webpack 的运行时代码分割成一个单独的 chunk。使用这个设置有利于长期缓存，并且当你使用多个入口点时推荐使用。

• minimize：当设置为 true 时，Webpack 会启动代码压缩。通常，这会使用 UglifyJSPlugin 来进行 JavaScript 代码的压缩，但现在通常默认使用更现代的工具如 TerserPlugin。

• minimizer：当你想要覆盖默认的压缩工具或者提供额外的压缩工具时使用。

• noEmitOnErrors（早期版本称为 NoEmitOnErrorsPlugin）：启用该选项后，Webpack 编译错误将会导致不生成输出。这确保了不会发出包含错误的 assets。

• concatenateModules（早期版本称为 ModuleConcatenationPlugin）：这个选项会试图找到模块图中可以安全地连接到单一模块的所有模块，来优化结果的体积。

• usedExports（也称为 tree shaking）：该选项用于标记 "tree shaking" 中未被使用的导出，使它们能被压缩工具删除。

在 Webpack 4 及以上版本中，这些优化默认在 mode 被设置为 production 时生效。通过合理地配置这些选项，开发者可以显著提高应用程序的加载和运行性能。这些优化通常包括减少 bundle 的体积和提高代码的运行时效率。在开发模式下，很多优化默认是关闭的，以提供更快的构建速度和更好的调试体验。

## 20. [webpack] mode 是做什么用？【热度: 475】

在webpack中，mode属性用来指定当前的构建环境是：development、production或者是none。设置mode可以使用webpack内置的函数，默认值为production。

mode 属性的主要作用是：根据当前的构建环境，启用 webpack 内置在该环境下推荐的优化。

#### mode 的具体作用包括：

##### 1. development

主要优化了增量构建速度和开发体验。

• process.env.NODE_ENV 的值设为 development。
• 启用热替换模块（Hot Module Replacement）。
• 启用开发工具（如调试源码的 source map）以更好地进行调试。

##### 2. production

• 一些处理优化，以提升应用在生产环境的性能。

• process.env.NODE_ENV 的值设为 production。

• 启用代码压缩（例如 TerserPlugin）。

• 删除 dead code（通过 Tree Shaking）。

• 作用域提升等各种性能优化措施。

##### 3. none

mode 设置为 none 则不启用任何默认优化选项，process.env.NODE_ENV 也不会被设置，默认为 production。

#### 使用方法：

在 webpack 配置文件中，可以直接设置 mode 的值:

```javascript
module.exports = {
    mode: "development",
    // 其他配置...
};
```

或者，在命令行中使用 --mode 参数：

```bash
webpack --mode=production
```

设置 mode 是告诉 webpack 使用其内部的优化策略，各个模式预定义了一些 webpack 的行为，开发者可以不需要进行详细的配置，也能快速启动一个针对特定环境优化过的构建过程。

## 21. V8 里面的 JIT 是什么? 【热度: 694】

在计算机科学中，JIT 是"Just-In-Time"（即时编译）的缩写，它是一种提高代码执行性能的技术。具体来说，在 V8 引擎（Google Chrome 浏览器和 Node.js 的 JavaScript 引擎）中，JIT 编译器在 JavaScript 代码运行时，将其编译成机器语言，以提高执行速度。

这里简要解释下 JIT 编译器的工作原理：

1. 解释执行：V8 首先通过一个解释器（如 Ignition）来执行 JavaScript 代码。这个过程中，代码不会编译成机器语言，而是逐行解释执行。这样做的优点是启动快，但执行速度较慢。

2. 即时编译：当代码被多次执行时，V8 会认为这部分代码是 "热点代码" （Hot Spot），此时 JIT 编译器（如 TurboFan）会介入，将这部分热点代码编译成机器语言。机器语言运行在 CPU 上比解释执行要快得多。

3. 优化与去优化：JIT 编译器会对热点代码进行优化，但有时候它会基于错误的假设做出优化（例如认为某个变量总是某种类型）。如果后来的执行发现这些假设不成立，编译器需要去掉优化（Deoptimize），重新编译。

JIT 编译器���一���关键优点是它能够在不牺牲启动速度的情况下，提供接近于或同等于编译语言的运行速度。这使得像 JavaScript 这样原本被认为执行效率较低的语言能够用于复杂的计算任务和高性能的应用场景。

随着 V8 和其他现代 JavaScript 引擎的不断进步，JIT 编译技术也在持续优化，以提供更快的执行速度和更高的性能。

## 22. 单元测试中，TDD、BDD、DDD 分别指？【热度: 166】

TDD、BDD 和 DDD 这三个缩写在软件开发中分别代表以下概念：

1. TDD（Test-Driven Development）- 测试驱动开发：

TDD 是一种软件开发过程，其中开发人员首先编写一个小测试用例，然后编写足够的代码来使这个测试通过，最后重构新代码以满足所需的设计标准。这个过程就是一个循环，被成为"红-绿-重构"循环，其中测试先失败（红色），编写代码使其通过（绿色），然后优化代码（重构）。TDD 的焦点在于编写干净的代码和降低未来的缺陷。

2. BDD（Behavior-Driven Development）- 行为驱动开发：

BDD 将 TDD 的基本思想和原则扩展到软件的整个开发生命周期，但其着重点在于软件的行为——即软件应如何表现，而不仅仅是它应该完成什么功能。BDD 强调的是与利益相关者的交流与协作，通过使用通俗易懂的语言来写测试，让非技术人员也能理解测试内容。BDD 鼓励团队成员之间更好地沟通，确保所有人都对软件应有的行为有共同的理解。

3. DDD（Domain-Driven Design）- 领域驱动设计：

DDD 与 TDD 和 BDD 并不是同一类型的概念。DDD 是一种软件设计哲学，强调了在软件项目的设计与开发中应以业务领域（Domain）为中心。它主张将业务领域的专业知识嵌入到软件的设计中，从而使软件能更好地解决业务问题。DDD 通常涉及到丰富的领域模型以及分层的架构设计，以确保业务逻辑清晰和维护性高。

这三个概念在软件开发中都扮演着重要的角色。TDD 和 BDD 都与确保软件质量和满足用户需求有关，而 DDD 则是一种更宏观层面上对软件设计的方法论。

## 23. husky 作用是啥，有哪些重要配置【热度: 192】

Husky 是一个基于 Node 的 Git 钩子管理工具，用于在你的工作流程中强制执行 Git 钩子。Husky 允许你定义脚本，这些脚本会在不同的 Git 生命周期事件触发时自运行，比如在提交、推送或合并前。

使用 Husky 可以：

1. 保证提交质量：Husky 可以在你提交代码之前运行代码校验，确保代码符合项目规范，提高代码质量。

2. 维护代码风格：可以在提交时检查代码风格，确保代码风格一致性。

3. 自动化流程：支持在推送前执行代码部署、测试脚本，让整个开发流程自动化。

4. 预防错误：例如在允许推送到远程仓库之前检查代码中是否有遗留的更改。

Husky 的一些重要配置如下：

1. 安装 husky：

```bash
npm install husky@latest --save-dev
```

2. 初始化 husky：

```bash
npx husky install
```

3. 添加 Git钩子脚本：

```bash
npx husky add .husky/*.sh
```

这里的 *.sh 是你想触发的钩子点，例如：pre-commit、commit-msg 等。

Husky 支持的钩子包括：

• pre-commit: 提交前，常用于检查代码、分析代码风格等。

• commit-msg: 检查提交信息有效性。

• post-commit: 提交后。

• pre-push: 推送前。

• 等等。

记得在 .husky 文件夹里配置这些钩子脚本，你可以根据项目需求来写自己的 hook 脚本。比如，设置一个 .husky/pre-commit 脚本（可能是一个 shell 脚本和 Node.js 脚本的组合），当你尝试提交代码时，Husky 将会运行这个脚本作为 pre-commit 钩子。

在一些场景下的 .husky/pre-commit 脚本，你可以指定运行如下：

```bash
#!/bin/sh
. "$(dirname -- "$0")/_/husky.sh"
npm run lint
./node_modules/.bin/pretty-quick
```

以上脚本将确保代码在提交前通过了 linter 检查，并通过 prettier 快速格式化以及 TypeScript 编译。使用的时候，请确认你的项目已经有了 Node.js 环境，并且已经安装了 Husky 和相应的代码检查、格式化工具。

## 24. Husky 和 lint-staged 有什么区别？【热度: 387】

Husky 和 lint-staged 都是与 Git 钩子 (hooks) 配合使用的 Node.js 库，但它们的用途和工作方式有所不同：

1. Husky:

Husky 是一个 Git 钩子管理器，它允许你触发自定义脚本在 git 事件发生时运行，如 pre-commit，pre-push，post-merge 等。

它的主要目的是自动化你的版本控制工作流程，例如在提交(commit)前运行代码检查、格式化代码或执行测试，以确保代码库的质量和一致性。

2. lint-staged:

• lint-staged 是一个运行在 Husky 钩子之上的工具，它专门用于对暂存区 (staged) 文件的检查。

• 当你运行 git commit 并且 Husky 触发 pre-commit 钩子时，lint-staged 会检查你即将提交的代码（即 git add 后的文件列表），并运行你配置好的检查脚本，如代码格式化程序、liner 或其他工具。

• 它的目的是确保在提交之前，只有没有检查错误的代码会被提交。

简而言之，Husky 是一个可以触发多种钩子事件的工具，而 lint-staged 是一种专门用于检查 Git 暂存区文件的工具。它们通常是配合使用的，因为 lint-staged 需要通过 Husky 来触发钩子。在你初始化项目并配置 CI/CD 流程时，通常会同时用到它们。

## 25. [webpack] 打包时 hash 码是如何生成的【热度: 167】

Webpack 在打包过程中生成 hash 码主要用于缓存和版本管理。主要有三种类型的 hash 码：

1. hash：是和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改。这意味着任何一个文件的改动都会影响到整体的 hash 值。

2. chunkhash：与webpack打包的chunk有关，不同的entry会生成不同的chunkhash值。例如，如果你的配置生成了多个chunk（例如使用了code splitting），每个chunk的更新只会影响到它自身的chunkhash。

3. contenthash：根据文件内容来定义 hash，内容不变，则 contenthash 不变。这在使用诸如 CSS 提取到单独文件的插件时特别有用，因此只有当文件的内容实际改变时，浏览器才会重新下载文件。

生成方式：

• hash 和 chunkhash 主要是通过某种 hash 算法（默认 MD5）来对文件名或者 chunk 数据进行编码。

• contenthash 是通过构建时的 webpack 插件（如 mini-css-extract-plugin）来处理的，它会对文件内容进行 hash。

Hash 码的生成可以被 webpack 配置的 hashFunction，hashDigest，hashDigestLength 等选项影响。例如，你可以选择不同的算法如 SHA256 或者 MD5，以及可以决定 hash 值的长度。

在 webpack 的配置文件中，可以通过如下方式设定 hash:

```javascript
output: {
    filename: '[name].[chunkhash].js',
    path: __dirname + '/dist'
}
```

这会将输出的文件名设置为入口名称加上基于每个 chunk 内容的 hash。在使用 webpack-dev-server 或者 webpack --watch 时，不会生成实际的文件，所以这些 hash 值是在内存中计算并关联的。

## 26. 如何从 0 到 1 搭建前端基建【热度: 404】

如何从 0 到 1 搭建前端基建

有一个非常经典的文章，直接参考即可：非大厂的我们，要如何去搞前端基建？
