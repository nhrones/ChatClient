import { Emoji } from './comms/peers.js';
import { initialize, onEvent } from './comms/signaling.js';
import { initUI, updateUI } from './dom.js';
let name = prompt("What's your name?", "Bill") || 'Nick';
let t = Date.now().toString();
let myID = name + '-' + t.substring(t.length - 3);
//HACK
// let eString = prompt(`Pick an emoji!  
//   1  🐸 
//   2  🐼 
//   3  🐭 
//   4  🐯 
//   5  🐶 
//   6  👀 
//   7  👓
// Enter the number!` ) || '7'
//hack let eNum = parseInt(eString)-1
let eNum = 6;
console.log('You picked ' + Emoji[eNum] + '!');
export const SignalServer = 'https://rtc-signal-server.deno.dev';
const host = window.location.hostname;
const SignalServerURL = (host === '127.0.0.1' || host === 'localhost')
    ? 'http://localhost:8000'
    : SignalServer;
console.log('SignalServerURL', SignalServerURL);
initialize(name, myID);
// initialize all UI DOM elements
initUI();
onEvent('UpdateUI', (msg) => {
    updateUI({
        from: myID,
        content: msg,
        who: myID,
        emoji: '',
        toHeader: true
    });
});
