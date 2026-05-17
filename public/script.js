async function login() {

    const username =
        document.getElementById('username').value;

    const password =
        document.getElementById('password').value;

    const response = await fetch('/auth/login', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            username,
            password
        })
    });

    const data = await response.json();

    if (response.ok) {

        localStorage.setItem(
            'token',
            data.token
        );

        const payload =
            JSON.parse(
                atob(
                    data.token.split('.')[1]
                )
            );

        localStorage.setItem(
            'role',
            payload.role
        );

        window.location.href =
            'dashboard.html';

    } else {

        document.getElementById(
            'message'
        ).innerText = data.message;
    }
}