import { serviceURL } from './signaling.js';
export let callee = {
    id: 'callee',
    name: 'callee',
    alias: 'Player-1',
    role: 'callee',
    emoji: ''
};
export let caller = {
    id: 'caller',
    name: 'caller',
    alias: 'Player-2',
    role: 'caller',
    emoji: ''
};
/** set the caller peer */
export function setCaller(peer) {
    caller = peer;
    console.info('setCaller: ', caller);
}
/** initialize both peers */
export function initPeers(id, name, emoji = Emoji[0]) {
    callee = { id: id, name: name, alias: 'Player-1', role: 'callee', emoji: emoji };
    caller = { id: 'caller', name: 'caller', alias: 'Player-2', role: 'caller', emoji: Emoji[1] };
}
/** Notify any listening peer ... we're registering as a new peer */
export const registerPeer = (id, name) => {
    const msg = JSON.stringify({
        from: id,
        event: 'RegisterPeer',
        data: callee
    });
    fetch(serviceURL, { method: "POST", body: msg });
};
// We start-up assuming we're first; the callee.   
// If we happen to connect after another peer, our role 
// will become caller and we'll need to adjust our role.
export function swapPeers(newName, newEmoji) {
    caller.name = newName;
    // swap emojis
    this.callee.emoji = caller.emoji;
    this.caller.emoji = newEmoji;
}
export const Emoji = ['🐸', '🐼', '🐭', '🐯', '🐶', '👀', '👓'];
