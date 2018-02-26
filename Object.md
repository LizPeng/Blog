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

## 3.3 内容 Contents

对象的内容是由一些存储在特定命名位置的(任意类型的)值组成的，我们称之为属性。

需要强调的一点事，当我们说“内容”时，_似乎在暗示_ 这些值实际上呗存储在对象内部，但这只是它的表现形式。在引擎内部，这些值的存储方式是多种多样的，一般并不会存在对象容器内部。存储在对象容器内部的是这些属性的名称，它们就像指针(从技术角度来说就是引用)一样，**指向这些值真正的存储位置**。
思考下面的代码：
```javascrpit
var myObject = { 
    a: 2 
}; 
 
myObject.a; // 2 
 
myObject["a"]; // 2 
```

如果要访问myObject中a位置上的值，我们需要使用. 操作符或者[]操作符。

-  .语法通常被称为**“属性访问”**
- []语法通常被称为**“键访问”**

这两种语法的主要区别在于 .操作符要求属性名满足标识符的命名规范，而[".."]语法可以接受任意 UTF-8/Unicode 字符串作为属性名。举例来说，如果要引用名称为 "Super-Fun!" 的属性，那就必须使用 ["Super-Fun!"] 语法访问，因为 Super-Fun! 并不是一个有效的标识符属性名。
此外，由于 [".."]语法使用字符串来访问属性，所以可以在程序中构造这个字符串，比如说：
```javascript
var wantA = true;
var myObject = {
	a: 2
};

var idx;

if (wantA) {
	idx = "a";
}

// later

console.log( myObject[idx] ); // 2
```

在对象中，属性名永远都是字符串。如果你使用 string（字面量）以外的其他值作为属性名，那它首先会被转换为一个字符串。
即使是数字也不例外，虽然在数组下标中使用的的确是数字，但是在对象属性名中数字会被转换成字符串，所以当心不要搞混对象和数组中数字的用法：
```javascript
var myObject = { };

myObject[true] = "foo";
myObject[3] = "bar";
myObject[myObject] = "baz";

myObject["true"];				// "foo"
myObject["3"];					// "bar"
myObject["[object Object]"];	// "baz"
```

### 3.3.1 可计算属性名 Computed Property Names

```javascript
var prefix = "foo";

var myObject = {
	[prefix + "bar"]: "hello",
	[prefix + "baz"]: "world"
};

myObject["foobar"]; // hello
myObject["foobaz"]; // world
```
### 3.3.2 属性与方法  Property vs. Method
如果访问的对象属性是一个函数，有些开发者喜欢使用不一样的叫法以作区分。由于函数很容易被认为是属于某个对象，在其他语言中，属于对象（也被称为“类”）的函数通常被称为“方法”，因此把“属性访问”说成是“方法访问”也就不奇怪了。

有意思的是，JavaScript 的语法规范也做出了同样的区分。
> 从技术角度来说，函数永远不会“属于”一个对象，所以把对象内部引用的函数称为“方法”似乎有点不妥。

确实，有些函数具有 this 引用，有时候这些 this 确实会指向调用位置的对象引用。但是这种用法从本质上来说并没有把一个函数变成一个“方法”，因为 this 是在运行时根据调用位置动态绑定的，所以函数和对象的关系最多也只能说是间接关系。

无论返回值是什么类型，每次访问对象的属性就是属性访问。如果属性访问返回的是一个函数，那它也并不是一个“方法”。属性访问返回的函数和其他函数没有任何区别（除了可能发生的隐式绑定 this，就像我们刚才提到的）。
举例来说： 
```javascript 
function foo() {
	console.log( "foo" );
}

var someFoo = foo;	// variable reference to `foo`

var myObject = {
	someFoo: foo
};

foo;				// function foo(){..}

someFoo;			// function foo(){..}

myObject.someFoo;	// function foo(){..}
```