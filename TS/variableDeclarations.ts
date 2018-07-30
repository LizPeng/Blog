// enum 枚举
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;
// 枚举类型提供的一个便利是由枚举的值得到它的名字。例如我们知道数值为2，但是不确定它映射到
// Color里的哪个名字

// void
/**
 * void表示没有任何类型，
 * 声明一个void类型的便利没有什么大用，因为你只能为他赋予undefined和null
 */
function warnUser(): void{
    alert("blabla")
}
// null 和 undefined
// 是所有类型的子类型

/**
 * Never
 * 表示是那些永不存在的值的类型
 * 是那些会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型
 */
function error(message: string): never {
    throw new Error(message);
}

// 断言类型 ，两种形式
// 通常发生在你比ts更了解某个值的详细信息
// 尖括号语法，as语法
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length
let strasLength: number = (someValue as string).length

// 当你在ts使用jsx时，只有as语法是被允许的
////////////////////////////以上为基础类型

// 属性rename
const o = {a: '', b: ''}
let {a: newName1, b: newName2} = o
// 解构 用于函数声明
type C = {a: string, b?: number}
function f({a,b}: C) :void {
    //
}
// 解构默认值，在默认值之前设置其格式
function f1({a,b} = {a: "", b: 0}): void {

}
f1();  // ok, default to { a: "", b: 0 }
// 函数重载
// 对于有重载的函数，源函数的每个重载都要在目标函数上找到对应的函数签名。这确保了目标函数可以再所有源函数可调用的地方调用。
// 类
// 类有静态部分和实例部分的类型，比较两个类类型的对象时，只有实例的成员会被比较。静态成员和构造函数不在比较的范围内。
