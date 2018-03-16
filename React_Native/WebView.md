创建一个原生的WebView，可以用于访问一个网页。
WebView renders web content in a native view.

```js
import React, { Component } from 'react';
import { WebView } from 'react-native';

class MyWeb extends Component {
  render() {
    return (
      <WebView
        style={{marginTop: 20}}
        source={{uri: 'https://github.com/facebook/react-native'}}
        scrollEnabled={false}
        onMessage={}
        scalesPageToFit={false}
      />
    );
  }
}
```
属性介绍：
- source：(object) loads static html or a uri(with optional headers) in the WebView。参数类型。
  `object: {uri: string,method: string,headers: object,body: string}, ,object: {html: string,baseUrl: string}, ,number`
- scrollEnable(ios): (Boolean) value that determines whether scrolling is enabled in the WebView. The default value is `true`.
- scalesPageToFit: (Boolean) that controls whether the web content is scaled to fit the view and enables the user to change the scale. The default value is `true`.
- onMessage: (Function) 在webview内部的网页中调用window.postMessage方法时可以触发此属性对应的函数，从而实现网页和RN之间的数据交换。 设置此属性的同时会在webview中注入一个postMessage的全局函数并覆盖可能已经存在的同名实现。 网页端的window.postMessage只发送一个参数data，此参数封装在RN端的event对象中，即event.nativeEvent.data。data 只能是一个字符串。