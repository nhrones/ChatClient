/**
 * WebRTC signal eventlist
 */ //HACK not used in ChatClient! Why not??
export var rtcMessage;
(function (rtcMessage) {
    rtcMessage[rtcMessage["Bye"] = 11] = "Bye";
    rtcMessage[rtcMessage["RtcOffer"] = 12] = "RtcOffer";
    rtcMessage[rtcMessage["RtcAnswer"] = 13] = "RtcAnswer";
    rtcMessage[rtcMessage["candidate"] = 14] = "candidate";
    rtcMessage[rtcMessage["invitation"] = 15] = "invitation";
})(rtcMessage || (rtcMessage = {}));
// constants
export const ICEconfiguration = {
    iceServers: [{
            urls: [
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302"
            ]
        }]
};
export const ReadyState = {
    closed: 'closed',
    closing: 'closing',
    connecting: 'connecting',
    open: 'open',
};
