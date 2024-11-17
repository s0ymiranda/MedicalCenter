//Date

const daynames = [
	"Lunes",
	"Martes",
	"Miércoles",
	"Jueves",
	"Viernes",
	"Sabado",
	"Domingo"
];

const months = [
	"Enero",
	"Febrero",
	"Marzo",
	"Abril",
	"Mayo",
	"Junio",
	"Julio",
	"Agosto",
	"Septiembre",
	"Octubre",
	"Noviembre",
	"Deciembre"
];

function togglemenu() {
  document
    .getElementsByClassName('navigation')[0]
    .classList.toggle('responsive');
}

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

const dayName = daynames[currentDate.getDay()]
const monthName = months[currentDate.getMonth()]

document.querySelector('.last-updated').textContent = `Ultima Actualización: ${document.lastModified}`

document.querySelector('.date-header').textContent = `${dayName}, ${currentDate.getDate()} ${monthName} ${currentYear}`