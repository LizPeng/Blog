function identify() {
  return this.name.toUpperCase()
}

function speak() {
  var greeting = "Hello, I'm " + indentify.call(this)
  console.log(greeting)
}

var me = {
  name: 'Kyle'
}

var you = {
  name: 'Reader'
}

identify.call(me) // KYLE
identify.call(you) // READER
speak.call(me) // 
speak.call(you) // 

exercise2
// 记录一下函数foo被调用的次数
function foo(num) {
  console.log("foo: " + num)
  // 记录foo被调用的次数
  this.count++
}
foo.count = 0
var i
for (i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i)
  }
}
// foo:6
// foo:7
// foo:8
// foo:9
console.log(foo.count) // 0

// 调用栈和调用位置
function baz() {
  // 当前的调用栈是： baz
  //  因此，当前调用位置的是 全局作用域
  console.log('baz')
  bar() // <-- bar的调用位置
}

function bar() {
  // 当前的调用栈是baz -> bar
  // 因为，当前调用位置在baz中
  console.log('bar')
  foo() // <-- foo的调用位置
}

function foo() {
  // 当前的调用栈是 baz -> bar -> foo
  // 因此，当前调用位置在bar中
  console.log("foo")
}
baz() // <-- baz的调用位置
// 硬绑定
function foo(something) {
  console.log(this.a, something)
  return this.a + something
}

// 简单的辅助绑定函数
function bind(fn, obj) {
  return function () {
    return fn.apply(obj, arguments)
  }
}
var obj = {
  a: 2
}
var bar = bind(foo, obj)
var b = bar(3) // 2 3
console.log(b) // 5
//  
function foo() {
  console.log(this.a)
}
var obj1 = {
  a: 2,
  foo: foo
}
var obj2 = {
  a: 3,
  foo: foo
}
obj1.foo() //2
obj2.foo() //3
obj1.foo.call(obj2) //3
obj2.foo.call(obj1) // 2

// new binding
function foo(something) {
  this.a = something
}
var obj1 = {}
var bar = foo.bind(obj1)
bar(2)
obj1.a // 2
var baz = new bar(3)
obj1.a // 2
baz.a // 3

// 绑定例外
function foo() {
  console.log(this.a)
}
var a = 2
foo.call(null) //2

// 展开数组
function foo(a, b) {
  console.log("a: " + a, "b: " + b)
}
// 把数组“展开”成参数
foo.apply(null, [2, 3]) // a:2, b:3

//使用bind(..)进行柯里化
var bar = foo.bind(null, 2)
bar(3) // a:2, b:3

// 间接引用
function foo() {
  console.log(this.a)
}
var a = 2
var o = {
  a: 3,
  foo: foo
}
var p = {
  a: 4
}
o.foo() // 3
(p.foo = o.foo)() // 2
// softbind
if (!Function.prototype.softBind) {
  Function.prototype.softBind = function (obj) {
    var fn = this,
      curried = [].slice.call(arguments, 1),
      bound = function bound() {
        return fn.apply(
          (!this ||
            (typeof window !== "undefined" &&
              this === window) ||
            (typeof global !== "undefined" &&
              this === global)
          ) ? obj : this,
          curried.concat.apply(curried, arguments)
        );
      };
    bound.prototype = Object.create(fn.prototype);
    return bound;
  };
}
// 箭头函数词法作用域
function foo() {
  // return an arrow function
  return (a) => {
    // `this` here is lexically adopted from `foo()`
    console.log(this.a);
  };
}

var obj1 = {
  a: 2
};

var obj2 = {
  a: 3
};

var bar = foo.call(obj1);
bar.call(obj2); // 2, not 3!