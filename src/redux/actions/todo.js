export const ADD_TODO = 'ADD_TODO';
export const REMOVE_TODO = 'REMOVE_TODO';
export const EDIT_TODO = 'EDIT_TODO';
export const BATCH_ADD_TODOS = 'BATCH_ADD_TODOS';
export const COMPLETE_TODO = 'COMPLETE_TODO';

export function addTodo({ id, title, description, date, type }) {
  return {
    type: ADD_TODO,
    payload: {
      id,
      title,
      description,
      date,
      type,
    },
  };
}

export function batchAddTodos(todos) {
  return {
    type: BATCH_ADD_TODOS,
    payload: todos,
  };
}

export function removeTodo({ id }) {
  return {
    type: REMOVE_TODO,
    id,
  };
}

export function editTodo({ id, title, description, date, type }) {
  return {
    type: EDIT_TODO,
    payload: {
      id,
      title,
      description,
      date,
      type,
    },
  };
}
