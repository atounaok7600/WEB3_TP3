export const setAuth = async (token) => {
    localStorage.setItem('token', token);

    const user = await fetchUser(token);
    localStorage.setItem('user', JSON.stringify(user));
};

export const getAuth = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    return { user, token };
};

export const clearAuth = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

const fetchUser = async (userToken) => {
    try {
        const response = await fetch('http://localhost:3000/user/', {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${userToken}`,
            },
        });

        if(!response.ok){
            throw new Error('Erreur lors de la récupération des données');
        }

        const userData = await response.json();
        return userData.user;
    } catch (error) {
        throw error;
    }
}