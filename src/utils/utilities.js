

export function getHeaders(user){
    return {
        headers: {
            Authorization: 'Bearer '.concat(user?.jwt),
            'Content-Type': 'application/json',
            withCredentials: true
        }
    }
}

export function formatVisitsURL(user) {
    switch (getRole(user)) {
        case 'ROLE_USER': return "/api/visits/byPatient?patient=".concat(user?.user?.username)
        case 'ROLE_DOCTOR': return "/api/visits/byDoctor?doctor=".concat(user?.doctor?.username)
    }
}

export function getUsername(user) {
    switch (getRole(user)) {
        case 'ROLE_USER': return user?.user?.username
        case 'ROLE_DOCTOR': return user?.doctor?.username
    }
}

export function formatBackendRegistrationURL(activeRole) {
    let url = "/auth/save";
    if(activeRole === 'ROLE_USER'){
        url = url.concat('/user')
    } else if(activeRole === 'ROLE_DOCTOR') {
        url = url.concat('/doctor')
    }
    return url;
}

export function formatBackendLoginURL(activeRole) {
    let url = "/auth/login";
    if(activeRole === 'ROLE_USER'){
        url = url.concat('/user')
    } else if(activeRole === 'ROLE_DOCTOR') {
        url = url.concat('/doctor')
    }
    return url;
}

export function getRole(user) {
    if(user?.user !== undefined && user?.user?.roles?.find(role => role.name === "ROLE_USER") !== undefined){
        return "ROLE_USER";
    } else if(user?.doctor !== undefined && user?.doctor?.roles?.find(role => role.name === "ROLE_DOCTOR") !== undefined){
        return "ROLE_DOCTOR";
    } else {
        return undefined;
    }
}

export function handleMessage(user, setUser, message) {
    if(getRole(user) === "ROLE_DOCTOR"){
        setUser({
            ...user,
            doctor: JSON.parse(message.body)
        })
    } else if(getRole(user) === "ROLE_USER"){
        setUser({
            ...user,
            user: JSON.parse(message.body)
        })
    }
}

export function handleLogout(stompClient, setUser, navigate){
    stompClient.current.deactivate();
    setUser(null); // sets global auth user to null
    window.localStorage.setItem('user', null) // sets 'user' object stored in localStorage to null.
    navigate('/Authenticate');
}

export function toggleAuthenticateForm(value, setActiveForm, setErrorMessage){
    setActiveForm(value);
    setErrorMessage(null)
}