import {Emoji} from './types.js'
import { SignalService,  } from './comms/signaling.js'
import { 
    hide, 
    initUI, 
    updateUI,
    submitButton,
    chatInput 
} from './dom.js'

let name = prompt("What's your name?", "Bill") || 'Nick';
let t = Date.now().toString()
export let myID = name + '-' + t.substring(t.length-3)
let eString = prompt(`Pick an emoji!  
  1  🐸 
  2  🐼 
  3  🐭 
  4  🐯 
  5  🐶 
  6  👀 
  7  👓
Enter the number!` ) || '7'
let eNum = parseInt(eString)-1
console.log('You picked ' + Emoji[eNum] + '!')

export const SignalServer = 'https://rtc-signal-server.deno.dev'
const host = window.location.hostname 
const SignalServerURL = (host === '127.0.0.1' || host === 'localhost') 
    ? 'http://localhost:8000'
    : SignalServer

console.log('SignalServerURL',SignalServerURL)


export const signaler = new SignalService(name, myID, Emoji[eNum], SignalServerURL)
export const { caller, callee } = signaler;

// initialize all UI DOM elements
initUI()

/** Start the peerConnection process by signaling an invitation */
export const start = () => {
    /*
      TODO To protect against a proxy server timeout, 
      include a comment line 
      (one starting with a ':' character),
      every 15 seconds or so.
    */
    console.log('main.start')
    signaler.postMessage({from: callee.id, topic: 'signalOffer', payload: callee });
    hide(submitButton)
    hide(chatInput);
}

// Finally ... tell them your listening/waiting
updateUI(myID, `⌛  ${myID} is waiting for a connection\n from: ${location.origin}`, 'server', '');