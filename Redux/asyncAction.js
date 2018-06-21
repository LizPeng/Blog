// 定义几个同步的action类型和action创建函数
export const SELECT_SUBREDDIT = "SELECT_SUBREDDIT"
export function  selectSubreddit(subreddit) {
    return {
        type: SELECT_SUBREDDIT,
        subreddit
    }
}

export const REQUEST_POSTS = 'REQUEST_POSTS'
export function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  }
}

// 当收到请求相应时
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export function receivePosts(subreddit, json) {
    return {
        type: RECEIVE_POSTS,
        subreddit,
        posts: json.data.children.map(child => child.data),
        receivedAt: Date.now()
    }
}

export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'
export function invalidateSubreddit(subreddit) {
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit
  }
}
/**
 * 异步action创建函数
 * 使用redux thunk中间件，把同步action创建函数和网络请求结合起来。
 * 通过使用指定的middleware，action创建函数除了返回action对象外还可以返回函数。
 * 这时，这个action创建函数就成为了thunk
 */
import fetch from 'cross-fetch'
// 来看一下我们写的第一个 thunk action 创建函数！
// 虽然内部操作不同，你可以像其它 action 创建函数 一样使用它：
// store.dispatch(fetchPosts('reactjs'))
export function fetchPosts(subreddit) {
    // 这里把dispatch方法通过参数传给函数，以此让它自己也能dispatch action
    return function (dispatch) {
        // 首次dispatch，更新应用的state
        dispatch(requestPosts(subreddit))

        // 这个案例，我们返回一个等待处理的promise
        return fetch(`http://www.subreddit.com/r/${subreddit}.json`)
            .then(
                response => response.json(),
                error => console.log('An error occurred', error)
            )
            .then(json => 
                // 可以多次dispath
                // 这里，使用API请求结果来更新应用的state
                dispatch(receivePosts(subreddit, json))
            )
    }
}
