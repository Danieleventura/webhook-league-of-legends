"use strict";


const token = process.env.TOKEN_WHATS;

// Imports dependencies and set up http server
const express = require("express"),
  body_parser = require("body-parser"),
  axios = require("axios").default,
  cors = require("cors"),
  app = express().use(body_parser.json()); // creates express http server

require("dotenv").config()
const champions = require('./champions.json');

app.listen(process.env.PORT|| 3000 , () => console.log("webhook is listening"));
app.use(cors());
// Accepts POST requests at /webhook endpoint
app.post("/webhook", async (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  let find = false
  // Check the Incoming webhook message
  console.log(JSON.stringify(req.body, null, 2));

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
      const  summonerName  = req.body.entry[0].changes[0].value.messages[0].text.body;
      let id,name,iconUrl, profileIconId,summonerLevel,tier, rank, wins, losses, queueType, tier2, rank2, wins2, losses2, queueType2 ;
      let championId1 = '--';
      let championId2 = '--'; 
      let championId3 = '--'; 
      let championLevel1 = '--'; 
      let championLevel2 = '--';
      let championLevel3 = '--'; 
      let championPoints1 = '--';
      let championPoints2 = '--'; 
      let championPoints3 = '--'; 
      let nameChampion2 = '--'; 
      let nameChampion1 = '--'; 
      let nameChampion3 = '--'; 
      
      await axios.get(
        `${process.env.LOL_URL}/lol/summoner/v4/summoners/by-name/${encodeURI(summonerName)}`,
        { headers: { "X-Riot-Token": process.env.LOL_KEY } }
      ).then((response) => {
        console.log("REQUEST FEITA PARA LOL - BUSCA JOGADOR");
        console.log(JSON.stringify(response.data, null, 2));
        id = response.data.id;
        profileIconId = response.data.profileIconId;
        summonerLevel  = response.data.summonerLevel;
        name  = response.data.name;
        find = true;
      }).catch((error) => {
        find = false;
        console.log(error); 
      });
      
      await axios.get(`${process.env.LOL_URL}/lol/league/v4/entries/by-summoner/${id}`, {
        headers: { "X-Riot-Token": process.env.LOL_KEY },
      }).then((response) => {
        console.log("REQUEST FEITA PARA LOL - BUSCA RANKED");
        console.log(JSON.stringify(response.data, null, 2));
        tier = response.data[0].tier;
        rank = response.data[0].rank;
        wins = response.data[0].wins;
        losses  = response.data[0].losses;
        if(response.data[0].queueType==='RANKED_SOLO_5x5'){
          queueType  = 'Ranqueado Solo';
        }else{
          queueType  = 'Ranqueado Flex';
        }
        
        if(response.data[1]!=null){
          tier2 = response.data[1].tier;
          rank2 = response.data[1].rank;
          wins2 = response.data[1].wins;
          losses2  = response.data[1].losses;
          if(response.data[1].queueType==='RANKED_SOLO_5x5'){
            queueType2  = 'Ranqueado Solo';
          }else{
            queueType2  = 'Ranqueado Flex';
          }
        }
        find= true; 
      }).catch((error) => {
        find = false;
        console.log(error); 
      });

      await axios.get(`${process.env.LOL_MAESTERY}/${id}/top?count=3`, {
        headers: { "X-Riot-Token": process.env.LOL_KEY },
      })
      .then((response) => {
        console.log("REQUEST FEITA PARA LOL MAESTRY - BUSCA MAESTRIA CAMPEOES");
        championId1 = response.data[0].championId;
        championLevel1 = response.data[0].championLevel;
        championPoints1 = response.data[0].championPoints;
        champions.forEach((element) => {
          console.log(element);
          if(element.key === championId1.toString()){
            nameChampion1 = element.name;
          }
        });
        if(response.data[1]!=null){
          championId2 = response.data[1].championId;
          championLevel2 = response.data[1].championLevel;
          championPoints2 = response.data[1].championPoints;
          champions.forEach((element) => {
            if(element.key === championId2.toString()){
              nameChampion2 = element.name;
            }
          });
        }
        if(response.data[2]!=null){
          championId3 = response.data[2].championId;
          championLevel3 = response.data[2].championLevel;
          championPoints3 = response.data[2].championPoints;
          champions.forEach((element) => {
            if(element.key === championId3.toString()){
              nameChampion3 = element.name;
            }
          });
        }
      }).catch((error) => {
        iconUrl = "https://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/0.png";
        console.log(error);  
      });

      await axios.get(`${process.env.LOL_ICONS}/${profileIconId}.png`)
      .then((response) => {
        console.log("REQUEST FEITA PARA LOL ICON - BUSCA ICON");
        iconUrl= `${process.env.LOL_ICONS}/${profileIconId}.png`;
        console.log("URL ICON: " + iconUrl);
      }).catch((error) => {
        iconUrl = "https://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/0.png";
        console.log(error);  
      });

      if(find === true){
        if(queueType2!= null){
          await axios({
            method: "POST", // Required, HTTP method, a string, e.g. POST, GET
            url:
              "https://graph.facebook.com/v14.0/" +
              phone_number_id +
              "/messages?access_token=" +
              token,
            data: {
              messaging_product: "whatsapp",
              to: from,
              recipient_type: "individual",
              type: "template",
              template: {
                  name: "lol_ranked2",
                  language: {
                    code: "pt_BR"
                  },
                  components: [
                      {
                          type: "header",
                          parameters: [
                              {
                                  type: "image",
                                  image: {
                                    link: iconUrl
                                  }
                              }
                          ]
                      },
                      {
                          type: "body",
                          parameters: [
                            {
                              type: "text",
                              text: name
                            },
                            {
                                type: "text",
                                text:  summonerLevel
                            },
                            {
                              type: "text",
                              text:  queueType
                            },
                            {
                              type: "text",
                              text:  tier  + " " + rank
                            },
                            {
                              type: "text",
                              text:  wins
                            },
                            {
                              type: "text",
                              text:  losses
                            },
                            {
                              type: "text",
                              text:  ((wins / (wins + losses)) * 100).toFixed(1)
                            },
                            {
                              type: "text",
                              text:  queueType2
                            },
                            {
                              type: "text",
                              text:  tier2  + " " + rank2
                            },
                            {
                              type: "text",
                              text:  wins2
                            },
                            {
                              type: "text",
                              text:  losses2
                            },
                            {
                              type: "text",
                              text:  ((wins2 / (wins2 + losses2)) * 100).toFixed(1)
                            },
                            {
                              type: "text",
                              text:  nameChampion1
                            },
                            {
                              type: "text",
                              text:  championLevel1
                            },
                            {
                              type: "text",
                              text:  championPoints1
                            }
                            ,
                            {
                              type: "text",
                              text:  nameChampion2
                            },
                            {
                              type: "text",
                              text:  championLevel2
                            },
                            {
                              type: "text",
                              text:  championPoints2
                            },
                            {
                              type: "text",
                              text:  nameChampion3
                            },
                            {
                              type: "text",
                              text:  championLevel3
                            },
                            {
                              type: "text",
                              text:  championPoints3
                            }
                          ]
                      }
                  ]
              }
            },
            headers: { "Content-Type": "application/json" },
          }).then((response) => {
            console.log("MENSAGEM ENVIADA");
          }).catch((error) => {
            console.log(error); 
          });
        }else{
          await axios({
            method: "POST", // Required, HTTP method, a string, e.g. POST, GET
            url:
              "https://graph.facebook.com/v14.0/" +
              phone_number_id +
              "/messages?access_token=" +
              token,
            data: {
              messaging_product: "whatsapp",
              to: from,
              recipient_type: "individual",
              type: "template",
              template: {
                  name: "lol_ranked1",
                  language: {
                    code: "pt_BR"
                  },
                  components: [
                      {
                          type: "header",
                          parameters: [
                              {
                                  type: "image",
                                  image: {
                                    link: iconUrl
                                  }
                              }
                          ]
                      },
                      {
                          type: "body",
                          parameters: [
                            {
                              type: "text",
                              text: name
                            },
                            {
                                type: "text",
                                text:  summonerLevel
                            },
                            {
                              type: "text",
                              text:  queueType
                            },
                            {
                              type: "text",
                              text:  tier  + " " + rank
                            },
                            {
                              type: "text",
                              text:  wins
                            },
                            {
                              type: "text",
                              text:  losses
                            },
                            {
                              type: "text",
                              text:  ((wins / (wins + losses)) * 100).toFixed(1)
                            },
                            {
                              type: "text",
                              text:  nameChampion1
                            },
                            {
                              type: "text",
                              text:  championLevel1
                            },
                            {
                              type: "text",
                              text:  championPoints1
                            }
                            ,
                            {
                              type: "text",
                              text:  nameChampion2
                            },
                            {
                              type: "text",
                              text:  championLevel2
                            },
                            {
                              type: "text",
                              text:  championPoints2
                            },
                            {
                              type: "text",
                              text:  nameChampion3
                            },
                            {
                              type: "text",
                              text:  championLevel3
                            },
                            {
                              type: "text",
                              text:  championPoints3
                            }
                          ]
                      }
                  ]
              }
            },
            headers: { "Content-Type": "application/json" },
          }).then((response) => {
            console.log("MENSAGEM ENVIADA");
          }).catch((error) => {
            console.log(error.response.data);  
            console.log(error.response.status);  
            console.log(error.response.headers); 
          });
        }
      } else{
        await axios({
          method: "POST", // Required, HTTP method, a string, e.g. POST, GET
          url:
            "https://graph.facebook.com/v14.0/" +
            phone_number_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            text: { body: "Erro ao buscar o jogador " + msg_body + "! " + "Tente novamente. 🙂🙃" },
          },
          headers: { "Content-Type": "application/json" },
        }).then((response) => {
          console.log("MENSAGEM ENVIADA");
        }).catch((error) => {
          console.log(error.response.data);  
          console.log(error.response.status);  
          console.log(error.response.headers); 
        });
      }
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests 
app.get("/webhook", (req, res) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
  **/
  const verify_token = process.env.MY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

app.get("/",(req,res)=>{
    res.status(200).send("Hello! this is webhook setup - Daniele Ventura");
});