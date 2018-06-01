/**
 * action来描述 “发生了什么”
 * 使用reducers来根据action更新state
 * 
 * Store就是把它们联系到一起的对象，有以下职责
 * 维持应用的state
 * 提供getState()方法获取state
 * 提供dispatch(action)方法更新state
 * 通过subscribe(listener)注册监听器
 * 通过subscribe(listener) 返回的函数注销监听器
 */

 import { createStore } from 'redux'
 import todoApp from './reducers'
 // createStore()第二个参数可选，用于设置state初始状态。
 let store = createStore(todoApp, window.STATE_FROM_SERVER)

import {
    addTodo,
    toggleTodo,
    setVisibilityFilter,
    VisibilityFilters
} from './actions'

// 打印初始状态
console.log(store.getState())
// 每次更新state时，打印日志
// 注意subscribe()返回一个函数用来注销监听器
const unsubscribe = store.subscribe( () => 
    console.log(store.getState())
)

// 发起一系列 action
store.dispatch(addTodo('Learn about actions'))
store.dispatch(addTodo('Learn about reducers'))
store.dispatch(addTodo('Learn about store'))
store.dispatch(toggleTodo(0))
store.dispatch(toggleTodo(1))
store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))

// 停止监听state更新
unsubscribe()