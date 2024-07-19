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
}

const bondServiceInterviewAssignmentClient = new BondServiceInterviewAssignmentClient();

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = loginForm.querySelector('#username').value;
    const password = loginForm.querySelector('#password').value;
    const formData = {username: username, password: password};

    function loginResultHandler(responseStatus, data) {
        if (responseStatus === 200) {
            window.location.href = 'test';
        } else {
            alert(data.error);
        }
    }

    bondServiceInterviewAssignmentClient.sendRequest('user-login/', 'POST', formData, loginResultHandler);
});
