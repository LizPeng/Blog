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

// this和箭头函数
let deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        // NOTE: the line below is now an arrow function, allowing us to capture 'this' right here
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);

/**
 * this参数
 * 不幸的是，this.suit[pickedSuit]的类型依旧为any。
 * 这是因为this来自对象字面量里的函数表达式。
 * 修改的方法是，提供一个显示的this参数。this参数时个假的参数，它出现参数列表的最前面
 */
function f(this: void) {
    // make sure `this` is unusable in this standalone function
}
// 我们往例子添加一些接口，Cark和Deck，让类型重用变得清晰简单些：
interface Card {
    suit: string;
    card: number;
}
interface Deck {
    suits: string[];
    cards: number[];
    createCardPicker(this: Deck): () => Card;
}
let deck1: Deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: [1,2,3],
    createCardPicker: function(this: Deck) {
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

// this参数在回调函数里
interface UIElement {
    addClickListener(onClick: (this: void, e: Event) => void) : void
}