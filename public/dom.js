import { myID, callee, signaler } from './main.js';
export let submitButton;
export let chatForm;
export let chatInput;
export const initUI = () => {
    submitButton = document.getElementById('submitButton');
    chatForm = document.querySelector('form');
    chatInput = document.getElementById('chatInput');
    chatInput.placeholder = 'say something ' + myID + '!';
    unhide(submitButton);
    unhide(chatInput);
    chatInput.onkeyup = (ev) => {
        if (chatInput.value.length) {
            unhide(submitButton);
        }
    };
    submitButton.onclick = () => {
        const data = {
            from: callee.id,
            topic: 'chat',
            payload: {
                content: chatInput.value || '',
                who: callee.name,
                emoji: callee.emoji,
            }
        };
        hide(submitButton);
        updateUI(myID, chatInput.value || '', callee.name, callee.emoji);
        chatInput.value = '';
        signaler.postMessage(data);
    };
};
export function updateUI(fromID, content, who, emoji, clearFirst = false) {
    let isMe = false;
    //TODO cleanup message layout based on `from`
    //TODO use correct emoji for each peer ???
    if (fromID === myID) {
        isMe = true;
    }
    if (who === 'server') {
        who = '';
        clearFirst = true;
        isMe = true;
        const banner = document.getElementById('banner');
        banner.textContent = content;
    }
    else {
        const template = document.querySelector('template[data-template="message"]');
        const nameEl = template.content.querySelector('.message__name');
        //todo emoji = (isMe) ? Emoji[0] : Emoji[1]
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
        if (clearFirst) {
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
