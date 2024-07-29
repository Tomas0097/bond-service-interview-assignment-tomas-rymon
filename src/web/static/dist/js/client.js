class Client {
    basePageUrl = 'http://127.0.0.1:8088/'
    baseApiUrl = this.basePageUrl + 'api/'

    sendRequest(endpoint, method, data, successResultHandler) {
        let options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
                'Authorization': `Token ${localStorage.getItem('authToken')}`  // Handle situation where user is not logged in --> local storage has not the token.
            },
        }

        if (method === 'POST') {
            options.body = JSON.stringify(data);
        }

        fetch(endpoint, options).then(response => {
            response.json().then(
                data => {(response.status === 200) ? successResultHandler(data) : alert(data.error)}
            )
        })
    }

    submitLoginForm(event) {
        event.preventDefault();

        const endpoint = client.baseApiUrl + 'users/login/';
        const loginForm = document.getElementById('login-form');
        const inputUsername = loginForm.querySelector('input[name="username"]').value;
        const inputPassword = loginForm.querySelector('input[name="password"]').value;
        const formData = {username: inputUsername, password: inputPassword};

        this.sendRequest(endpoint, 'POST', formData, (responseData) => {
            localStorage.setItem('authToken', responseData.token);
            localStorage.setItem('userId', responseData.user_id);
            window.location.href = client.basePageUrl + 'user-page/';
        });
    }

    showUserDetails() {
        const endpoint = this.baseApiUrl + 'users/' + localStorage.getItem('userId') + '/';

        this.sendRequest(endpoint, 'GET', {}, (responseData) => {
            const userName = document.getElementById('user-name');
            userName.textContent = responseData.username;
        })
    }

    showUserBonds() {
        const endpoint = this.baseApiUrl + 'users/' + localStorage.getItem('userId') + '/bonds/';

        this.sendRequest(endpoint, 'GET', {}, (responseData) => {
            const table = document.getElementById('user-bond-portfolio');

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
