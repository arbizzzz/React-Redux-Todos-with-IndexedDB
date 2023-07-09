import {
  ADD_TODO,
  REMOVE_TODO,
  EDIT_TODO,
  BATCH_ADD_TODOS,
} from '../actions/todo';

export default function todosReducer(state = { todos: [] }, action) {
  const { todos } = state;
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [...todos, action.payload],
      };

    case BATCH_ADD_TODOS:
      return {
        ...state,
        todos: [...state.todos, ...action.payload],
      };

    case REMOVE_TODO:
      return {
        todos: todos.filter((item) => item.id !== action.id),
      };

    case EDIT_TODO:
      return {
        ...state,
        todos: todos.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        ),
      };

    default:
      return state;
  }
}
