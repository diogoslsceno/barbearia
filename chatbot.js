// =====================================
// IMPORTAÇÕES
// =====================================
const qrcode  = require("qrcode-terminal")
const { Client, LocalAuth } = require("whatsapp-web.js")
const moment  = require("moment-timezone")

// =====================================
// CONFIGURAÇÃO DO CLIENTE
// =====================================
const client = new Client({
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

// =====================================
// QR CODE
// =====================================
client.on("qr", (qr) => {
  console.log("📲 Escaneie o QR Code abaixo com o WhatsApp:")
  qrcode.generate(qr, { small: true })
})

// =====================================
// CONECTADO
// =====================================
client.on("ready", () => {
  console.log("✅ WhatsApp conectado! Bot da Barber rodando.")
})

// =====================================
// DESCONEXÃO
// =====================================
client.on("disconnected", (reason) => {
  console.log("⚠️  Desconectado:", reason)
})

// =====================================
// INICIALIZA
// =====================================
client.initialize()

// =====================================
// HELPERS
// =====================================
const delay = (ms) => new Promise((res) => setTimeout(res, ms))

async function typing(chat, ms = 1800) {
  await chat.sendStateTyping()
  await delay(ms)
}

function saudacao() {
  const h = moment().tz("America/Sao_Paulo").hour()
  if (h >= 5  && h < 12) return "Bom dia"
  if (h >= 12 && h < 18) return "Boa tarde"
  return "Boa noite"
}

// =====================================
// CARDÁPIO DE SERVIÇOS
// =====================================
const SERVICOS = {
  "1": { nome: "Corte Normal",    preco: "R$ 45,00",  duracao: "30 min" },
  "2": { nome: "Barba Completa",     preco: "R$ 35,00",  duracao: "25 min" },
  "3": { nome: "Corte 3 Barba",      preco: "R$ 85,00",  duracao: "50 min" },
}

// =====================================
// BARBEIROS DISPONÍVEIS
// =====================================
const BARBEIROS = {
  "1": "Carlos",
  "2": "Tiago",
  "3": "Matheus",
}

// =====================================
// HORÁRIOS DISPONÍVEIS
// =====================================
const HORARIOS = ["09:00","10:00","11:00","13:00","14:00","15:00","16:00","17:00","18:00"]

// =====================================
// ESTADO POR CLIENTE
// =====================================
// sessao[numero] = { etapa, dados }
const sessao = {}

function getSessao(numero) {
  if (!sessao[numero]) {
    sessao[numero] = { etapa: "inicio", dados: {} }
  }
  return sessao[numero]
}

function resetSessao(numero) {
  sessao[numero] = { etapa: "inicio", dados: {} }
}

// =====================================
// MENUS
// =====================================
function menuPrincipal() {
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

function menuServicos() {
  let txt = "━━━━━━━━━━━━━━━━━━━━━━\n✂️  *Nossos Serviços*\n━━━━━━━━━━━━━━━━━━━━━━\n\n"
  for (const [k, s] of Object.entries(SERVICOS)) {
    txt += `${k}️⃣  *${s.nome}*\n    💰 ${s.preco}  |  ⏱ ${s.duracao}\n\n`
  }
  txt += "_Digite o número para agendar ou *menu* para voltar._"
  return txt
}

function menuBarbeiros() {
  let txt = "━━━━━━━━━━━━━━━━━━━━━━\n💈  *Escolha o Barbeiro*\n━━━━━━━━━━━━━━━━━━━━━━\n\n"
  for (const [k, nome] of Object.entries(BARBEIROS)) {
    txt += `${k}️⃣  ${nome}\n`
  }
  txt += "\n_Digite o número do barbeiro._"
  return txt
}

function menuHorarios() {
  let txt = "━━━━━━━━━━━━━━━━━━━━━━\n🕐  *Horários Disponíveis*\n━━━━━━━━━━━━━━━━━━━━━━\n\n"
  HORARIOS.forEach((h, i) => {
    txt += `${i + 1}️⃣  ${h}\n`
  })
  txt += "\n_Digite o número do horário desejado._"
  return txt
}

function resumoAgendamento(dados) {
  return (
    "━━━━━━━━━━━━━━━━━━━━━━\n" +
    "✅  *Confirmar Agendamento*\n" +
    "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
    `✂️  Serviço:   *${dados.servico.nome}*\n` +
    `💈  Barbeiro:  *${dados.barbeiro}*\n` +
    `🗓  Data:      *${dados.data}*\n` +
    `🕐  Horário:   *${dados.horario}*\n` +
    `💰  Valor:     *${dados.servico.preco}*\n\n` +
    "Digite *1* para confirmar ou *2* para cancelar."
  )
}

// =====================================
// FUNIL DE MENSAGENS
// =====================================
client.on("message", async (msg) => {
  try {
    // Ignora grupos
    if (!msg.from || msg.from.endsWith("@g.us")) return
    const chat = await msg.getChat()
    if (chat.isGroup) return

    const numero = msg.from
    const texto  = msg.body ? msg.body.trim() : ""
    const textoL = texto.toLowerCase()
    const s      = getSessao(numero)

    // Palavras que resetam para o menu
    const isMenu = /^(menu|oi|olá|ola|oie|bom dia|boa tarde|boa noite|inicio|início|start|0)$/i.test(textoL)

    if (isMenu) {
      resetSessao(numero)
      await typing(chat)
      await client.sendMessage(numero, `${saudacao()}! 👋 Bem-vindo à *Barber*.\n\n${menuPrincipal()}`)
      getSessao(numero).etapa = "menu"
      return
    }

    // ── ETAPA: menu principal ────────────────────────────
    if (s.etapa === "menu" || s.etapa === "inicio") {

      if (texto === "1") {
        s.etapa = "agendar_servico"
        await typing(chat)
        await client.sendMessage(numero, menuServicos())
        return
      }

      if (texto === "2") {
        await typing(chat)
        await client.sendMessage(numero, menuServicos())
        return
      }

      if (texto === "3") {
        await typing(chat)
        await client.sendMessage(
          numero,
          "📞 *Atendimento Humano*\n\nUm de nossos atendentes vai entrar em contato em instantes.\n\nEnquanto isso, pode digitar *menu* para voltar ao início. 😊"
        )
        return
      }

      if (texto === "4") {
        await typing(chat)
        await client.sendMessage(
          numero,
          "📍 *Localização & Horários*\n\n" +
          "🗺  Rua das Tesouras, 123 — Centro\n\n" +
          "🕐 *Seg a Sex:* 09:00 às 19:00\n" +
          "🕐 *Sábado:*    09:00 às 17:00\n" +
          "❌ *Domingo:*   Fechado\n\n" +
          "_Digite *menu* para voltar._"
        )
        return
      }

      // Entrada inválida no menu
      await typing(chat, 1000)
      await client.sendMessage(numero, "Por favor, escolha uma das opções:\n\n" + menuPrincipal())
      s.etapa = "menu"
      return
    }

    // ── ETAPA: escolha do serviço ────────────────────────
    if (s.etapa === "agendar_servico") {
      if (SERVICOS[texto]) {
        s.dados.servico = SERVICOS[texto]
        s.etapa = "agendar_barbeiro"
        await typing(chat)
        await client.sendMessage(numero, menuBarbeiros())
        return
      }
      await typing(chat, 1000)
      await client.sendMessage(numero, "Opção inválida. " + menuServicos())
      return
    }

    // ── ETAPA: escolha do barbeiro ───────────────────────
    if (s.etapa === "agendar_barbeiro") {
      if (BARBEIROS[texto]) {
        s.dados.barbeiro = BARBEIROS[texto]
        s.etapa = "agendar_data"
        await typing(chat)
        await client.sendMessage(
          numero,
          "🗓  *Qual a data desejada?*\n\nDigite no formato *DD/MM/YYYY*\nEx: _25/06/2025_"
        )
        return
      }
      await typing(chat, 1000)
      await client.sendMessage(numero, "Barbeiro inválido. " + menuBarbeiros())
      return
    }

    // ── ETAPA: data ──────────────────────────────────────
    if (s.etapa === "agendar_data") {
      const dataRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
      if (dataRegex.test(texto)) {
        const [, dd, mm, yyyy] = texto.match(dataRegex)
        const data = moment(`${yyyy}-${mm}-${dd}`, "YYYY-MM-DD", true)
        if (!data.isValid() || data.isBefore(moment(), "day")) {
          await typing(chat, 1000)
          await client.sendMessage(numero, "⚠️  Data inválida ou passada. Digite uma data futura no formato *DD/MM/YYYY*.")
          return
        }
        if (data.day() === 0) {
          await typing(chat, 1000)
          await client.sendMessage(numero, "⚠️  Não abrimos aos domingos. Escolha outro dia. 😊")
          return
        }
        s.dados.data = texto
        s.etapa = "agendar_horario"
        await typing(chat)
        await client.sendMessage(numero, menuHorarios())
        return
      }
      await typing(chat, 1000)
      await client.sendMessage(numero, "⚠️  Formato inválido. Digite a data assim: *DD/MM/YYYY*\nEx: _25/06/2025_")
      return
    }

    // ── ETAPA: horário ───────────────────────────────────
    if (s.etapa === "agendar_horario") {
      const idx = parseInt(texto) - 1
      if (!isNaN(idx) && HORARIOS[idx]) {
        s.dados.horario = HORARIOS[idx]
        s.etapa = "agendar_confirmacao"
        await typing(chat)
        await client.sendMessage(numero, resumoAgendamento(s.dados))
        return
      }
      await typing(chat, 1000)
      await client.sendMessage(numero, "⚠️  Opção inválida. " + menuHorarios())
      return
    }

    // ── ETAPA: confirmação ───────────────────────────────
    if (s.etapa === "agendar_confirmacao") {
      if (texto === "1") {
        await typing(chat, 2000)
        await client.sendMessage(
          numero,
          "✅  *Agendamento confirmado!*\n\n" +
          `✂️  ${s.dados.servico.nome}\n` +
          `💈  ${s.dados.barbeiro}\n` +
          `🗓  ${s.dados.data} às ${s.dados.horario}\n\n` +
          "Te esperamos! Qualquer dúvida é só chamar. ✂️\n\n" +
          "_Digite *menu* para voltar ao início._"
        )
        resetSessao(numero)
        return
      }

      if (texto === "2") {
        resetSessao(numero)
        await typing(chat, 1000)
        await client.sendMessage(numero, "❌ Agendamento cancelado.\n\n" + menuPrincipal())
        getSessao(numero).etapa = "menu"
        return
      }

      await typing(chat, 1000)
      await client.sendMessage(numero, "Digite *1* para confirmar ou *2* para cancelar.")
      return
    }

    // ── Fallback ─────────────────────────────────────────
    await typing(chat, 1000)
    await client.sendMessage(numero, `${saudacao()}! 👋\n\n${menuPrincipal()}`)
    s.etapa = "menu"

  } catch (err) {
    console.error("❌ Erro:", err)
  }
})
