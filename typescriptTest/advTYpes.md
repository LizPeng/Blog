flollowed  https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter

### 交叉类型 inetersaction Types
交叉类型是将多个类型合并为一个类型。它包含了所需的所有类型的特性。创建混入的一个简单例子：
```ts
function extend<T,U>(first: T, second: U): T & U {
    let result = <T & U>{};
    for (let id in first) {
        (<any>result)[id] = (<any>first)[id]
    }
    for (let id in second) {
        if(!result.hasOwnProperty(id)){
            (<any>result)[id] = (<any>second)[id]
        }
    }

    return result
}
class Perseon {
    constructor(public name: string) { }
}

interface Loggable {
    log(): void;
}
class ConsoleLogger implements Loggable {
    log() {
        //...
    }
}
var jim = extend(new Person("Jim"), new ConsoleLogger());
var n = jim.name;
jim.log();

```

### 联合类型 union Types
联合类型表示一个值 可以是几种类型之一，我们用 `|` 分隔每个类型 。如果一个值是一个联合类型，我们只能访问联合类型的所有类型里 共有的成员。

```ts
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
    retrun Math.random() > 0.5 ? Bird : Fish
}
let pet = getSmallPet();
pet.layEggs(); // okay
pet.swim();    // errors
```
### 类型保护 与 区分类型 type guards and differectiating Types

```ts
let pet = getSmallPet();

if((<Fish>pet).swim) {
    (<Fish>pet).swim()
}else {
    (<Bird>pet).fly()
}

```

### user-Defined Type Guard
To define a type guard, we simply need to define a function whose return type is a type predicate:
```ts
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim !== undefined;
}

var a: Fish = {
    swim: () => {
        return 'swim'
    },
    layEggs: () => {}
}
console.log(isFish(a)) // true
```

### 类型别名
```ts
type Name = string;
//也可以是泛型
type Container<T> = { value: T }

```
### 字符串 字面量类型 string literal Types
字符串字面量类型允许你指定字符串必须的固定值。可以实现类似枚举类型的字符串, 还可以用于区分函数重载;
```ts
type Easing = "ease-in" | "ease-out" | "ease-in-out"
```

### 可辨识联合 Discriminated Unions
你可以合并单例类型，联合类型，类型保护和类型别名来创建一个 叫做 可辨识联合的高级模式，它也称做 标签联合或代数数据类型。

```ts
interface Square {
    kind: "square";
    size: number;
}
interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}
interface Circle {
    kind: "circle";
    radius: number;
}
// 首先我们声明了将要联合的接口。 每个接口都有 kind属性但有不同的字符串字面量类型。
// kind属性称做 可辨识的特征或 标签。 其它的属性则特定于各个接口
type Shape = Square | Rectangle | Circle;

function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
    }
}
// 完整性检查
// 当没有涵盖所有可辨识联合的变化时，我们想让编译器可以通知我们。
// 使用never 类型， 编辑器用它来进行完整性检查
function assertNever(x: never) : never {
    throw New Error("Unexpected object: " + x)
}
function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
        default: return assertNever(s); // error here if there are missing cases
    }
}
```

### 多态的this类型
比较简单，不介绍


### 索引类型 index types

使用索引类型，编译器就能够检查使用了动态属性名的代码。例如，一个常见的js模式是从对象中选取属性的子集。
```ts

// 下面是如何在ts里使用此函数，通过 索引类型查询 和 索引访问 操作符
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
    return names.map( n => o[n] )
}
interface Person {
    name: string;
    age: number;
}
let person: Person = {
    name: 'Jarid',
    age: 35
}`
let strings: string[] = pluck(person, ['name'])
let personProps: keyof Person; // 'name' | 'age'
```
编译器会检查name是否真的是Person的一个属性，本例子还引入了几个新的类型操作符。

第一个是 `keyof T`，__索引类型查询操作符__。
对于任何类型T，`keyof T`的结果为 T 上已知的公共属性名的联合。

第二个是 `T[K]`, __索引访问操作符__。在这里，类型语法反映了表达式语法。这意味着`person['name']`具有类型`Person['name']`

```ts
function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
    return o[name]
}
// 当你返回T[K]的结果，编译器会实例化键的真实类型，因此getProperty的返回值类型会随着你需要的属性改变。
let name: string = getProperty(person, 'name'); // 'Jarid'
let age: number = getProperty(person, 'age');
let unknown = getProperty(person, 'unknown'); // error, 'unknown' is not in 'name' | 'age'
```

### 索引类型和字符串索引签名 index types and string index signatures
`keyof`和`T[K]`与 字符串索引签名 进行交互。如果你有一个带有字符串索引签名的类型，那么`keyof T`会是`string`。并且`T[string]`为索引签名的类型
```ts
interface Map<T> {
    [key: string]: T
}
let keys: keyof Map<number>;  // string
let value: Map<number>['foo']; //number
```

### 映射类型
ts提供了从旧类型中创建新类型的一种方式---__映射类__。在映射类型里，新类型以相同的形式去转换旧类型里 每个属性。例如，你可以令每个属性成为readonly类型或可选的。
```ts
interface Person {
    name: string;
    age: number;
}

