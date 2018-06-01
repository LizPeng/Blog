实现容器组件
http://cn.redux.js.org/docs/basics/UsageWithReact.html

创建容器组件把展示组件和Redux关联起来。容器组件就是使用`store.subscribe()`从Redux state树中读取部分数据，并通过props来把这些数据提供给要渲染的组件。
建议使用React Redux库的`connect()`方法来生成。
----
- 使用`connect()`之前，需要先定义`mapStateToProps`这个函数来指定如何把当前Redux store state映射到展示组件中。VisibleTodoList 需要计算传到 TodoList 中的 todos，所以定义了根据 state.visibilityFilter 来过滤 state.todos 的方法，并在 mapStateToProps 中使用。
- 除了读取 state，容器组件还能分发 action。类似的方式，可以定义 `mapDispatchToProps()` 方法接收 `dispatch() `方法
- 最后，使用 connect() 创建 VisibleTodoList，并传入这两个函数。
```js
const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
    case 'SHOW_ALL':
    default:
      return todos
  }
}
const mapStateToProps = state => {
    return {
        todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
}

const mapDispatchToProps = dispatch => {
  return {
    onTodoClick: id => {
      dispatch(toggleTodo(id))
    }
  }
}
// 最后使用connect()创建VisibleTodoList，并传入这两个函数。
import { connect } from 'react-redux'

const VisibleTodoList = connect(
    mapStateToProps,
    mapDispatchToProps
)(TodoList)

export default VisibleTodoList
```

