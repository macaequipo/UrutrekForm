// JAVASCRIPT PARA EL NAVEGADOR - Versión simplificada y funcional
document.getElementById("ficha-form").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = document.getElementById("submit-btn");
  const status = document.getElementById("status");
  
  // Estado de carga
  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";
  status.textContent = "Enviando datos...";
  status.className = "mt-4 text-blue-600 text-sm";

  // Crear FormData directamente
  const formData = new FormData(form);
  
  // Mostrar datos que se van a enviar (para debug)
  console.log('Datos a enviar:');
  for (let [key, value] of formData.entries()) {
    console.log(key + ':', value);
  }

  // Enviar datos
  fetch("https://script.google.com/macros/s/AKfycbzH8yjYWxBGFtkDqWZNTgpuV4n9iX9lk6Ald-1EgXAvVktfITIMxHI_nMDERoyHPSVW/exec", {
    method: "POST",
    body: formData
    // NO agregar headers - dejar que el navegador los maneje
  })
  .then(response => {
    console.log('Status:', response.status);
    console.log('OK:', response.ok);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.text(); // Usar text() primero para ver qué recibimos
  })
  .then(text => {
    console.log('Respuesta raw:', text);
    
    // Intentar parsear como JSON
    let result;
    try {
      result = JSON.parse(text);
      console.log('JSON parseado:', result);
    } catch (e) {
      console.error('Error parseando JSON:', e);
      throw new Error('Respuesta no válida del servidor');
    }
    
    // Verificar si fue exitoso
    if (result.status === "success" || result.status === "ok") {
      // Éxito
      status.textContent = "✓ " + (result.message || "Formulario enviado correctamente");
      status.className = "mt-4 text-green-600 text-sm";
      form.reset();
    } else {
      // Error del servidor
      throw new Error(result.message || "Error desconocido del servidor");
    }
  })
  .catch(error => {
    console.error('Error completo:', error);
    status.textContent = "✗ Error: " + error.message;
    status.className = "mt-4 text-red-600 text-sm";
  })
  .finally(() => {
    // Restaurar botón
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar";
  });
});