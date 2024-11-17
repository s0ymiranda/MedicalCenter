const mod_button = document.getElementById("modificar");
const save_button = document.getElementById("guardar");

const red = "#FFB7B2";
const green = "#B7D1B9";

const urlAPI = "https://is-team-b.onrender.com/doctors/"

const days_translation_eng_spa = {
	"monday" : "Lunes",
	"tuesday" :"Martes",
	"wednesday" :"Miércoles",
	"thursday" :"Jueves",
	"friday" : "Viernes",
	"saturday" :"Sabado",
	"sunday" :"Domingo"
}

const days_translation_spa_eng = {
	"lunes" : "monday",
	"martes" :"tuesday",
	"miércoles" :"wednesday",
	"jueves" :"thursday",
	"viernes" : "friday",
	"sabado" :"saturday",
	"domingo" :"sunday"
}

const baseData = {
    "time" : {
        "monday" : {
            "is_work" : false,
            "time" : {}
        },
        "tuesday" : {
            "is_work" : false,
            "time" : {}
        },
        "wednesday" : {
            "is_work" : false,
            "time" : {}
        },
        "thursday" : {
            "is_work" : false,
            "time" : {}
        },
        "friday" : {
            "is_work" : false,
            "time" : {}
        }
    }
};

let animation = null;

document.addEventListener("DOMContentLoaded", async function() {
    let all_good = true;
    const modal = document.getElementById("loadingModal");
    const loadingText = document.getElementById("loadingText");
    const loader = document.getElementById("loader");

    let dots = 0;
    loadingText.textContent = "Cargando Horario";
    interval = setInterval(() => {
        dots = (dots + 1) % 4;
        loadingText.textContent = "Cargando Horario" + ".".repeat(dots);
    }, 500);

    modal.style.display = "flex";
    modal.classList.add("show");

    animation = lottie.loadAnimation({
        container: loader, // El contenedor para la animación
        renderer: 'svg', // Tipo de renderizador, puedes usar 'canvas' o 'html' también
        loop: true, // ¿Repetir la animación?
        autoplay: true, // ¿Reproducir inmediatamente?
        path: 'scripts/loader.json' // Ruta a tu archivo JSON
    });

    try {
        const response = await fetch(urlAPI + "1/schedule");
        const dataDoctor = await response.json();

        const name = document.getElementById("nombreMedico");
        name.innerText = `Horario de ${dataDoctor.name}, ${dataDoctor.specialty}`;

        Object.entries(dataDoctor.weekly_medical_schedule).forEach(([day_name, data]) => {
            Object.entries(data).forEach(([is_work, schedule]) => {
                Object.entries(schedule).forEach(([time, available]) => {

                    baseData["time"][day_name] = data;

                    // if (day_name == "wednesday") { TESTING
                    //     baseData["time"]["wednesday"].is_work = false;
                    //     is_work = false;
                    // }

                    let h = parseInt(time.substring(0, 2));
                    const text = (h >= 12) ? "00PM" : "00AM";
                    if (h > 12) {
                        h = h - 12;
                    }
                    const finalString = ((h < 10) ? '0' + h : h) + text;
                    const selectorString = `table tr > td#${days_translation_eng_spa[day_name].toLowerCase()}${finalString.toLowerCase()} > input[type="checkbox"]`;
                    const checkbox = document.querySelector(selectorString);

                    if (available && is_work) {
                        checkbox.checked = true;
                        const parent = checkbox.parentNode;
                        parent.style.background = green;
                        const label = this.createElement("label");
                        label.textContent = "Asignado";
                        parent.appendChild(label);
                    } else {
                        checkbox.checked = false;
                        const parent = checkbox.parentNode;
                        parent.style.background = red;
                        const label = this.createElement("label");
                        label.textContent = (is_work) ? "No Asignado" : "No Disponible";
                        parent.appendChild(label);
                    }
                    checkbox.style.visibility = "hidden";
                    checkbox.addEventListener("change", function() {
                        if (this.checked) {
                            const parent = this.parentNode;
                            parent.style.background = green;
                            parent.querySelector('label').textContent = "Asignado";
                        } else {
                            const parent = this.parentNode;
                            parent.style.background = red;
                            parent.querySelector('label').textContent = (is_work) ? "No Asignado" : "No Disponible";
                        }
                    });
                });
            });
        });
    } catch (error) {

        console.error("Error fetching or parsing JSON file:", error);
        all_good = false;

    } finally {

        animation.stop();
        animation.destroy();

        animation = lottie.loadAnimation({
            container: loader,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: (all_good) ? 'scripts/success.json' : 'scripts/failed.json' // https://iconscout.com/lottie-animations/success by "https://iconscout.com/contributors/fantast-designer" Fantastdesigner AND https://iconscout.com/lottie-animations/failed-mail targetFailed Mail by "https://iconscout.com/contributors/rejuve" Rejuv on https://iconscout.com IconScout
        });

        clearInterval(interval);

        loadingText.textContent = (all_good) ? "Horario Cargado Exitosamente!" : "Fallo cargando el horario. Intente de nuevo mas tarde.";

        if (all_good) {
            setTimeout(() => {
                modal.classList.add("hide");
            }, 1800);
            setTimeout(() => {
                animation.stop();
                animation.destroy();
                modal.style.display = "none";
                modal.classList.remove("hide");
            }, 2300);
        }
    }
});

