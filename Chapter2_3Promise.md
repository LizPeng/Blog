如果我们能够把控制反转再反转回来，会怎样呢？
如果我们不把自己程序的continuation传给第三方，而是希望第三发给我们提供了解其任务何时结束的能力，然后由我们自己的代码来决定下一步做什么，那将怎样呢？
----
这种范式就称为Promise
## 3.1 什么是Promise
```js
function add(getX, getY, cb) {
  var x, y;
  getX(function(xVal){
    x = xVal
    if(y!=undefined) {
      cb(x+y)
    }
  });

  getY(function(yVal) {
    y =yVal;
    if( x!= undefined){
      cb(x+y)
    }
  })
}
//
add(fetchX, fetchY, function(sum) {
  console.log(sum)
})
```
我们来大致看一下如何通过`Promise`函数表达这个x + y的例子
```js
function add(xPromise, yPromise) {
  // Promise.all([ .. ])接受一个promise数组并返回一个新的promise，
  // 这个新promise等待数组中的所有promise完成
  return Promise.all([xPromise, yPromise])
    // when that promise is resolved, let's take the
	  // received `X` and `Y` values and add them together.
    .then(function(values) {
      // `values` is an array of the messages from the
		  // previously resolved promises
      return values[0] + values[1]
    })
}
add(fetchX(), fetchY())
  .then(function(sum) {
    console.log(sum)
  })
```
这段代码中有两层Promise
fetchX()和fetchY()是直接调用的，它们的返回值（promise！）被传给add(..)。这些promise代表的底层值的可用时间可能是现在或将来，但不管怎样，promise归一保证了行为的一致性。我们可以按照不依赖于时间的方式追踪值X和Y。它们是未来值。

第二层是`add(...)`(通过Promise.all)创建并返回的promise。我们通过调用`then(..)`等待这个promise。 `add(..)`运算完成后，未来值sum就准备好了，可以打印出来。我们把等待未来值x和y的逻辑隐藏了add(..)内部。
> 在add(..)内部，Promise.all([ .. ])调用创建了一个promise（这个promise等待promiseX和promiseY的决议）。链式调用.then(..)创建了另外一个promise。这个promise由return values[0] + values[1]这一行立即决议（得到加运算的结果）。因此，链add(..)调用终止处的调用then(..)——在代码结尾处——实际上操作的是返回的第二个promise，而不是由Promise.all([ .. ])创建的第一个promise。还有，尽管第二个then(..)后面没有链接任何东西，但它实际上也创建了一个新的promise，如果想要观察或者使用它的话就可以看到。本章后面会详细介绍这种Promise链。

## 3.2 具有then方法的鸭子类型

### 3.3.2 调用过晚
如果两个promise p1和p2都已经决议，那么p1.then(..); p2.then(..)应该最终会先调用p1的回调，然后是p2的那些。但还有一些微妙的场景可能不是这样的，比如以下代码：
```js
var p3 = new Promise( function(resolve,reject){
  resolve( "B" );
} );
var p1 = new Promise( function(resolve,reject){
  resolve( p3 );
} );
p2 = new Promise( function(resolve,reject){
  resolve( "A" );
} );
p1.then( function(v){
  console.log( v );
} );
p2.then(function(V) {
  console.log(v)
})
// AB <-- 而不是B A
```
p1不是用立即值而是用另一个promise p3决议，后者本身决议值位“B”。规定的行为是把p3展开到p1，但是是异步地展开。所以，在异步任务队列中，p1的回调排在p2的回调之后
要避免这样的细微区别带来的噩梦，你永远都不应该依赖于不同Promise间回调的顺序和调度。实际上，好的编码实践方案根本不会让多个回调的顺序有丝毫影响，可能的话就要避免。

### 3.3.3 回调未调用

首先，没有任何东西能阻止Promise向你通知它的决议。
当然，如果你的回调函数本身包含JavaScript错误，那可能就会看不懂你期望的结果，但实际上回调还是被调用了。后面我们会介绍如何在回调出错时得到通知，因为就连这些错误也不会被吞掉。
但是，如果Promise本身永远不会被决议呢？其使用了一种称为__竟态__的高级抽奖机制
```js
// 用于超时一个Promise的工具
function timeoutPromise(delay) {
  return new Promise( function(resolve, reject) {
    setTimeout(function(){
      reject("Timeout!");
    }, delay)
  }) 
}

// setup a timeout for `foo()`
Promise.race([
  foo(), // attempt `foo()`
  timeoutPromise( 3000 ) // give it 3 seconds
]).then (
  function(){
    // `foo(..)` fulfilled in time!
  },
  function(err){
    // either `foo()` rejected, or it just
		// didn't finish in time, so inspect
		// `err` to know which
  }
)
````

### 3.3.4 调用次数过少或过多

由于Promise只能被决议一次，所以任何通过`then(..)`注册的(每个)回调就只会被调用一次。
当然，如果你把同一个回调注册了不止一次(比如p.then(f); p.then(f))，那它被调用的次数就会和注册次数相同。响应函数只会被调用一次，但这个保证并不能预防你搬石头砸自己的脚。

### 3.3.5 Failing to Pass Along Any Parameters/Environment

Promises can have, at most, one resolution value (fulfillment or rejection).

### 3.3.6 吞掉错误或异常
### 3.3.7 是可信任的Promise吗

如果向Promise.resolve(..)传递一个非Promise、非thenable的立即值，就会得到一个用这个值填充的promise。下面这种情况下，promise p1和promise p2的行为是完全一样的：

```js
var p1 = new Promise( function(resolve, reject) {
  resolve(42)
})
var p2 = Promise.resolve(42)
```
而如果向`Promsie.resolve(..)`传递一个真正的Promise，就只会返回同一个promise:
```js
var p1 = Promise.resolve( 42 );
var p2 = Promise.resolve( p1 );
p1 === p2 //true
```
更重要的是，如果向Promise.resolve(..)传递了一个非Promise的thenable值，前者就会试图展开这个值，而且展开过程会持续到提取出一个具体的非类Promise的最终值。
考虑：
```js
var p = {
  then: function(cb) {
    cb( 42 );
  }
};
// 这可以工作，但只是因为幸运而已
p.then(
  function fulfilled(val){
    console.log( val ); // 42
  },
  function rejected(err){
    // 永远不会到达这里
  }
);

```