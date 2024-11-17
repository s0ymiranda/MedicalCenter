document.getElementById("add-office-form").addEventListener("submit", function(event) {
    event.preventDefault(); 
    
    const name = document.getElementById("name").value;
    const floor = document.getElementById("floor").value;
    const wing = document.getElementById("wing").value;
    const state = document.getElementById("state").value;
    const active = document.getElementById("active").value === "true"; 
    const observations = document.getElementById("observations").value;
    
    const officeData = {
        name: name,
        floor: parseInt(floor),
        wing: wing,
        state: state,
        is_active: active,
        observations: observations
    };
    
    fetch("https://is-team-b.onrender.com/offices", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(officeData)
    })
    
    .then(response => {
        if (!response.ok) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        alert(data.message ? data.message : "Consultorio agregado con éxito.");
    })
    .catch(error => {
        console.error('Error al agregar consultorio:', error);
        alert('Hubo un error al agregar el consultorio.');
    });

    this.reset();
});