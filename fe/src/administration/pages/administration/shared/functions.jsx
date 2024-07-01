const getToken = () => {
    const token = localStorage.getItem('token');
    let id;

    if (token) {
        const parts = token.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            id = payload.id;
        }
    }
    return id;
    
}


export default getToken;
