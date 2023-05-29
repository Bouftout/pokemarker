// route.js - route module.

const express = require("express"),
    control = express.Router(),
    validator = require('validator'),
    connection = require('../connectdb.js').db;


// Pokemon socket.io
const io = require("socket.io")(server);

// server-side
io.on("connection", (socket) => {
    // console.log("Connection:" + socket.id); // x8WIv7-mJelg7on_ALbx


    //Des que tu est connecter il va executer ce qu'il a dedans :
    socket.conn.on("upgrade", () => {
        const upgradedTransport = socket.conn.transport.name;
        console.log("Connection socket.js upgrade : " + upgradedTransport) // ws
    });


    //Connection :
    socket.on("connectpoke", async (room) => {

        try {
            const clients = io.sockets.adapter.rooms.get(`pokeroom${room}`);
            const numClients = clients ? clients.size : 0;
            console.log(numClients)
            console.log('[socket]', 'join room :', `pokeroom${room}`)
            socket.join(`pokeroom${room}`);
            io.to(`pokeroom${room}`).emit('newplayer', `pokeroom${room}`, Number(numClients) + 1);

        } catch (e) {
            console.log('[error]', 'join room :', e);
            socket.emit('error', 'couldnt perform requested action');
        }

    });


    //Deconnection :
    socket.on("disconnect", async () => {
        console.log("Une personne s'est déconnecter")
    });

    socket.on('disconnecting', function () {

        //Deconnection
        console.log('[socket]', 'leave room !', socket.rooms);
        socket.rooms = null;
    });


    socket.on("sendpoke", async (room, namepoke) => {
        console.log('[socket]', 'leave room :', room);
        await socket.to(`pokeroom${room}`).emit(`recevoirpoke`, namepoke);
        // await io.emit(`recevoirpoke`, namepoke);

    })

    socket.on("foisdeuxserv", async (room, atk) => {

        // await io.to(`pokeroom${room}`).emit(`foisdeux`, atk);


    })


    socket.on("winner", async (pvwinner, vainqueur, perdant, p1pokename, p2pokename) => {


       
            console.log('[socket]', 'winner :');
            console.log(pvwinner + vainqueur + perdant + p1pokename + p2pokename + "\n")

            connection.query(`INSERT INTO \`combat\` (id_pokemon_p1_combat,id_pokemon_p2_combat,pvrestant,id_vainqueur,id_perdant) VALUES ((SELECT id FROM pokemon where surnom = ?),(SELECT id FROM pokemon where surnom = ?),?,(SELECT id FROM accounts WHERE username = ?),(SELECT id FROM accounts WHERE username = ?))`, [p1pokename, p2pokename, pvwinner, vainqueur, perdant], function (err, results, fields) {
                // If there is an issue with the query, output the error
                if (err) return console.log(err);


            });
        

        

    })



});


module.exports = control;