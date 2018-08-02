/**
 * 交叉类型 Intersection Types
 * 交叉类型是将多个类型合并为一个类型。
 * 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特征
 */

function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    for (let id in first) {
        (<any>result)[id] = (<any>first)[id]
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)){
            (<any>result)[id] = (<any>second)[id]
        }
    }
    return result
}
class Person {
    constructor(public name :string) {}
}
interface Loggable {
    log(): void;
}
class ConsoleLogger implements Loggable {
    log(){
        //....
    }
}
var jim = extend(new Person("Jim"), new ConsoleLogger())
var n = jim.name;
jim.log();

/**
 * 联合类型 union types
 * 联合类型与交叉类型很有关联
 */
function padLeft(value: string ,padding: any | string) {
    if(typeof padding === 'number') {
        return Array(padding + 1).join("") + value;
    }
    if(typeof padding === 'string') {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`)
}
padLeft("hello world", 4)

//  如何一个值的类型是A | B ,它包含了a和b中共有的成员
// 如果一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员。
interface Bird {
    fly();
    layEggs();
}

interface Fish {
    swim();
    layEggs();
}

function getSmallPet(): Fish | Bird {
    // ...
}

let pet = getSmallPet();
pet.layEggs(); // okay
// pet.swim();    // errors
// 下面代码使用 断言类型
if( (<Fish>pet).swim){
    (<Fish>pet).swim()
}else {
    (<Bird>pet).fly()
}
// 用户自定义的类型保护
// 类型保护就是一些表达式，它们会在运行时检查以确保在某个作用域里的类型。
// 要定义一个类型保护，我们只要简单地定义一个函数，它的返回值是一个 type predicate：
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim !== undefined;
}
// 在上面这个例子中，pet  is  Fish就是type predicate。谓词为 parameterName is Type 这种形式。
// parameterName 必须是来自于当前函数签名的一个参数名。
// 每当使用一些变量调用isFish时，ts会将变量缩减为那个具体的类型，只要这个类型与变量的原始类型是兼容的
if(isFish(pet)){
    pet.swim()
}else {
    pet.fly()
}
// ts不仅知道在if分支里pet是Fish类型；它还清楚在else分支，一定不是Fish类型，一定是Bird类型。

/**
 * instanceof 类型保护
 * 类型保护是通过构造函数来细化类型的一种方式
 */
interface Padder {
    getPaddingString(): string
}
class SpaceRepeatingPadder implements Padder {
    constructor(private numSpaces: number){}
    getPaddingString() {
        return Array(this.numSpaces + 1).join("")
    }
}
class StringPadder implements Padder {
    constructor(private value: string) { }
    getPaddingString() {
        return this.value;
    }
}

function getRandomPadder() {
    return Math.random() < 0.5 ?
        new SpaceRepeatingPadder(4) :
        new StringPadder("  ");
}

// 类型为SpaceRepeatingPadder | StringPadder
let padder: Padder = getRandomPadder();

if (padder instanceof SpaceRepeatingPadder) {
    padder; // 类型细化为'SpaceRepeatingPadder'
}
if (padder instanceof StringPadder) {
    padder; // 类型细化为'StringPadder'
}
//  instanceof 的右侧要求是一个构造函数

// 可以为nul的类型 --strictNullChecks
// 可选参数和可选属性，使用了--strictNullChecks，可选参数会被自动地加上 | undefined

// 类型保护和断言类型
// 由于可以为null的类型是通过联合类型实现，那么你需要使用类型保护来去除null。
function f(sn: string | null) : string {
    return sn || "default";
}

/**
 * 如果编译器不能够去除null 或undefined，你可以使用类型断言手动去除
 * 语法是添加! 后缀：identifier! 从identifier的类型中去除了null和undefined
 */
function fixed(name: string | null): string {
    function postfix(epithet: string) {
      return name!.charAt(0) + '. the ' + epithet // ok
    }
    name = name || "Bob";
    return postfix("great");
  }
  //本例子 使用了嵌套函数，因为编译器无法去除嵌套函数的null（除非是立即调用的函数表达式）
  //因为无法追踪所有对嵌套函数的调用，尤其是你将内层函数作为外层函数的返回值。

/**
 * 类型别名
 * 可以作用于原始值，联合类型，元组以及任何其他你需要手写的类型
 */  
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
// 同接口一样，类型别名也可以是泛型，我们可以添加类型参数并且在别名声明的右侧传入
type Container<T> = {value: T}
// 我们也可以使用类型别名在属性里引用自己:
type Tree<T> = {
    value: T,
    left: Tree<T>,
    right: Tree<T>
}
// 与交叉类型一起使用，我们可以创建出一些十分稀奇古怪的类型。!!!!!!!
type LinkedList<T> = T & { next: LinkedList<T> };

interface Person {
    name: string;
}

var people: LinkedList<Person>;
var s = people.name;
var s = people.next.name;
var s = people.next.next.name;
var s = people.next.next.next.name;

/**
 * 接口 vs 类型别名
 * 差别
 * 接口创建了一个新的名字，可以在其他任何地方使用
 * 类型别名并不创建新名字
 * 另一个重要区别是类型别名不能被extends和implements(自己也不能)
 * 因为软件中的对象应该对于扩展是开放的，但是对于修改是封闭的。
 */

type Alias = {num: number}
interface Interface {
    num: number
}
declare function aliased(arg: Alias): Alias;
declare function interfaced(arg: Interface): Interface;

// 字符串字面量类型
type Easing = "easi-in" | "ease-out" | "ease-in-out"
class UIElement {
    animate(dx: number, dy: number, easing: Easing) {
        if(easing === 'ease-in-out'){

        }else if(easing === 'ease-out'){

        }else if(easing === 'easi-in'){

        }else {

        }
    }
}


// 字符串字面量还可以用于 区分函数重载!!!!!!!!

// 枚举成员类型
/**
 * 可辨识联合
 */
