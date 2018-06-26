interface SquareConfig{
    color?: string
    width?: number
}

function createSquare(config: SquareConfig): {color: string; area: number} {
    let newSquare = {color: "white", area: 100};
    if (config.color) {
      newSquare.color = config.color;
    }
    if (config.width) {
      newSquare.area = config.width * config.width;
    }
    return newSquare;
  }
  
  let mySquare = createSquare({color: "black"});
  
// 只读属性
interface Point {
    readonly x: number;
    readonly y: number;
}

//TypeScript具有ReadonlyArray<T>类型，它与Array<T>相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改：
let a: number[] = [1,2,3,4]
let ro: ReadonlyArray<number> = a;
// ro[0] = 12; // error!
// a = ro //把整个readonlyarray赋值到一个普通该数组也是不可以的
// 但是可以用类型断言重写： a = ro as number[]

/**
 * 额外的属性检查
 * 
 */
function cSquare(config: SquareConfig): {color: string; area: number} {
  //
  return {color: '', area: 13}
}
// let errorSquare = cSquare({colour: 'red', width: 100})这会报错,使用类型断言就不会
    let rightSquare= cSquare({colour: 'red', width: 100} as SquareConfig) 
//如果square还会带有任意数量的其他属性，我们可以这样定义它(字符串索引签名)
interface SquareConfig1 {
  color?: string;
  width?: number;
  [propName: string] : any;
}
// 函数类型
/**
 * 接口也可以描述函数类型
 * 为了使用接口表示函数类型，我们需要给接口定义一个调用签名
 * 它像是一个只有参数列表和返回值类型的函数定义。
 * 参数列表里的每个参数需要名字和类型。
 */
interface SearchFunc {
  (source: string, subString: string): boolean;
}
let mySearch : SearchFunc
mySearch = function(source: string, subString: string) {
  // 一些操作
  return 0 >1 
}
// 函数的参数名不需要与接口里定义的名字相匹配，要求对应位置上的参数类型是兼容的。

// 可索引的类型
/**
 * 与使用接口描述函数类型差不多，我们也可以描述那些能够“通过索引得到”的类型，比如a[10]。
 * 可索引类型具有一个索引签名，它描述了对象索引的类型，还有相应索引返回值类型。
 */
interface StringArray {
  [index: number] : string;
}
let myArray: StringArray;
myArray = ['bob', 'fred']
let myStr: string = myArray[0]

// 类类型，强制一个类去符合某种契约
// interface ClockInterface{
//   currentTime: Date;
//   //在接口中描述一个方法，在类里实现它
//   setTime(d: Date)
// }
// class Clock implements ClockInterface {
//   currentTime: Date;
//   setTime(d: Date) {
//     this.currentTime = d
//   }
//   constructor(h: number, m: number) {}
// }
/////////////
interface ClockConstructor {
  // new !!!!
  new (hour: number, minute: number) : ClockInterface;
}
interface ClockInterface {
  tick()
}
function createClock(ctor: ClockConstructor, hour: number, minute: number) : ClockInterface {
  return new ctor(hour, minute)
}
class DigtialClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log('beep')
  }
}
class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log('tick')
  }
}
let digital = createClock(DigtialClock, 12, 17)