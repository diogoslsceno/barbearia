class SessionModel {
  constructor() {
    this.sessions = {}
    this.ttl = 30 * 60 * 1000 // 30 minutos em milissegundos

    // Limpeza periódica automática a cada 10 minutos
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanup(), 10 * 60 * 1000).unref()
    }
  }

  get(number) {
    const now = Date.now()
    if (!this.sessions[number]) {
      this.reset(number)
    } else {
      this.sessions[number].lastAccess = now
    }
    return this.sessions[number]
  }

  reset(number) {
    this.sessions[number] = {
      step: "start",
      lastAccess: Date.now(),
      data: {
        service: null,
        barber: null,
        date: null,
        time: null,
      },
    }
  }

  setStep(number, step) {
    const session = this.get(number)
    session.step = step
    session.lastAccess = Date.now()
  }

  setData(number, key, value) {
    const session = this.get(number)
    session.data[key] = value
    session.lastAccess = Date.now()
  }

  cleanup() {
    const now = Date.now()
    let count = 0
    for (const [number, session] of Object.entries(this.sessions)) {
      if (now - session.lastAccess > this.ttl) {
        delete this.sessions[number]
        count++
      }
    }
    if (count > 0) {
      console.log(`🧹 Limpeza de sessões concluída: ${count} sessão(ões) inativa(s) removida(s) da memória.`)
    }
  }
}

module.exports = new SessionModel()
