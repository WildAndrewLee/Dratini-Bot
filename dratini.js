const net = require('net');
const eris = require('eris');
const dratini = require('dratini');
const Dratini = dratini.Dratini;
const Command = dratini.Command;
const Arguments = dratini.Arguments;

const addresses = [
    '8.31.99.135:8484',
    '8.31.99.136:8484',
    '8.31.99.137:8484',
    '8.31.99.138:8484',
    '8.31.99.141:8484',
    '8.31.99.142:8484',
    '8.31.99.143:8484',
    '8.31.99.200:8484',
    '8.31.99.201:8484',
    '8.31.99.244:8484'
]

const to_notify = {};

function alertMe(args, ctx){
    this.createMessage(ctx.channel.id, "Okay. I'll notify you when MapleStory is online.");
    to_notify[ctx.author.id] = true;
}

function connect(ip, port){
    return new Promise((resolve, reject) => {
        let c = net.connect(port, ip, () => {
            resolve();
        });

        c.on('error', reject);
    });
}

function checkOnline(){
    let promises = [];

    for(let i = 0; i < addresses.length; i++){
        let ip = addresses[i].split(':')[0];
        let port = addresses[i].split(':')[1];

        promises.push(connect(ip, port));
    }

    Promise.all(promises).then(() => {
        for(id in to_notify){
            client.getDMChannel(id).then((ch) => {
                client.createMessage(ch.id, 'MapleStory is back online!');
                delete to_notify[id];
            });
        }
    });

    setTimeout(checkOnline, 10000);
}

const Eris = require('eris');
const client = new Eris('');
const bot = new Dratini();
bot.init(client, '~');

bot.register(
    new Command(
        new Arguments(
            [
                'notify',
                'me'
            ]
        ), alertMe, {
            desc: 'Subscribe to a notification when MapleStory is back online. You will be alerted when all login servers are available.'
        }
    )
);

client.connect();
client.on('ready', checkOnline);
