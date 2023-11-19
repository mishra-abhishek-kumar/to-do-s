const form = document.getElementById('form');
const taskName = document.getElementById('task-name');
const taskDescription = document.getElementById('task-desc');
const pendingTaskList = document.getElementById('remaining-task-list');
const completedTaskList = document.getElementById('completed-task-list');

form.addEventListener('submit', addTask);
pendingTaskList.addEventListener('click', completeTask);
pendingTaskList.addEventListener('click', deleteTask);
completedTaskList.addEventListener('click', deleteTask);

window.addEventListener('DOMContentLoaded', () => {
    axios.get('https://crudcrud.com/api/e96abb4a497d4fdcb00ebb5291bd4233/taskData')
        .then((response) => {
            for (var i = 0; i < response.data.length; i++) {
                displayTask(response.data[i]);
            }
        })
        .catch((err) => {
            console.log(err);
        })
});

function displayTask(task) {
    console.log(task._id);
    //creating elements to be added
    const li = document.createElement('li');
    const doneBtn = document.createElement('input');
    const delBtn = document.createElement('input');

    //styliing buttons
    doneBtn.classList = 'done float-right';
    doneBtn.setAttribute('type', 'button');
    doneBtn.setAttribute('value', 'DONE')

    delBtn.classList = 'del float-right';
    delBtn.setAttribute('type', 'button');
    delBtn.setAttribute('value', 'DEL');


    if (task.isCompleted === false) {
        li.appendChild(document.createTextNode(`${task.task}:`));
        li.appendChild(delBtn);
        li.appendChild(doneBtn);
        li.appendChild(document.createTextNode(` ${task.description}`));
        li.setAttribute("id", `${task._id}`);
        pendingTaskList.appendChild(li);
    } else {
        li.appendChild(document.createTextNode(`${task.task}:`));
        li.appendChild(delBtn);
        li.appendChild(document.createTextNode(` ${task.description}`));
        li.setAttribute("id", `${task._id}`);
        completedTaskList.appendChild(li);
    }
}

async function addTask(e) {
    e.preventDefault();

    //creating elements to be added
    const li = document.createElement('li');
    const doneBtn = document.createElement('input');
    const delBtn = document.createElement('input');

    //styliing buttons
    doneBtn.classList = 'done float-right';
    doneBtn.setAttribute('type', 'button');
    doneBtn.setAttribute('value', 'DONE')

    delBtn.classList = 'del float-right';
    delBtn.setAttribute('type', 'button');
    delBtn.setAttribute('value', 'DEL');

    //appending li with elements 
    li.appendChild(document.createTextNode(`${taskName.value}:`));
    li.appendChild(delBtn);
    li.appendChild(doneBtn);
    li.appendChild(document.createTextNode(` ${taskDescription.value}`));

    //appending completed li to pending tasks
    pendingTaskList.appendChild(li);

    const taskData = {
        task: `${taskName.value}`,
        description: `${taskDescription.value}`,
        isCompleted: false
    }

    try {
        const response = await axios.post('https://crudcrud.com/api/e96abb4a497d4fdcb00ebb5291bd4233/taskData', taskData);
        li.setAttribute("id", response.data._id);
        console.log("New Task is created with ID: ", response.data._id);
    } catch (error) {
        console.log(error);
    }

    taskName.value = '';
    taskDescription.value = '';
}

async function completeTask(e) {
    if (e.target.classList.contains('done')) {
        let splitString = e.target.parentElement.innerText.split(':');
        let taskName = splitString[0].trim();
        let taskDescription = splitString[1].trim();
        
        const li = document.createElement('li');
        const delBtn = document.createElement('input');

        delBtn.classList = 'del float-right';
        delBtn.setAttribute('type', 'button');
        delBtn.setAttribute('value', 'DEL');

        try {
            const response = await axios.put(`https://crudcrud.com/api/e96abb4a497d4fdcb00ebb5291bd4233/taskData/${e.target.parentElement.id}`, { "task": `${taskName}`, "description": `${taskDescription}`, "isCompleted": true });
            console.log("Task completed with ID: ", e.target.parentElement.id);
            li.appendChild(document.createTextNode(`${taskName}: ${taskDescription}`));
            li.appendChild(delBtn);
            li.setAttribute("id", e.target.parentElement.id);
        } catch (error) {
            console.log(error);
        }


        completedTaskList.appendChild(li);
        pendingTaskList.removeChild(e.target.parentElement);
    }
}

async function deleteTask(e) {
    if (e.target.classList.contains('del')) {

        if (e.target.parentElement.parentElement.classList.contains('remaining-task-list')) {
            pendingTaskList.removeChild(e.target.parentElement);
        } else if (e.target.parentElement.parentElement.classList.contains('completed-task-list')) {
            completedTaskList.removeChild(e.target.parentElement);
        }

        try {
            await axios.delete(`https://crudcrud.com/api/e96abb4a497d4fdcb00ebb5291bd4233/taskData/${e.target.parentElement.id}`);
            console.log("Task deleted with ID: ", e.target.parentElement.id);
        } catch (error) {
            console.log(error);
        }
    }
}