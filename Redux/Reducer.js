/**
 * Reducers指定了应用状态的变化如何响应actions并发送到store的，
 * 记住actions只是描述了有事情发生了这一事实
 * 并没有描述应用如何更新state
 */

 // action处理
import {
    ADD_TODO,
    TOGGLE_TODO,
    SET_VISIBILITY_FILTER,
    VisibilityFilters
} from './actions'

// 我们把todos更新的业务逻辑拆分到一个单独的函数里
function todos(state = [], action) {
    switch (action.type) {
        case ADD_TODO:
          return [
            ...state,
            {
              text: action.text,
              completed: false
            }
          ]
        case TOGGLE_TODO:
          return state.map((todo, index) => {
            if (index === action.index) {
              return Object.assign({}, todo, {
                completed: !todo.completed
              })
            }
            return todo
          })
        default:
          return state
      }
}

function visibilityFilter(state = SHOW_ALL, action) {
    switch (action.type) {
      case SET_VISIBILITY_FILTER:
        return action.filter
      default:
        return state
    }
}

// 最后redux提供了combineReducers工具来做上面todoApp的事情
import {combineReducers} from 'redux'
const todoApp = combineReducers({
    visibilityFilter,
    todos
})

export default todoApp


/**
 * combineReducers()所做的只是生成一个函数，这个函数来调用你的一系列reducer
 * 每个reducer根据它们的key来筛选出state中的一部分数据并处理

// 每个reducer的state参数都不同，分别对应它管理的那部分state数据。
function todoApp_2(state = {}, action) {
    return {
        visibilityFilter: visibilityFilter(state.visibilityFilter, action),
        todos: todos(state.todos, action)
    }
}
function todoApp_1(state = initialState, action) {
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return Object.assign({}, state, {
                visibilityFilter: action.filter
            })
        case ADD_TODO:
            return Object.assign({}, state, {
                // reducer合成
                todos: todos(state.todos, action)
            })
        case TOGGLE_TODO:
            return Object.assign({}, state, {
                todos: todos(state.todos, action)
            })
        default:
            return state
    }
}

*/