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

    sendRequest(url, method, data, successResultHandler) {
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            response.json().then(
                data => {(response.status === 200) ? successResultHandler(data) : alert(data.error)}
            )
        })
    }

    submitLoginForm(event) {
        event.preventDefault();

        const loginForm = document.getElementById('login-form');
        const inputUsername = loginForm.querySelector('input[name="username"]').value;
        const inputPassword = loginForm.querySelector('input[name="password"]').value;
        const formData = {username: inputUsername, password: inputPassword};

        this.sendRequest(this.apiUrls.login, 'POST', formData, (responseData) => {
            localStorage.setItem('authToken', responseData.token);
            window.location.href = client.pageUrls.userProfile;
        });
    }
};

const client = new Client();
