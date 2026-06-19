const qrcodeTerminal = require("qrcode-terminal")
const QRCode = require("qrcode")
const { Client, LocalAuth } = require("whatsapp-web.js")
const ChatController = require("./controllers/ChatController")
const fs = require("fs")
const path = require("path")

class BarberBot {
  constructor() {
    this.createNewClient()
  }

  createNewClient() {
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
    this.client.on("qr", async (qr) => {
      console.log("📲 Escaneie o QR Code abaixo com o WhatsApp:")
      qrcodeTerminal.generate(qr, { small: true })

      // Salvar QR Code como imagem png
      const qrPath = path.join(__dirname, "../../assets/qrcode.png")
      try {
        await QRCode.toFile(qrPath, qr)
        console.log(`💾 QR Code também salvo como imagem em: ${qrPath}`)
      } catch (err) {
        console.error("⚠️ Erro ao salvar imagem do QR Code:", err)
      }
    })

    this.client.on("ready", () => {
      console.log("✅ WhatsApp conectado! Bot da Barber (MVC) rodando.")
      this.deleteQrFile()
    })

    this.client.on("auth_failure", async (msg) => {
      console.error("❌ Falha na autenticação do WhatsApp Web:", msg)
      await this.cleanAuthAndRestart()
    })

    this.client.on("disconnected", async (reason) => {
      console.log("⚠️ Cliente desconectado do WhatsApp Web:", reason)
      await this.cleanAuthAndRestart()
    })

    this.client.on("message", (msg) => {
      this.chatController.handleMessage(msg)
    })

    this.client.initialize()
  }

  async cleanAuthAndRestart() {
    console.log("🔄 Tentando reiniciar o bot e limpar cache expirado...")
    try {
      if (this.client) {
        await this.client.destroy().catch(() => {})
      }
    } catch (err) {
      console.error("⚠️ Erro ao destruir o cliente:", err)
    }

    const authPath = path.join(__dirname, "../../.wwebjs_auth")
    if (fs.existsSync(authPath)) {
      try {
        fs.rmSync(authPath, { recursive: true, force: true })
        console.log("🧹 Cache de autenticação (.wwebjs_auth) limpo com sucesso.")
      } catch (err) {
        console.error("⚠️ Erro ao limpar diretório de autenticação:", err)
      }
    }

    this.deleteQrFile()

    console.log("⏳ Reiniciando inicialização do bot em 5 segundos...")
    setTimeout(() => {
      this.createNewClient()
      this.initialize()
    }, 5000)
  }

  deleteQrFile() {
    const qrPath = path.join(__dirname, "../../assets/qrcode.png")
    if (fs.existsSync(qrPath)) {
      try {
        fs.unlinkSync(qrPath)
        console.log("🗑️ Arquivo de QR Code temporário removido.")
      } catch (err) {
        console.error("⚠️ Erro ao deletar o arquivo do QR Code:", err)
      }
    }
  }
}

// Captura erros inesperados e evita que o processo caia
process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Rejeição Não Tratada em Promessa:", reason)
})

process.on("uncaughtException", (error) => {
  console.error("💥 Exceção Não Capturada:", error)
})

module.exports = BarberBot
