import { formatVisitsURL, getHeaders, getRole } from "../utils/utilities";
import axios from "./axios";
import StompMessage from '../DTOs/StompMessage';
import { formatBackendLoginURL, formatBackendRegistrationURL } from "../utils/utilities";
import VisitDTO from "../DTOs/VisitDTO";

export async function handleLogin(values, setLoading, setErrorMessage, setUser, navigate){
    // upon form submission we set loading to true and reset the error state (setErrorMessage(null))
    setLoading(true)
    setErrorMessage(null)

    try {
        // uses axios to send POST request to backend auth API
        const response = await axios.post(
            formatBackendLoginURL(values.roles),  // backend auth API URL
            values, // form values (request body)
            {
                headers: {
                    'Content-Type': 'application/json',
                    withCredentials: true
                }
            }
        );
        
        // after post request has returned, we set loading to false (no longer waiting for backend response)
        setLoading(false)

        // if backend response is HTTP status 200, user successfully authenticated
        if(response.status === 200){
            setUser(response.data) // sets global auth user variable with the user object returned from the backend
            window.localStorage.setItem('user', JSON.stringify(response.data)); // sets user in localStorage to persist across refresh

            //TODO: Debugging purposes, delete
            console.log("Authentication Success!")

            // user has been authenticated, therefore navigate to home
            navigate("/");
        } 
                
    } catch(error) {
        // if an error is thrown, the backend has responded therefore no longer loading
        setLoading(false)

        //TODO: look into this 
        // if backend responds with HTTP status 401 user is disabled
        if(error.response.status === 401){
            navigate("/unconfirmed") // account is not confirmed

        } else if(error.response.status === 400) {
            // if backend responds with HTTP status 400 it could either be wrong email, wrong password, or wrong role
            // catches backend error messages and sets error state accordingly (the cases are the error messages returned by backend auth API)
            switch (error.response.data) {
                case "Incorrect email or password.": 
                    setErrorMessage("Incorrect Password. Try again!");
                    break;

                case "Error: Please choose correct role.":
                    setErrorMessage("Please choose the correct role.");
                    break;

                case "Error: User does not exist, please register.":
                    setErrorMessage("Email not found. Try again or Sign Up!");
                    break;

                case "Error: Doctor does not exist, please register.":
                    setErrorMessage("Email not found. Try again or Sign Up!");
                    break;
            }
        }
    }
}
export async function handleRegistration(values, setLoading, setErrorMessage, setUser, navigate){
    // loading is set to true when we send the response to the backend and are waiting on it.
    setLoading(true)
    // error messages are reset
    setErrorMessage(null)
   
    // use AXIOS to send POST request to the backend
    try {
        // post request to backend auth api
        const response = await axios.post(
            formatBackendRegistrationURL(values.roles), // ie:  auth/save/user
            values,  // form values
            {
                headers: {
                    'Content-Type': 'application/json',
                     withCredentials: true
                }
            }
        );
                   
        // when code reaches here, the backend response has returned so loading is set to false
        setLoading(false)

        if(response.status === 201){
            if(response.data !== undefined) {
                setUser(response.data); // setting global auth user
            } 

            console.log("Registration success!")
            // navigation to /unconfirmed page becasue by default, new users have not confirmed their email.
            navigate("/unconfirmed");
        }
    } catch(error) {
        // if an error is thrown from the backend, we set loading to false sinc backend responded
        setLoading(false)
        // set error message according to the error returned from the backend
        switch(error.response.data){
            case "Error: Email is already in use! Please login":
                setErrorMessage("Email is already in use. Please login!")
                break;
            case "Error: Username is already in taken!":
                setErrorMessage("Username is already taken. Please choose another!")
                break;
        }
    }
   
}

export async function handleCheckIn(values, setLoading, setErrorMessage, setSuccessMessage, user, setUser){
    try {
        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const response = await axios.post(
            "/api/locations/checkIn",
            {
                "name": values.location,
                "email": user?.doctor?.email,
                "jwt": user?.jwt,
                "role": getRole(user)
            },
            getHeaders(user)
        )

        setLoading(false)

        if(response.status === 200){
            console.log("Successful Check In!")
            setUser(response.data);
            setSuccessMessage("Check In Successful!");
        }
     
    } catch(error) {
        console.log(error);
        setLoading(false)

        if(error.response.status === 401){
            setErrorMessage("Something went wrong, re-authenticate and try again.")

        } else{
            setErrorMessage(error.response.data);
            if(error.response.data === 'Error: Doctor is already checked in at a location.'){
                // above error results from bug in which Doctor is already checked in at a location but frontend does not recognize it.

                setLoading(true);
                setErrorMessage(null);
                setSuccessMessage(null);
                // make request to backend to get fresh user object with isCheckedIn=true and currentLocation!=null
                try{
                    const response = await axios.get(
                        "/api/welcome/doctor?username=".concat(user?.doctor?.username),
                        getHeaders(user)
                    )
                    setLoading(false);

                    if(response.status === 200) {
                        setUser(response.data);
                    }

                } catch(exception) {
                    setLoading(false);
                    setErrorMessage(exception.response.data)
                    console.log(exception)
                }
            }
        }
    }
}

