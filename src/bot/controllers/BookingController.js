const moment = require("moment-timezone")
const DataModel = require("../models/DataModel")
const BotView = require("../views/BotView")
const SessionModel = require("../models/SessionModel")
const { typing } = require("../../shared/utils")

class BookingController {
  constructor(client) {
    this.client = client
  }

  async handle(number, text, session, chat) {
    const step = session.step

    switch (step) {
      case "agendar_servico":
        return this.handleService(number, text, chat)
      case "agendar_barbeiro":
        return this.handleBarber(number, text, chat)
      case "agendar_data":
        return this.handleDate(number, text, chat)
      case "agendar_horario":
        return this.handleTime(number, text, chat)
      case "agendar_confirmacao":
        return this.handleConfirmation(number, text, chat)
      default:
        return false
    }
  }

  async handleService(number, text, chat) {
    if (DataModel.SERVICOS[text]) {
      SessionModel.setData(number, "service", DataModel.SERVICOS[text])
      SessionModel.setStep(number, "agendar_barbeiro")
      await typing(chat)
      await this.client.sendMessage(number, BotView.menuBarbeiros())
      return true
    }
    await typing(chat, 1000)
    await this.client.sendMessage(
      number,
      BotView.erroOpcaoInvalida() + "\n\n" + BotView.menuServicos()
    )
    return true
  }

  async handleBarber(number, text, chat) {
    if (DataModel.BARBEIROS[text]) {
      SessionModel.setData(number, "barber", DataModel.BARBEIROS[text])
      SessionModel.setStep(number, "agendar_data")
      await typing(chat)
      await this.client.sendMessage(
        number,
        "🗓  *Qual a data desejada?*\n\nDigite no formato *DD/MM/YYYY*\nEx: _25/06/2026_"
      )
      return true
    }
    await typing(chat, 1000)
    await this.client.sendMessage(
      number,
      BotView.erroOpcaoInvalida() + "\n\n" + BotView.menuBarbeiros()
    )
    return true
  }

  async handleDate(number, text, chat) {
    const dataRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    if (dataRegex.test(text)) {
      const [, dd, mm, yyyy] = text.match(dataRegex)
      const data = moment(`${yyyy}-${mm}-${dd}`, "YYYY-MM-DD", true)

      if (!data.isValid() || data.isBefore(moment(), "day")) {
        await typing(chat, 1000)
        await this.client.sendMessage(
          number,
          "⚠️  Data inválida ou passada. Digite uma data futura no formato *DD/MM/YYYY*."
        )
        return true
      }
      if (data.day() === 0) {
        await typing(chat, 1000)
        await this.client.sendMessage(
          number,
          "⚠️  Não abrimos aos domingos. Escolha outro dia. 😊"
        )
        return true
      }

      SessionModel.setData(number, "date", text)
      SessionModel.setStep(number, "agendar_horario")
      await typing(chat)
      await this.client.sendMessage(number, BotView.menuHorarios())
      return true
    }
    await typing(chat, 1000)
    await this.client.sendMessage(
      number,
      "⚠️  Formato inválido. Digite a data assim: *DD/MM/YYYY*\nEx: _25/06/2026_"
    )
    return true
  }

  async handleTime(number, text, chat) {
    const idx = parseInt(text) - 1
    const horarios = DataModel.HORARIOS
    if (!isNaN(idx) && horarios[idx]) {
      SessionModel.setData(number, "time", horarios[idx])
      SessionModel.setStep(number, "agendar_confirmacao")
      await typing(chat)
      await this.client.sendMessage(
        number,
        BotView.resumoAgendamento(SessionModel.get(number).data)
      )
      return true
    }
    await typing(chat, 1000)
    await this.client.sendMessage(
      number,
      BotView.erroOpcaoInvalida() + "\n\n" + BotView.menuHorarios()
    )
    return true
  }

  async handleConfirmation(number, text, chat) {
    if (text === "1") {
      const data = SessionModel.get(number).data
      await typing(chat, 2000)
      await this.client.sendMessage(
        number,
        "✅  *Agendamento confirmado!*\n\n" +
          `✂️  ${data.service.nome}\n` +
          `💈  ${data.barber}\n` +
          `🗓  ${data.date} às ${data.time}\n\n` +
          "Te esperamos! Qualquer dúvida é só chamar. ✂️\n\n" +
          "_Digite *menu* para voltar ao início._"
      )
      SessionModel.reset(number)
      return true
    }

    if (text === "2") {
      SessionModel.reset(number)
      await typing(chat, 1000)
      await this.client.sendMessage(
        number,
        "❌ Agendamento cancelado.\n\n" + BotView.menuPrincipal()
      )
      SessionModel.setStep(number, "menu")
      return true
    }

    await typing(chat, 1000)
    await this.client.sendMessage(
      number,
      "Digite *1* para confirmar ou *2* para cancelar."
    )
    return true
  }
}

module.exports = BookingController
