const { exec } = require('child_process');
const { promisify } = require('util');
const screenshot = require('screenshot-desktop');
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');


const C_HTOP = '📈 htop';
const C_SCREENSHOT = '🖥 Screenshot';

const pExec = promisify(exec);

const bot = new Telegraf(BOT_TOKEN);

bot.start(async ctx => {
    await ctx.reply(
        'Custom buttons keyboard',
        Markup.keyboard([[C_SCREENSHOT, C_HTOP]])
            .oneTime()
            .resize()
            .extra()
    );
});

bot.hears(C_SCREENSHOT, async ctx => {
    const {
        chat: { username }
    } = ctx;
    if (username !== ADMIN_USERNAME) {
        return ctx.reply('You are not admin');
    }

    const displays = await screenshot.listDisplays();

    const img = await screenshot();
    await ctx.reply(JSON.stringify(displays));
    await ctx.replyWithPhoto({ source: img });
});

bot.hears(C_HTOP, async ctx => {
    const {
        chat: { username }
    } = ctx;
    if (username !== ADMIN_USERNAME) {
        return ctx.reply('You are not admin');
    }

    const { stdout } = await pExec('top -n 1 -b | head -n 10');
    ctx.replyWithHTML('<pre>\n' + stdout + '\n</pre>');
});

bot.startPolling();