type Readonly<T> = {
    readonly [P in keyof T]: T[P]
}
type Nullable<T> = {
    [P in keyof T] = T[P] | null
}

type Partial<T> = {
    [P in keyof T]?: T[P]
}
// 像下面这样使用：
type PersonPartial = Partial<Person>
type ReadonlyPerson = Readonly<Person>;

//// 下面来看看最简单的映射类型和它的组成部分：
type Keys = 'option1' | 'option2';
type Flags = {
    [K in Keys]: boolean
}

```
在这些例子里，属性列表`keyof T`切结果类型是`T[P]`的变体。这是使用通用映射类型的一个好模板。因为这类转换的 同态的，映射只作用于T的属性而没有其他的。

编译器知道在添加任何新属性之前可以拷贝所有存在的属性修饰符。

下面是另一个例子，`T[P]`被包装在`Proxy<T>`类里：
```ts
type Proxy<T> = {
    get(): T;
    set(value: T): void;
}
type Proxify<T> = {
    [P in keyof T]: Proxy<T[P]>
}
function proxify<T>(o: T: Proxify<T> {
    ///wrap proxies
}
let proxyProps = proxify(props)
```

注意 `Readonly<T>`和 `Partial<T>`用处不小，因此它们与 `Pick`和 `Record`一同被包含进了TypeScript的标准库里：

```ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
}
type Record<K extends string, T> = {
    [P in K]: T;
}
```
Readonly, Partial和Pick是同态的，但Record不是。因为Record并不需要输入类型来拷贝属性，所以它不属于同态
```ts
type ThreeStringProps = Record<'prop1' | 'prop2' | 'prop3', string>
```
非同态类型本质上会创建新的属性，因此它们不会从它处拷贝属性修饰符。

### 由映射类型进行推断
现在你了解了如何包装一个类型的属性，那么接下来就是如何拆包
```ts
function unproxify<T>(t: Proxify<T>): T {
    let result = {} as T;
    for (const k in t) {
        result[k] = t[k].get()
    }
    return result
}
let originalProps = unproxify(proxyProps);
```

### Conditional Types

```ts
declare function f<T extends boolean>(x: T): T extends true ? string: number ;
let x = f(Math.random() < 0.5)

```

```ts
interface Foo {
    propA: boolean;
    propB: boolean;
}
declare function f<T>(x: T): T extends Foo ? string : number;

function foo<U>(x: U) {
    let a = f(x) // conditional type that hasn’t yet chosen a branch
    let b: string | number = a
}

```

### Distributive conditional types.
Conditional types in which the checked type is a naked parameter are called distribute conditional types.
. For example, an instantiation of `T extends U ? X : Y` with the type argument` A | B | C` for T is resolved as `(A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)`.

```ts
type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object";

type T0 = TypeName<string>;  // "string"
type T1 = TypeName<"a">;  // "string"
type T2 = TypeName<true>;  // "boolean"
type T3 = TypeName<() => void>;  // "function"
type T4 = TypeName<string[]>;  // "object"

type T10 = TypeName<string | (() => void)>;  // "string" | "function"
type T12 = TypeName<string | string[] | undefined>;  // "string" | "object" | "undefined"
type T11 = TypeName<string[] | number[]>;  // "object"

type BoxedValue<T> = { value: T }
type BoxedArray<T> = { array: T[] } 
type Boxed<T> = T extends any[] ? BoxedArray<T[number]> : BoxedValue<T>

type T20 = Boxed<string>;  // BoxedValue<string>;
type T21 = Boxed<number[]>;  // BoxedArray<number>;
type T22 = Boxed<string | number[]>;  // BoxedValue<string> | BoxedArray<number>;
```

The distributive property of conditional types can conveniently be used to **filter** union typs:

```ts
type   Diff<T, U> = T extends U ? never : T;   // remove types from T that are     assignable to U 差集
type Filter<T, U> = T extends U ? T : never;   // remove types from T that are not assignable to U 交集
type T30 =   Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
type T31 = Filter<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"
type T32 =   Diff<string | number | (() => void), Function>;  // string | number
type T33 = Filter<string | number | (() => void), Function>;  // () => void

// 更复杂点的用法
type NonNullable<T> = Diff<T, null | undefined> // remove null and undefined from T 

type T34 = NonNullable<string | number | undefined> ;// string | number
type T35 = NonNullable<string | string[] | null | undefined>;  // string | string[]
type T36 = NonNullable<undefined> // ??
function f1<T>(x: T, y: NonNullable<T>) {
    x = y; // ok
    y = x ; //error
}
function f2<T extends string | undefined>(x: T, y: NonNullable<T>) {
    x = y ; //ok
    y = x ; //error
    let s1: string = x // Error
    let s2: string = y // Ok
}
```

Conditional types are particularly useful when combined with mapped types: 

```ts
type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>
```