'use strict';


const todoControl = document.querySelector('.todo-control'),
    headerInput = document.querySelector('.header-input'),
    todoList = document.querySelector('.todo-list'),
    todoCompleted = document.querySelector('.todo-completed');

let todoData = [];


for(let i = 0; i<localStorage.length; i++){
    let key = localStorage.key(i);
    let compl = localStorage.getItem(key) === "true" ? true : false;
    let newTodo = {
        value: key,
        completed: compl
    };
    todoData.push(newTodo);
}

const render = function() {

    todoList.textContent = '';
    todoCompleted.textContent = '';

    todoData.forEach(function(item){
        const li = document.createElement('li');
        li.classList.add('todo-item');

        li.innerHTML = '<span class="text-todo">'+item.value+'</span>'+
                    '<div class="todo-buttons">'+
                        '<button class="todo-remove"></button>'+
                        '<button class="todo-complete"></button>'+
                    '</div>';
        console.log(item);
        if(item.completed){
            todoCompleted.append(li);
        } else{
            todoList.append(li);
        }
        
        const btntodoComplete = li.querySelector('.todo-complete');
        const btntodoRemove = li.querySelector('.todo-remove');

        btntodoComplete.addEventListener('click', function(){
            item.completed = !item.completed;
            let localComplete = localStorage.getItem(item.value) === "true" ? true : false;
            
            localStorage.setItem(item.value,(!localComplete));
            console.log((!localComplete));
            render();
        });
        btntodoRemove.addEventListener('click', function(){
            let index = todoData.indexOf(item);
            todoData.splice(index,1);
            localStorage.removeItem(item.value);
            render();
        });
});

};

todoControl.addEventListener("submit", function(event){
    event.preventDefault();
    if(!headerInput.value) return;
    const newTodo = {
        value: headerInput.value ,
        completed: false
    };

    todoData.push(newTodo);
    localStorage.setItem(newTodo.value,false);
    headerInput.value = '';

    render();
});

render();