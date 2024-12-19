document.addEventListener('DOMContentLoaded', function () {

    let isEditMode = false;
    let edittingId;
    let productos = [];
    const API_URL = 'backend/AdmProductos.php';

    async function CargarProductos() {
        //va al servidor por los productos
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                productos = await response.json();
                renderProductos(productos);
            } else {
                /*if (response.status == 401) {
                    window.location.href = 'AdmEmpleados.html';//REVISAR EL HTML EN CASO DE FALLO
                }
                console.error("Error al obtener empleados");*/

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error al obtener los productos: ", errorData.error || "Error desconocido");
                    return;
                }
                
            }
            
        } catch (err) {
            console.error(err);
        }

        function renderProductos(productos) {
            //traer los productos desde el backend
            
            const productList = document.getElementById('task-list');
            productList.innerHTML = '';
            productos.forEach(function (producto) {
    
                const productCard = document.createElement('div');
                productCard.className = 'col-md-4 mb-3';
                productCard.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombreProducto}</h5>
                        <p class="card-text">${producto.descripcion}</p>
                        <p class="card-text">Estado: ${producto.estado}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-secondary btn-sm edit-task" data-id="${producto.idProducto}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-task" data-id="${producto.idProducto}">Delete</button>
                    </div>
                </div>
            `;
                productList.appendChild(productCard);
            });
        }
    
        // Asigna eventos a los botones después de cargar las tareas
        document.querySelectorAll('.edit-task').forEach(function (button) {
            button.addEventListener('click', handleEditProduct);
        });
    
        document.querySelectorAll('.delete-task').forEach(function (button) {
            button.addEventListener('click', handleDeleteProduct);
        });
    }
    
    // Función para editar producto
    function handleEditProduct(event) {
        try {
            //localizar la tarea quieren editar
            const productoId = parseInt(event.target.dataset.idProducto);
            const producto = productos.find(t => t.idProducto === productoId);
            //cargar los datos en el formulario 
            document.getElementById('task-title').value = producto.nombreProducto;
            document.getElementById('task-desc"').value = producto.descripcion;
            document.getElementById('task-state').value = producto.estado;

            //ponerlo en modo edicion
            isEditMode = true;
            edittingId = productoId;
            //mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById("taskModal"));
            modal.show();


        } catch (error) {
            alert("Error trying to edit a product");
            console.error(error);
        }
    }

    // Función para eliminar tarea
    
    async function handleDeleteProduct(event) {
        const idProducto = parseInt(event.target.dataset.id);
        const response = await fetch(`${API_URL}?idProducto=${idProducto}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            CargarProductos();
            
        } else {
            console.error("Error eliminando producto");
            console.log(`${API_URL}?idProducto=${idProducto}`);
        }
    }

    // Evento para agregar una nueva tarea
    document.getElementById('task-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const nombreProducto = document.getElementById("task-title").value;
        const descripcion = document.getElementById("task-desc").value;
        const estado = document.getElementById("task-state").value;

        if (isEditMode) {
            //editar
            const response = await fetch(`${API_URL}?idProducto=${edittingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombreProducto: nombreProducto, descripcion: descripcion, estado: estado}),
                credentials: "include"
            });
            if (!response.ok) {
                console.error("Sucedio un error");
            }

        } else {
            const newProduct = {
                nombreProducto: nombreProducto,
                descripcion: descripcion,
                estado: estado
            };
            //enviar el producto al backend
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct),
                credentials: "include"
            });
            if (!response.ok) {
                console.error("Sucedio un error");
            }
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        CargarProductos();
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
    CargarProductos();

});


