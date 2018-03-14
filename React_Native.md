# RN 笔记

#### 导航器
```js
// 创建一个有两个页面（Main和Profile）的应用
import {StackNavigator} from 'react-navigation'
const App = StackNavigator({
  Main: {screen: MainScreen},
  Profile:{screen: ProfileScreen}
})
//每一个screen组件都可以单独设置导航选项，使用navigation属性中的方法去跳转到别的页面
class MainScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Button
        title="Go to Jane's profile"
        onPress={() => 
          navitage('Profile', {name: 'Jane'})
        }
      />
    );
  }
}
```

#### 图片

##### 静态图片资源
要往App中添加一个静态图片，只需把图片文件放在代码文件夹中某处，然后像下面这样去引用它：
```js
<Image source={require('./my-icon.png')} />
```
在上面的这个例子里，是哪个组件引用了这个图片，Packager就会去这个组件所在的文件夹下查找my-icon.png。并且，如果你有my-icon.ios.png和my-icon.android.png，Packager就会根据平台而选择不同的文件。
##### 静态非图片资源
##### 使用混合App的图片资源
##### 
##### 
##### 

