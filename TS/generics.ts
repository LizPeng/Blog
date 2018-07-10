/**
 * 泛型
 * 使用泛型来创建可重用的组件
 * 一个组件可以支持多种类型的数据
 */

/**
 * identity函数，返回任何传入它的值
 * 添加了类型变量T，之后使用T当做返回值类型
 * 不同于any，它不会丢失信息
 */
function identity<T>(arg: T): T {
    return arg;
}