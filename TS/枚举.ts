/**
 * 数字枚举
 */
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}
// 下列Up的值为0，每个枚举成员的值是不同的
enum Direction0 {
    Up ,
    Down,
    Left,
    Right
}
// how to use 枚举
// 通过枚举的属性来访问枚举成员
enum Response1 {
    No = 0,
    Yes = 1,
}
function respond(recipient: string, message: Response1): void {

}
respond("Princess Caroline", Response1.Yes)
/**
 * 字符串枚举
 */

 /**
  * 异构枚举 heterogeneous enums
  */
enum BooleanLikeHeterEnum {
    No = 0,
    Yes = "YEs",
}
// 计算的和常量成员
// 每个枚举成员都带有一个值，它可以是 常量 或 计算出来的 。

/**
 * 枚举类型本身变成了每个枚举成员的 联合。
 * 通过联合诶局，类型系统能够利用这一一个事实，它可以知道枚举里的值的集合。
 * 因此，TS能够捕获在比较值的时候犯得愚蠢的错我。
 */
enum E {
    Foo,
    Bar,
}
// 一个愚蠢的错误如下
// function f(x: E) {
//     if(x !== E.Foo || x !== E.Bar) {
//       // Error  
//     }
// }

//  运行时的枚举

// 反向映射,从枚举值 到 枚举名字
enum Enum {
    A
}
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
