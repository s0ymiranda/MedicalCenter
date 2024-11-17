const urlConsultorio = "https://is-team-b.onrender.com/offices/";
const urlParams = new URLSearchParams(window.location.search);
const officeID = urlParams.get('id');

document.addEventListener("DOMContentLoaded", function() {

    const nameInput = document.getElementById('name');
    const floorInput = document.getElementById('floor');
    const wingInput = document.getElementById('wing');
    const stateInput = document.getElementById('state');
    const activeInput = document.getElementById('active');
    const observationsInput = document.getElementById('observations');
    
    const editButton = document.getElementById('edit');
    const saveButton = document.getElementById('save');

    fetch(urlConsultorio + officeID)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            nameInput.value = data.name;
            floorInput.value = data.floor;
            wingInput.value = data.wing;
            stateInput.value = data.state;
            activeInput.value = data.is_active ? "true": "false";
            observationsInput.value = data.observations;
            
            document.getElementById('back').disabled = false;
        })
        .catch(error => {
            console.error('Error', error);
        });

    editButton.addEventListener('click', function () {
        nameInput.disabled = false;
        stateInput.disabled = false;
        activeInput.disabled = false;
        observationsInput.disabled = false;
    
        saveButton.style.display = "inline-block";
        editButton.style.display = "none";
    });

    saveButton.addEventListener('click', function() {
        const updatedOffice = {
            name: nameInput.value,
            state: stateInput.value,
            observations: observationsInput.value,
            is_active: (activeInput.value === "true") ? "1" : "0",
        };
        
        console.log(updatedOffice);
        fetch(urlConsultorio + officeID, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedOffice)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message || "Consultorio actualizado con éxito.");
            nameInput.disabled = true;
            stateInput.disabled = true;
            activeInput.disabled = true;
            observationsInput.disabled = true;

            saveButton.style.display = "none";
            editButton.style.display = "inline-block";
        })
        .catch(error => {
            console.error('Error al actualizar la oficina', error);
            alert('Hubo un error al actualizar la oficina.');
        });
    });
});