export async function handleCheckOut(setLoading, setErrorMessage, setSuccessMessage, user, setUser){
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
        const response = await axios.post(
            "/api/locations/checkOut",
            {
                "email": user?.doctor?.email,
                "jwt": user?.jwt,
                "role": getRole(user)
            },
            getHeaders(user)
        )
        setLoading(false);

        if(response.status === 200){
            console.log("Successful Check Out!")
            setUser(response.data);
            setSuccessMessage("Check Out Successful!");
        }

    } catch(error){
        setLoading(false);
        setErrorMessage(error?.response?.data);
    }
}

export async function fetchLocations(user){
    const response = await axios.get(
        "/api/locations/all",
        getHeaders(user)
    )
    return response;
};

export async function fetchDocsAtLocation(user, location, setDocsAtLocation, setLoadingDocs, setErrorMessage, setWarningMessage) {
    setLoadingDocs(true);
    setErrorMessage(null);
    setWarningMessage(null);

    try {
        const response = await axios.get(
            "/api/locations/activeDoctors?location_name="+location,
            getHeaders(user)
        )
    
        setDocsAtLocation(response?.data);
        setLoadingDocs(false);

        if(response?.data[0] === undefined){
            setWarningMessage("No doctors currently checked in at the specified location. Choose another location or try again later.")
        }

    } catch(error){
        setLoadingDocs(false);
        console.log(error);

        if(error?.response?.status === 401){
            setErrorMessage("Something went wrong, re-authenticate and try again.")
        } else {
            setErrorMessage(error?.response?.data);
        }
    }
}
export async function fetchVisits(user){
    const response = await axios.get(
        formatVisitsURL(user),
        getHeaders(user)
    )
    return response;
};

export async function updateLocations(locationsDataState, setLocationsDataState, queryClient){
    if(locationsDataState?.isInvalidated || locationsDataState===undefined){
        try{
            await queryClient.refetchQueries({queryKey: ['allLocations']})
            setLocationsDataState(queryClient.getQueryState(['allLocations']))
        } catch(error){
            setLocationsDataState({
                ...locationsDataState,
                status: "error",
                error: error
            })
        }
    }
}

export async function updatePtVisits(visitDataState, setVisitDataState, queryClient, user){
    if(visitDataState?.isInvalidated || visitDataState===undefined) {
        try {
            await queryClient.refetchQueries({ queryKey: ['allPtVisits', user?.user?.username]})
            setVisitDataState(queryClient.getQueryState(['allPtVisits', user?.user?.username]));

        } catch (error) {
            setVisitDataState({
                ...visitDataState,
                status: "error",
                error: error
            })
        }
    }
}

export async function updateDocVisits(visitDataState, setVisitDataState, queryClient, user){
    if(visitDataState?.isInvalidated || visitDataState===undefined) {
        console.log("updating doctor visits...");
        try {
            await queryClient.refetchQueries({ queryKey: ['allDocVisits', user?.doctor?.username]})
            setVisitDataState(queryClient.getQueryState(['allDocVisits', user?.doctor?.username]));

        } catch (error) {
            setVisitDataState({
                ...visitDataState,
                status: "error",
                error: error
            })
        }
    }
}
export async function newVisitRequestStomp(values, {resetForm}, stompClient, queryClient, user, setSuccessMessage, setLoading, navigate){
    stompClient.current.publish({
        destination: "/app/currentVisit/new",
        body: JSON.stringify(
            new StompMessage(
                "NewVisitRequest",          // messageType
                user?.user?.username,       // senderUsername
                values.doctor,              // recipientUsername
                VisitDTO.build(             // payload
                    values.doctor,              // doctorUsername
                    user?.user?.username,       // patientUsername
                    values.location,            // locationName
                )
            )
        )
    })

    resetForm();
    setSuccessMessage("Visit Request Sent!")
    setLoading(true);

    await queryClient.invalidateQueries({
        queryKey: ['allPtVisits', user?.user?.username],
        refetchType: 'none'
    });

    setTimeout(() => {
        setLoading(false)
        navigate("/patient/visits")
        
    }, 1000)
}

