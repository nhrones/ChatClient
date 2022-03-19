import { Emoji } from '../types.js';
import { updateUI, hide, unhide, submitButton, chatInput } from '../dom.js';
import * as main from '../main.js';
import { webRTC } from './webRTC.js';
const DEBUG = true;
/**
 * Signaling Service
 *
 * This service handles signaling and iceCandidate exchange
 * to establish one or more WebRTC Connection instances.
 *
 * We'll be connecting to a server that streams messages
 * to our local EventSource instance
 *
 * */
export class SignalService {
    sse;
    caller;
    callee;
    rtcConn;
    signalURL = '';
    /**
     * Signaling ctor
     */
    constructor(thisname, id, thisEmoji, url) {
        this.rtcConn = new webRTC(thisname);
        this.signalURL = url;
        // I'm expecting to get a 'signalOffer', where I would be the callee       
        this.callee = { id: id, name: thisname, emoji: thisEmoji };
        // When I get that offer, I'll set up the caller object?    
        this.caller = { id: '', name: '', emoji: Emoji[0] };
        this.sse = new EventSource(this.signalURL + '/listen/' + this.callee.id);
        this.sse.onopen = (e) => {
            if (DEBUG)
                console.log('sse opened!');
            main.start();
        };
        // close the sse when the window closes
        window.addEventListener('beforeunload', () => {
            if (this.sse.readyState === 1) {
                const sigMsg = JSON.stringify({
                    from: id,
                    event: 'close',
                    data: id + ' window was closed!',
                    id: 0
                });
                fetch(this.signalURL, {
                    method: "POST",
                    body: sigMsg
                });
            }
        });
        // When problems occur (such as a network timeout,
        // or issues pertaining to access control), 
        // an error event is generated. 
        this.sse.onerror = (err) => {
            console.error('sse(EventSource) failed: ', err);
        };
        // Handle incoming messages from the signaling server.
        // for incoming messages that `DO NOT` have an event field on them 
        this.sse.onmessage = (ev) => {
            const { data } = ev;
            const { from, topic, payload } = JSON.parse(data);
            if (DEBUG)
                console.info('sse.onmessage!', data);
            if (DEBUG)
                console.log('topic', topic);
            switch (topic) {
                case 'chat':
                    const { content, who, emoji } = payload;
                    updateUI(from, content, who, emoji);
                    break;
                case 'offer': // a peer has made an offer (SDP)
                    this.rtcConn.handleOffer(payload);
                    unhide(chatInput);
                    break;
                case 'answer': // a peer has sent an answer (SDP)
                    this.rtcConn.handleAnswer(payload);
                    break;
                case 'candidate': // calls peer onicecandidate with new candidate
                    this.rtcConn.handleCandidate(payload);
                    break;
                case 'invitation': // A peer is offering to chat
                    // I'll initiate a connection unless I'm engaged already.
                    // check if I'm already engaged in a chat.
                    if (this.rtcConn.peerConnection) {
                        if (DEBUG)
                            console.log(`Already connected with ${this.caller.name}, ignoring signal 'offer'!`);
                        return;
                    }
                    // set the callers name
                    this.caller.name = payload.name;
                    if (DEBUG)
                        console.log(`${this.caller.name} has sent me a 'chat-offer' signal!  We'll signal an answer!`);
                    // send the caller the identity of this callee
                    this.postMessage({ from: this.callee.id, topic: 'acceptInvitation', payload: this.callee });
                    // start the RTC-connection
                    this.rtcConn.makeConnection();
                    break;
                case 'acceptInvitation': // someone's answering our offer!
                    // a role change is required
                    // set the new callers name
                    this.caller.name = payload.name;
                    // swap emojis
                    this.callee.emoji = this.caller.emoji;
                    this.caller.emoji = payload.emoji;
                    break;
                case 'bye': // peer hung up
                    if (this.rtcConn.peerConnection) {
                        this.rtcConn.peerConnection.close();
                        this.rtcConn.killPeer();
                    }
                    hide(submitButton);
                    hide(chatInput);
                    break;
                default:
                    break;
            }
        };
    }
    /**
     * By default, if the connection between the client and server closes,
     * the client will attempt to reconnect.
     * The connection can only be `terminated` with the .close() method.
     */
    close() {
        this.sse.close();
    }
    /**
     * PostMessage sends messages to peers via a signal service
     * or via an opened WebRTC DataChannel
     * @param message {SignalMessage} - message - message payload
     */
    postMessage(message) {
        const msg = JSON.stringify(message);
        // if we've opened a Datachannel, use it
        if (this.rtcConn.dataChannel && this.rtcConn.dataChannel.readyState === 'open') {
            if (DEBUG)
                console.log('DataChannel >> :', msg);
            this.rtcConn.dataChannel.send(msg);
        }
        else { //no, just use the signal server
            if (DEBUG)
                console.log('Server >> :', msg);
            fetch(this.signalURL, {
                method: "POST",
                body: JSON.stringify(message)
            });
        }
    }
}
