class Client {
    basePageUrl = 'http://127.0.0.1:8088/'
    BaseApiUrl = this.basePageUrl + 'api/'

    pageUrls = {
        homepage: this.basePageUrl,
        userProfile: this.basePageUrl + 'user-profile/'
    }

    apiUrls = {
        login: this.BaseApiUrl + 'user-login/'
    }

    sendRequest(url, method, data, resultHandler) {
        fetch(url, {
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
                localStorage.setItem('authToken', data.token);
                window.location.href = client.pageUrls.userProfile;
            } else {
                alert(data.error);
            }
        }

        this.sendRequest(this.apiUrls.login, 'POST', formData, loginResultHandler);
    }
};

const client = new Client();
