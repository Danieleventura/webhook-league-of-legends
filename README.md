# Webhook League of Legends

<img src="/img/exemplo1.jpeg" width="400" height="790">  <img src="/img/exemplo1.jpeg" width="400" height="790">

1 - Necessário hospedar o webhook 

    - Utilizei o glitch para hospedar - https://bot-league-of-legends.glitch.me

![nome do print](/img/glitch.png)

2 - Criar o bot na api do whatsapp 
    
    - https://developers.facebook.com/

3 - Gerar um token

4 - Informar o número para receber e enviar as mensagens

5 - Configurar o webhook na seção Configuração (enviar o token gerado por o desenvolvedor)

![nome do print](/img/webhook.png)

6 - Criar os modelos de mensagens em 
    
    - https://business.facebook.com/wa/manage/home/?business_id=474213014590764&waba_id=101788886034499

    - lol_ranked1 - Portuguese (BR)
![nome do print](/img/lol_ranked1.png)


    - lol_ranked2 - Portuguese (BR)
![nome do print](/img/lol_ranked2.png)

7 - Testar a aplicação no whatsapp

    - O bot ainda não inicia a conversa

    - Informar o nome do jogador na conversa do whatsapp do seu número teste

    - O bot retornara as informações se encontrar o jogador


# Variaveis de Ambiente (.env)

TOKEN_WHATS=  token gerado pela api do wahtsapp

MY_TOKEN= token gerado pelo desenvolvedor (será necessário informá-lo no passo 5)

LOL_KEY= key da api do league of legends 

    - https://developer.riotgames.com/

LOL_URL= https://br1.api.riotgames.com

LOL_ICONS=  https://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon

LOL_MAESTERY= https://br1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner#
