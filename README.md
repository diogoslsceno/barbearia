# ✂️ BarberBot - Sistema de Barbearia

Sistema profissional para barbearias com Landing Page moderna e Chatbot de agendamento automático via WhatsApp.

## 🏗️ Arquitetura MVC & POO
O projeto foi totalmente reestruturado seguindo o padrão **Model-View-Controller** e **Orientação a Objetos**, garantindo código limpo e fácil manutenção.

- **Models:** Gestão de dados (Serviços, Barbeiros) e controle de sessões de usuários.
- **Views:** Templates de mensagens e menus personalizados.
- **Controllers:** Lógica de roteamento de mensagens e funil de agendamento resiliente.

## 🚀 Funcionalidades
- ✅ Agendamento automático (Serviço > Barbeiro > Data > Horário).
- ✅ Validação de datas (impede agendamentos passados ou em dias fechados).
- ✅ Menu interativo com localização e serviços.
- ✅ Landing Page responsiva com animações AOS.
- ✅ Simulação de digitação humana no WhatsApp.

## 🛠️ Tecnologias
- **Backend:** Node.js, [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js).
- **Frontend:** HTML5, SCSS, JavaScript, AOS Library.
- **Auxiliares:** Moment.js para gestão de fusos e datas.

## 📦 Como rodar
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o bot:
   ```bash
   npm start
   ```
3. Escaneie o QR Code no terminal com seu WhatsApp.

## 📂 Estrutura de Pastas
- `src/bot/`: Core do chatbot (MVC).
- `src/shared/`: Funções utilitárias.
- `src/web/`: Landing Page e estilos.
- `assets/`: Recursos visuais do projeto.

---
*Desenvolvido para proporcionar a melhor experiência entre barbeiro e cliente.*
