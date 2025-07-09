var usernameField = document.getElementById('username');
var usernameError = document.getElementById('username-error');
var passwordField = document.getElementById('password');
var passwordError = document.getElementById('password-error');
var cpasswordField = document.getElementById('cpassword');
var cpasswordError = document.getElementById('cpassword-error');
var regForm = document.getElementById('reg-form');
var submitBtn = document.getElementById('submit');

submitBtn.setAttribute("disabled", true);

function isValidUsername(username) {
    username = username.trim();
    if (!/^[a-zA-Z]/.test(username)) {
        return { valid: false, message: "Username must begin with a letter." };
    }

    if (username.length < 3) {
        return { valid: false, message: "Username must be 3 or more alphanumeric characters. " };
    }

    return { valid: true, message: " " };
}

function isValidPassword(password) {

    if (password.length < 8) {
        return { valid: false, message: "Password must contain 8 or more characters." };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one upper-case letter." };
    }
    if (!/\d/.test(password)) {
        return { valid: false, message: "Password must contain at least one number." };
    }
    if (!/[/*-+!@#$^&~[\]]/.test(password)) {
        return { valid: false, message: "Password must contain at least one special character." };
    }
    return { valid: true, message: " " };

}

function validateForm() {
    var usernameResult = isValidUsername(usernameField.value.trim());
    var passwordResult = isValidPassword(passwordField.value);
    var passwordsMatch = passwordField.value === cpasswordField.value;

    if (!usernameResult.valid) {
        usernameField.classList.remove("valid");
        usernameField.classList.add("invalid");
        usernameError.textContent = usernameResult.message;
    } else {
        usernameField.classList.remove("invalid");
        usernameField.classList.add("valid");
        usernameError.textContent = "";
    }

    if (!passwordResult.valid) {
        passwordField.classList.remove("valid");
        passwordField.classList.add("invalid");
        passwordError.textContent = passwordResult.message;
    } else {
        passwordField.classList.remove("invalid");
        passwordField.classList.add("valid");
        passwordError.textContent = "";
    }

    if (!passwordsMatch) {
        cpasswordField.classList.remove("valid");
        cpasswordField.classList.add("invalid");
        cpasswordError.textContent = "Passwords do not match.";
    } else {
        cpasswordField.classList.remove("invalid");
        cpasswordField.classList.add("valid");
        cpasswordError.textContent = "";
    }

    if (usernameResult.valid && passwordResult.valid && passwordsMatch) {
        submitBtn.removeAttribute("disabled");
    } else {
        submitBtn.setAttribute("disabled", true);
    }
}

if (usernameField) {
    usernameField.addEventListener('input', validateForm);
}
if (passwordField) {
    passwordField.addEventListener('input', validateForm);
}
if (cpasswordField) {
    cpasswordField.addEventListener('input', validateForm);
}

document.addEventListener('DOMContentLoaded', () => {
    const showPasswordCheckbox = document.getElementById('show-password');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('cpassword');

    showPasswordCheckbox.addEventListener('change', () => {
        const type = showPasswordCheckbox.checked ? 'text' : 'password';
        passwordField.type = type;
        confirmPasswordField.type = type;
    });
});

regForm.addEventListener('submit', function (e) {
    e.preventDefault();
    validateForm();

    var usernameResult = isValidUsername(usernameField.value.trim());
    var passwordResult = isValidPassword(passwordField.value);
    var passwordsMatch = passwordField.value === cpasswordField.value;

    if (usernameResult.valid && passwordResult.valid && passwordsMatch) {
        console.log("FORM SUBMITTED!");
        alert("Account created successfully!");

        regForm.reset();

        usernameField.classList.remove("valid");
        passwordField.classList.remove("valid");
        cpasswordField.classList.remove("valid");
        submitBtn.setAttribute("disabled", true);
    } else {
        console.log("Validation failed! Form was not submited...");
    }
});