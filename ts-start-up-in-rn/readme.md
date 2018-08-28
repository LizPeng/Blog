如果你在写纯JavaScript，你大概是想直接运行这些JavaScript文件， 这些文件存在于 src，lib或dist目录里，它们可以按照预想运行。

若如此，那么你写的纯JavaScript文件将做为TypeScript的输入，你将要运行的是TypeScript的输出。 在从JS到TS的转换过程中，我们会分离输入文件以防TypeScript覆盖它们。 你也可以指定输出目录

### 书写配置文件tsconfig.json

```js
{
    "compilerOptions": {
        "outDir": "./built",
        "allowJs": true,
        "target": "es5"
    },
    "include": [
        "./src/**/*"
    ]
}
```
这里我们为TypeScript设置了一些东西：
- 读取所有可识别的src目录下的文件(通过inlude)
- 接受JavaScript作为输入(通过allowJs)
- 生成所有的文件放在built目录下(通过outDir)
- 将JavaScript代码降级到低版本比如ES5(通过target)

现在，如果你在工程根目录下运行tsc，就可以在built目录下看到生成的文件。 built下的文件应该与src下的文件相同。 现在你的工程里的TypeScript已经可以工作了。

### 好处
TypeScript还能发现那些执行不到的代码和标签
> 配置项细节
 - noImplicitReturns 会防止你忘记在函数末尾返回值
 - noFallthroughCasesInSwitch 会防止在switch代码块里的两个case之间忘记添加break语句。
 - noEmitOnError 严格检查
 - noImplicitAny  TypeScript将没有明确指定的类型默默地推断为 any类型，可以在修改文件之前启用noImplicitAny
 - strictNullChecks   null和undefined获得了它们自己各自的类型null和undefined。 当任何值 可能为null，你可以使用联合类型。 比如，某值可能为 number或null，你可以声明它的类型为number | null


```ts
declare var foo: string[] | null;
foo.length;  // error - 'foo' is possibly 'null'
// 假设有一个值TypeScript认为可以为null或undefined，但是你更清楚它的类型，你可以使用!后缀。
foo!.length; // okay - 'foo!' just has type 'string[]'

// 要当心，当你使用strictNullChecks，你的依赖也需要相应地启用strictNullChecks。
```
### 与构建工具进行集成
#### Webpack

Webpack集成非常简单。 你可以使用 ts-loader，它是一个TypeScript的加载器，结合source-map-loader方便调试。 运行：
```shell
npm install ts-loader source-map-loader
```
并将下面的选项合并到你的webpack.config.js文件里
```js
module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "./dist/bundle.js",
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    // Other options...
};
```
要注意的是ts-loader必须在其它处理.js文件的加载器之前运行。 你可以在[React和Webpack教程](https://www.tslang.cn/docs/handbook/react-&-webpack.html)里找到使用Webpack的例子。

## 转换到TypeScript文件
到目前为止，你已经做好了使用TypeScript文件的准备。 
> 将 .js文件重命名为.ts文件。 如果你使用了JSX，则重命名为 .tsx文件。