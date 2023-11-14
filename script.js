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
    axios.get('https://crudcrud.com/api/6b1997144fdc46be90035e163cbcb95c/taskData')
        .then((response) => {
            for (var i = 0; i < response.data.length; i++) {
                displayTask(response.data[i]);
                // console.log(response.data[i]._id);
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
        li.appendChild(document.createTextNode(` :${task._id}`));
        pendingTaskList.appendChild(li);
    } else {
        li.appendChild(document.createTextNode(`${task.task}:`));
        li.appendChild(delBtn);
        li.appendChild(document.createTextNode(` ${task.description}`));
        li.appendChild(document.createTextNode(` :${task._id}`));
        completedTaskList.appendChild(li);
    }
}

function addTask(e) {
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

    axios.post('https://crudcrud.com/api/6b1997144fdc46be90035e163cbcb95c/taskData', taskData)
        .then((response) => {
            li.appendChild(document.createTextNode(`: ${response.data._id}`));
            console.log("New Task is created with ID: ", response.data._id);
        })
        .catch((err) => {
            console.log(err);
        })

    taskName.value = '';
    taskDescription.value = '';
}

function completeTask(e) {
    if (e.target.classList.contains('done')) {
        // console.log(e.target.parentElement.innerText);
        let splitString = e.target.parentElement.innerText.split(':');
        let taskName = splitString[0].trim();
        let taskDescription = splitString[1].trim();
        let taskID = splitString[2].trim();

        const li = document.createElement('li');
        const delBtn = document.createElement('input');

        delBtn.classList = 'del float-right';
        delBtn.setAttribute('type', 'button');
        delBtn.setAttribute('value', 'DEL');

        li.appendChild(document.createTextNode(`${taskName}: ${taskDescription}`));
        li.appendChild(delBtn);
        li.appendChild(document.createTextNode(`:${taskID}`));
        completedTaskList.appendChild(li);
        pendingTaskList.removeChild(e.target.parentElement);

        axios.put(`https://crudcrud.com/api/6b1997144fdc46be90035e163cbcb95c/taskData/${taskID}`, { "task": `${taskName}`, "description": `${taskDescription}`, "isCompleted": true })
            .then((response) => {
                console.log("Task completed with ID: ", taskID);
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

function deleteTask(e) {
    if (e.target.classList.contains('del')) {
        let splitString = e.target.parentElement.innerText.split(':');
        let taskID = splitString[2].trim();

        if(e.target.parentElement.parentElement.classList.contains('remaining-task-list')) {
            pendingTaskList.removeChild(e.target.parentElement);
        } else if(e.target.parentElement.parentElement.classList.contains('completed-task-list')) {
            completedTaskList.removeChild(e.target.parentElement);
        }
        
        axios.delete(`https://crudcrud.com/api/6b1997144fdc46be90035e163cbcb95c/taskData/${taskID}`)
            .then((response) => {
                console.log("Task deleted with ID: ", taskID);
            })
            .catch((err) => {
                console.log(err);
            })
    }
}