## 3.2 类型
> 简单基本类型(string,boolean, number, null和undefined)本身并不是对象。null有时会被当做一种对象类型，但是这其实只是语言本身的一个bug，既对bugg执行 typeof null时会返回字符串"object"，实际上，null本身是基本类型。

实际上，JavaScript中许多特殊的对象子类型，我们可以称之为 _复杂基本类型_

函数就是对象的一个子类型(从技术角度上来说就是“可调用的对象”)。JavaScript中的函数是“一等公民”，因为它们本质上和普通的对象一样（只是可以调用），所以可以像操作其他对象一样操作函数（比如当做另一个函数的参数）。

### 内置对象

还有一些对象子类型，通常被称为**内置对象**。有些内置对象的名字看起来和
简单基础类型一样，不过实际上它们的关系更复杂，我们稍后会详细介绍。
- String
- Number
- Boolean
- Object
- Function 
- Array
- Date
- RegExp
- Error

这些内置对象从表现形式来说很像其他语言中的类型（type）或者类（class），比如 Java中的 String 类。

但是在 JavaScript 中，它们实际上只是一些内置函数。这些内置函数可以当作构造函数（由 new 产生的函数调用——参见第 2 章）来使用，从而可以构造一个对应子类型的新对象。举例来说：
``` javascript 
var strPrimitive = "I am a string";  
typeof strPrimitive; // "string"  
strPrimitive instanceof String; // false 
var strObject = new String( "I am a string" );  
typeof strObject; // "object" 
strObject instanceof String; // true 
 检查 sub-type 对象 
Object.prototype.toString.call( strObject ); // [object String]
```

## 3.3 内容

对象的内容是由一些存储在特定命名位置的(任意类型的)值组成的，我们称之为属性。

需要强调的一点事，当我们说“内容”时，_似乎在暗示_ 这些值实际上呗存储在对象内部，但这只是它的表现形式。在引擎内部，这些值的存储方式是多种多样的，一般并不会存在对象容器内部。存储在对象容器内部的是这些属性的名称，它们就像指针(从技术角度来说就是引用)一样，**指向这些值真正的存储位置**。
思考下面的代码：
``` javascrit
var myObject = { 
    a: 2 
}; 
 
myObject.a; // 2 
 
myObject["a"]; // 2 
```
