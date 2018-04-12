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

假设我们要调用一个工具foo(..)，且并不确定得到的返回值是否是一个可信任的行为良好的Promise，但我们可以知道它至少是一个thenable。`Promise.resolve(..)`提供了可信任的Promise封装工具，可以链接使用：
```js
//不要 只是这么做
foo(42)
  .then(function(v) {
    console.log(v)
  })

// 而要这样
Promise.resolve(foo(42))
  .then(function(v) {
    console.log(v)
  })
```

### 3.8.3 建立信任

## 3.4 链式流
为了进一步阐释链接，我们把延迟Promise创建(没有决议消息)过程一般化到一个工具中，以便在多个步骤中复用：
```js
function delay(time) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, time)
  })
}
delay(100) // setp1
.then( function STEP2(){
  console.log( "setp 2 (after 100ms)" )
  return delay(200)
})
.then( function STEP3(){
  console.log( "step 3(after another 200ms)")
})
.then( function STEP4(){
  console.log("step4 (next Job)")
  return delay(50)
})
.then( function STEP5(){
  console.log( "step 5 (after another 50ms)" )
})
```
考虑一个更实际的场景：这里不用定时器，而是构造Ajax请求：
```js
// 假定工具ajax({url},{callback})存在
// Promise-aware ajax
function request(url) {
  return new Promise(function(resolve, reject){
    // ajax(..)回调应该是我们这个promise的resolve(..)函数
    ajax(url, resolve)
  });
}
```
```js
// 我们首先定义一个工具request(..)，用来构造一个表示ajax(..)调用完成的promise
request("http://some.url.1")
.then( function(response1){
  return request("http://some.url.2/?V=" + response1)
})
.then(function(response2){
  console.log(response2)
})
```
我们构建的这个Promise链不仅是一个表达多步异步序列的流程控制，还是一个从一个步骤到下一个步骤传递消息的消息通道。
如果这个Promise链中的某个步骤出错了怎么办？错误和异常是基于每个Promise的，这意味着可能在链的任意位置捕捉到这样的错误，而这个捕捉动作在某种程度上就相当于在这一位置将整条链“重置”回了正常运作：
```js
// 步骤1
request("http://some.url.1/")
// 步骤2
.then( function(){
  foo.bar() // undefined,出错
  //永远不会到这里
  return request("http://some.url.2/?v="+ response1)
})
// 步骤3
.then(
  function fulfilled(response2){
     //永远不会到这里
  },
  //
  function rejected(err){
    console.log(err)
    // 来自foo.bar()的错误 TypeError
    return 42
  }
)
// 步骤4
.then( function(msg){
  console.log(msg) // 42
} )
```
#### 简单总结一下使链式流程控制可行的Promise固有特性。
- 调用Promise的then(..)会自动创建一个新的Promise从调用返回。
- 在完成或拒绝处理函数内部，如果返回一个值或抛出一个异常，新返回的(可链接的)Promise就相应第决议。
- 如果完成或拒绝处理函数返回一个Promise，它将会被展开，这样一来，不管它的决议值是什么，都会成为当前then(..)返回的链接Promise的决议值。

解释一下为什么单词resolve(比如在Promise.resolve(..)中)如果用于表达结果可能是完成也可能是拒绝，既没有歧义，而且也确实更精确：
```js
var rejectTh = {
  then: function(resolved, rejected){
    rejected('Oops')
  }
}
var rejectedPr = Promise.resolve(rejectTh) 
// 返回的Promise实际上就是拒绝状态
```

提供给`then(..)`的回调，它们应该怎么命名呢？
```js
function fulfilled(msg){
  console.log(msg)
}
function rejected(err) {
  console.error(er)
}
p.then(
  fulfilled,
  rejected
)
```

## 3.5 错误处理
`try..catch`结构只能是同步的，无法用于异步代码模块

一些模式化的错误处理方式已经出现，最值得一提的是error-first回调风格
```js
function foo(cb) {
  setTimeout( function(){
    try{
      var x = baz.bar()
      cb(null,x) //成功
    }catch(err){
      cb(err)
    }
  } )
}

foo( function(err, val){
  if(err) {
    console.error(err)
  }else {
    console.log(val)
  }
} )
```
传给foo(..)的回调函数保留第一个参数err，用于在出错时接收到信号。如果其存在的话，就认为出错，否则认为是成功。

