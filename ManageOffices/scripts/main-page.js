const url = "https://is-team-b.onrender.com/offices";

document.addEventListener("DOMContentLoaded", function() {
    var resultDiv = document.getElementById('result');
    var consultButton = document.getElementById('consult');

    var floorSelect = document.getElementById('floor');
    var wingSelect = document.getElementById('wing');
    

    function searchOffices() {
        var floor = floorSelect.value === 'all' ? '' : floorSelect.value.slice(1); 
        var wing = wingSelect.value === 'all' ? '' : wingSelect.value.slice(1);

        let searchUrl = `${url}?`;
        if (floor) searchUrl += `floor=${floor}&`;
        if (wing) searchUrl += `wing=${wing}`;

        fetch(searchUrl)
            .then(response => {
                consultButton.disabled = true; 
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                resultDiv.innerHTML = '';

                if (Array.isArray(data)) {
                    data.forEach(office => {
                        var officeDiv = document.createElement('div');
                        officeDiv.classList.add('office');
                        officeDiv.setAttribute('data-id', office.id_office);

                        var officeInfo = document.createElement('p');
                        officeInfo.textContent = 'Nombre: ' + office.name + ', ALA/PISO: ' + office.wing + '/' + office.floor;

                        var deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Eliminar';

                        deleteButton.addEventListener('click', function() {
                            var officeID = officeDiv.getAttribute('data-id'); 
                            fetch(`${url}/${officeID}`, {
                                method: 'DELETE'
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Error');
                                }
                                return response.json();
                            })
                            .then(data => {
                                console.log(data.message);
                                resultDiv.removeChild(officeDiv);
                                alert("Oficina eliminada con éxito.");
                            })
                            .catch(error => {
                                console.error('Error', error);
                                alert('No se puede eliminar, Este consultorio tiene un medico asociado.');
                            });
                            consultButton.disabled = true; 
                        });
                     
                        officeDiv.appendChild(officeInfo);
                        officeDiv.appendChild(deleteButton);
                        
                        resultDiv.appendChild(officeDiv);

                        officeDiv.classList.add('office');
                        officeInfo.classList.add('officeInfo');
                        deleteButton.classList.add('deleteButton');
                    });
                } else {
                    console.error('Data retrieved is not in the expected format (an array)');
                }
            })
            .catch(error => {
                console.error('Error', error);
                resultDiv.innerHTML = '<p>No se encontró ningún resultado.</p>'; // Mensaje si no hay resultados
            });
    }

    floorSelect.addEventListener('change', searchOffices);
    wingSelect.addEventListener('change', searchOffices);

    searchOffices();

    resultDiv.addEventListener('click', function(event) {

        const officeDiv = event.target.closest('.office');
        if (officeDiv) {
            const officeID = officeDiv.getAttribute('data-id');
            if (officeDiv.classList.contains('selected-office')) {
                officeDiv.classList.remove('selected-office');
                consultButton.disabled = true;
            } else {
                const previouslySelected = resultDiv.querySelector('.office.selected-office');
            
                if (previouslySelected) {
                    previouslySelected.classList.remove('selected-office');
                }
                officeDiv.classList.add('selected-office');
                consultButton.disabled = false;

                consultButton.onclick = function() {
                    window.location.href = `office.html?id=${officeID}`;
                };
            }
        }
    });
});
