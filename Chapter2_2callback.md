## 2.1 continuation
```javascript
// A
ajax("..", function(..){
  // C
})
// B
```
// A和// B表示程序的前半部分（也就是现在的部分），而// C标识了程序的后半部分（也就是将来的部分）。前半部分立刻执行，然后是一段时间不确定的停顿。在未来的某个时刻，如果Ajax调用完成，程序就会从停下的位置继续执行后半部分。

> 换句话说,回调函数包裹或者说封装了程序的延续(continuation)

一旦我们以回调函数的形式引入了单个continuation（或者几十个，就像很多程序所做的那样！），我们就容许了大脑工作方式和代码执行方式的分歧。一旦这两者出现分歧（这远不是这种分歧出现的唯一情况，我想你明白这一点！），我们就得面对这样一个无法逆转的事实：代码变得更加难以理解、追踪、调试和维护。

## 2.2 顺序的大脑

### 2.2.1 执行与计划
### 2.2.2 嵌套回调与链式回调

## 2.3 信任问题

信任，但要“核实”
```js
// 依旧安全但更友好一些的：
function addNumbers(x,y) {
// 确保输入为数字
x = Number( x );
y = Number( y );
// +安全进行数字相加
return x + y;
}
addNumbers( 21, 21 ); // 42
addNumbers( 21, "21" ); // 42

```

## 2.4 省点回调

设置一个超时来取消事件,可以构造一个工具（这里展示的只是一个“验证概念”版本）来帮助实现这一点
```js
function timeouify(fn, delay) {
  var intv = setTimeout( function() {
    intv = null;
    fn( new Error("Timeout"))
  }, delay)
  return function() {
    // 还没有超时？
    if (intv) {
      clearTimeout(intv)
      fn.apply(this, arguments)
    }
  }
}
// 以下是使用方式：
function foo(err, data) {
  if(err) {
    console.error(err)
  } else {
    console.log(data)
  }
}
ajax("http://surl.blabla", timeoutify(foo, 500))
```

如果你不确定关注的API会不会永远异步执行怎么办呢？可以创建一个类似于这个“验证概念”版本的asyncify(..)工具：
```js
function asyncify(fn) {
  var orig_fn = fn,
    intv = setTimeout( function() {
      intv = null;
      if (fn) fn();
    }, 0)
  fn = null;
  return function() {
    //触发太快，在定时器intv触发指示异步转换发生之前？
    if(intv) {
      fn = orig_fn.bind.apply(
      orig_fn,
      // 把封装器的this添加到bind(..)调用的参数中，
      // 以及克里化（currying）所有传入参数
      [this].concat( [].slice.call( arguments ) )
      );
    }
    // 已经是异步
    else {
      // 调用原来的函数
      orig_fn.apply( this, arguments )
    }
  }
}

//可以像这样使用asyncify(..)：
function result(data) {
  console.log( a );
} 
var a = 0;
ajax( "..pre-cached-url..", asyncify( result ) );
a++;

```

不管这个Ajax请求已经在缓存中并试图对回调立即调用，还是要从网络上取得，进而在将来异步完成，这段代码总是会输出1，而不是0——result(..)只能异步调用，这意味着a++有机会在result(..)之前运行。
好啊，又“解决”了一个信任问题！但这是低效的，而且也会带来膨胀的重复代码，使你的项目变得笨重。
这就是回调的故事，讲了一遍又一遍。它们可以实现所有你想要的功能，但是你需要努力才行。这些努力通常比你追踪这样的代码能够或者应该付出的要多得多。
可能现在你希望有内建的API或其他语言机制来解决这些问题。最终，ES6带着一些极好的答案登场了，所以，继续读下去吧！

## 2.5 小结