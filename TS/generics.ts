/**
 * 泛型
 * 使用泛型来创建可重用的组件
 * 一个组件可以支持多种类型的数据
 */

/**
 * identity函数，返回任何传入它的值
 * 我们给identity添加了类型变量T，T帮助我们捕获用户传入的类型，之后我们就可以使用这个类型
 * 添加了类型变量T，之后使用T当做返回值类型
 * 不同于any，它不会丢失信息
 */
function identity<T>(arg: T): T {
    return arg;
}
// 使用方法1，传入所有参数，包含类型参数
let output1 = identity<string>("MyString")
// 使用方法2，利用类型推论
let output2 = identity("myString")

/**
 * 使用泛型变量
 * 创建泛型函数时，编译器要求你在函数体必须正确的使用这个通用的类型
 * 换句话说，你必须把这些参数当做是任意或所有类型
 */

function loggingIdentity<T>(arg: T): T {
    // console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
// 可能传入的诗歌数字，数字是没有.length属性的

/**
 * 泛型函数 loggingIdentityArray
 * 泛型函数的类型和非泛型函数的类型没什么不同只是有一个类型参数在最前面，像函数声明一样：
 * 接收类型参数T和参数arg，它是个元素类型是T的数组，并且返回。
 * 这样让我们把泛型变量T当做类型的一部分使用，而不是整个类型，增加了灵活性
 * @param arg 
 */
function loggingIdentityArray<T>(arg: T[]): T[] {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}

let myIdentity: <T>(arg: T) => T = identity;
// 使用不同泛型参数名，只要在数量上和使用方式上能对应上就可以
let otherIdentity: <U>(arg: U) => U = identity; 
// 还可以用带有调用签名的对象字面量来定义泛型函数:
let objIdentity: {<T>(arg: T): T} = identity;
// 这引导我们去写第一个泛型接口了，我们把上面例子里的对象字面量拿出来作为一个接口:
interface GenericIdentityFn {
    <T>(arg: T): T;
}
let interIdentity: GenericIdentityFn = identity

//  TODO
// 泛型类
// 泛型约束
