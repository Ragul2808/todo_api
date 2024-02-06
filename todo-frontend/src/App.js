import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './App.css';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

function App() {
  const [allFrontend, setAllFrontend] = useState([]);
  const [newFrontendTitle, setNewFrontendTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [completedFrontend, setCompletedFrontend] = useState([]);
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3008/api/v1/tasks');
      setAllFrontend(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  const handleAddNewFrontend = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:3008/api/v1/tasks', {
        title: newFrontendTitle,
        description: newDescription,
        completed: false,
      });
      setAllFrontend([...allFrontend, response.data]);
      setNewDescription('');
      setNewFrontendTitle('');
    } catch (error) {
      console.error('Error adding new task:', error);
    }
  };

  useEffect (() => {
    let savedFrontend = JSON.parse (localStorage.getItem ('Frontendlist'));
    let savedCompletedFrontend = JSON.parse (
      localStorage.getItem ('completedFrontend')
    );
    if (savedFrontend) {
      setAllFrontend (savedFrontend);
    }

    if (savedCompletedFrontend) {
      setCompletedFrontend (savedCompletedFrontend);
    }
  }, []);

  const handleFrontendDelete = index => {
    let reducedFrontend = [...allFrontend];
    reducedFrontend.splice (index,1);
    // console.log (index);

    // console.log (reducedFrontend);
    localStorage.setItem ('Frontendlist', JSON.stringify (reducedFrontend));
    setAllFrontend (reducedFrontend);
  };

  const handleCompletedFrontendDelete = index => {
    let reducedCompletedFrontend = [...completedFrontend];
    reducedCompletedFrontend.splice (index);
    // console.log (reducedCompletedFrontend);
    localStorage.setItem (
      'completedFrontend',
      JSON.stringify (reducedCompletedFrontend)
    );
    setCompletedFrontend (reducedCompletedFrontend);
  };

  const handleComplete = index => {
    const date = new Date ();
    var dd = date.getDate ();
    var mm = date.getMonth () + 1;
    var yyyy = date.getFullYear ();
    var hh = date.getHours ();
    var minutes = date.getMinutes ();
    var ss = date.getSeconds ();
    var finalDate =
      dd + '-' + mm + '-' + yyyy + ' at ' + hh + ':' + minutes + ':' + ss;

    let filteredFrontend = {
      ...allFrontend[index],
      completedOn: finalDate,
    };

    // console.log (filteredFrontend);

    let updatedCompletedList = [...completedFrontend, filteredFrontend];
    console.log (updatedCompletedList);
    setCompletedFrontend (updatedCompletedList);
    localStorage.setItem (
      'completedFrontend',
      JSON.stringify (updatedCompletedList)
    );
    // console.log (index);

    handleFrontendDelete (index);
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>

      <div className="Frontend-wrapper">

        <div className="Frontend-input">
          <div className="Frontend-input-item">
            <label>Title:</label>
            <input
              type="text"
              value={newFrontendTitle}
              onChange={e => setNewFrontendTitle (e.target.value)}
              placeholder="What's the title of your Task?"
            />
          </div>
          <div className="Frontend-input-item">
            <label>Description:</label>
            <input
              type="text"
              value={newDescription}
              onChange={e => setNewDescription (e.target.value)}
              placeholder="What's the description of your Task?"
            />
          </div>
          <div className="Frontend-input-item">
            <button
              className="primary-btn"
              type="button"
              onClick={handleAddNewFrontend}
            >
              Add
            </button>
          </div>
        </div>
        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompletedScreen === false && 'active'}`}
            onClick={() => setIsCompletedScreen (false)}
          >
            To Do
          </button>
          <button
            className={`secondaryBtn ${isCompletedScreen === true && 'active'}`}
            onClick={() => setIsCompletedScreen (true)}
          >
            Completed
          </button>
        </div>
        <div className="Frontend-list">

          {isCompletedScreen === false &&
            allFrontend.map ((item, index) => (
              <div className="Frontend-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                </div>
                <div>
                  <AiOutlineDelete
                    title="Delete?"
                    className="icon"
                    onClick={() => handleFrontendDelete (index)}
                  />
                  <BsCheckLg
                    title="Completed?"
                    className=" check-icon"
                    onClick={() => handleComplete (index)}
                  />
                </div>
              </div>
            ))}

          {isCompletedScreen === true &&
            completedFrontend.map ((item, index) => (
              <div className="Frontend-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p> <i>Completed at: {item.completedOn}</i></p>
                </div>
                <div>
                  <AiOutlineDelete
                    className="icon"
                    onClick={() => handleCompletedFrontendDelete (index)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
