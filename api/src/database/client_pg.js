const { Client } = require("pg");
const debug = require("debug")("Database_Client");

const env = require(`../env/${process.env.NODE_ENV}`);
const client = new Client(`postgresql://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`);



if (process.env.NODE_ENV === 'pg_conf'){

    
    client.connect()
            .then(()=>{
                debug('Connexion DB postgres de dev OK');
            })
            .catch((err)=>{
                debug('Erreur connexion DB dev:', err);
            })

            
 }else {
            
            client.connect()
            .then(()=>{
                debug('Connexion DB prod OK');
            })
            .catch((err)=>{
                debug('Erreur connexion DB prod:', err);
            })
            
 }
    
 
 
 if (process.env.NODE_ENV === 'heroku'){
     
     
         const client = new Client({
             user :`${env.DB_USER}`,
             password:`${env.DB_PASS}`,
             host:`${env.DB_HOST}`,
    database:`${env.DB_NAME}`,
    port:5432,
    ssl: process.env.NODE_ENV === "production" 
      ? { rejectUnauthorized: true }
      : { rejectUnauthorized: false },
    });

    client.connect()
            .then(()=>{
                    debug('Connexion DB distante Heroku OK');
                })
                .catch((err)=>{
                    debug('Erreur connexion DB Heroku:', err);
            })


}



module.exports = client;