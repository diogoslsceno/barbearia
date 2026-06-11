const moment = require("moment-timezone");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function typing(chat, ms = 1800) {
    if (chat.sendStateTyping) {
        await chat.sendStateTyping();
    }
    await delay(ms);
}

function getSaudacao() {
    const h = moment().tz("America/Sao_Paulo").hour();
    if (h >= 5 && h < 12) return "Bom dia";
    if (h >= 12 && h < 18) return "Boa tarde";
    return "Boa noite";
}

module.exports = {
    delay,
    typing,
    getSaudacao
};
