## 3.2 类型
> 简单基本类型(string,boolean, number, null和undefined)本身并不是对象。null有时会被当做一种对象类型，但是这其实只是语言本身的一个bug，既对bugg执行 typeof null时会返回字符串"object"，实际上，null本身是基本类型。

实际上，JavaScript中许多特殊的对象子类型，我们可以称之为_复杂基本类型_

函数就是对象的一个子类型(从技术角度上来说就是“可调用的对象”)