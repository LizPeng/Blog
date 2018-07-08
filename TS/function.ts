// 书写完整函数类型
let myAdd: (x: number, y:number) => number =
    function(x:number, y:number) : number {
        return x +y 
    }

// 推断类型
let myAd = function(x: number, y: number): number {
    return x + y
}

/**
 * 可选参数和默认参数
 * TypeScript里的每个函数参数都是必须的
 * 在参数名旁使用? 实现可选参数功能，可选参数必须跟在必须参数后面。
 */
function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}
// 默认初始化值的参数
function buildName1(first: string, lastName = "Smith"){
    return first + " "+ lastName
}

// 剩余参数

function buildName2(f: string, ...restOfName: string[]) {
    return f + " " + restOfName.join(" ");
}
let employeeName = buildName2("Joseph", "Samuel", "Lucas", "MacKinzie");