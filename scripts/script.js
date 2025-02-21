const filterButton = document.getElementById("filter-btn");
const filterDrop = document.getElementById("filter-cont");

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