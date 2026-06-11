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

## 🤖 Uso Recomendado com Gemini CLI

Este projeto foi otimizado e corrigido utilizando o **Gemini CLI**. Para garantir que o ambiente de execução (navegador, dependências e cache) seja configurado corretamente de forma automatizada, recomenda-se o uso deste agente.

### Passo a passo para configuração correta:
1. **Instalação do Agente:** Certifique-se de ter o [Gemini CLI](https://github.com/google/gemini-cli) instalado em sua máquina.
2. **Setup Automatizado:** Ao abrir a pasta do projeto, você pode solicitar ao Gemini CLI:
   - *"Configure o ambiente e instale o navegador necessário para o bot."*
   - *"Corrija erros de sessão ou QR Code se o bot travar."*
3. **Manutenção Sugerida:** O agente foi instruído a limpar arquivos de trava (`SingletonLock`) e atualizar o cache do WhatsApp Web sempre que necessário para evitar interrupções.

## 📦 Como rodar (Manual)
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Instale o navegador Chrome para o Puppeteer (necessário para o WhatsApp Web):
   ```bash
   npx puppeteer browsers install chrome@146.0.7680.31
   ```
   *Nota: Caso ocorra erro de "manifest" ou versão, tente limpar o cache com `rm -rf .wwebjs_cache`.*

3. Inicie o bot:
   ```bash
   npm start
   ```
4. Escaneie o QR Code no terminal com seu WhatsApp.

## 📂 Estrutura de Pastas

- `src/bot/`: Core do chatbot (MVC).
- `src/shared/`: Funções utilitárias.
- `src/web/`: Landing Page e estilos.
- `assets/`: Recursos visuais do projeto.

---

_Desenvolvido para proporcionar a melhor experiência entre barbeiro e cliente._
