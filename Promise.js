// https://github.com/crazycodeboy/RNStudyNotes/tree/master/React%20Native%20%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96/React%20Native%20%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E4%B9%8B%E5%8F%AF%E5%8F%96%E6%B6%88%E7%9A%84%E5%BC%82%E6%AD%A5%E6%93%8D%E4%BD%9C
// 为Promise插上可取消的翅膀

const makeCancelable = (promise) => {
  let hasCanceled_ = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) => 
      hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
    )
    promise.catch((error) => 
      hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    )
  })
  
  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true
    }
  }
}

// 这样使用取消操作
const somePromise = new Promise( r => setTimeout(r, 10000)) // 创建一个异步操作
const cancelable = makeCancelable(somePromise) //为异步操作添加可取消的功能
cancelable
  .promise
  .then(()=> console.log("resolved"))
  .catch( ({isCanceled, ...error}) => console.log('isCanceled', isCanceled))
//取消异步操作
cancelable.cancel()
//////////////////////////////////

// 可取消的网络请求fetch
this.cancelable = makeCancelable(fetch('url'))
  this.cancelable.promise
      .then( (response) => response.json())
      .then( (responseData) => console.log(responseData))
      .catch( (error) => console.log(error))

// 取消网络请求
this.cancelable.cancel()

// 在项目中的使用

componentWillUnmount() {
  this.cancelable.cancel()
}

