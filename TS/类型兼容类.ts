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