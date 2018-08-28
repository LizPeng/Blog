// 类和函数声明可以直接被标记为默认导出，标记为默认导出的类和函数的名字是可以省略的
/**
 * export = 和 import = require()
 * ts模块支持export = 语法以及传统的CommonJS和AMD的工作流模型
 * export = 语法定义了一个模块的导出对象，它可以是类，接口，命名空间，函数或枚举
 * 若要导入一个使用了export =的模块时，必须使用TypeScript提供的特定语法import module = require("module")。
 */

let numberRegexp = /^[0-9]+$/;
class ZipCodeValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
export = ZipCodeValidator;