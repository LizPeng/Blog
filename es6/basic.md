 ### 基础用法

结合数组结构和迭代器
```js
function* fibs() {
  let a = 0;
  let b = 1;
  while(true) {
    yield a; // 输出a
    [a, b] = [b, a+b]
  }
}
var [first, second, third, fourth, fifth, sixth] = fibs();
console.log(sixth); // 5
```
