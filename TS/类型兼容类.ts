/**
 * 兼容类型类
 * 是基于结构子类型的。
 * 结构类型是一种只使用其成员来描述类型的方式。它正好与名义(nominal)类型形成对比。
 * 看下面的例子
 */
interface Named {
    name: string;
}
class Person {
    name: string;
}
let p: Named;
p = new Person()

// 结构化类型系统的基本规则是，如果x要兼容y，那么y至少具有与x相同的属性。
interface Named {
    name: string;
}

let x: Named;
// y's inferred type is { name: string; location: string; }
let y = { name: 'Alice', location: 'Seattle' };
x = y

// 比较两个函数
let x1 = (a: number) => 0;
let y1 = (b: number, s: string) => 0;

y1 = x1; // OK
// x1 = y1 
// 查看x1能否赋值给y1，首先看它们的参数列表。x1的每个参数必须能在y里找到对应类型的参数。只看类型

/**
 * 函数参数双向协变
 * 当比较函数参数类型时，只有当源函数参数能够赋值给目标函数 或者反过来时才能赋值成功。
 * 
 */
// 可选参数及剩余参数

enum EventType { Mouse, Keyboard }

interface Event { timestamp: number; }
interface MouseEvent extends Event { x: number; y: number }
interface KeyEvent extends Event { keyCode: number }

function listenEvent(eventType: EventType, handler: (n: Event) => void) {
    /* ... */
}

// Unsound, but useful and common
listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x + ',' + e.y));

// Undesirable alternatives in presence of soundness
listenEvent(EventType.Mouse, (e: Event) => console.log((<MouseEvent>e).x + ',' + (<MouseEvent>e).y));
listenEvent(EventType.Mouse, <(e: Event) => void>((e: MouseEvent) => console.log(e.x + ',' + e.y)));
