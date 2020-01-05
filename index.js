const Discord = require('discord.js');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require("fs");

const prefix = "<"


const adapter = new FileSync('database.json');
const db = low(adapter);

db.defaults({ salon: [] }).write()

var bot = new Discord.Client();

bot.on('ready', () => {
    bot.user.setPresence({ game: { name: 'ta beauté', type: 3 } });
    bot.user.setStatus("idle");
    console.log("Bot Ready !");
})

bot.login(process.env.TOKEN);



bot.on('message', async message => {

    if (message.author.bot) return;



    // Vérification changement de nom d'un membre


    async function carré() {

        if (!db.get("salon").find({ idMember: message.member.id }).value()) {
            //var salondcreatedb = db.get("salon").find({ idMember: message.member.id }).value()
           // var salondcreate = Object.values(salondcreatedb);
           // db.get("salon").find({ idMember: message.member.id }).assign({ userTag: salon = msgauthortag, userNameServ: salon = msgauthor }).write();

        } else {

            var msgauthortag = message.member.user.tag;
            var salondcreatedb = db.get("salon").find({ idMember: message.member.id }).value()
            var salondcreate = Object.values(salondcreatedb);
            let server = message.member.guild;
            var msgauthor = message.member.user.username;

            if (msgauthortag != salondcreate[2] && message.member.id == salondcreate[0]) {

                var nameSalonEcrit = server.channels.find(channel => channel.name === `salon-de-${salondcreate[3]}`.toLowerCase())
                var nameSalonVocal = server.channels.find(channel => channel.name === `Salon-de-${salondcreate[3]}`)

              await  nameSalonEcrit.edit({
                    name: `salon-de-${msgauthor}`.toLowerCase()
                })
                await nameSalonVocal.edit({
                    name: `Salon-de-${msgauthor}`
                })

                 var roleami = server.roles.find(role => role.name === `Ami de ${salondcreate[2]}`)
                await  roleami.edit({
                    name: `Ami de ${msgauthortag}`
                })

                db.get("salon").find({ idMember: message.member.id }).assign({ userTag: salon = msgauthortag, userNameServ: salon = msgauthor }).write();
            }
        }
    }


    // Créer ses 2 salons privés


    if (message.content.startsWith(prefix + 'sal')) {

        let server = message.member.guild;
        var msgauthor = message.member.user.username;
        var msgauthortag = message.member.user.tag;
        //  let privateChannel = server.roles.find(role => role.id === "660599912987099208"); // serveur test
        let privateChannel = server.roles.find(role => role.id === "660856250279395329"); // serveur normal

        if (!db.get("salon").find({ idMember: message.member.id }).value()) {
            db.get("salon").push({
                idMember: salon = message.member.id,
                haveChannel: salon = "no",
                userTag: salon = msgauthortag,
                userNameServ: salon = msgauthor,
                delChannel: salon = "op",
                canJoin: salon = "no"
            }).write();
        }

        var salondcreatedb = db.get("salon").find({ idMember: message.member.id }).value()
        var salondcreate = Object.values(salondcreatedb);


        if (salondcreate[1] == "yes") {
            message.reply("Vous possédez déjà vos Salons privés !")
        }
        else {
            message.reply("Vos Salons ont été crées !")
            message.member.addRole(privateChannel);
            await server.createRole({
                name: `Ami de ${msgauthortag}`,
                color: 'RANDOM',
            })

            db.get("salon").find({ idMember: message.member.id }).assign({ haveChannel: salon = "yes" }).write();

            var roleami = server.roles.find(role => role.name === `Ami de ${msgauthortag}`)

            server.createChannel(`Salon-de-${msgauthor}`, 'text', [
                {
                    type: 'role',
                    id: server.defaultRole.id,
                    deny: ['VIEW_CHANNEL'],
                }
                ,
                {
                    type: 'role',
                    id: '660610618566377493',
                    allow: ['VIEW_CHANNEL'],
                }
            ]).then(c => {
                let category = server.channels.find(c => c.name == "XXX" && c.type == "category");
                c.setParent('660857172925874201');
                c.overwritePermissions(message.guild.id, {
                    VIEW_CHANNEL: false

                })

                c.overwritePermissions(message.author.id, {
                    VIEW_CHANNEL: true
                })

                c.overwritePermissions(roleami.id, {
                    VIEW_CHANNEL: true
                })
                var liste = new Discord.RichEmbed()

                .setColor("#FF0000")
                .setAuthor(`Bienvenue dans votre salon ${msgauthortag}`, message.author.avatarURL)
                .addField(`───────────────────`, `Dans votre salon, vous pouvez gérer plusieurs choses, voici la liste :\n
                **<perm** : Permet de gérer les permissions des membres dans votre salon\n
                **<add @pseudo** : Permet d'ajouter des membres à votre salon\n
                **<del @pseudo** : Permet de supprimer des membres à votre salon\n
                **<color** : Permet de changer la couleur du rôle des membres de votre salon\n
                **<amis** : Permet de voir la liste des membres qui ont accès à votre salon\n
                **<supp** : Permet de supprimer vos salons (une confirmation est demandée pour éviter une fausse manip)`)
                .addField(`───────────────────`, `Il y'a également des commandes qui n'impactent pas vos salons, voici la liste :\n
                **<leave @pseudo** : Permet de quitter la liste d'amis d'un membre\n
                **<liste @pseudo** : Permet de voir la liste d'amis d'un membre\n
                **<join @pseudo** : Permet d'avoir accès au salon d'un membre, à condition que ce membre ai configuré son salon ouvert à n'importe qui\n
                **<dispo @pseudo** : Permet de voir le nombre de salons encore disponibles`)

                c.send({ embed: liste }).then(c => {
                    c.pin()
                })
                
            })

            server.createChannel(`Salon-de-${msgauthor}`, 'voice', [
                {
                    type: 'role',
                    id: server.defaultRole.id,
                    deny: ['VIEW_CHANNEL']
                }
                ,
                {
                    type: 'role',
                    id: '660610618566377493',
                    allow: ['VIEW_CHANNEL'],
                }
            ]).then(m => {
                m.overwritePermissions(message.guild.id, {
                    VIEW_CHANNEL: false
                })

                m.overwritePermissions(message.author.id, {
                    VIEW_CHANNEL: true
                })

                m.overwritePermissions(roleami.id, {
                    VIEW_CHANNEL: true
                })
                m.setParent('660857172925874201');
            })
        }
    }


    // Modifier les permisions de ses salons


    if (message.content.startsWith(prefix + 'perm')) {

        carré();

        if (!db.get("salon").find({ idMember: message.member.id }).value()) {
            message.reply("Vous devez avoir vos salons privés avant de modifier les permissions")

        } else {

            var salondcreatedb = db.get("salon").find({ idMember: message.member.id }).value()
            var salondcreate = Object.values(salondcreatedb);
            const role = message.guild.roles.find('name', `Ami de ${salondcreate[2]}`);
            var nameSalonEcrit = message.guild.channels.find(channel => channel.name === `salon-de-${salondcreate[3]}`.toLowerCase())
            var nameSalonVocal = message.guild.channels.find(channel => channel.name === `Salon-de-${salondcreate[3]}`)

            let args = message.content.split(" ").slice(1);

            if (!role) return message.reply("Vous devez avoir vos salons privés avant de modifier les permissions");


            if (!args[0]) {
                var liste = new Discord.RichEmbed()

                .setColor("#FF0000")
                .setAuthor("Gérer les permissions de votre salon", message.author.avatarURL, msgauthor)
                //.setTitle(`Voici votre liste d'ami(s) ${msgauthortag} :`)
                .addField(`───────────────────`, `**Pour modifier les permissions de votre salon, vous devez entrer la commande comme ceci, avec le paramètre que vous souhaitez changer :**\n'<perm NomDeLaPerm true'\nPour activer la permission\n**OU**\n'<perm NomDeLaPerm false'\nPour désactiver la permission`)
                .addField(`───────────────────`, `Voici la liste des permissions, ainsi que leurs utilités :\n**img** : Permet d'envoyer des images\n**tts** : Permet d'envoyer un message de synthèse vocale\n**msg** : Permet d'envoyer des messages\n**everyone** : Permet de mentionner @everyone\n**reaction** : Permet d'ajouter des réactions aux messages\n**join** : Permet d'ouvrir son salon publiquement si quelqu'un souhaite le rejoindre`)
                .setFooter('Par défaut, toutes permissions sont activées, sauf pour la permission **"join"**')
                .setTimestamp()

            message.channel.send({ embed: liste })

            }

            if (args[0] == "img" && args[1] == "false") {

                message.reply("La permission a bien été modifée !")
                nameSalonEcrit.overwritePermissions(role, {
                    ATTACH_FILES: false
                })
            }
            if (args[0] == "img" && args[1] == "true") {

                message.reply("La permission a bien été modifée !")
                nameSalonEcrit.overwritePermissions(role, {
                    ATTACH_FILES: true
                })
            }

            if (args[0] == "tts" && args[1] == "false") {

                message.reply("La permission a bien été modifée !")
                nameSalonEcrit.overwritePermissions(role, {
                    SEND_TTS_MESSAGES: false
                })
            }
            if (args[0] == "tts" && args[1] == "true") {

                message.reply("La permission a bien été modifée !")
                nameSalonEcrit.overwritePermissions(role, {
                    SEND_TTS_MESSAGES: true
                })
            }

            if (args[0] == "msg" && args[1] == "false") {

                message.reply("La permission a bien été modifée !")
                nameSalonEcrit.overwritePermissions(role, {
                    SEND_MESSAGES: false
                })
            }
            if (args[0] == "msg" && args[1] == "true") {

                message.reply("La permission a bien été modifée !")
                nameSalonEcrit.overwritePermissions(role, {
                    SEND_MESSAGES: true
                })
            }

            if (args[0] == "everyone" && args[1] == "false") {

                message.reply("La permission a bien été modifée !")
                nameSalonEcrit.overwritePermissions(role, {
                    MENTION_EVERYONE: false
                })
            }

            if (args[0] == "everyone" && args[1] == "true") {

                message.reply("La permission a bien été modifée !")
                nameSalonEcrit.overwritePermissions(role, {
                    MENTION_EVERYONE: true
                })
            }

            if (args[0] == "reaction" && args[1] == "false") {

                message.reply("La permission a bien été modifée !")
                nameSalonEcrit.overwritePermissions(role, {
                    ADD_REACTIONS: false
                })
            }

            if (args[0] == "reaction" && args[1] == "true") {

                message.reply("La permission a bien été modifée !")
                nameSalonEcrit.overwritePermissions(role, {
                    ADD_REACTIONS: true
                })
            }
            if (args[0] == "join" && args[1] == "false") {

                message.reply("La permission a bien été modifée !")
                db.get("salon").find({ idMember: message.member.id }).assign({ canJoin: salon = "non" }).write();
            }

            if (args[0] == "join" && args[1] == "true") {

                message.reply("La permission a bien été modifée !")
                db.get("salon").find({ idMember: message.member.id }).assign({ canJoin: salon = "oui" }).write();
            }
        }
    }



    if (message.content.startsWith(prefix + 'color')) {

        carré();

        if (!db.get("salon").find({ idMember: message.member.id }).value()) {
            message.reply("Vous devez avoir vos salons privés avant de pouvoir modifier la couleur de votre Role d'ami.")

        } else {

            var salondcreatedb = db.get("salon").find({ idMember: message.member.id }).value()
            var salondcreate = Object.values(salondcreatedb);
            const role = message.guild.roles.find('name', `Ami de ${salondcreate[2]}`);
            let args = message.content.split(" ").slice(1);

            if (!role) return message.reply("Vous devez avoir vos salons privés avant de pouvoir modifier la couleur de votre Role d'ami.");

            if (!args[0]) {
                var liste = new Discord.RichEmbed()

                    .setColor("#FF0000")
                    .setAuthor("Changement de couleur de votre role", message.author.avatarURL, msgauthor)
                    //.setTitle(`Voici votre liste d'ami(s) ${msgauthortag} :`)
                    .addField(`───────────────────`, `Pour changer la couleur de votre role Ami, il y'a 2 solutions :\n-Indiquer le nom d'une couleur de base de discord en Anglais et en Majuscule\n-Choisir une couleur autre, avec un code HEX (exemple : #7EE0E7)`)
                    .addField(`───────────────────`, `Lien pour les couleurs HEX :\nhttps://htmlcolorcodes.com/fr/`)
                    .addField(`───────────────────`, `Exemples :\n<color PURPLE (met le role en VIOLET)\n<color #D1a2b3 (met le role en ROSE)\n<color RANDOM (met une couleur aléatoire)`)
                    .setTimestamp()

                message.channel.send({ embed: liste })
            } else {
                role.setColor(args[0])
            }

        }
    }
    // Ajouter un membre à sa liste d'amis


    if (message.content.startsWith(prefix + 'add')) {
        var memberMention = message.mentions.members.first();


        if (!db.get("salon").find({ idMember: message.member.id }).value()) {
            message.reply("Vous devez avoir vos salons privés avant d'ajouter quelqu'un en ami");
        } else {

            carré();

            var salondcreatedb = db.get("salon").find({ idMember: message.member.id }).value()
            var salondcreate = Object.values(salondcreatedb);
            const role = message.guild.roles.find('name', `Ami de ${salondcreate[2]}`);

            if (!message.mentions.users.size) {
                return message.reply("Vous devez mentionner un membre pour l'ajouter à votre liste d'amis.");
            }

            if (!role) return message.reply("Vous devez avoir vos salons privés avant d'ajouter quelqu'un en ami");

            var salondcreatedb = db.get("salon").find({ idMember: message.member.id }).value()
            var salondcreate = Object.values(salondcreatedb);
            var memberMention = message.mentions.members.first();

            if (memberMention.id == salondcreate[0]) {
                return message.reply("Vous ne pouvez pas vous ajouter vous même..")
            }

            if (memberMention.roles.has(role.id)) {
                message.reply("Ce membre est déjà votre ami !")
            } else {
                memberMention.addRole(role.id);
                message.reply("Vous avez ajouté " + memberMention + " a votre liste d'amis")
            }
        }
    }

    // Supprimer un membre de sa liste d'amis


    if (message.content.startsWith(prefix + 'del')) {
        const member = message.mentions.members.first();

    carré();

        if (!message.mentions.users.size) {
            return message.reply("Vous devez mentionner un membre pour le supprimer de votre liste d'amis");
        }

        if (!db.get("salon").find({ idMember: message.member.id }).value()) {
            message.reply("Vous devez avoir vos salons privés avant d'ajouter quelqu'un en ami")

        } else {

            var salondcreatedb = db.get("salon").find({ idMember: message.member.id }).value()
            var salondcreate = Object.values(salondcreatedb);
            const role = message.guild.roles.find('name', `Ami de ${salondcreate[2]}`);

            if (!role) {
                message.reply("Vous devez avoir vos salons privés avant de retirer quelqu'un de vos amis")
            } else {
                var salondcreatedb = db.get("salon").find({ idMember: message.member.id }).value()
                var salondcreate = Object.values(salondcreatedb);

                if (!member.roles.has(role.id)) {
                    message.reply("Ce membre n'est pas dans votre liste d'amis !")
                } else {
                    member.removeRole(role.id);
                    message.reply("Vous avez supprimé " + member + " de votre liste d'amis")
                }
            }
        }
    }

    //  Quitter la liste d'amis d'un membre


    if (message.content.startsWith(prefix + 'leave')) {
        const memberMention = message.mentions.members.first();

        carré();

        if (!message.mentions.users.size) {
            return message.reply("Vous devez mentionner un membre pour quitter sa liste d'amis");
        }

        if (!db.get("salon").find({ idMember: memberMention.id }).value()) {
            return message.reply("Vous ne pouvez pas quitter sa liste d'amis si il ne vous a pas ajouté.")
        } else {
            var salondcreatedb = db.get("salon").find({ idMember: memberMention.id }).value()
            var salondcreate = Object.values(salondcreatedb);
            const role = message.guild.roles.find('name', `Ami de ${salondcreate[2]}`);

            if (!role) {
                message.reply("Vous ne pouvez pas quitter son salon si il ne vous a pas ajouté.")
            } else {
                if (!message.member.roles.has(role.id)) {
                    message.reply("Vous ne pouvez pas quitter sa liste d'amis si il ne vous a pas ajouté.")
                } else {
                    message.member.removeRole(role.id);
                    message.reply("Vous avez quitté la liste d'amis de " + memberMention)
                }
            }
        }
    }

    // Voir sa liste d'amis


    if (message.content.startsWith(prefix + 'amis')) {
        var msgauthortag = message.member.user.tag;
        var guildid = message.member.guild.id
        var salondcreatedb = db.get("salon").find({ idMember: message.member.id }).value()
        var salondcreate = Object.values(salondcreatedb);
        const role = message.guild.roles.find('name', `Ami de ${salondcreate[2]}`);

        carré();

        if (!role) {
            message.reply("Vous devez avoir vos salons privés avant d'avoir des amis")
        } else {
            let memberWithRole = bot.guilds.get(guildid).roles.find("name", `Ami de ${salondcreate[2]}`).members.map(m => m.user.tag);
            var liste = new Discord.RichEmbed()

                .setColor("#FF0000")
                .setAuthor("Tracker d'amis", message.author.avatarURL, msgauthor)
                .setTitle(`Voici votre liste d'ami(s) ${msgauthortag} :`)
                .addField(`───────────────────`, `${memberWithRole.join("\n")} \n\n*Si aucun nom ne s'affiche, nous n'avez pas d'amis.*`)
                .setTimestamp()

            message.channel.send({ embed: liste })
        }
    }


    // Regarder la liste d'amis d'un membre


    if (message.content.startsWith(prefix + 'liste')) {
        const memberMention = message.mentions.members.first();

        carré();

        if (!message.mentions.users.size) {
            return message.reply("Vous devez mentionner un membre pour voir sa liste d'amis");
        }

        if (!db.get("salon").find({ idMember: memberMention.id }).value()) {
            return message.reply("Le membre doit avoir ses salons privés avant d'avoir des amis")
        } else {
            var test = memberMention.user.tag
            var salondcreatedb = db.get("salon").find({ idMember: memberMention.id }).value()
            var salondcreate = Object.values(salondcreatedb);
            var guildid = message.member.guild.id
            const role = message.guild.roles.find('name', `Ami de ${salondcreate[2]}`);

            if (!role) {
                message.reply("Le membre doit avoir ses salons privés avant d'avoir des amis")
            } else {
                let memberWithRole = bot.guilds.get(guildid).roles.find("name", `Ami de ${salondcreate[2]}`).members.map(m => m.user.tag);
                var liste = new Discord.RichEmbed()

                    .setColor("#FF0000")
                    //.setAuthor("Tracker d'amis", member.avatarURL, member)
                    .setTitle(`Voici la liste d'ami(s) de ${test} :`)
                    .addField(`───────────────────`, `${memberWithRole.join("\n")} \n\n*Si aucun nom ne s'affiche, ce membre n'a pas d'amis.*`)
                    .setTimestamp()

                message.channel.send({ embed: liste })
            }
        }
    }


    // Voir le nombre de salons

    if (message.content.startsWith(prefix + 'dispo')) {
        var nbChannels = message.guild.channels.size
        var nombreste = 500 - nbChannels

        message.channel.send(nombreste + " Salons sont encore disponibles.\nSeulemment " + nombreste / 2 + " membres peuvent encore créer leurs salons !")
    }


    //


    if (message.content.startsWith(prefix + 'supp')) {

        carré();

        if (!db.get("salon").find({ idMember: message.member.id }).value()) {
            return;
        } else {

            var msgauthortag = message.member.user.tag;
            var salondcreatedb = db.get("salon").find({ idMember: message.member.id }).value()
            var salondcreate = Object.values(salondcreatedb);
            var roleami = message.guild.roles.find(role => role.name === `Ami de ${msgauthortag}`)
            var nameSalonEcrit = message.guild.channels.find(channel => channel.name === `salon-de-${salondcreate[3]}`.toLowerCase())
            var nameSalonVocal = message.guild.channels.find(channel => channel.name === `Salon-de-${salondcreate[3]}`)

            if (!roleami) {
                return;
            } else {

                if (salondcreate[4] == "op") {
                    message.reply("Voulez vous vraiment supprimer vos salons ?\nUne fois les salons supprimés, il sera impossible de récupérer les données du salon.\nPour valider, tapez à nouveau <supp, sinon tapez <cancel")

                    db.get("salon").find({ idMember: message.member.id }).assign({ delChannel: salon = "wait" }).write();
                }

                if (salondcreate[4] == "wait") {
                    roleami.delete();
                    nameSalonEcrit.delete();
                    nameSalonVocal.delete();

                    message.reply("Vos salons ont été supprimés.")

                    db.get("salon").find({ idMember: message.member.id }).assign({ haveChannel: salon = "no", delChannel: salon = "op" }).write();
                }
            }
        }
    }

    if (message.content.startsWith(prefix + 'cancel')) {
        carré();

        if (!db.get("salon").find({ idMember: message.member.id }).value()) {
            return;
        } else {

            var salondcreatedb = db.get("salon").find({ idMember: message.member.id }).value()
            var salondcreate = Object.values(salondcreatedb);
            var roleami = message.guild.roles.find(role => role.name === `Ami de ${message.member.user.tag}`)

            if (!roleami) {
                return;
            } else {
                if (salondcreate[4] == "wait") {
                    db.get("salon").find({ idMember: message.member.id }).assign({ delChannel: salon = "op" }).write();
                }
            }
        }
    }


    if (message.content.startsWith(prefix + 'join')) {
        const memberMention = message.mentions.members.first();

        if (!message.mentions.users.size) {
            return message.reply("Vous devez mentionner un membre pour essayer de rejoindre son salon");
        }

        if (!db.get("salon").find({ idMember: memberMention.id }).value()) {
            return message.reply("Ce membre n'a pas de salons !");
        } else {
            var salondcreatedb = db.get("salon").find({ idMember: memberMention.id }).value()
            var salondcreate = Object.values(salondcreatedb);
            var roleami = message.guild.roles.find(role => role.name === `Ami de ${salondcreate[2]}`)

            if (!roleami) {
                return message.reply("Ce membre n'a pas de salons !");
            } else {
                if (salondcreate[5] == "oui") {
                    message.member.addRole(roleami)
                    message.reply("Vous avez désormais accès au salon de ce membre")
                } else {
                    message.reply("Ce membre a bloqué son salon, vous ne pouvez pas le rejoindre sans invitation");
                }
            }
        }
    }

    // CODE FOIREUX WTF 


    // if(message.content.startsWith('ka')) {

    //     (await message.channel.fetchMessages()).map(messages => {
    //       const lastMessage = messages.content
    //       var d = new Date();
    //       var test = d.toLocaleTimeString()
    //       message.channel.send(test + "e")
    //     }).catch(err => {
    //       console.error(err)
    //     })
    //   }

    // Commande pour supprimer des messages (100 max)


    if (message.content.startsWith(prefix + 'clear')) {

        let args = message.content.split(" ").slice(1);

        await message.delete();

        if (!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return

        if (args[0] > 100) {
            message.reply("Imposible de supprimer plus de 100 messages.")
        }

        if (!args[0]) return message.reply("Merci d'indiquer un nombre de messages à supprimer (1 à 100)")

        if (args[0] > 100) throw new Error("erreur");

        message.channel.bulkDelete(args[0]).catch(console.error);
    }


    const timeoutObj = setTimeout(() => {
    }, 30000);

    if (message.content.startsWith(prefix + 'stop')) {
        message.reply("stop")
        clearTimeout(timeoutObj)
    }

})


bot.on('guildMemberRemove', (member) => {

    var guildid = member.guild.id
    let server = member.guild;
    var msgauthortag = member.user.tag;

    if (!db.get("salon").find({ userTag: msgauthortag }).value()) {
    }
    else {

        var salondcreatedb = db.get("salon").find({ idMember: member.id }).value()
        var salondcreate = Object.values(salondcreatedb);

        let memberWithRole = bot.guilds.get(guildid).roles.find("name", `Ami de ${salondcreate[2]}`).members.map(m => m.user.tag);

        if (memberWithRole < 1) {

            var roleami = server.roles.find(role => role.name === `Ami de ${salondcreate[2]}`)
            var nameSalonEcrit = server.channels.find(channel => channel.name === `salon-de-${salondcreate[3]}`.toLowerCase())
            var nameSalonVocal = server.channels.find(channel => channel.name === `Salon-de-${salondcreate[3]}`)

            roleami.delete();
            nameSalonEcrit.delete();
            nameSalonVocal.delete();

            db.get("salon").find({ idMember: member.id }).assign({ haveChannel: salon = "no" }).write();

        } else {

            var roleami = server.roles.find(role => role.name === `Ami de ${salondcreate[2]}`)
            var nameSalonEcrit = server.channels.find(channel => channel.name === `salon-de-${salondcreate[3]}`.toLowerCase())
            var nameSalonVocal = server.channels.find(channel => channel.name === `Salon-de-${salondcreate[3]}`)

            nameSalonEcrit.send("@everyone Le salon va être supprimé dans 10 minutes")

            const timeoutObj = setTimeout(() => {
                roleami.delete();
                nameSalonEcrit.delete();
                nameSalonVocal.delete();
                db.get("salon").find({ idMember: member.id }).assign({ haveChannel: salon = "no" }).write();
            }, 600000);
        }
    }
})
