document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('generateBtn').addEventListener('click', function() {
        var passwordLength = parseInt(document.getElementById('passwordLengthInput').value);
        var lowercase = document.getElementById('lowercase').checked;
        var uppercase = document.getElementById('uppercase').checked;
        var numbers = document.getElementById('numbers').checked;
        var specialChars = document.getElementById('specialChars').checked;
        var charset = "";

        if(!lowercase && !uppercase && !numbers && !specialChars) {
            alert('Veuillez choisir au moins une option');
            window.location.reload();
        }

        else {
            if(lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
            if(uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            if(numbers) charset += "0123456789";
            if(specialChars) charset += "!@#%&*;:,.<>?";
            
            var password = generatePassword(passwordLength, charset);
            document.getElementById('passwordDisplay').innerText = password;

            var strength = getPasswordStrength(password);
            updateSecurityStrength(strength);
        }  
    });
});

function generatePassword(length, charset) {
    var password = "";
    for(var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

function getPasswordStrength(password) {
    // Initialisation des scores
    var lengthScore = 0;
    var uppercaseScore = 0;
    var digitScore = 0;
    var specialCharScore = 0;

    // Calcul du score pour la longueur
    var passwordLength = password.length;
    if (passwordLength >= 8 && passwordLength <= 10) {
        lengthScore = 1;
    } else if (passwordLength >= 11 && passwordLength <= 13) {
        lengthScore = 2;
    } else if (passwordLength >= 14) {
        lengthScore = 3;
    }

    // Calcul du score pour les minuscules, majuscules, chiffres et caractères spéciaux
    for (var i = 0; i < passwordLength; i++) {
        var char = password.charAt(i);
        if (/[a-z]/.test(char) && /[A-Z]/.test(char)) {
            uppercaseScore = 1;
        } else if (/\d/.test(char)) {
            digitScore = 1;
        } else if (/[^a-zA-Z0-9]/.test(char)) {
            specialCharScore = 2;
        }
    }

    // Calcul du score total
    var totalScore = lengthScore + uppercaseScore + digitScore + specialCharScore;

    console.log(totalScore)

    // Attribution du niveau de force en fonction du score total
    if (totalScore <= 2) {
        return "very-weak";
    } else if (totalScore === 3) {
        return "weak";
    } else if (totalScore === 4) {
        return "medium";
    } else {
        return "strong";
    }
}


function updateSecurityStrength(strength) {
    var bar = document.querySelectorAll('#securityLevel #bar .level');
    // Réinitialisation de toutes les largeurs des segments de la barre
    bar.forEach(function(segment) {
        segment.style.width = "0%";
    });

    // Affichage et animation progressive des segments correspondant au niveau de force atteint
    var levels = ["very-weak", "weak", "medium", "strong"];
    var index = levels.indexOf(strength);
    var totalWidth = 0; // Total de la largeur des segments à afficher
    for (var i = 0; i <= index; i++) {
        totalWidth += 25; // Largeur de chaque segment (25% pour chaque niveau)
    }

    // Ajustement de la largeur des segments pour remplir la barre
    for (var j = 0; j <= index; j++) {
        bar[j].style.display = "block";
        bar[j].style.width = (100 * (25 / totalWidth)) + "%"; // Calcul de la largeur proportionnelle
    }
}

function copyToClipboard() {
    //get the generated password container
    const passwordDisplay = document.querySelector('#passwordDisplay');
    //create a fakeinput ans set the contents to the text to copy
    const storage = document.createElement('textarea');
    storage.value = passwordDisplay.innerHTML;
    passwordDisplay.appendChild(storage);

    //copy the text in the fake input and remove it
    storage.select();
    storage.setSelectionRange(0,99999);
    document.execCommand("copy");
    passwordDisplay.removeChild(storage);
}