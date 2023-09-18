
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

