
export const CANDIDATE = 'candidate'

export const ICEconfiguration = {
    iceServers: [{
        urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302"
        ]
    }]
}

export type Peer = {
    id: string,
    name: string,
    emoji: string
}

/** Signal Message Topic type */
type Topic = 'bye' | 'offer' | 'answer' | 'candidate' | 'signalOffer' | 'signalAnswer' | 'chat';
type ChatPayload = {
    content: string,
    who: string,
    emoji: string
}    
/** Payload type */
type Payload = RTCSessionDescriptionInit | RTCIceCandidateInit | ChatPayload | Peer | string;

/** SignalingMessage type */
export type SignalingMessage = {
    from: string;
    topic: Topic;
    payload: Payload;
}

export const Emoji = ['🐸','🐼','🐭','🐯','🐶','👀','👓']
