const backLog = document.querySelector('#backlog-list')
const todoList = document.querySelector('#todo-list')
const doingList = document.querySelector('#doing-list')
const doneList = document.querySelector('#done-list')
const form = document.querySelector('#add-todo-form')

// RENDER BACKLOG
function renderBackLog(doc) {
	let li = document.createElement('li')
	let task = document.createElement('span')
	let status = document.createElement('span')
	let cross = document.createElement('div')
	let down = document.createElement('span')

	li.setAttribute('data-id', doc.id)
	task.textContent = doc.data().task
	status.textContent = doc.data().status
	cross.textContent = 'x'
	down.textContent = 'Next'

	li.appendChild(task)
	li.appendChild(status)
	li.appendChild(cross)
	li.appendChild(down)
	backLog.appendChild(li)

	// Delete data
	cross.addEventListener('click', (e) => {
		e.stopPropagation();
		let id = e.target.parentElement.getAttribute('data-id')
		db.collection('todo').doc(id).delete()
	})

	down.addEventListener('click', (e) => {
		e.stopPropagation()
		let id = e.target.parentElement.getAttribute('data-id')
		db.collection('todo').doc(id).update({status: 'todo'})
	})
}


// RENDER TODO
function renderTodo(doc) {
	let li = document.createElement('li')
	let task = document.createElement('span')
	let status = document.createElement('span')
	let cross = document.createElement('div')
	let up = document.createElement('span')
	let down = document.createElement('span')

	li.setAttribute('data-id', doc.id)
	task.textContent = doc.data().task
	status.textContent = doc.data().status
	cross.textContent = 'x'
	up.textContent = 'Previous'
	down.textContent = 'Next'

	li.appendChild(task)
	li.appendChild(status)
	li.appendChild(cross)
	li.appendChild(up)
	li.appendChild(down)
	todoList.appendChild(li)

	// Delete data
	cross.addEventListener('click', (e) => {
		e.stopPropagation();
		let id = e.target.parentElement.getAttribute('data-id')
		db.collection('todo').doc(id).delete()
	})

	up.addEventListener('click', (e) => {
		e.stopPropagation()
		let id = e.target.parentElement.getAttribute('data-id')
		db.collection('todo').doc(id).update({status: 'backlog'})
	})

	down.addEventListener('click', (e) => {
		e.stopPropagation()
		let id = e.target.parentElement.getAttribute('data-id')
		db.collection('todo').doc(id).update({status: 'doing'})
	})
}

// RENDER DOING
function renderDoing(doc) {
	let li = document.createElement('li')
	let task = document.createElement('span')
	let status = document.createElement('span')
	let cross = document.createElement('div')
	let up = document.createElement('span')
	let down = document.createElement('span')

	li.setAttribute('data-id', doc.id)
	task.textContent = doc.data().task
	status.textContent = doc.data().status
	cross.textContent = 'x'
	up.textContent = 'Previous'
	down.textContent = 'Next'

	li.appendChild(task)
	li.appendChild(status)
	li.appendChild(cross)
	li.appendChild(up)
	li.appendChild(down)
	doingList.appendChild(li)

	// Delete data
	cross.addEventListener('click', (e) => {
		e.stopPropagation();
		let id = e.target.parentElement.getAttribute('data-id')
		db.collection('todo').doc(id).delete()
	})
	up.addEventListener('click', (e) => {
		e.stopPropagation()
		let id = e.target.parentElement.getAttribute('data-id')
		db.collection('todo').doc(id).update({status: 'todo'})
	})
	down.addEventListener('click', (e) => {
		e.stopPropagation()
		let id = e.target.parentElement.getAttribute('data-id')
		db.collection('todo').doc(id).update({status: 'done'})
	})
}

// RENDER DONE
function renderDone(doc) {
	let li = document.createElement('li')
	let task = document.createElement('span')
	let status = document.createElement('span')
	let up = document.createElement('span')
	let cross = document.createElement('div')

	li.setAttribute('data-id', doc.id)
	task.textContent = doc.data().task
	status.textContent = doc.data().status
	cross.textContent = 'x'
	up.textContent = 'Previous'

	li.appendChild(task)
	li.appendChild(status)
	li.appendChild(cross)
	li.appendChild(up)
	doneList.appendChild(li)

	// Delete data
	cross.addEventListener('click', (e) => {
		e.stopPropagation();
		let id = e.target.parentElement.getAttribute('data-id')
		db.collection('todo').doc(id).delete()
	})

	up.addEventListener('click', (e) => {
		e.stopPropagation()
		let id = e.target.parentElement.getAttribute('data-id')
		db.collection('todo').doc(id).update({status: 'doing'})
	})
}

// GET DATA TODO
// real time database

db.collection('todo').where('status', '==', 'backlog').onSnapshot(snapshot => {
	let changes = snapshot.docChanges()
	console.log('changes from backlog: ',changes)
	changes.forEach(dataChange => {
		console.log('dataChange in backLog: ', dataChange)
		if(dataChange.type == 'added') {
			renderBackLog(dataChange.doc)
		} else if(dataChange.type == 'removed') {
			let li = backLog.querySelector('[data-id=' + dataChange.doc.id + ']')
			console.log('removed data from backlog li: ', li)
			backLog.removeChild(li)
		}
	})
})

db.collection('todo').where('status', '==', 'todo').onSnapshot(snapshot => {
	let changes = snapshot.docChanges()
	changes.forEach(dataChange => {
		if(dataChange.type == 'added') {
			renderTodo(dataChange.doc)
		} else if(dataChange.type == 'removed') {
			let li = todoList.querySelector('[data-id=' + dataChange.doc.id + ']')
			console.log('removed data from todo li: ', li)
			todoList.removeChild(li)
		}
	})
})

db.collection('todo').where('status', '==', 'doing').onSnapshot(snapshot => {
	let changes = snapshot.docChanges()
	changes.forEach(dataChange => {
		if(dataChange.type == 'added') {
			renderDoing(dataChange.doc)
		} else if(dataChange.type == 'removed') {
			let li = doingList.querySelector('[data-id=' + dataChange.doc.id + ']')
			console.log('removed data from doing li: ', li)
			doingList.removeChild(li)
		}
	})
})

db.collection('todo').where('status', '==', 'done').onSnapshot(snapshot => {
	let changes = snapshot.docChanges()
	changes.forEach(dataChange => {
		if(dataChange.type == 'added') {
			renderDone(dataChange.doc)
		} else if(dataChange.type == 'removed') {
			let li = doneList.querySelector('[data-id=' + dataChange.doc.id + ']')
			console.log('removed data from done li: ', li)
			doneList.removeChild(li)
		}
	})
})

// SAVE DATA

form.addEventListener('submit', (e)=> {
	e.preventDefault();
	if(form.task.value && form.status.value) {
		db.collection('todo').add({
			task: form.task.value,
			status: form.status.value
		})
		form.task.value = '';
	} else {
		alert('please fill all fields')
	}
})

