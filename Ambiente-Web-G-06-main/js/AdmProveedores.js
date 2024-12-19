document.addEventListener('DOMContentLoaded', function () {

    let isEditMode = false;
    let edittingId;
    let proveedores = [];
    const API_URL = 'backend/AdmProveedores.php';

    async function CargarProveedores() {
        //va al servidor por los proveedores
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                proveedores = await response.json();
                renderProveedores(proveedores);
            } else {
                /*if (response.status == 401) {
                    window.location.href = 'AdmEmpleados.html';//REVISAR EL HTML EN CASO DE FALLO
                }
                console.error("Error al obtener empleados");*/

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error al obtener los proveedores: ", errorData.error || "Error desconocido");
                    return;
                }

            }

        } catch (err) {
            console.error(err);
        }

        function renderProveedores(proveedores) {
            //traer los proveedores desde el backend

            const provtList = document.getElementById('task-list');
            provtList.innerHTML = '';
            proveedores.forEach(function (proveedor) {

                const provCard = document.createElement('div');
                provCard.className = 'col-md-4 mb-3';
                provCard.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${proveedor.nombreProveedor}</h5>
                        <p class="card-text">Direccion: ${proveedor.direccion}</p>
                        <p class="card-text">Email: ${proveedor.email}</p>
                         <p class="card-text">Contacto: ${proveedor.contacto}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-secondary btn-sm edit-task" data-id="${proveedor.idProveedor}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-task" data-id="${proveedor.idProveedor}">Delete</button>
                    </div>
                </div>
            `;
                provtList.appendChild(provCard);
            });
        }

        // Asigna eventos a los botones después de cargar las tareas
        document.querySelectorAll('.edit-task').forEach(function (button) {
            button.addEventListener('click', handleEditProv);
        });

        document.querySelectorAll('.delete-task').forEach(function (button) {
            button.addEventListener('click', handleDeleteProv);
        });
    }

    // Función para editar proveedor
    function handleEditProv(event) {
        try {
            //localizar la tarea quieren editar
            const proveedorId = parseInt(event.target.dataset.idProveedor);
            const proveedor = proveedores.find(t => t.idProveedor === proveedorId);
            //cargar los datos en el formulario 
            document.getElementById('task-name').value = proveedor.nombreProveedor;
            document.getElementById('task-direc"').value = proveedor.direccion;
            document.getElementById('task-email').value = proveedor.email;
            document.getElementById('task-contact').value = proveedor.contacto;

            //ponerlo en modo edicion
            isEditMode = true;
            edittingId = proveedorId;
            //mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById("taskModal"));
            modal.show();


        } catch (error) {
            alert("Error trying to edit a prov");
            console.error(error);
        }
    }

    // Función para eliminar tarea

    async function handleDeleteProv(event) {
        const idProveedor = parseInt(event.target.dataset.id);
        const response = await fetch(`${API_URL}?idProveedor=${idProveedor}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            CargarProveedores();

        } else {
            console.error("Error eliminando proveedor");
            console.log(`${API_URL}?idProveedor=${idProveedor}`);
        }
    }

    // Evento para agregar una nueva tarea
    document.getElementById('task-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const nombreProveedor = document.getElementById("task-name").value;
        const direccion = document.getElementById("task-direc").value;
        const email = document.getElementById("task-email").value;
        const contacto = document.getElementById("task-contact").value;

        if (isEditMode) {
            //editar
            const response = await fetch(`${API_URL}?idProveedor=${edittingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombreProveedor: nombreProveedor, direccion: direccion, email: email, contacto: contacto }),
                credentials: "include"
            });
            if (!response.ok) {
                console.error("Sucedio un error");
            }

        } else {
            const newProv = {
                nombreProveedor: nombreProveedor,
                direccion: direccion,
                email: email,
                contacto: contacto
            };
            //enviar el proveedor al backend
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProv),
                credentials: "include"
            });
            if (!response.ok) {
                console.error("Sucedio un error");
            }
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        CargarProveedores();
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
    CargarProveedores();

});