Promise使用了分离回调(split-callback)风格。一个回调用于完成情况，一个回调用于拒绝情况
```js
var p = Promise.reject("Oops")
p.then(
  function fulfilled(){
    //不会到之类
  },
  function rejected(err){
    console.log(err) //  Oops
  }
)
```
#### 3.5.1 绝望的陷阱
#### 3.5.2 处理未捕获的情况
#### 3.5.3 成功的坑
- 默认情况下，Promise在下一个任务或时间循环tick上(向开发者终端)报告所有拒绝，如果在这个时间点上该Promise上还没有注册错误处理函数。
- 如果想要一个被拒绝的Promise在查看之前的某个时间段内保持被拒绝状态，可以调用defer()，这个函数优先级高于Promise的自动错误报告。
如果一个Promise被拒绝的话，默认情况下会向开发者终端报告这个事实(而不是默认为沉默)。可以选择隐式(在拒绝之前注册一个错误处理函数)或者显示(通过defer())禁止这种报告。在这两种情况下，都是由你来控制误报的情况。
考虑：
```js
var p = Promise.reject("Oops").defer();

// foo(..) 是支持Promise的
foo(42)
  .then(
    function fulfilled(){
      return p;
    },
    function rejected(err){
      // 处理foo(..)错误
    }
  )
```

## 3.6 Promise模式
1.超时竞赛
```js
//foo()是一个支持Promsie的函数

// 前面定义的timeoutPromise(..)返回一个Promise
// 这个promise会在指定延时之后拒绝

// 为foo()设定超时
Promise.race([
  foo(),               // 启动foo()
  timeoutPrimise(3000) // 给它3秒
])
  .then(
    function(){
      // foo(..)按时完成
    },
    function(err){
      // 要么foo()被拒绝，要么指示没能够按时完成，
      // 因此要查看err了解具体原因
    }
  )
```
大多数情况下，这个超时模式能够很好地工作。

2.finally
同时我们可以构建一个静态辅助工具来支持查看(而不影响)Promise的决议：
```js 
//polyfill安全的guard检查
if(!Promise.observe){
  Promise.observe = function(pr, cb) {
    //观察pr的决议
    pr.then(
      function fulfilled(msg){
        // 安排异步回调(作为Job)
        Promise.resolve( msg ).then(cb)
      },
      function rejected(err){
        Promsie.resolve( err ).then(cb)
      }
    );
    // return origin promise
    return pr
  }
}
// 如何在超时例子中使用这个工具
Promise.race([
  Promise.observe(
    foo(),  //试着运行foo()
    function cleanup(msg){
      // 在foo()之后清理，即使它没有在超时之前完成
    },
    timeoutPromise(3000) //给它3秒
  )
])
```
> 这个辅助工具Promise.observe(..)只是用来展示可以如何查看Promise的完成而不对其产生影响。
```js
// 定义first()
if(!Promise.first) {
  Promise.first = function(prs) {
    return new Promise( function(resolve, reject){
      // 在所有promise上循环
      prs.forEach( function(pr){
        // normalize the value
        Promise.resolve(pr)
          // whichever one fulfills first wins, and
			  	// gets to resolve the main promise
          .then(resolve)
      } )
    } )
  }
}
```
### 3.6.4 并发迭代
一个异步的map(..)工具。它接收一个数组的值(可以是Promise或其他任何值)，外加要在每个值上运行一个函数(任务)作为参数。map(..)本身返回一个promise,其完成值是一个数组，该数组(保持映射顺序)保存任务执行之后的异步完成值：
```js
if(!Promise.map) {
  Promise.map = function(vals, cb){
    // 一个等待所有map的promise的新promise
    return Promise.all(
      vals.map(function(val){
        return new Promise(function(resolve){
          cb(val, resolve)
        })
      })
    )
  }
}
// 在这个map(..)实现中，不能发送异步拒绝信号，但如果在映射的回调(cb(..))内出现同步的异常
// 或错误，主Promise.map(..)返回的promise就会拒绝


// 在一组promise使用map
var p1 = Promise.resolve( 21 );
var p2 = Promise.resolve( 42 );
var p3 = Promise.reject( "Oops" );

Promise.map([p1,p2,p3], function(pr,done){
  // make sure the item itself is a Promise
  Promise.resolve(pr)
    .then(
      function(v) {
        // map完成的v到新值
        done(v*2)
      },
      done //
    )
})
.then( function(vals){
  console.log(vals) // [42,84,"Oops"]
} )

```