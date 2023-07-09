import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../scss/main.scss';
import AddTodo from './AddTodo';
import {
  OpenDatabase,
  upgradeCallback,
  getAllDataFromObjectStore,
} from '../utils/indexedDb';
import DatabaseContext from '../contexts/DataBaseContext';
import { batchAddTodos } from '../redux/actions/todo';
import TodoList from './TodoList';
import { toast } from 'react-toastify';

function App() {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const data = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const handleShowComplete = () => {
    setShowComplete(!showComplete);
  };

  const filteredTodos = useMemo(
    () => data.filter((item) => item.type === 'completed'),
    [data]
  );

  useEffect(() => {
    const openDB = async () => {
      try {
        const db = await OpenDatabase('todos', 1, upgradeCallback);
        setDb(db);
      } catch (error) {
        toast.error(`Failed to open database: ${error.message}`, {
          theme: 'colored',
        });
      }
    };
    openDB();
  }, []);

  useEffect(() => {
    const getAllData = async () => {
      setLoading(true);
      try {
        if (db && !initialDataFetched) {
          const data = await getAllDataFromObjectStore(db, 'todos');
          if (data !== null && data.length > 0) {
            dispatch(batchAddTodos(data));
          }
          setInitialDataFetched(true);
        }
      } catch (error) {
        toast.error(error.message, { theme: 'colored' });
      }
      setLoading(false);
    };

    getAllData();
  }, [db, dispatch, initialDataFetched]);

  const text = loading ? 'Loading...' : 'No Todos available';

  return (
    <DatabaseContext.Provider value={db}>
      <div className='container' id='app-start'>
        <AddTodo />
        {!loading && data.length > 0 ? (
          <>
            <h2>Todos List</h2>
            <div className='nav-bar'>
              <div className='nav-item'>
                <button
                  onClick={handleShowComplete}
                  className={!showComplete ? 'active' : ''}
                >
                  Recent
                </button>
                <button
                  className={showComplete ? 'active' : ''}
                  onClick={handleShowComplete}
                >
                  Completed
                </button>
              </div>
            </div>
            <TodoList todos={showComplete ? filteredTodos : data} />
          </>
        ) : (
          <p>{text}</p>
        )}
      </div>
    </DatabaseContext.Provider>
  );
}

export default App;
