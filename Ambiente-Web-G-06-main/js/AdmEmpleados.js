document.addEventListener('DOMContentLoaded', function () {

    let isEditMode = false;
    let edittingId;
    let empleados = [];
    const API_URL = 'backend/AdmEmpleados.php';
    
    
    async function CargarEmpleados() {
        //va al servidor por los empleados
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                empleados = await response.json();
                renderEmpleados(empleados);
            } else {
                /*if (response.status == 401) {
                    window.location.href = 'AdmEmpleados.html';//REVISAR EL HTML EN CASO DE FALLO
                }
                console.error("Error al obtener empleados");*/

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error al obtener empleados: ", errorData.error || "Error desconocido");
                    return;
                }
                
            }
            
        } catch (err) {
            console.error(err);
        }
    }

    function renderEmpleados(empleados) {
        //traer los empleados desde el backend
        
        const EmployeeList = document.getElementById('task-list');
        EmployeeList.innerHTML = '';
        empleados.forEach(function (empleado) {

            const employeeCard = document.createElement('div');
            employeeCard.className = 'col-md-4 mb-3';
            employeeCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${empleado.nombreEmpleado}</h5>
                    <p class="card-text">${empleado.direccion}</p>
                    <p class="card-text"><small class="text-muted">Contacto: ${empleado.contacto}</small> </p>
                    <p class="card-text"><small class="text-muted">Email: ${empleado.email}</small> </p>
                    <p class="card-text"><small class="text-muted">Puesto: ${empleado.puesto}</small> </p>
                    <p class="card-text"><small class="text-muted">Horario: ${empleado.horario}</small> </p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-secondary btn-sm edit-task"data-id="${empleado.idEmpleado}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-task" data-id="${empleado.idEmpleado}">Delete</button>
                </div>
            </div>
            `;
            EmployeeList.appendChild(employeeCard);
        });


        document.querySelectorAll('.edit-task').forEach(function (button) {
            button.addEventListener('click', handleEditEmployee);
        });

        document.querySelectorAll('.delete-task').forEach(function (button) {
            button.addEventListener('click', handleDeleteEmployee);
        });

    }

    function handleEditEmployee(event) {
        try {
            //localizar la tarea quieren editar
            const empleadoId = parseInt(event.target.dataset.idEmpleado);
            const empleado = empleados.find(t => t.idEmpleado === empleadoId);
            //cargar los datos en el formulario 
            document.getElementById('task-name').value = empleado.nombreEmpleado;
            document.getElementById('task-direc').value = empleado.direccion;
            document.getElementById('task-contact').value = empleado.contacto;
            document.getElementById('task-email').value = empleado.email;
            document.getElementById('task-job').value = empleado.puesto;
            document.getElementById('task-hour').value = empleado.horario;

            //ponerlo en modo edicion
            isEditMode = true;
            edittingId = empleadoId;
            //mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById("taskModal"));
            modal.show();


        } catch (error) {
            alert("Error trying to edit a employee");
            console.error(error);
        }
    }


    async function handleDeleteEmployee(event) {
        const idEmpleado = parseInt(event.target.dataset.id);
        const response = await fetch(`${API_URL}?idEmpleado=${idEmpleado}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            CargarEmpleados();
            
        } else {
            console.error("Error eliminando empleados");
            console.log(`${API_URL}?idEmpleado=${idEmpleado}`);
        }
    }
    

    document.getElementById('task-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const nombreEmpleado = document.getElementById("task-name").value;
        const direccion = document.getElementById("task-direc").value;
        const contacto = document.getElementById("task-contact").value;
        const email = document.getElementById("task-email").value;
        const puesto = document.getElementById("task-job").value;
        const horario = document.getElementById("task-hour").value;

        if (isEditMode) {
            //editar
            const response = await fetch(`${API_URL}?idEmpleado=${edittingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombreEmpleado: nombreEmpleado, direccion: direccion, contacto: contacto,email: email,puesto: puesto,horario: horario }),
                credentials: "include"
            });
            if (!response.ok) {
                console.error("Sucedio un error");
            }

        } else {
            const newEmployee = {
                nombreEmpleado: nombreEmpleado,
                direccion: direccion,
                contacto: contacto,
                email: email,
                puesto: puesto,
                horario: horario
            };
            //enviar el empleado al backend
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newEmployee),
                credentials: "include"
            });
            if (!response.ok) {
                console.error("Sucedio un error");
            }
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        CargarEmpleados();
    });

    document.getElementById('taskModal').addEventListener('show.bs.modal', function () {
        if (!isEditMode) {
            document.getElementById('task-form').reset();
            // document.getElementById('task-title').value = "";
            // document.getElementById('task-desc').value = "";
            // document.getElementById('due-date').value = "";
        }
    });

    document.getElementById("taskModal").addEventListener('hidden.bs.modal', function () {
        edittingId = null;
        isEditMode = false;
    })
    CargarEmpleados();

});