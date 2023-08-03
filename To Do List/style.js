const data = new Date();

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

let oldInputValue;
let todos = [];

const timeElapsed = Date.now();
const today = new Date(timeElapsed);
document.getElementById("date").innerHTML = today.toDateString();
function time() {
    const data = new Date();
    let h = data.getHours();
    let m = data.getMinutes();
    let s = data.getSeconds();

    if (h < 10)
        h = "0" + h;
    if (m < 10)
        m = "0" + m;
    if (s < 10)
        s = "0" + s;

    document.getElementById("hour").innerHTML = h + ":" + m + ":" + s;
    setTimeout('time()', 500);
}
time(); 
// Load todo list from local storage when the page is loaded or refreshed
window.addEventListener('load', () => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
        updateTodoList();
    }
});

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = todoInput.value;
    if (inputValue)
        saveTodoAndStore(inputValue); // Save Function with local storage
});

const saveTodoToDOM = (todo) => {
    const todoElement = document.createElement("div");
    todoElement.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = todo.title;
    todoElement.appendChild(todoTitle);

    if (todo.completed) {
        todoElement.classList.add("done");
    }

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todoElement.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todoElement.appendChild(editBtn);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-todo");
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todoElement.appendChild(removeBtn);

    todoList.appendChild(todoElement);
    todoInput.value = "";
    todoInput.focus();
};

const saveTodoAndStore = (text) => {
    const newTodo = { title: text, completed: false };
    saveTodoToDOM(newTodo);
    todos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(todos));
};

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if (parentEl && parentEl.querySelector("h3"))
        todoTitle = parentEl.querySelector("h3").innerText;

    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
        // Update the completion status in the todos array and local storage
        const index = todos.findIndex(todo => todo.title === todoTitle);
        if (index !== -1) {
            todos[index].completed = parentEl.classList.contains("done");
            localStorage.setItem('todos', JSON.stringify(todos));
        }
    }

    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
        // Remove the task from the todos array and update local storage
        todos = todos.filter(todo => todo.title !== todoTitle);
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();
        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }
});

// Add event listener for instant editing when clicking on the todo title
todoList.addEventListener("click", (e) => {
    const targetEl = e.target;
    if (targetEl.tagName === "H3") {
        const todoElement = targetEl.parentElement;
        const todoTitle = targetEl.innerText;

        toggleForms();
        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value;
    if (editInputValue) {
        // Find the corresponding todo object in the todos array and update it
        const index = todos.findIndex((todo) => todo.title === oldInputValue);
        if (index !== -1) {
            todos[index].title = editInputValue;
            // Update local storage with the updated todos array
            localStorage.setItem('todos', JSON.stringify(todos));
            updateTodoList(); // Update the entire todo list after an edit
        }
    }

    toggleForms();
});

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
});

function updateTodoList() {
    todoList.innerHTML = ""; // Clear the current todo list
    todos.forEach(todo => saveTodoToDOM(todo)); // Rebuild the todo list with updated data
}
