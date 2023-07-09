import React, { useState, useEffect, useRef, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { editTodo, removeTodo } from '../redux/actions/todo';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DatabaseContext from '../contexts/DataBaseContext';
import { UpdateData, DeleteDataByKey } from '../utils/indexedDb';
import { toast } from 'react-toastify';

export default function Todo({ title, description, date, id, type }) {
  const db = useContext(DatabaseContext);
  const [disabled, setDisabled] = useState(true);

  const dispatch = useDispatch();

  const [newValues, setNewValues] = useState({
    title,
    description,
    date,
  });

  const handleValuesChange = (name, value) => {
    setNewValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    handleValuesChange('date', date);
  };

  const divRef = useRef(null);

  const onEdit = () => {
    setDisabled(false);
  };

  const onSave = async () => {
    if (newValues.title.trim() === '' || newValues.description.trim() === '') {
      toast.error('Please fill in all empty fields', { theme: 'colored' });
      return false;
    }
    setDisabled(true);
    try {
      await UpdateData(db, 'todos', id, newValues);
      dispatch(editTodo({ id, ...newValues }));
      toast.success('Edit saved successfully', { theme: 'colored' });
    } catch (error) {
      toast.error(error.message, { theme: 'colored' });
    }
  };

  const handleDelete = async () => {
    try {
      await DeleteDataByKey(db, 'todos', id);
      dispatch(removeTodo({ id }));
      toast.success('Deleted successfully', { theme: 'colored' });
    } catch (error) {
      toast.error(error.message, { theme: 'colored' });
    }
  };

  const handleMarkAsDone = async () => {
    try {
      await UpdateData(db, 'todos', id, { type: 'completed' });
      dispatch(editTodo({ id, type: 'completed', ...newValues }));
      toast.success('Marked as Complete', { theme: 'colored' });
    } catch (error) {
      toast.error(error.message, { theme: 'colored' });
    }
  };

  useEffect(() => {
    const inputElement = divRef.current.querySelector(
      '.todo input[type="text"]'
    );
    const textareaElement = divRef.current.querySelector('.todo textarea');

    const caretColor = '#FFF';
    if (disabled === true) {
      inputElement.style.caretColor = 'transparent';
      textareaElement.style.caretColor = 'transparent';
    } else {
      inputElement.style.caretColor = caretColor;
      textareaElement.style.caretColor = caretColor;
    }
  }, [disabled]);

  return (
    <div className='todo' ref={divRef}>
      <div className='title-holder'>
        {type === 'completed' && (
          <span className='complete-tag'>Completed!</span>
        )}

        <input
          name='title'
          type='text'
          defaultValue={title}
          disabled={disabled}
          onChange={(e) => handleValuesChange(e.target.name, e.target.value)}
        />

        <DatePicker
          dateFormat='MMMM d, yyyy'
          showIcon
          placeholderText='Select due date'
          selected={newValues.date}
          onChange={handleDateChange}
          disabled={disabled}
        />
      </div>
      <textarea
        name='description'
        className='description'
        defaultValue={description}
        disabled={disabled}
        onChange={(e) => handleValuesChange(e.target.name, e.target.value)}
      ></textarea>
      <div className='configs-holder'>
        {!disabled ? (
          <button type='button' onClick={onSave}>
            Save
          </button>
        ) : (
          <button type='button' className='edit' onClick={onEdit}>
            Edit
          </button>
        )}

        <button type='button' className='danger' onClick={handleDelete}>
          Delete
        </button>
        {type !== 'completed' && (
          <button type='button' onClick={handleMarkAsDone}>
            Mark as done
          </button>
        )}
      </div>
    </div>
  );
}
