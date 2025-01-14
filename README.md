# freelancer-service-manager-api
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

Este projeto consiste em 1 de 3 módulos de um sistema para agendamentos de trabalhos oferecidos por prestadores de serviço autônomos. Este módulo é responsável por encapsular todas as regras de negócio, garantir a correta manipulação do banco de dados e interagir com os módulos [web](https://github.com/zzdiniz/freelancer-service-manager-web) e [chatbot](https://github.com/zzdiniz/freelancer-service-manager-bot).

O sistema desenvolvido como uma API REST estruturada em 19 endpoints, agrupados
de acordo com diferentes funcionalidades de modo que, cada caso de uso no sistema requer o
uso de um ou mais endpoints. Sendo assim, pode-se classificar os endpoints desenvolvidos da
seguinte forma:

- **Endpoints relacionados ao agendamento:** permitem adicionar novos agendamentos,
recuperar datas disponíveis e alterar o status dos agendamentos.
- **Endpoints relacionados ao bot:** facilitam a criação de bots, além de possibilitar a recuperação de bots por identificador ou nome de usuário.
- **Endpoints relacionados ao cliente:** abrangem funcionalidades como a adição de novos clientes e a criação, atualização e recuperação do estado da conversa.
- **Endpoints relacionados ao prestador de serviços:** permitem adicionar prestadores
ao sistema, realizar login e enviar notificações ou mensagens.
- **Endpoints relacionados ao serviço:** possibilitam a adição e a recuperação de serviços
oferecidos pelos prestadores.
## Desafios
Um dos maiores desafios do módulo de negócio foi a implementação da rota para cadastro
automatizado de bots. O fluxo tradicional para criar um novo bot no Telegram envolve a interação do usuário com o Botfather, um bot do Telegram onde comandos específicos precisam
ser executados para gerar uma chave de acesso. Contudo, para simplificar esse processo e
evitar que o prestador de serviços precisasse sair da plataforma ou executar ações manuais
complexas, foi necessário desenvolver uma solução automatizada.

Sendo assim, a abordagem escolhida foi o desenvolvimento de uma rota que realizasse
webscraping no site do Telegram, automatizando a criação do bot. O webscraping é uma técnica
utilizada para extrair dados de sites por meio de scripts ou bots, que acessam as páginas e
capturam informações. No contexto do projeto, foi desenvolvido um script que automatizou a
interação com o Telegram, preenchendo os dados necessários e gerando a chave de acesso do
bot sem que o prestador precisasse realizar ações manuais.
## Tecnologias utilizadas
- Typescript
- NodeJS
- ExpressJS
- MySQL
