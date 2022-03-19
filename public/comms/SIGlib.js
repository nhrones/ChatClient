/**
 * signal event message list
 */
export var sigMessage;
(function (sigMessage) {
    sigMessage[sigMessage["RegisterPlayer"] = 0] = "RegisterPlayer";
    sigMessage[sigMessage["RemovePlayer"] = 1] = "RemovePlayer";
    sigMessage[sigMessage["ResetGame"] = 2] = "ResetGame";
    sigMessage[sigMessage["ResetTurn"] = 3] = "ResetTurn";
    sigMessage[sigMessage["ShowPopup"] = 4] = "ShowPopup";
    sigMessage[sigMessage["UpdateRoll"] = 5] = "UpdateRoll";
    sigMessage[sigMessage["UpdateScore"] = 6] = "UpdateScore";
    sigMessage[sigMessage["UpdateDie"] = 7] = "UpdateDie";
    sigMessage[sigMessage["UpdatePlayers"] = 8] = "UpdatePlayers";
    sigMessage[sigMessage["SetID"] = 9] = "SetID";
    sigMessage[sigMessage["GameFull"] = 10] = "GameFull";
})(sigMessage || (sigMessage = {}));
