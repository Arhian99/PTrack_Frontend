import React, { useEffect, createContext, useState } from 'react'
import SockJS from 'sockjs-client';
import useAuth from '../hooks/useAuth';
import { Client } from '@stomp/stompjs';
import { useRef } from 'react';
import { handleMessage } from '../utils/utilities';

const SOCKET_URL = 'http://localhost:8080/ws';
let topicCurrentVisitSubscription = null;
const StompContext = createContext({});

export function WebSocketWrapper({ children }) {
    const {user, setUser} = useAuth();
   const stompClient = useRef(null);

    function handshake(){
        stompClient.current= new Client({
            webSocketFactory: () => new SockJS(SOCKET_URL),
            connectHeaders: {
                "Authorization": "Bearer ".concat(user?.jwt)
            },
            debug: (msg) => {
                console.log(msg);
            },
            reconnectDelay: (1000),
            onConnect: () => {
                topicCurrentVisitSubscription = stompClient.current.subscribe(
                    "/user/queue/currentVisit/new",
                    (message) => {
                        console.log("New Message Received...");
                        handleMessage(user, setUser, message);
                    }
                )
                console.log("WebSocket Connection Established...");
            },
            onDisconnect: () => {
                console.log("WebSocket Disconnected...");
            },
            onStompError: (msg) => {
                console.log('Broker reported error: ' + msg.headers['message'])
                console.log('Additional details: ' + msg.body);
            }
        });

        stompClient.current.activate();
    };

    useEffect(() => {
        if(user!=null){
            handshake();
        } else if (user===null){
            stompClient?.current?.deactivate();
        }
    }, [user]);


  return (
    <StompContext.Provider value={stompClient} >
        {children}
    </StompContext.Provider>
  )
}

export default StompContext;