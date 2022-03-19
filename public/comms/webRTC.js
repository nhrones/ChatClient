import { ReadyState, } from './RTClib.js';
import { CANDIDATE } from '../types.js';
import { myID, start, signaler, callee, caller } from '../main.js';
import { hide, unhide, updateUI, submitButton, chatInput } from '../dom.js';
const DEBUG = true;
/**
 * webRTC class
 */
export class webRTC {
    peerConnection;
    /** The RTCDataChannel API enables peer-to-peer exchange of data */
    dataChannel;
    RTCopen = false;
    channelName = '';
    constructor(name) {
        this.channelName = name;
    }
    /**
     * creates a peer connection
     * @param {boolean} - isOfferer - we're making the offer
     *          true if called by makeCall()
     *          false if called from handleOffer()
     */
    createPeerConnection(isOfferer) {
        if (DEBUG)
            console.log('Starting WebRTC as', isOfferer ? 'Offerer' : 'Offeree');
        this.peerConnection = new RTCPeerConnection({
            iceServers: [{
                    urls: [
                        "stun:stun1.l.google.com:19302",
                        "stun:stun2.l.google.com:19302"
                    ]
                }]
        });
        // local ICE layer passes candidates to us for delivery 
        // to the remote peer over the signaling channel
        this.peerConnection.onicecandidate = (e) => {
            const init = {
                candidate: null,
                sdpMid: "",
                sdpMLineIndex: 0
            };
            if (e.candidate) {
                init.candidate = e.candidate.candidate;
                init.sdpMid = e.candidate.sdpMid;
                init.sdpMLineIndex = e.candidate.sdpMLineIndex;
            }
            // sent over the signaler to the remote peer.
            signaler.postMessage({ from: callee.id, topic: CANDIDATE, payload: init });
        };
        // creating data channel 
        if (isOfferer) {
            if (DEBUG)
                console.log('Offerer -> creating dataChannel!');
            // createDataChannel is a factory method on the RTCPeerConnection object
            this.dataChannel = this.peerConnection.createDataChannel('chat');
            this.setupDataChannel();
        }
        else {
            // If user is not the offerer, wait for 
            // the offerer to pass us its data channel
            this.peerConnection.ondatachannel = (event) => {
                if (DEBUG)
                    console.log('peerConnection.ondatachannel -> creating dataChannel!');
                this.dataChannel = event.channel;
                this.setupDataChannel();
            };
        }
    }
    killPeer() {
        this.peerConnection = null;
    }
    /**
     * Resets the peerConnection and dataChannel, then calls 'start()'
     * */
    reset() {
        this.dataChannel = null;
        this.peerConnection = null;
        hide(submitButton);
        hide(chatInput);
        start();
    }
    // Hook up data channel event handlers
    setupDataChannel() {
        this.dataChannel.onopen = () => {
            this.checkDataChannelState();
        };
        this.dataChannel.onclose = () => {
            this.checkDataChannelState();
        };
        // We're now messaging on the DataChannel ... no more signaling. 
        // no need to do anything except show user messages
        this.dataChannel.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (DEBUG)
                console.info('dataChannel.onmessage: ', data);
            const { from, payload } = data;
            const { content, who, emoji } = payload;
            updateUI(from, content, who, emoji);
        };
    }
    checkDataChannelState() {
        if (this.dataChannel) {
            if (DEBUG)
                console.log('WebRTC channel state is:', this.dataChannel.readyState);
            if (this.dataChannel.readyState === ReadyState.open) {
                updateUI(myID, ` 👬  You're now connected to ${caller.name}!`, 'server', '');
            }
            else if (this.dataChannel.readyState === ReadyState.closed) {
                updateUI(myID, `👀  ${caller.name} was disconnected! Waiting for
 new offer on: ${location.origin}`, 'server', '');
                // reset everything and restart
                caller.name = '';
                caller.id = '';
                caller.emoji = '';
                this.reset();
            }
        }
    }
    async makeConnection() {
        this.createPeerConnection(true);
        const offer = await this.peerConnection.createOffer();
        signaler.postMessage({ from: callee.id, topic: 'offer', payload: { type: 'offer', sdp: offer.sdp } });
        // Note that RTCPeerConnection won't start gathering 
        // candidates until setLocalDescription() is called.
        await this.peerConnection.setLocalDescription(offer);
    }
    /**
     * handle a Session-Description-Offer
     * @param {RTCSessionDescriptionInit} offer - {topic: string, sdp: string}
     */ //todo move external
    async handleOffer(offer) {
        if (this.peerConnection) {
            if (DEBUG)
                console.log('existing peerconnection');
            return;
        }
        this.createPeerConnection(false);
        await this.peerConnection.setRemoteDescription(offer);
        const answer = await this.peerConnection.createAnswer();
        signaler.postMessage({ from: callee.id, topic: 'answer', payload: { type: 'answer', sdp: answer.sdp } });
        // Note that RTCPeerConnection won't start gathering 
        // candidates until setLocalDescription() is called.
        await this.peerConnection.setLocalDescription(answer);
    }
    /**
     * handle a Session-Description-Answer
     * @param {RTCSessionDescriptionInit} answer - {type: string, sdp: string}
     */
    async handleAnswer(answer) {
        if (!this.peerConnection) {
            if (DEBUG)
                console.error('no peerconnection');
            return;
        }
        await this.peerConnection.setRemoteDescription(answer);
        unhide(chatInput);
    }
    /**
     * handle ICE-Candidate
     * @param {RTCIceCandidateInit} candidate - RTCIceCandidateInit
     */
    async handleCandidate(candidate) {
        if (!this.peerConnection) {
            if (DEBUG)
                console.error('no peerconnection');
            return;
        }
        try {
            if (!candidate.candidate) {
                await this.peerConnection.addIceCandidate(null);
            }
            else {
                await this.peerConnection.addIceCandidate(candidate);
            }
        }
        catch (er) {
            console.info(er);
        }
    }
}
// export const ReadyState = {
//     closed: 'closed',
//     closing: 'closing',
//     connecting: 'connecting',
//     open: 'open',
// }
/**
 * WebRTC signal eventlist
 */
export var message;
(function (message) {
    message[message["Bye"] = 11] = "Bye";
    message[message["RtcOffer"] = 12] = "RtcOffer";
    message[message["RtcAnswer"] = 13] = "RtcAnswer";
    message[message["candidate"] = 14] = "candidate";
    message[message["invitation"] = 15] = "invitation";
})(message || (message = {}));
