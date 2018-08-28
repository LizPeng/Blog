// for...in迭代的是对象的  键 的列表
// for...of迭代的是对象的  键 对应的值
// 另一个区别是，for...in可以操作任何对象它提供了查看对象属性的一种方法
// for...of关注与迭代对象的值
let list = [4, 5, 6];

for (let i in list) {
    console.log(i); // "0", "1", "2",
}

for (let i of list) {
    console.log(i); // "4", "5", "6"
}