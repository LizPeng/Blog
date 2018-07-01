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
    clg() {
        console.log(this.name)
    }
}
class Rhino extends privateAnimal {
    constructor() {
        super("Rhino")
    }
    clg() {
        // console.log(this.name) 报错无法访问this.name
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
class Person {
    protected name: string;
    constructor(name: string) {this.name = name}
}
class Empolye extends Person {
    private department: string;
    constructor(name: string, department: string) {
        super(name);
        this.department = department
    }
    public getElevatorPitch() {  
        // 可以访问this.name
        // 我们不能再类外使用name，但仍然可以通过Emoloye类的实例方法访问，因为Employe是由Persion派生而来的
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}
let howard = new Empolye("Howard", "Sales")
console.log(howard.getElevatorPitch())
// console.log(howard.name) 报错


// 构造函数也可以被标记成protected。这意味着这个类不能在包含它的类外被实例化，但是能被继承。
// readonly 修饰符。只读属性必须在声明时或构造函数里被初始化
// 参数属性
class AnimalCanshu {
    // 使用参数来创建和初始化name成员。把声明和赋值合并至一处。
    constructor(private name: string) {}
    move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`)
    }
}

/**
 * 存取器
 * 支持通过getters/setters来截取对象对象成员的访问。能有效控制对对象成员的访问。
 */ 
class getterEmployee {
    fullName: string;
}
let gEmploy = new getterEmployee();
gEmploy.fullName = "Bob"
if(gEmploy.fullName) {
    console.log(gEmploy.fullName)
}

/**
 * 静态属性
 * 每个实例想要访问这个属性的时候，都要在origin签名加上类名Grid.origin
 */
class Grid {
    static origin = {x: 0, y: 0};
    calc(point: {x: number;y: number;}) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) {}
}
let grid1 = new Grid(1.0)
console.log(grid1.calc({x: 10, y: 10}))

/**
 * 抽象类
 * 作为其他派生类的基类使用。一般不会直接被实例化。
 * 可以包含成员的实现细节。
 * abstract关键字是用于定义抽象类和抽象类内部定义抽象方法。
 * 抽象类中的抽象方法不包含具体实现并且必须在派生类中实现
 * 抽象方法的语法与接口方法相似
 * 两者都是定义方法签名但不包含方法体。然而，抽象方法必须包含abstract关键字并且可以包含访问修饰符
 */
abstract class Animalabs {
    abstract makeSound(): void;
    move(): void {
        console.log('roaming the earch')
    }
}
abstract class Department {
    constructor(public name: string) {
    }
    printName(): void {
        console.log('Department' + this.name)
    }
    abstract printMeeting(): void; // 必须在派生类中实现
}
class AcountingDepartment extends Department {
    constructor() {
        super('Acountting ') // 在派生类的构造函数必须调用super()
    }
    printMeeting(): void {
        console.log('The blablabal')
    }
    generateRepors(): void {
        console.log('generating reports')
    }
}
let department: Department; //允许创建一个对抽象类型的引用
// department = new Department(); 错误： 不能创建一个抽象类的实例
department = new AcountingDepartment();
department.printName();
department.printMeeting();
// department.generateRepors() 方法在声明的抽象类中不存在