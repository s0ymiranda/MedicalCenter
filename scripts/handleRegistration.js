function handleRegistration(event) {
    event.preventDefault();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;
    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden. Por favor, intenta de nuevo.");
        return;
    }
    location.href = '/home.html';
}