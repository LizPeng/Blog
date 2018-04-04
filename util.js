// Extend the default Number object with a formatMoney() method:
// usage: someVar.formatMoney(decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
// defaults: (2, "$", ",", ".")
Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
  places = !isNaN(places = Math.abs(places)) ? places : 2;
  symbol = symbol !== undefined ? symbol : "$";
  thousand = thousand || ",";
  decimal = decimal || ".";
  var number = this,
    negative = number < 0 ? "-" : "",
    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};
// To set it up as a global function:
function formatMoney(number, places, symbol, thousand, decimal) {
  if(isNaN(+number)){
    console.error('+number类型必须为数字')
    return 
  }
  number = +number || 0;
  places = !isNaN(places = Math.abs(places)) ? places : 2;
  // symbol = symbol !== undefined ? symbol : "$";
  thousand = thousand || ",";
  decimal = decimal || ".";
  var negative = number < 0 ? "-" : "",
    i = parseInt(number = Math.abs(+number).toFixed(places)) + "", //+number把字符串转换为数字
    j = (j = i.length) > 3 ? j % 3 : 0;
  return symbol + negative + 
        (j ? (i.substr(0, j) + thousand) : "") +  
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + 
        (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}


// 数据格式化，千分位进位
function formatNumber(str) {
  const res = str.toString().replace(/\d+/, n => {
    return n.replace(/\d(?=(\d{3})+$)/g, function ($1) {
      return $1 + ',';
    })
  })
  return res;
}