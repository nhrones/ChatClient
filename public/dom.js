import { callee, caller } from './comms/peers.js';
import { onEvent } from './comms/signaling.js';
import { sendSignal, RTCopen } from './comms/webRTC.js';
export let sendButton;
export let chatForm;
export let chatInput;
const thisID = callee.id;
export const initUI = () => {
    sendButton = document.getElementById('sendButton');
    chatForm = document.querySelector('form');
    chatInput = document.getElementById('chatInput');
    chatInput.placeholder = 'say something ' + thisID + '!';
    unhide(sendButton);
    unhide(chatInput);
    chatInput.onkeyup = (ev) => {
        if (chatInput.value.length) {
            unhide(sendButton);
        }
        if (ev.key === "Enter") {
            sendChatMessage();
        }
    };
    sendButton.onclick = () => {
        sendChatMessage();
    };
};
function sendChatMessage() {
    const data = {
        event: 'chat',
        data: {
            content: chatInput.value || '',
            who: callee.name,
            emoji: callee.emoji,
        }
    };
    updateUI({
        from: thisID,
        content: chatInput.value || '',
        who: callee.name,
        emoji: callee.emoji
    });
    chatInput.value = '';
    sendSignal(data);
}
// chat event is exclsive to this app (comms has no knowledge of 'chat' events)
onEvent('chat', (data) => {
    const { content, who, emoji } = data;
    updateUI({ from: who, content: content, who: who, emoji: emoji });
});
// sent from webRTC when peer has disconnected
onEvent('PeerDisconnected', (msg) => {
    let ops = {
        from: '',
        content: msg,
        who: caller.name,
        emoji: '',
        toHeader: true
    };
    updateUI(ops);
});
export function updateUI(options) {
    let { from, who, content, emoji, clearContent, toHeader } = options;
    let isMe = (from === thisID);
    if (RTCopen) {
        unhide(chatInput);
        unhide(sendButton);
    }
    else {
        hide(chatInput);
        hide(sendButton);
    }
    if (toHeader) {
        who = '';
        clearContent = true;
        isMe = true;
        const banner = document.getElementById('banner');
        banner.textContent = content;
    }
    else {
        const template = document.querySelector('template[data-template="message"]');
        const nameEl = template.content.querySelector('.message__name');
        if (emoji || who) {
            nameEl.innerText = emoji + ' ' + who;
        }
        const bub = template.content.querySelector('.message__bubble');
        bub.innerText = content;
        const clone = document.importNode(template.content, true);
        const messageEl = clone.querySelector('.message');
        if (isMe) {
            messageEl.classList.add('message--mine');
        }
        else {
            messageEl.classList.add('message--theirs');
        }
        const messagesEl = document.querySelector('.messages');
        // should clear?
        if (clearContent) {
            messagesEl.innerHTML = '';
        }
        messagesEl.appendChild(clone);
        // Scroll to bottom
        messagesEl.scrollTop = messagesEl.scrollHeight - messagesEl.clientHeight;
    }
}
export const hide = (el) => {
    el.style.display = "none";
    el.disabled = false;
};
export const unhide = (el) => {
    el.style.display = "block";
    el.disabled = false;
};
