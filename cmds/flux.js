const axios = require('axios');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

module.exports = {
    name: 'flux',
    description: 'Generate AI images based on a prompt',
    async execute(api, event, args) {
        const prompt = args.join(' ').trim();

        if (!prompt) {
            api.sendMessage(`Please enter a prompt.\nUsage: ${config.prefix}flux <your prompt>`, event.threadID, event.messageID);
            return;
        }

        api.sendMessage("Generating images...", event.threadID, event.messageID);

        try {
            const imagePromises = [];
            for (let i = 1; i <= 5; i++) {
                imagePromises.push(
                    axios.get(`https://api.joshweb.click/api/flux?prompt=${encodeURIComponent(prompt)}&model=${i}`)
                );
            }

            const responses = await Promise.all(imagePromises);
            const images = responses.map(response => response.data.imageUrl);

            api.sendMessage({
                body: `Images generated for prompt: ${prompt}`,
                attachment: images
            }, event.threadID);
        } catch (error) {
            api.sendMessage("There was an error generating the images. Please try again later.", event.threadID, event.messageID);
        }
    }
};
