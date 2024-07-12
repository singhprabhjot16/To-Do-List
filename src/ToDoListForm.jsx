import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import './ToDoListForm.css'

function ToDoListForm() {
    const [tasks, setTasks] = useState([]);
    const [value, setValue] = useState("");
    const [update, setUpdate] = useState(false);
    const [editID, setEditID] = useState(null);

    useEffect(() => {
        const toDoString = localStorage.getItem("tasks");
        if (toDoString) {
            const pastToDos = JSON.parse(toDoString);
            setTasks(pastToDos);
        }
    }, []);

    function saveToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function handleChange(event) {
        setValue(event.target.value);
    }
    
    function handleClick(event) {
        event.preventDefault();
        if (!value) {
            return;
        }
        if (!update) {
            setTasks((oldTasks) => {
                return [...oldTasks, {id: uuid(), task: value, isComplete: false, isUpdating: false}];
            });
        }
        else {
            setTasks((oldTasks) => {
                return oldTasks.map((task) => {
                    if (task.id === editID) {
                        return {...task, task: value};
                    }
                    return task;
                });
            });
            setUpdate(false);
        }
        setValue("");
        saveToLocalStorage();
    }

    function handleEdit(id) {
        const index = tasks.findIndex((item) => item.id === id);
        setValue(tasks[index].task);
        setUpdate(true);
        setEditID(tasks[index].id);
        saveToLocalStorage();
    }

    function handleDelete(id) {
        setTasks((oldTasks) => {
            return oldTasks.filter((task) => task.id !== id);
        });
        saveToLocalStorage();
    }

    function handleCheckBox(event) {
        setTasks((oldTasks) => {
            const id = event.target.name;
            return oldTasks.map(item => {
                if (item.id === id) {
                    return {...item, isComplete: !item.isComplete}
                }
                return item;
            });
        });
        saveToLocalStorage();
    }

    return (
        <div className='to-do-list-wrapper'>
            <h1>What's on your mind?</h1>
            <form action="">
                <input type="text" placeholder="I plan to do..." value={value} onChange={handleChange}/>
                <button onClick={handleClick}>{update ? "Update" : "Add"}</button>
            </form>
            {!tasks.length && <p className='looks-empty'>No Tasks To Display</p>}
            <div className="tasks-list">
                {tasks.map((task) => {
                    return (
                        <div className={task.isComplete ? "is-complete" : "task"} key={task.id}>
                            <input type="checkbox" checked={task.isComplete} onChange={handleCheckBox} name={task.id} />
                            <p>{task.task}</p>
                            {!task.isComplete && <div className='icons-div'>
                                <FontAwesomeIcon icon={faPenToSquare} onClick={() => handleEdit(task.id)} className='icon'/>
                                <FontAwesomeIcon icon={faTrashCan} onClick={() => handleDelete(task.id)} className='icon'/>
                            </div>}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default ToDoListForm;