let modButtonPressed = false;

mod_button.addEventListener("click", function() {
    const checkboxs = document.querySelectorAll('table input[type="checkbox"]');
    if (modButtonPressed) {
        restoreBase();
        checkboxs.forEach((element) => {
            element.style.visibility = "hidden";
        });
        save_button.disabled = true;
        mod_button.textContent = "Modificar Horario";
    }
    else {
        checkboxs.forEach((element) => {
            const elmData = element.parentElement;
            const dayName = elmData.id.match(/[a-zA-ZáéíóúÁÉÍÓÚ]+/g)[0];
            if (baseData["time"][days_translation_spa_eng[dayName]].is_work)
            {
                element.style.visibility = "visible";
            }
        });
        save_button.disabled = false;
        mod_button.textContent = "Cancelar";
    }
    modButtonPressed = !modButtonPressed;
});

async function updateJsonData(updatedData) {

    let all_good = true;

    const modal = document.getElementById("loadingModal");
    const loadingText = document.getElementById("loadingText");
    const loader = document.getElementById("loader");

    let dots = 0;
    loadingText.textContent = "Cargando";
    interval = setInterval(() => {
        dots = (dots + 1) % 4;
        loadingText.textContent = "Cargando" + ".".repeat(dots);
    }, 500);

    modal.style.display = "flex";
    modal.classList.add("show");

    animation = lottie.loadAnimation({
        container: loader,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'scripts/loader.json'
    });

    setTimeout(() => {
        modal.classList.remove("show");
    }, 1000);

    try {
        const response = await fetch(urlAPI + "1/schedule", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        console.log(response)

        if (!response.ok) {
            throw new Error('Error en la actualización: ' + response.statusText);
        }

        const result = await response.json();
        console.log('Actualización exitosa:', result);
    } catch (error) {
        console.error('Error al actualizar:', error);
        all_good = false;
    } finally {
        animation.stop();
        animation.destroy();

        animation = lottie.loadAnimation({
            container: loader,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: (all_good) ? 'scripts/success.json' : 'scripts/failed.json' // https://iconscout.com/lottie-animations/success by "https://iconscout.com/contributors/fantast-designer" Fantastdesigner AND https://iconscout.com/lottie-animations/failed-mail targetFailed Mail by "https://iconscout.com/contributors/rejuve" Rejuv on https://iconscout.com IconScout
        });

        clearInterval(interval);

        loadingText.textContent = (all_good) ? "Datos Actaulizados con Exito!" : "Fallo en la actualizacion de datos. Intente de nuevo mas tarde.";

        if (!all_good) {
            restoreBase();
        }
        else {
            Object.entries(updatedData["time"]).forEach(([day_name, data]) => {
                baseData["time"][day_name]["time"] = data;
            });
        }

        setTimeout(() => {
            modal.classList.add("hide");
            animation.stop();
            animation.destroy();
        }, 2000);

        setTimeout(() => {
            modal.style.display = "none";
            modal.classList.remove("hide");
        }, 2500);
    }
}

save_button.addEventListener("click", function() {
    const updateData = {
        "time" : {
            "monday" : {},
            "tuesday" : {},
            "wednesday" : {},
            "thursday" : {},
            "friday" : {}
        }
    };
    const checkboxs = document.querySelectorAll('table input[type="checkbox"]');
    checkboxs.forEach((element) => {
        element.style.visibility = "hidden";
        const elmData = element.parentElement;
        const idData = elmData.id.match(/[a-zA-ZáéíóúÁÉÍÓÚ]+/g);
        const idTimeData = elmData.id.match(/[0-9]+/g);
        const time = parseInt(idTimeData[0].substring(0,2));
        updateData["time"][days_translation_spa_eng[idData[0]]][(time < 12 && idData[1] == "pm") ? time + 12 + ":00" : ((time < 10) ? "0":"") + time + ":00"] = (elmData.childNodes[3].innerText == "Asignado");
    })
    save_button.disabled = true;
    modButtonPressed = false;
    mod_button.textContent = "Modificar Horario";

    updateJsonData(updateData);
});

function restoreBase()
{
    const checkboxs = document.querySelectorAll('table input[type="checkbox"]');
    checkboxs.forEach((element) => {
        const elmData = element.parentElement;
        const idData = elmData.id.match(/[a-zA-ZáéíóúÁÉÍÓÚ]+/g);
        const idTimeData = elmData.id.match(/[0-9]+/g);
        const time = parseInt(idTimeData[0].substring(0,2));
        element.checked = baseData["time"][days_translation_spa_eng[idData[0]]]["time"][(time < 12 && idData[1] == "pm") ? time + 12 + ":00" : ((time < 10) ? "0":"") + time + ":00"];
        element.dispatchEvent(new Event("change"));
    });
}