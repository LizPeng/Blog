/**
 * 类
 * 基于类的继承并且对象是由类构建出来的
 */
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}
let greeter = new Greeter("world")
// 使用new构造了Greeter类的一个实例。创建一个Greeter类型的新对象，并执行构造函数初始化它

// 继承
// ts中，我们可以使用常用的面向对象模式。基于类的程序设计中一种最基本的模式
class Animal {
    name: string;
    constructor(theName: string) { this.name = theName };
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} Animal moved ${distanceInMeters}m.`);
    }
}

// class Dog extends Animal {
//     bark() {
//         console.log('Woof! Woof!')
//     }
// }
// const dog = new Dog()
// dog.bark()
// dog.move(10)
// Dog是一个派生类，它派生自Animal基类，通过extends关键字。
// 培生累通常被称作 子类， 基类通常被称作 超类

class Snake extends Animal {
    constructor(name: string) {
        super(name)
    }
    move(distanceInMeters = 5) {
        console.log('Slithering...')
        super.move(distanceInMeters)
    }
}
class Horse extends Animal {
    constructor(name: string) {
        super(name)
    }
    move(distanceInMeters = 5) {
        console.log('Galloping...')
        super.move(distanceInMeters)
    }
}
/**
 * 派生类包含了一个构造函数，它必须调用super()，它会执行基类的构造函数。
 * 在构造函数里访问this的属性之前，我们一定要调用super()。
 */


 // 公共，私有与受保护的修饰符
 // ts中，成员都默认为public，你也可以明确将一个成员标记成public
 // 当成员被标记为private时，它就不能再声明它的类的外部访问
//  class privateAnimal {
//      private name: string;
//      constructor(theName: string) {
//          this.name = theName;
//      }
//  }
//  new privateAnimal("Cat").name: // 错误
/**
 * 当我们比较带有private或protected成员的类型的时候，情况就不同了。
 * 如果其中一个类型里包含了一个private成员，
 * 那么只有当另外一个类型中也存在这一个private成员，并且它们都是来自同一处声明时
 * 我们才认为这两个类型是兼容的。
 * 对于protected成员也是用这个规则
 */
class privateAnimal {
    private name: string;
    constructor(theName: string) {
        this.name = theName;
    }
}
class Rhino extends privateAnimal {
    constructor() {
        super("Rhino")
    }
}
class Employee {
    private name: string;
    constructor(theName: string) {
        this.name = theName;
    }
}
let a1 = new privateAnimal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");
a1 = rhino
// a1 = employee 错误，不兼容

// 理解protected， protected成员在派生类中仍然可以访问