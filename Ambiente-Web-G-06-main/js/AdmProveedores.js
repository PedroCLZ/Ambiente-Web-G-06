document.addEventListener('DOMContentLoaded', function () {
    let isEditMode = false;
    let edittingId;
    const tasks = [{
        id: 1,
        name: "Starbucks",
        direction: "Costa Rica",
        contact: "45610324",
        email: "starbucks@example.com"
    },
    {
        id: 2,
        name: "Musmani",
        direction: "Costa Rica",
        contact: "76542198",
        email: "musmani@example.com"
    },
    {
        id: 3,
        name: "Dos Pinos",
        direction: "Costa Rica",
        contact: "7513547",
        email: "dospinos@example.com"
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
                        <h5 class="card-title">${task.name}</h5>
                        <p class="card-text">Direccion: ${task.direction}</p>
                        <p class="card-text">Email: ${task.email}</p>
                        <p class="card-text">Contacto: ${task.contact}</p>
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
            document.getElementById('task-name').value = task.name;
            document.getElementById('task-direc').value = task.direction;
            document.getElementById('task-contact').value = task.contact;
            document.getElementById('task-email').value = task.email;

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

        const name = document.getElementById("task-name").value;
        const direction = document.getElementById("task-direc").value;
        const contact = document.getElementById("task-contact").value;
        const email = document.getElementById("task-email").value;

        if (isEditMode) {
            //todo editar
            const task = tasks.find(t => t.id === edittingId);
            task.name = name;
            task.direction = direction;
            task.contact = contact;
            task.email = email;

        } else {
            const newTask = {
                id: tasks.length + 1,
                name: name,
                direction: direction,
                contact: contact,
                email: email,
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
