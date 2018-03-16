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
> 为了使新的图片资源机制正常工作，require中的图片名字必须是一个静态字符串（不能使用变量！因为require是在编译时期执行，而非运行时期执行！）。
```js
// 正确
<Image source={require('./my-icon.png')} />

// 错误
var icon = this.props.active ? 'my-icon-active' : 'my-icon-inactive';
<Image source={require('./' + icon + '.png')} />

// 正确
var icon = this.props.active 
  ? require('./my-icon-active.png') 
  : require('./my-icon-inactive.png');
<Image source={icon}>
```
> 通过这种方式引用的图片资源包含图片的尺寸（宽度，高度）信息，如果你需要动态缩放图片（例如，通过flex），你可能必须手动在style属性设置{ width: undefined, height: undefined }。

##### 网络图片
很多要在App中显示的图片并不能在编译的时候获得，又或者有时候需要动态载入来减少打包后的二进制文件的大小。这些时候，与静态资源不同的是，**你需要手动指定图片的尺寸**。同时我们强烈建议你使用https以满足iOS App Transport Security 的要求。
```js
// 正确
<Image source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
       style={{width: 400, height: 400}} />

// 错误
<Image source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}} />
```
##### 资源属性是一个对象（object）
在React Native中，另一个值得一提的变动是我们把src属性改为了source属性，而且并不接受字符串，正确的值是一个带有uri属性的对象。
```js
<Image source={{uri: 'something.jpg'}} />
```
##### 背景图片组件ImageBackground
使用<ImageBackground>组件
```js
return(
  <ImageBackground source={...}>
    <Text>Inside</Text>
  </ImageBackground>
)
```

#### Handling Touches [more details](https://facebook.github.io/react-native/docs/handling-touches.html)

Displaying a basic button
```js
<Button
  onPress={() => {
    Alert.alert('You tapped the button!');
  }}
  title="Press Me"
/>
```

### 手势响应系统 [more](https://reactnative.cn/docs/0.51/gesture-responder-system.html#content)


## 组件简介list

- [Button](https://facebook.github.io/react-native/docs/button.html):显示一个圆形的loading提示符号
- [FlatList](https://facebook.github.io/react-native/docs/flatlist.html):高性能的简单列表组件
```js
// 下面是一个较复杂的例子，其中演示了如何利用PureComponent来进一步优化性能和减少bug产生的可能
class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id)
  }
  render() {
    const textColor = this.props.selected ? "red" : "black"
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View>
          <Text style={{ color: textColor }}> 
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

class MultiSelectList extends React.PureComponent {
  state = {selected: ( new Map(): Map<string, boolean> )} // !!!!
  
  _keyExtractor = (item, index) => item.id

  _onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    this.setState( (state) => {
      // copy the map rather than modifying state
      const selected = new Map(state.selected)
      selected.set(id, !selected.get(id)) //toggle
      return { selected }
    })
  }

  _renderItem = ({item}) => (
    <MyListItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      title={item.title}
    />
  )

  render() {
    return (
      <FlatList 
        data={this.props.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    )
  }
}
```
- [Modal](https://facebook.github.io/react-native/docs/modal.html):Modal组件可以用来覆盖包含React Native根视图的原生视图
- []():
- []():
- []():
- []():
- []():
- []():
- []():
- []():
- []():





