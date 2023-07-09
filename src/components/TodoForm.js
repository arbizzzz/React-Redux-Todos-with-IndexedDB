import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import checkMark from '../assets/images/icon_check_green_sm.svg';

function TodoForm({ onSubmit, handleValuesChange, values }) {
  const [textareaHeight, setTextareaHeight] = useState('auto');
  const [disabled, setDisabled] = useState(true);

  const { title, description, date } = values;

  const textAreaChangeHandler = (event) => {
    setTextareaHeight('auto');
    handleValuesChange({ description: event.target.value });
  };

  const handleDateChagne = (date) => {
    handleValuesChange({ date });
  };

  const inputChangeHandler = (event) => {
    handleValuesChange({ title: event.target.value });
  };

  const changeHeight = (event) => {
    event.target.style.height = 'auto';
    event.target.style.height = `${event.target.scrollHeight}px`;
    setTextareaHeight(`${event.target.scrollHeight}px`);
  };

  useEffect(() => {
    if (title !== '' && description !== '') {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [title, description]);

  return (
    <div className='add-todo'>
      <form onSubmit={onSubmit}>
        <div>
          <input
            onChange={inputChangeHandler}
            type='text'
            name='title'
            placeholder='Add title'
            value={title ? title : ''}
          />
        </div>
        <div>
          <textarea
            onInput={changeHeight}
            style={{ height: textareaHeight }}
            onChange={textAreaChangeHandler}
            id='description'
            name='title'
            placeholder='Add description'
            value={description ? description : ''}
          ></textarea>
        </div>
        <div className='configs-holder'>
          <DatePicker
            dateFormat='MMMM d, yyyy'
            showIcon
            placeholderText='Select due date'
            selected={date}
            onChange={handleDateChagne}
          />
          <button type='submit' id='form-submit' disabled={disabled}>
            <img src={checkMark} alt='save note' />
          </button>
        </div>
      </form>
    </div>
  );
}

export default TodoForm;
