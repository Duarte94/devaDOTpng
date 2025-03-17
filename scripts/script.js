const commTitle = document.getElementsByClassName("comm-card");
const commDrop = document.getElementsByClassName("reference-drop");

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