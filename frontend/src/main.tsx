import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { GAME_INSTANCE_FEATURE_KEY, gameInstanceReducer } from 'game-logic';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const store = configureStore({
  reducer: {
    [GAME_INSTANCE_FEATURE_KEY]: gameInstanceReducer,
  },
  // Additional middleware can be passed to this array
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production', // TODO we are not on a node server...
  // Optional Redux store enhancers
  enhancers: [],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Initial analysis showed that our updates all take >10ms with some updates running in 2ms.
// I wonder if this is simply react base overhead. Need to test with a new app once :D
// function onRender(
//   id,
//   phase,
//   actualDuration,
//   baseDuration,
//   startTime,
//   commitTime,
// ) {
//   // Aggregate or log render timings...
//   console.log(actualDuration, baseDuration);
// }

root.render(
  // <Profiler id="App" onRender={onRender}>
  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>,
  // </Profiler>,
);
