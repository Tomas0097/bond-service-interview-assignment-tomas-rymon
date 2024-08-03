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

        if (method === 'POST' | method === 'PUT') {
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
            const table = document.getElementById('bond-list');
            this.userBondsData = responseData;

            responseData.forEach(bond => {
                let row = table.insertRow(-1);
                let cellTitle = row.insertCell(0)
                let title = document.createElement('span');

                title.textContent = bond.issue_name;
                title.classList.add('clickable');
                title.setAttribute('onclick', `client.showUpdateBondForm(${bond.id});`);
                cellTitle.appendChild(title);

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

    showAddBondForm() {
        const form = document.getElementById('bond-form');
        const formTitle = document.getElementById('bond-form-title');
        const submitCreateButton = document.getElementById('bond-form-create-button');
        const submitUpdateButton = document.getElementById('bond-form-update-button');
        const inputs = form.querySelectorAll('td input, td select');

        formTitle.textContent = 'Add new bond';
        submitCreateButton.classList.remove('hidden');
        submitUpdateButton.classList.add('hidden');
        inputs.forEach(input => {input.value = ''});
        form.classList.remove('hidden');
    }

    showUpdateBondForm(bondId) {
        const form = document.getElementById('bond-form');
        const formTitle = document.getElementById('bond-form-title');
        const submitCreateButton = document.getElementById('bond-form-create-button');
        const submitUpdateButton = document.getElementById('bond-form-update-button');
        const bondData = this.userBondsData.find(item => item.id === bondId);

        formTitle.textContent = `Update: ${bondData.issue_name}`;
        submitCreateButton.classList.add('hidden');
        submitUpdateButton.classList.remove('hidden');
        form.dataset.bondID = bondId;
        form.querySelector('#input-issue-name').value = bondData.issue_name;
        form.querySelector('#input-isin').value = bondData.isin;
        form.querySelector('#input-value').value = bondData.value;
        form.querySelector('#input-coupon-type').value = bondData.coupon_type;
        form.querySelector('#input-interest-rate').value = bondData.interest_rate;
        form.querySelector('#input-coupon-frequency-in-months').value = bondData.coupon_frequency_in_months;
        form.querySelector('#input-purchase-date').value = bondData.purchase_date;
        form.querySelector('#input-maturity-date').value = bondData.maturity_date;
        form.classList.remove('hidden');
    }

    createBond(event) {
        event.preventDefault();

        const endpoint = this.baseApiUrl + 'users/' + localStorage.getItem('userId') + '/bonds/';
        const bondForm = document.getElementById('bond-form');

        const inputIssueName = bondForm.querySelector('#input-issue-name').value;
        const inputISIN = bondForm.querySelector('#input-isin').value;
        const inputValue = bondForm.querySelector('#input-value').value;
        const inputCouponType = bondForm.querySelector('#input-coupon-type').value;
        const inputInterestRate = bondForm.querySelector('#input-interest-rate').value;
        const inputCouponFrequencyInMonths = bondForm.querySelector('#input-coupon-frequency-in-months').value;
        const inputPurchaseDate = bondForm.querySelector('#input-purchase-date').value;
        const inputMaturityDate = bondForm.querySelector('#input-maturity-date').value;

        const formData = {
            issue_name: inputIssueName,
            isin: inputISIN,
            value: inputValue,
            coupon_type: inputCouponType,
            interest_rate: inputInterestRate,
            coupon_frequency_in_months: inputCouponFrequencyInMonths,
            purchase_date: inputPurchaseDate,
            maturity_date: inputMaturityDate
        };

        this.sendRequest(endpoint, 'POST', formData, (responseData) => {
            window.location.href = client.basePageUrl + 'user-page/';
        });
    }

    updateBond(event) {
        event.preventDefault();

        const userId = localStorage.getItem('userId')
        const bondId = event.target.form.dataset.bondID
        const endpoint = this.baseApiUrl + 'users/' + userId + '/bonds/' + bondId + '/';
        const bondForm = document.getElementById('bond-form');

        const inputIssueName = bondForm.querySelector('#input-issue-name').value;
        const inputISIN = bondForm.querySelector('#input-isin').value;
        const inputValue = bondForm.querySelector('#input-value').value;
        const inputCouponType = bondForm.querySelector('#input-coupon-type').value;
        const inputInterestRate = bondForm.querySelector('#input-interest-rate').value;
        const inputCouponFrequencyInMonths = bondForm.querySelector('#input-coupon-frequency-in-months').value;
        const inputPurchaseDate = bondForm.querySelector('#input-purchase-date').value;
        const inputMaturityDate = bondForm.querySelector('#input-maturity-date').value;

        const formData = {
            issue_name: inputIssueName,
            isin: inputISIN,
            value: inputValue,
            coupon_type: inputCouponType,
            interest_rate: inputInterestRate,
            coupon_frequency_in_months: inputCouponFrequencyInMonths,
            purchase_date: inputPurchaseDate,
            maturity_date: inputMaturityDate
        };

        console.log(endpoint)

        this.sendRequest(endpoint, 'PUT', formData, (responseData) => {
            window.location.href = client.basePageUrl + 'user-page/';
        });
    }

};

const client = new Client();
