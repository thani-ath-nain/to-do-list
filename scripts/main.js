// import { getQuotes } from "generateQuotes.js";
const quotes = [
	`Your time is limited, so don’t waste it living someone else’s life. -Steve Jobs`,
	`Stay hungry. Stay foolish. -Steve Jobs`,
	`The way to get started is to quit talking and begin doing. -Walt Disney`,
	`It is your work in life that is the ultimate seduction. -Pablo Picasso`,
	`Action is the foundational key to all success. -Pablo Picasso`,
	`Everybody has goals, aspirations or whatever, and everybody has been at a point in their life where nobody believed in them. -EMINEM`,
	`I just can’t sit back and wallow, in my own sorrow, but I know one fact: I’ll be one tough act to follow. -EMINEM`,
	`Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time. -Thomas Edison`,
	`There is no substitute for hard work. -Thomas Edison`,
	`Opportunity is missed by most people because it is dressed in overalls and looks like work. -Thomas Edison`,
	`The three great essentials to achieve anything worth while are: Hard work, Stick-to-itiveness, and Common sense. -Thomas Edison`,
	`I never did a day's work in my life. It was all fun. -Thomas Edison`,
	`Study without desire spoils the memory, and it retains nothing that it takes in. -Leonardo Da Vinci`,
	`As a well spent day brings happy sleep, so life well used brings happy death. -Leonardo Da Vinci`,
	`One can have no smaller or greater mastery than mastery of oneself. -Leonardo Da Vinci`,
];
function getIndexOfNewQuote() {
	return Math.floor(Math.random() * quotes.length);
}
/* export */ function getQuotes() {
	const randomIndex = getIndexOfNewQuote();
	document.querySelector('#quoteDisplay').innerHTML = quotes[randomIndex];
	console.log(quotes[randomIndex]);
}

// function addNewQuote(newQuote) {
//   if (newQuote !== "") {
//     return quotes.push(newQuote);
//   } else {
//     return;
//   }
// }

getQuotes();
const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');
const listDisplayContainer = document.querySelector(
	'[data-list-display-container]',
);
const listTitleElement = document.querySelector('[data-list-title]');
const listCountElement = document.querySelector('[data-list-count]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const clearCompleteTasksButton = document.querySelector(
	'[data-clear-complete-tasks-button]',
);

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

function saveAndRender() {
	save();
	render();
}

listsContainer.addEventListener('click', (e) => {
	if (e.target.tagName.toLowerCase() === 'li') {
		selectedListId = e.target.dataset.listId;
		saveAndRender();
	}
});

tasksContainer.addEventListener('click', (e) => {
	if (e.target.tagName.toLowerCase() === 'input') {
		const selectedList = lists.find((list) => list.id === selectedListId);
		const selectedTask = selectedList.tasks.find(
			(task) => task.id === e.target.id,
		);
		selectedTask.complete = e.target.checked;
		save();
		renderTaskCount(selectedList);
	}
});

clearCompleteTasksButton.addEventListener('click', (e) => {
	const selectedList = lists.find((list) => list.id === selectedListId);
	selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
	saveAndRender();
});

deleteListButton.addEventListener('click', (e) => {
	lists = lists.filter((list) => list.id !== selectedListId);
	selectedListId = null;
	saveAndRender();
});

newListForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const listName = newListInput.value;
	if (listName == null || listName === '') return;
	const list = createList(listName);
	newListInput.value = null;
	lists.push(list);
	saveAndRender();
});

newTaskForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const taskName = newTaskInput.value;
	if (taskName == null || taskName === '') return;
	const task = createTask(taskName);
	newTaskInput.value = null;
	const selectedList = lists.find((list) => list.id === selectedListId);
	selectedList.tasks.push(task);
	saveAndRender();
});

function createList(name) {
	return { id: Date.now().toString(), name: name, tasks: [] };
}

function createTask(name) {
	return { id: Date.now().toString(), name: name, complete: false };
}

function save() {
	localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
	localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
	clearElement(listsContainer);
	renderLists();

	const selectedList = lists.find((list) => list.id === selectedListId);
	if (selectedListId == null) {
		listDisplayContainer.style.display = 'none';
	} else {
		listDisplayContainer.style.display = '';
		listTitleElement.innerText = selectedList.name;
		renderTaskCount(selectedList);
		clearElement(tasksContainer);
		renderTasks(selectedList);
	}
}

function renderTasks(selectedList) {
	selectedList.tasks.forEach((task) => {
		const taskElement = document.importNode(taskTemplate.content, true);
		const checkbox = taskElement.querySelector('input');
		checkbox.id = task.id;
		checkbox.checked = task.complete;
		const label = taskElement.querySelector('label');
		label.htmlFor = task.id;
		label.append(task.name);
		tasksContainer.appendChild(taskElement);
	});
}

function renderTaskCount(selectedList) {
	const incompleteTaskCount = selectedList.tasks.filter(
		(task) => !task.complete,
	).length;
	const taskString = incompleteTaskCount === 1 ? 'task' : 'tasks';
	listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

function renderLists() {
	lists.forEach((list) => {
		const listElement = document.createElement('li');
		listElement.dataset.listId = list.id;
		listElement.classList.add('list-name');
		listElement.innerText = list.name;
		if (list.id === selectedListId) {
			listElement.classList.add('active-list');
		}
		listsContainer.appendChild(listElement);
	});
}

function clearElement(element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

render();
//TODO Refactor.
//TODO make seperate place for quoteGenerator. Use module pattern.
