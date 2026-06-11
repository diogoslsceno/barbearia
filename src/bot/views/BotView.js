const DataModel = require("../models/DataModel")
const { getSaudacao } = require("../../shared/utils")

class BotView {
  static menuPrincipal() {
    return (
      "━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✂️  *BARBER* — Menu Principal\n" +
      "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
      "1️⃣  Agendar horário\n" +
      "2️⃣  Ver serviços e preços\n" +
      "3️⃣  Falar com atendente\n" +
      "4️⃣  Localização e horários\n\n" +
      "_Digite o número da opção desejada._"
    )
  }

  static menuServicos() {
    let txt =
      "━━━━━━━━━━━━━━━━━━━━━━\n✂️  *Nossos Serviços*\n━━━━━━━━━━━━━━━━━━━━━━\n\n"
    for (const [k, s] of Object.entries(DataModel.SERVICOS)) {
      txt += `${k}️⃣  *${s.nome}*\n    💰 ${s.preco}  |  ⏱ ${s.duracao}\n\n`
    }
    txt += "_Digite o número para agendar ou *menu* para voltar._"
    return txt
  }

  static menuBarbeiros() {
    let txt =
      "━━━━━━━━━━━━━━━━━━━━━━\n💈  *Escolha o Barbeiro*\n━━━━━━━━━━━━━━━━━━━━━━\n\n"
    for (const [k, nome] of Object.entries(DataModel.BARBEIROS)) {
      txt += `${k}️⃣  ${nome}\n`
    }
    txt += "\n_Digite o número do barbeiro._"
    return txt
  }

  static menuHorarios() {
    let txt =
      "━━━━━━━━━━━━━━━━━━━━━━\n🕐  *Horários Disponíveis*\n━━━━━━━━━━━━━━━━━━━━━━\n\n"
    DataModel.HORARIOS.forEach((h, i) => {
      txt += `${i + 1}️⃣  ${h}\n`
    })
    txt += "\n_Digite o número do horário desejado._"
    return txt
  }

  static resumoAgendamento(data) {
    return (
      "━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✅  *Confirmar Agendamento*\n" +
      "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
      `✂️  Serviço:   *${data.service.nome}*\n` +
      `💈  Barbeiro:  *${data.barber}*\n` +
      `🗓  Data:      *${data.date}*\n` +
      `🕐  Horário:   *${data.time}*\n` +
      `💰  Valor:     *${data.service.preco}*\n\n` +
      "Digite *1* para confirmar ou *2* para cancelar."
    )
  }

  static mensagemBoasVindas() {
    return `${getSaudacao()}! 👋 Bem-vindo à *Barber*.\n\n${this.menuPrincipal()}`
  }

  static localizacaoEHorarios() {
    const loc = DataModel.LOCALIZACAO
    return (
      "📍 *Localização & Horários*\n\n" +
      `🗺  ${loc.endereco}\n\n` +
      loc.horarios.join("\n") +
      "\n\n_Digite *menu* para voltar._"
    )
  }

  static erroOpcaoInvalida() {
    return "⚠️ Opção inválida. Por favor, tente novamente ou digite *menu*."
  }
}

module.exports = BotView
