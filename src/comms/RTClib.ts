

/** 
 * WebRTC signal eventlist 
 *///HACK not used in ChatClient! Why not??
 export enum rtcMessage {
    Bye = 11,
    RtcOffer = 12,
    RtcAnswer = 13,
    candidate = 14,
    invitation = 15
}

// constants
export const ICEconfiguration = {
    iceServers: [{
        urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302"
        ]
    }]
}

export const ReadyState = {
    closed: 'closed',
    closing: 'closing',
    connecting: 'connecting',
    open: 'open',
}