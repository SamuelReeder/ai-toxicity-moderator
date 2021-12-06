// require('@tensorflow/tfjs-node');
const Discord = require('discord.js');
const toxicity = require('@tensorflow-models/toxicity');
const client = new Discord.Client();

let loadedModel;
async function loadModel() {
    loadedModel = toxicity.load(0.5001);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.time}!`);
    loadModel();
});


client.on('message', async message => {
    if (message.author.bot) return;
    loadedModel.then(model => {

        model.classify(message.content).then(predictions => {
            console.log(predictions);

            const embed = {
                color: 0x0099ff,
                title: 'Toxicity Report',
                fields: [],
                timestamp: new Date(),
                footer: {
                    text: 'Made by Samuel R with TensorFlow'
                }
            };

            predictions.forEach(e => {
                embed.fields.push({
                    name: e.label,
                    value: `${e.results[0].match} with ${e.results[0].match ? Math.round(e.results[0].probabilities[1] * 100) : Math.round(e.results[0].probabilities[0] * 100)}% certainty`,
                    inline: true
                })
            });

            message.channel.send({embed: embed});
        });
    });
});

client.login( /* USE CLIENT TOKEN */);