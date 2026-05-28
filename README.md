# Barber Bot — WhatsApp

## ⚠️ Requisito: Node.js 18 ou superior

### Atualizar Node.js no Linux (Ubuntu/Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version   # deve mostrar v18.x.x ou superior
```

---

## Instalação

```bash
# 1. Entre na pasta do projeto
cd barbearia

# 2. Apague a pasta node_modules antiga (versão incompatível)
rm -rf node_modules package-lock.json

# 3. Instale as dependências corretas
npm install

# 4. Rode o bot
node chatbot.js
```

---

## Como usar

1. Ao rodar `node chatbot.js`, um QR Code aparece no terminal.
2. Abra o WhatsApp no celular → Dispositivos Conectados → Conectar Dispositivo.
3. Escaneie o QR Code.
4. O bot já começa a responder automaticamente.
5. Pelo tempo curto, provavelmente ele não vai funcionar, então ele só está aí para constar no projeto.


---

## Fluxo do bot

Qualquer mensagem de saudação (`oi`, `olá`, `menu`, `bom dia`...) inicia o menu:

```
1 → Agendar horário
      → Escolhe o serviço
      → Escolhe o barbeiro
      → Digita a data (DD/MM/YYYY)
      → Escolhe o horário
      → Confirma o agendamento

2 → Ver serviços e preços
3 → Falar com atendente
4 → Localização e horários
```

---

## Personalizar

- **Serviços:** edite o objeto `SERVICOS` no `chatbot.js`
- **Barbeiros:** edite o objeto `BARBEIROS`
- **Horários:** edite o array `HORARIOS`
- **Endereço:** edite a opção `4` do menu principal
