const filterButton = document.getElementById("filter-btn");
const filterDrop = document.getElementById("filter-cont");

const commTitle = document.getElementsByClassName("comm-card");
const commDrop = document.getElementsByClassName("reference-drop");

filterButton.addEventListener("click", function(event) {
    event.stopPropagation(); // Previene la propagación del clic para evitar cerrarlo inmediatamente
    toggleFilterDrop(); // Llama a la función para mostrar/ocultar
});

document.addEventListener("click", function() {
    // Oculta el dropdown si se hace clic fuera del botón o del dropdown
    if (filterDrop.style.display === "flex") {
        filterDrop.style.display = "none";
    }
});

function toggleFilterDrop() {
    if (filterDrop.style.display === "flex") {
        filterDrop.style.display = "none"; // Oculta si está visible
    } else {
        filterDrop.style.display = "flex"; // Muestra si está oculto
    }
}

commTitle.addEventListener("click", function(event){
  event.stopPropagation();
  toggleCommDrop();
});

document.addEventListener("click", function(){
  if (commDrop.style.display === "flex"){
    commDrop.style.display = "none";
  }
});

function toggleCommDrop(){
  if (commDrop.style.display === "flex"){
    commDrop.style.display = "none";
  } else {
    commDrop.style.display = "flex"
  }
}