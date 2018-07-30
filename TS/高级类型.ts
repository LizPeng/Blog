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
// 要定义一个类型保护，我们只要简单地定义一个函数，它的返回值是一个 类型谓词：
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim !== undefined;
}
// 在上面这个例子中，pet  is  Fish就是类型谓词。谓词为 parameterName is Type 这种形式。
// parameterName 必须是来自于当前函数签名的一个参数名。
// 每当使用一些变量调用isFish时，ts会将变量缩减为那个具体的类型，只要这个类型与变量的原始类型是兼容的