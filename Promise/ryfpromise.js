// timeout方法返回一个Promise实例，表示一段时间以后才会发生的结果
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done')
  })
}

timeout(100).then( (value) => {
  console.log(value)
})

// Promise新建后就会立即执行

// 异步加载图片的例子
function loadImageAsync(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = function() {
      resolve(image)
    }
    image.onerror = function() {
      reject(new Error('Could not load image at ' + url))
    }
    image.src = url
  })
}

//用Promise对象实现Ajax操作
const getJSON = function(url) {
  const promise = new Promise(function(resolve, reject){
    const handler = function() {
      if(this.readyState !== 4){
        return ;
      }
      if(this.state === 200) {
        resolve(this.response)
      } else {
        reject( new Error(this.statusText) )
      }
    }
    /// blablabla
    return promise;
  })
}

getJSON("/posts.json").then(function(json) {
  console.log('Content: ' + json)
}, function(error) {
  console.error('出错了', error)
})
