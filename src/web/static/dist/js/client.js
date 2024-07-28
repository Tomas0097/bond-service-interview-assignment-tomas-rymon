class Client {
    basePageUrl = 'http://127.0.0.1:8088/'
    BaseApiUrl = this.basePageUrl + 'api/'

    pageUrls = {
        homepage: this.basePageUrl,
        userPage: this.basePageUrl + 'user-page/'
    }
    apiUrls = {
        userLogin: this.BaseApiUrl + 'user-login/',
        userProfileData: this.BaseApiUrl + 'user-profile-data/'
    }

    sendRequest(url, method, data, successResultHandler) {
        let requestOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
                'Authorization': `Token ${localStorage.getItem('authToken')}`  // Handle situation where user is not logged in --> local storage has not the token.
            },
        }

        if (method === 'POST') {
            requestOptions.body = JSON.stringify(data);
        }

        fetch(url, requestOptions).then(response => {
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

        this.sendRequest(this.apiUrls.userLogin, 'POST', formData, (responseData) => {
            localStorage.setItem('authToken', responseData.token);
            window.location.href = client.pageUrls.userProfile;
        });
    }

    showUserProfileData() {
        this.sendRequest(this.apiUrls.userProfileData, 'GET', {}, (responseData) => {
            const userName = document.getElementById('user-name');
            userName.textContent = responseData.username;
        })
    }
};

const client = new Client();
