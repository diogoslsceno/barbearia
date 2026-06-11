class DataModel {
    static get SERVICOS() {
        return {
            "1": { nome: "Corte Normal", preco: "R$ 45,00", duracao: "30 min" },
            "2": { nome: "Barba Completa", preco: "R$ 35,00", duracao: "25 min" },
            "3": { nome: "Corte e Barba", preco: "R$ 85,00", duracao: "50 min" },
        };
    }

    static get BARBEIROS() {
        return {
            "1": "Carlos",
            "2": "Tiago",
            "3": "Matheus",
        };
    }

    static get HORARIOS() {
        return ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    }

    static get LOCALIZACAO() {
        return {
            endereco: "Rua das Tesouras, 123 — Centro",
            horarios: [
                "🕐 *Seg a Sex:* 09:00 às 19:00",
                "🕐 *Sábado:*    09:00 às 17:00",
                "❌ *Domingo:*   Fechado"
            ]
        };
    }
}

module.exports = DataModel;
