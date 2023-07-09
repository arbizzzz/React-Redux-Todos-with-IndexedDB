import React from 'react';
import Todo from './Todo';

export default function TodoList({ todos }) {
  return (
    <>
      {todos && todos.length > 0 ? (
        <ul>
          {todos.map((item) => (
            <li key={item.id}>
              <Todo
                title={item.title}
                description={item.description}
                id={item.id}
                date={item.date}
                type={item.type}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>No todos available</p>
      )}
    </>
  );
}
