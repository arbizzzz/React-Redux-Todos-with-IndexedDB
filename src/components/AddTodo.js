import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../redux/actions/todo';
import TodoForm from './TodoForm';
import { AddToObjectStore } from '../utils/indexedDb';
import DatabaseContext from '../contexts/DataBaseContext';
import { toast } from 'react-toastify';

function AddTodo() {
  const db = useContext(DatabaseContext);
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    title: '',
    description: '',
    date: new Date(),
    type: 'todo',
  });

  const handleValuesChange = (updatedValues) => {
    setValues({ ...values, ...updatedValues });
  };

  const handleSubmit = async (event) => {
    if (!db) return;
    event.preventDefault();
    try {
      const { id } = await AddToObjectStore(db, 'todos', values);
      dispatch(addTodo({ ...values, id }));
      setValues({ title: '', description: '' });
      toast.success('Added successfully', { theme: 'colored' });
    } catch (error) {
      toast.error(error.message, { theme: 'colored' });
    }
  };

  return (
    <div className='App'>
      <h1>Add Todo</h1>
      <TodoForm
        onSubmit={handleSubmit}
        values={values}
        handleValuesChange={handleValuesChange}
      />
    </div>
  );
}

export default AddTodo;
