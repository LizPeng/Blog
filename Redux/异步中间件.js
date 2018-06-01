// 生成action creator的函数
function makeActionCreator(type, ...argNames) {
    return function (...args) {
        let action = {type}
        argNames.forEach((arg, index) => {
            action[argNames[index]] = args[index]
        })
        return action 
    }
}
const ADD_TODO = 'ADD_TODO'
const EDIT_TODO = 'EDIT_TODO'
const REMOVE_TODO = 'REMOVE_TODO'

export const addTodo = makeActionCreator(ADD_TODO, 'todo')
export const editTodo = makeActionCreator(EDIT_TODO, 'id', 'todo')
export const removeTodo = makeActionCreator(REMOVE_TODO, 'id')

/**
 * 异步Action Creators
 * 中间件让你在每个action对象dispatch出去之前，注入一个自定义的逻辑来解释你的action对象
 * 如果没有中间件，dispatch只能接收一个普通对象。因此我们必须在components里面进行ajax调用
 */
// actionCreators.js
export function loadPostsSuccess(userId, response) {
    return {
      type: 'LOAD_POSTS_SUCCESS',
      userId,
      response
    };
  }
  
  export function loadPostsFailure(userId, error) {
    return {
      type: 'LOAD_POSTS_FAILURE',
      userId,
      error
    };
  }
  
  export function loadPostsRequest(userId) {
    return {
      type: 'LOAD_POSTS_REQUEST',
      userId
    };
  }
// UserInfo.js
import { Component } from 'react'
import { connect } from 'react-redux'
import { loadPostsRequest, loadPostsSuccess, loadPostsFailure } from './actionCreators';

class Posts extends Component {
    loadData(userId) {
        let { dispatch, posts } = this.props //调用React Redux `connect()` 注入的props
        if(posts[userId]) {
            //这里是被缓存的数据
            return 
        }
        //Reducer可以通过设置`isFetching`相应这个action
        //因此让我们显示一个Spinner控件
        dispatch(loadPostsRequest(userId))
        //reducer可以通过填写 users 相应这些action
        fetch(`http://myapi.com/users/${userId}/posts`).then(
            response => dispatch(loadPostsSuccess(userId, responst)),
            error => dispatch(loadPostsFailure(userId, error))
        )
    }
    componentDidMount() {
        this.loadData(this.props.userId)
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.userId !== this.props.userId) {
            this.loadData(nextProps.userId)
        }
    }
    render() {
        if (this.props.isLoading) {
            return <p>Loading...</p>;
        }
      
        let posts = this.props.posts.map(post =>
            <Post post={post} key={post.id} />
        );
      
        return <div>{posts}</div>;
    }
}
export default connect(state => ({
    posts: state.posts
}))(Posts)

////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 中间件让我们能写表达更清晰的，潜在的异步action creators
 * 它允许我们dispatch普通对象之外的东西，并且解释它们的值。
 * thunk中间件让你可以把action
 */
// 用redux-thunk重写上面的代码
// actionCreators.js
export function loadPosts(userId) {
    // 用thunk中间件解释：
    return function (dispatch, getState) {
        let { psots } = getState();
        if (posts[userId]) {
            return
        }
        dispatch({
            type: 'LOAD_POSTS_REQUEST',
            userId
        })
        // 异步分发原味 action
        fetch(`http://myapi.com/users/${userId}/posts`).then(
            response => dispatch({
                type: 'LOAD_POSTS_SUCCESS',
                userId,
                response
            }),
            error => dispatch({
                type: 'LOAD_POST_FAILURE',
                userId,
                error
            })
        )
    }
}
// userInfo.js
import { Component } from 'react';
import { connect } from 'react-redux';
import { loadPosts } from './actionCreators';

class PostsThunk extends Component {
    componentWillMount() {
        this.props.dispatch(loadPosts(this.props.userId))
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.userId !== this.props.userId) {
            this.props.dispatch(loadPosts(nextProps.userId))
        }
    }

    render() {
        if (this.props.isLoading) {
          return <p>Loading...</p>;
        }
    
        let posts = this.props.posts.map(post =>
          <Post post={post} key={post.id} />
        );
    
        return <div>{posts}</div>;
    }
}

export default connect( state => ({
    posts: state.posts
}))(Posts)
/////////////
// 编写自己的中间件，把上面的模式泛化，代之以这样的异步action creators
export function loadPosts(userId) {
    return {
        // 要在之前和之后发送的 action types
        types: ['LOAD_POSTS_REQUEST', 'LOAD_POSTS_SUCCESS', 'LOAD_POSTS_FAILURE'],
        // 检查缓存（可选）
        shouldCallAPI: (state) => !state.users[userId],
        // 进行取
        callAPI: () => fetch(`http://myapi.com/users/${userId}/posts`),
        // 在actions的开始和结束注入的参数
        payload: { userId }
    }
}
// 解释这个actions的中间件可以像这样
function callAPIMiddleware({ dispatch, getState }) {
    return next => action => {
        const {types, callAPI, shouldCallAPI = () => true, payload = {}} = action
        if(!types) {
            return next(action)
        }
    
        if(
            !Array.isArray(types) || 
            types.length !== 3 || 
            types.every(type => typeof type === 'string')
        ){
            throw new Error("Expected an array of three string types.")
        }
        if(typeof callAPI !== 'function') {
            throw new Error('Expected callAPI to be a function.!')
        }
        if(!shouldCallAPI(getState())){
            return 
        }
        const [requestType, sucessType, failureType ] = types
        dispatch(Object.assign({}, payload, {
            response,
            type: requestType
        }))
        return callAPI().then(
            response => dispatch(Object.assign({}, payload, {
                response,
                type: successType
            })),
            error => dispatch(Object.assign({}, payload, {
                error,
                type: failureType
            }))
        )
    }
}