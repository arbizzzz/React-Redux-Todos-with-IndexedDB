import { createStore } from 'redux';
import middleware from '../middelware';
import todosReducer from '../reducers';

export const store = createStore(todosReducer, middleware);
