import React from 'react'
import { useContext } from 'react'
import StompContext from '../context/WebSocketWrapper'

function useStomp() {
    return useContext(StompContext);
}

export default useStomp;