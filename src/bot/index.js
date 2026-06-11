const qrcode = require("qrcode-terminal")
const { Client, LocalAuth } = require("whatsapp-web.js")
const ChatController = require("./controllers/ChatController")

class BarberBot {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--single-process",
        ],
      },
    })

    this.chatController = new ChatController(this.client)
  }

  initialize() {
    this.client.on("qr", (qr) => {
      console.log("📲 Escaneie o QR Code abaixo com o WhatsApp:")
      qrcode.generate(qr, { small: true })
    })

    this.client.on("ready", () => {
      console.log("✅ WhatsApp conectado! Bot da Barber (MVC) rodando.")
    })

    this.client.on("disconnected", (reason) => {
      console.log("⚠️  Desconectado:", reason)
    })

    this.client.on("message", (msg) => {
      this.chatController.handleMessage(msg)
    })

    this.client.initialize()
  }
}

module.exports = BarberBot
