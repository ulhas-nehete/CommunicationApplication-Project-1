document.addEventListener('DOMContentLoaded', () => {
    

    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || [];  
    if (!loggedInUser) {
        window.location.href = 'Welcome.html'; 
    } else {        
        document.getElementById("fullname").textContent = loggedInUser.fullname;
        document.getElementById("email").textContent = loggedInUser.email;
    }

    // User Edit
    const editUserForm = document.getElementById("editUser");
    if (editUserForm) {
        const userId = new URLSearchParams(window.location.search).get("id");
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find((user) => user.id == userId);
            
        if (user) {
            document.getElementById("userId").value = user.id;
            document.getElementById("fullname").value = user.fullname;
            document.getElementById("email").value = user.email;
            
            if (loggedInUser.id == user.id) {
                document.getElementById("email").setAttribute("disabled", "disabled");
            }
            
            editUserForm.addEventListener("submit", (e) => {
                e.preventDefault();
                user.fullname = document.getElementById("fullname").value;
                user.email = document.getElementById("email").value;

                // Validate Fullname
                if (user.fullname === '') {
                    document.getElementById('usernameError').textContent = 'Please enter fullname';
                    return false;
                }

                // Validate Email
                if (user.email === '') {
                    document.getElementById('emailError').textContent = 'Please enter email';
                    return false;
                } else if (!validateEmail(user.email)) {
                    document.getElementById('emailError').textContent = 'Please enter a valid email';
                    return false;
                }


                localStorage.setItem("users", JSON.stringify(users));
                window.location.href = "userlist.html";
            });
        }
    }
});


// User Login
function userLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Clear previous error 
    document.getElementById('emailError').textContent = '';
    document.getElementById('validEmailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    

    if (email === '') {
        document.getElementById('emailError').textContent = 'Please enter email';
        return false;
    }  else if (!validateEmail(email)) {
        document.getElementById('validEmailError').textContent = 'Please enter a valid email';
        return false;
    }

    if (password === '') {
        document.getElementById('passwordError').textContent = 'Please enter password';
        return false;
    }

    const users = localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [];
    

    const findUser = users.find(function (u) {
        return u.email == email && u.password == password;
    });

    if (!findUser) {
        document.getElementById('emailPasswordError').textContent = 'Email or Password is incorrect';
        return false;
    } else {
        localStorage.setItem('loggedInUser', JSON.stringify(findUser));
    }
    return true;
}


// User Logout
function userLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('loggedInUser');
        localStorage.setItem('logoutMessage', 'You have been logged out');
        window.location.href = 'Welcome.html';
    }
}


// User Logout message
window.onload = function() {
    const logoutMessage = localStorage.getItem('logoutMessage');
    if (logoutMessage) {
        const showLogoutMessage = document.getElementById('logoutMessage');
        showLogoutMessage.textContent = logoutMessage;
        showLogoutMessage.style.display = 'block';
        localStorage.removeItem('logoutMessage');
    }
}


// User Registration
function userRegister() {
    const fullname = document.getElementById("fullname").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    document.getElementById('usernameError').textContent = '';
    document.getElementById('emailError').textContent = ''; 
    document.getElementById('passwordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';

    // Name Validation
    if (fullname === '') {
        document.getElementById('usernameError').textContent = 'Please enter full name';
        return false;
    }

    // Email Validation
    if (email === '') {
        document.getElementById('emailError').textContent = 'Please enter email';
        return false;
    } else if (!validateEmail(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email';
        return false;
    }

    // Password Validation
    if (password === '') {
        document.getElementById('passwordError').textContent = 'Please enter password';
        return false;
    } else if (password.length < 8) {
        document.getElementById('passwordError').textContent = 'Password must be at least 8 characters long';
        return false;
    }

    // Confirm Password Validation
    if (confirmPassword === '') {
        document.getElementById('confirmPasswordError').textContent = 'Please confirm your password';
        return false;
    } else if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
        return false;
    }           

    const users = localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [];

    // Check Duplicate Email
    let isUserDuplicate = users.some(function (u) {
        return u.email === email;
    });
    if (isUserDuplicate) {
        document.getElementById('emailError').textContent = 'Email already registered';
        return false;
    }

    const user = {
        id: Number(new Date()),
        fullname: fullname,
        email: email,
        password: password
    };

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    return true;
}




// Group Chat
function groupChat() {  
    const userChatMessage = document.getElementById("userChatMessage").value;
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const dateTime = formatDateTime(new Date());

    // Chat Message Validation
    if (userChatMessage === '') {
        document.getElementById('chatMessageError').textContent = 'Please enter message';
        return false;
    }

    const allGroupChat = localStorage.getItem("allGroupChat") ? JSON.parse(localStorage.getItem("allGroupChat")) : [];

    const chatMessage = {
        dateTime: dateTime,
        fullname: loggedInUser.fullname,
        userChatMessage: userChatMessage
    };
    allGroupChat.push(chatMessage);
    localStorage.setItem("allGroupChat", JSON.stringify(allGroupChat));
    return true;
}

// format date time
function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}



// validate Email
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}


