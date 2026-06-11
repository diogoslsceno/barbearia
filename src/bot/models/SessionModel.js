class SessionModel {
    constructor() {
        this.sessions = {};
    }

    get(number) {
        if (!this.sessions[number]) {
            this.reset(number);
        }
        return this.sessions[number];
    }

    reset(number) {
        this.sessions[number] = {
            step: "start",
            data: {
                service: null,
                barber: null,
                date: null,
                time: null
            }
        };
    }

    setStep(number, step) {
        const session = this.get(number);
        session.step = step;
    }

    setData(number, key, value) {
        const session = this.get(number);
        session.data[key] = value;
    }
}

module.exports = new SessionModel();
