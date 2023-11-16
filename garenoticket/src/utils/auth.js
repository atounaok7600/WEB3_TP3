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

export const getUser = async (token) => {
    try {
        return await fetchUser(token)
    } catch (error) {
        throw error;
    }
}