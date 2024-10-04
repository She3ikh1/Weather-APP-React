import React, { useEffect, useState } from "react";
import axios from "axios";
const Home = () => {

  const [tab, setTab] = useState(1);
  const [task, setTask] = useState(null);
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [updatedId, setUpdatedId] = useState(null);
  const [updatedtask, setUpdatedTask] = useState("");

  const handleTabs = (tab) => {
    setTab(tab);
  };
  const handleAddTask = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/new-task", { task }).then((res) => {
      setTodos(res.data);
      setTask("");
    });
    //new-task is our end point to add new todo
  };
  useEffect(() => {
    axios.get("http://localhost:5000/read-tasks").then((res) => {
      setTodos(res.data);
    });
  }, []);
  const handleEdit = (id, task) => {
    setTask(task);
    setIsEdit(true);
    setUpdatedTask(task);
    setUpdatedId(id);
    // axios.post("http://localhost:5000/update-task", { updatedId, updatedtask });
  };
  const updateTask = () => {
    // Ensure updatedtask has a valid value

    axios
      .post("http://localhost:5000/update-task", { updatedId, updatedtask })
      .then((res) => {
        setTodos(res.data);
        console.log("Task updated:", res.data);

        // Ensure updatedtask has a valid value
        if (!updatedtask || updatedtask.trim() === "") {
          alert("Task cannot be empty.");
          return;
        }

        axios
          .post("http://localhost:5000/update-task", { updatedId, updatedtask })
          .then((res) => {
            setTodos(res.data);
            setTask("");
            console.log("Task updated:", res.data);
            // Optionally refresh the todos list after the update
          })
          .catch((err) => {
            console.error("Error updating task:", err);
          });
      });
  };
  const handleDelete = (id) => {
    axios.post("http://localhost:5000/delete-task", { id }).then((res) => {
      setTodos(res.data);
    });
  };
  const handleComplete = (id) => {
    axios.post("http://localhost:5000/complete-task",{id})
    .then(res =>{
      // setTodos(res.)
    })
  };

  return (
    <div className="bg-lime-50 w-screen h-screen">
      <div className="flex-col flex w-screen h-screen justify-center items-center">
        <div>
          <h2 className="font-bold text-2xl mb-4">Todo List " </h2>
        </div>
        <div className="flex gap-3">
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            type="text"
            placeholder="Enter Todays Todo"
            className="w-64 p-2 outline-none border border-green-800 rounded-md"
          />
          <button className="bg-black text-white rounded-md px-4 hover:bg-slate-600">
            {isEdit ? (
              <button onClick={updateTask}>Update</button>
            ) : (
              <button onClick={handleAddTask}>Add</button>
            )}
          </button>
        </div>

        <div className="flex text-sm w-96 justify-evenly mt-4 ">
          <p
            onClick={() => handleTabs(1)}
            className={`${
              tab === 1 ? "text-purple-500" : "text-black"
            } curosr-pointer`}
          >
            All
          </p>
          <p
            onClick={() => handleTabs(2)}
            className={`${
              tab === 2 ? "text-purple-500" : "text-black"
            } curosr-pointer`}
          >
            Active
          </p>
          <p
            onClick={() => handleTabs(3)}
            className={`${
              tab === 3 ? "text-purple-500" : "text-black"
            } curosr-pointer`}
          >
            Completed
          </p>
        </div>
        {todos?.map((todo) => (
          <div className="flex justify-between bg-lime-100 p-2 w-96 mt-3 rounded-md">
            <div>
              <p className="text-lg font-semibold">{todo.task}</p>
              <p className="text-sm text-green-800 ">
                {new Date(todo.createdAt).toLocaleString()}
              </p>
              <p className="text-sm">Status : Active</p>
            </div>

            <div className="flex flex-col justify-start items-start">
              <button
                className="text-orange-500 cursor-pointer "
                onClick={() => handleEdit(todo.id, todo.task)}
              >
                Edit
              </button>
              <button
                className="text-red-600 cursor-pointer"
                onClick={() => handleDelete(todo.id)}
              >
                Delete
              </button>
              <button
                className="text-yellow-500 cursor-pointer"
                onClick={() => handleComplete(todo.id)}
              >
                Completed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default Home;
