// enum 枚举
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;
// 枚举类型提供的一个便利是由枚举的值得到它的名字。例如我们知道数值为2，但是不确定它映射到
// Color里的哪个名字

// void
/**
 * void表示没有任何类型，
 * 声明一个void类型的便利没有什么大用，因为你只能为他赋予undefined和null

 */
function warnUser(): void{
    alert("blabla")
}