export async function acceptVisitStomp(queryClient, setVisitDataState, stompClient, user, visit){
    stompClient.current.publish({
        destination: "/app/currentVisit/accept",
        body: JSON.stringify(
            new StompMessage(
                "NewVisitResponse",             // messageType
                user?.doctor?.username,         // senderUsername
                visit.patientUsername,          // recipientUsername
                {"visitID": visit.id}           // payload
            )
        )
    })

    await queryClient.refetchQueries({ queryKey: ['allDocVisits', user?.doctor?.username]})
    setVisitDataState(queryClient.getQueryState(['allDocVisits', user?.doctor?.username]));
}

export async function declineVisitStomp(queryClient, setVisitDataState, stompClient, user, visit) {    
    stompClient.current.publish({
        destination: "/app/currentVisit/decline",
        body: JSON.stringify(
            new StompMessage(
                "NewVisitResponse",             // messageType
                user?.doctor?.username,         // senderUsername
                visit.patientUsername,          // recipientUsername
                {"visitID": visit.id}           // payload
            )
        )
    })

    await queryClient.refetchQueries({ queryKey: ['allDocVisits', user?.doctor?.username]})
    setVisitDataState(queryClient.getQueryState(['allDocVisits', user?.doctor?.username]));
}

// function visitByStatus(){
//     console.log('sorting visits...');

//     switch(getRole(user)){
//         case 'ROLE_USER':
//             allVisits?.patientVisits?.forEach(visit => {
//                 switch(visit?.status){
//                     case 'VISIT_PENDING':
//                         setVisitByStatus({
//                             ...visitByStatus,
//                             pending: visitByStatus.pending.push(visit)
//                         })
//                         break;
//                     case 'VISIT_CURRENT':
//                         setVisitByStatus({
//                             ...visitByStatus,
//                             current: visitByStatus.current.push(visit)
//                         })
//                         break;
//                     case 'VISIT_FINALIZED':
//                         setVisitByStatus({
//                             ...visitByStatus,
//                             finalized: visitByStatus.finalized.push(visit)
//                         })
//                         break;
//                     case 'VISIT_REJECTED':
//                         setVisitByStatus({
//                             ...visitByStatus,
//                             rejected: visitByStatus.rejected.push(visit)
//                         })
//                         break;
//                 }
//             })
//         case 'ROLE_DOCTOR':
//             allVisits?.patientVisits?.forEach(visit => {
//                 switch(visit?.status){
//                     case 'VISIT_PENDING':
//                         setVisitByStatus({
//                             ...visitByStatus,
//                             pending: visitByStatus.pending.push(visit)
//                         })
//                         break;
//                     case 'VISIT_CURRENT':
//                         setVisitByStatus({
//                             ...visitByStatus,
//                             current: visitByStatus.current.push(visit)
//                         })
//                         break;
//                     case 'VISIT_FINALIZED':
//                         setVisitByStatus({
//                             ...visitByStatus,
//                             finalized: visitByStatus.finalized.push(visit)
//                         })
//                         break;
//                     case 'VISIT_REJECTED':
//                         setVisitByStatus({
//                             ...visitByStatus,
//                             rejected: visitByStatus.rejected.push(visit)
//                         })
//                         break;
//                 }
//             })
//     }

//     return visitByStatus;

// };

// {
//     stompClient.current.publish({
//         destination: "/app/currentVisit/accept",
//         body: JSON.stringify(
//             new StompMessage(
//                 "NewVisitResponse",             // messageType
//                 user?.doctor?.username,         // senderUsername
//                 visit.patientUsername,          // recipientUsername
//                 {"visitID": visit.id}           // payload
//             )
//         )
//     })
// }


// stompClient.current.publish({
//     destination: "/app/currentVisit/new",
//     body: JSON.stringify(
//         new StompMessage(
//             "NewVisitRequest",          // messageType
//             user?.user?.username,       // senderUsername
//             values.doctor,              // recipientUsername
//             VisitDTO.build(             // payload
//                 values.doctor,              // doctorUsername
//                 user?.user?.username,       // patientUsername
//                 values.location,            // locationName
//             )
//         )
//     )
// })

// resetForm();
// setSuccessMessage("Visit Request Sent!")
// setLoading(true)

// await queryClient.invalidateQueries({
//     queryKey: ['allPtVisits', user?.user?.username],
//     refetchType: 'none'
// })

// setTimeout(() => {
//     setLoading(false)
//     navigate("/patient/visits")
    
// }, 1000)
