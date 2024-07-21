class BondServiceInterviewAssignmentClient {
    baseUrl = 'http://127.0.0.1:8088/api/'

    sendRequest(endPoint, method, data, resultHandler) {
        fetch(this.baseUrl + endPoint, {
            method: method,
            headers: {'Content-Type': 'application/json', 'X-CSRFToken': csrfToken},
            body: JSON.stringify(data),
        })
        .then(response => {
            response.json().then(data => {resultHandler(response.status, data)})
        })
    }

    submitLoginForm(event) {
        event.preventDefault();

        const loginForm = document.getElementById('login-form');
        const inputUsername = loginForm.querySelector('input[name="username"]').value;
        const inputPassword = loginForm.querySelector('input[name="password"]').value;
        const formData = {username: inputUsername, password: inputPassword};

        function loginResultHandler(responseStatus, data) {
            if (responseStatus === 200) {
                window.location.href = 'test';
            } else {
                alert(data.error);
            }
        }

        this.sendRequest('user-login/', 'POST', formData, loginResultHandler);
    }
};

const bondServiceInterviewAssignmentClient = new BondServiceInterviewAssignmentClient();
