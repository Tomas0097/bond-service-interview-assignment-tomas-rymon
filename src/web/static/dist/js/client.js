class Client {
    basePageUrl = 'http://127.0.0.1:8088/'
    BaseApiUrl = this.basePageUrl + 'api/'

    pageUrls = {
        homepage: this.basePageUrl,
        userPage: this.basePageUrl + 'user-page/'
    }
    apiUrls = {
        userLogin: this.BaseApiUrl + 'user-login/',
        userDetails: this.BaseApiUrl + 'user-details/',
        userBonds: this.BaseApiUrl + 'user-bonds/',
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
            window.location.href = client.pageUrls.userPage;
        });
    }

    showUserProfileData() {
        this.sendRequest(this.apiUrls.userDetails, 'GET', {}, (responseData) => {
            const userName = document.getElementById('user-name');
            userName.textContent = responseData.username;
        })
    }

    showUserPortfolioData() {
        this.sendRequest(this.apiUrls.userBonds, 'GET', {}, (responseData) => {
            const table = document.getElementById('user-portfolio').querySelector('table');

            responseData.forEach(bond => {
                const row = table.insertRow(-1);

                row.insertCell(0).textContent = bond.issue_name;
                row.insertCell(1).textContent = bond.isin;
                row.insertCell(2).textContent = bond.value;
                row.insertCell(3).textContent = bond.coupon_type;
                row.insertCell(4).textContent = bond.interest_rate;
                row.insertCell(5).textContent = bond.coupon_frequency_in_months;
                row.insertCell(6).textContent = bond.purchase_date;
                row.insertCell(7).textContent = bond.maturity_date;
            })
        })
    }
};

const client = new Client();
