// 我们是如何在 dispatch 机制中引入 Redux Thunk middleware 的呢？我们使用了 applyMiddleware()，如下：
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStor, applyMiddleware } from 'redux'
import { selectSubreddit, fetch}