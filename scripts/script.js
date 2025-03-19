// Selecciona todos los elementos con las clases "comm-card" y "reference-drop"
const commTitles = document.getElementsByClassName("comm-card"); // Colección de títulos.
const commDrops = document.getElementsByClassName("reference-drop"); // Colección de desplegables.

// Itera sobre los títulos y agrega un evento click a cada uno
for (let i = 0; i < commTitles.length; i++) {
  commTitles[i].addEventListener("click", function(event) {
    // Detén la propagación del evento
    event.stopPropagation();
    
    // Alterna la visibilidad del desplegable correspondiente al título
    toggleCommDrop(i); // Pasamos el índice para identificar el desplegable.
  });
}

// Agrega un evento al documento para cerrar cualquier menú desplegable al hacer clic fuera
document.addEventListener("click", function() {
  for (let j = 0; j < commDrops.length; j++) {
    if (commDrops[j].style.display === "flex") {
      commDrops[j].style.display = "none"; // Oculta cualquier desplegable abierto.
    }
  }
});

// Función para alternar el estado de visibilidad de un desplegable específico
function toggleCommDrop(index) {
  // Verifica si el desplegable correspondiente ya está visible
  if (commDrops[index].style.display === "flex") {
    commDrops[index].style.display = "none"; // Oculta el desplegable.
  } else {
    // Oculta los demás desplegables antes de mostrar el seleccionado
    for (let k = 0; k < commDrops.length; k++) {
      commDrops[k].style.display = "none"; // Oculta todos.
    }
    commDrops[index].style.display = "flex"; // Muestra el desplegable correspondiente.
  }
}




// Cargar el contenido del footer.html
fetch('/footer.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudo cargar el footer: ' + response.status);
    }
    return response.text(); // Leer el contenido del archivo como texto
  })
  .then(data => {
    document.getElementById('footer').innerHTML = data; // Insertar el contenido en el div
  })
  .catch(error => {
    console.error('Hubo un problema:', error);
  });