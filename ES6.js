/**
 * 深入浅出ES6
 */
```js
for(var value of Array) {
  console.log(value)
}
```
// 自定义迭代器
var zeroesForeverIterator = {
  [Symbol.iterator]: function () {
    return this;
  },
  next: function () {
    return {done: false, value: 0};
  }
};
/**
 * for-in用来遍历对象属性
 * for-of用来遍历数据--例如数组中的值
 */

/**
 * Generators生成器
 */
// 示例：生成器函数
function* quips(name) {
  yield "你好" + name + "!";
  yield "希望你能喜欢这篇介绍ES6的译文";
  if (name.startsWith("X")) {
    yield "你的名字" + name + " 首字母是X，这很酷！";
  }
  yield "我们下次再见！";  
}
//当你调用quips()生成器函数时发生了什么？
var iter = quips("jorendorff");
// [object Generator]
iter.next()
// { value: "你好jorendorff!", done: false }
iter.next()
// { value: "希望你能喜欢这篇介绍ES6的译文", done: false }
iter.next()
// { value: "我们下次再见！", done: false }
iter.next()
// { value: undefined, done: true }

// 生成器就是迭代器
// 实现一个迭代器
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop
  }
  [Symbol.iterator]() { return this }
  next() {
    var value = this.value;
    if(value < this.stop) {
      this.value++;
      return {done: false, value: value}
    } else {
      return { done: true, value: undefined}
    }
  }
}
// 返回一个新的迭代器，可以从start到stop计数
function range(start, stop) {
  return new RangeIterator(start, stop)
}