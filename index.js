const { Telegraf, Markup } = require('telegraf');
const fetch = require('node-fetch'); 
require('dotenv').config();

const bot = new Telegraf(process.env.TOKEN);

// /start command
bot.start((ctx) => {
    ctx.reply(`
👋 Hello! Welcome to the GitHub Search Bot.
🔹 You can search for GitHub repositories:
Command: /search <repository_name>

🔹 Example: /search react

💡 Tip: Soon you'll be able to search users and their repositories too!

Happy coding! 🚀

Made by AmirCodeZ 💻
`);
});


async function searchRepos(query, page = 1) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&page=${page}&per_page=5`);
    return response.json();
}


bot.command('search', async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ');
    if (!query) return ctx.reply('Please enter a search term!');

    const page = 1;
    const result = await searchRepos(query, page);

    if (result.total_count === 0) return ctx.reply('No repositories found.');

    const buttons = result.items.map(repo =>
        [Markup.button.url(repo.full_name, repo.html_url)]
    );

    await ctx.replyWithMarkdown(
        `Found ${result.total_count} repositories for "${query}":`,
        Markup.inlineKeyboard(buttons)
    );
});



bot.launch({
    polling: true
});
