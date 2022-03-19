import { rtcMessage } from './RTClib'

/** 
 * signal event message list 
 */
 export enum sigMessage { //TODO move this to Dice only
    RegisterPlayer = 0, // signaling: 86, players: 33
    RemovePlayer = 1,   // players: 76, server::signaler: 80
    ResetGame = 2,      // diceGame: 72, 78
    ResetTurn = 3,      // diceGame: 66, scoreElement: 66
    ShowPopup = 4,      // diceGame: 195, popup : 66
    UpdateRoll = 5,     // rollButton: 17, 22
    UpdateScore = 6,    // webRTC: 160, scoreElement: 64
    UpdateDie = 7,      // dice: 65, 71
    UpdatePlayers = 8,  // players: 41, 45
    SetID = 9,          // app: 22
    GameFull = 10,      // app: 29
}

/** 
 * SignalingMessage type 
 */
 export type SignalingMessage = { 
    topic: sigMessage | rtcMessage, 
    data: RTCSessionDescriptionInit | RTCIceCandidateInit | object | string[] | string, 
}