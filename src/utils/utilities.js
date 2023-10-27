
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

