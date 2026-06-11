const BotView = require("../views/BotView")
const SessionModel = require("../models/SessionModel")
const BookingController = require("./BookingController")
const { typing } = require("../../shared/utils")

class ChatController {
  constructor(client) {
    this.client = client
    this.bookingController = new BookingController(client)
  }

  async handleMessage(msg) {
    try {
      if (!msg.from || msg.from.endsWith("@g.us")) return
      const chat = await msg.getChat()
      if (chat.isGroup) return

      const number = msg.from
      const text = msg.body ? msg.body.trim() : ""
      const textL = text.toLowerCase()
      const session = SessionModel.get(number)

      const isMenuRequest =
        /^(menu|oi|olá|ola|oie|bom dia|boa tarde|boa noite|inicio|início|start|0)$/i.test(
          textL
        )

      if (isMenuRequest) {
        SessionModel.reset(number)
        await typing(chat)
        await this.client.sendMessage(number, BotView.mensagemBoasVindas())
        SessionModel.setStep(number, "menu")
        return
      }

      // Tenta processar pelo BookingController primeiro se estiver em um fluxo de agendamento
      const handledByBooking = await this.bookingController.handle(
        number,
        text,
        session,
        chat
      )
      if (handledByBooking) return

      // Lógica do Menu Principal
      if (session.step === "menu" || session.step === "start") {
        switch (text) {
          case "1":
            SessionModel.setStep(number, "agendar_servico")
            await typing(chat)
            await this.client.sendMessage(number, BotView.menuServicos())
            break
          case "2":
            await typing(chat)
            await this.client.sendMessage(number, BotView.menuServicos())
            break
          case "3":
            await typing(chat)
            await this.client.sendMessage(
              number,
              "📞 *Atendimento Humano*\n\nUm de nossos atendentes vai entrar em contato em instantes.\n\nEnquanto isso, pode digitar *menu* para voltar ao início. 😊"
            )
            break
          case "4":
            await typing(chat)
            await this.client.sendMessage(
              number,
              BotView.localizacaoEHorarios()
            )
            break
          default:
            await typing(chat, 1000)
            await this.client.sendMessage(
              number,
              BotView.erroOpcaoInvalida() + "\n\n" + BotView.menuPrincipal()
            )
            SessionModel.setStep(number, "menu")
        }
        return
      }

      // Fallback se nada acima capturar
      await typing(chat, 1000)
      await this.client.sendMessage(number, BotView.mensagemBoasVindas())
      SessionModel.setStep(number, "menu")
    } catch (err) {
      console.error("❌ Erro no ChatController:", err)
    }
  }
}

module.exports = ChatController
