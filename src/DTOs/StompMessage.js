


export default class StompMessage {
    messageType;
    senderUsername;
    recipientUsername;
    payload;

    constructor(messageType, senderUsername, recipientUsername, payload){
        this.messageType = messageType;
        this.senderUsername = senderUsername;
        this.recipientUsername = recipientUsername;
        this.payload = payload;
    }
};