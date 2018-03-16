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
