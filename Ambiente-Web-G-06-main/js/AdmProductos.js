document.addEventListener('DOMContentLoaded', function () {
    let isEditMode = false;
    let edittingId;
    const tasks = [{
        id: 1,
        title: "Latte Caramelo Ahumado",
        description: "Un espresso suave combinado con leche cremosa y un toque de jarabe de caramelo ahumado. Esta mezcla dulce y ahumada se corona con una pizca de sal marina para realzar todos los sabores. Ideal para quienes buscan algo reconfortante y con un toque especial.",
        state: "Disponible"
    },
    {
        id: 2,
        title: "Panini Caprese al Pesto",
        description: "Pan focaccia crujiente relleno de rodajas frescas de mozzarella, tomates cherry y hojas de albahaca, untado con pesto de albahaca casero. Este panini se tuesta hasta alcanzar un dorado perfecto, liberando los aromas frescos de sus ingredientes. Un clásico italiano ideal para un almuerzo ligero.",
        state: "No disponible"
    },
    {
        id: 3,
        title: "Smoothie Energía Verde",
        description: "Un smoothie revitalizante hecho de espinacas frescas, pepino, manzana verde, piña y un toque de jengibre. Perfecto para quienes buscan una opción saludable, refrescante y energizante. Se puede personalizar con semillas de chía o espirulina para un impulso extra de nutrientes.",
        state: "Disponible"
    }];

    function loadTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        tasks.forEach(function (task) {
            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';
            taskCard.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${task.title}</h5>
                        <p class="card-text">${task.description}</p>
                        <p class="card-text">Estado: ${task.state}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
                    </div>
                </div>
            `;
            taskList.appendChild(taskCard);
        });
    
        // Asigna eventos a los botones después de cargar las tareas
        document.querySelectorAll('.edit-task').forEach(function (button) {
            button.addEventListener('click', handleEditTask);
        });
    
        document.querySelectorAll('.delete-task').forEach(function (button) {
            button.addEventListener('click', handleDeleteTask);
        });
    }
    

    document.querySelectorAll('.delete-task').forEach(function (button) {
        button.addEventListener('click', handleDeleteTask);
    });

    // Función para editar tarea
    function handleEditTask(event) {
        try {
            // alert(event.target.dataset.id);
            //localizar la tarea quieren editar
            const taskId = parseInt(event.target.dataset.id);
            const task = tasks.find(t => t.id === taskId);
            //cargar los datos en el formulario 
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-desc').value = task.description;
            document.getElementById('task-state').value = task.state;
            //ponerlo en modo edicion
            isEditMode = true;
            edittingId = taskId;
            //mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById("taskModal"));
            modal.show();


        } catch (error) {
            alert("Error trying to edit a task");
            console.error(error);
        }
    }

    // Función para eliminar tarea
    function handleDeleteTask(event) {
        const id = parseInt(event.target.dataset.id);
        const index = tasks.findIndex(t => t.id === id);
        tasks.splice(index, 1);
        loadTasks();
    }

    // Evento para agregar una nueva tarea
    document.getElementById('task-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-desc").value;
        const state = document.getElementById("task-state").value;

        if (isEditMode) {
            //todo editar
            const task = tasks.find(t => t.id === edittingId);
            task.title = title;
            task.description = description;
            task.state = state;
        } else {
            const newTask = {
                id: tasks.length + 1,
                title: title,
                description: description,
                state: state,
            };
            tasks.push(newTask);
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        loadTasks();
    });

    document.getElementById('taskModal').addEventListener('show.bs.modal',function(){
        if(!isEditMode){
            document.getElementById('task-form').reset();
            // document.getElementById('task-title').value = "";
            // document.getElementById('task-desc').value = "";
            // document.getElementById('due-date').value = "";
        }
    });

    document.getElementById("taskModal").addEventListener('hidden.bs.modal', function(){
        edittingId = null;
        isEditMode = false;
    })
    loadTasks();

});

