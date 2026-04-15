export default {
    name: "Help",
    triggers: ["help", "menu", "h"],
    code: async (ctx) => {
        const helpText = `╭━━━━━━━━━━━━━━━━━━╮
┃   *${ctx.config.BOT_NAME} v${ctx.config.BOT_VERSION}*
╰━━━━━━━━━━━━━━━━━━╯

*📌 GENERAL COMMANDS*
▸ ${ctx.config.PREFIX}ping - Check latency
▸ ${ctx.config.PREFIX}help - Show this menu
▸ ${ctx.config.PREFIX}info - Bot information
▸ ${ctx.config.PREFIX}owner - Contact owner

*🖼️ MEDIA COMMANDS*
▸ ${ctx.config.PREFIX}sticker - Image to sticker
▸ ${ctx.config.PREFIX}vv - Save View Once media

*👥 GROUP COMMANDS*
▸ ${ctx.config.PREFIX}tagall - Mention everyone
▸ ${ctx.config.PREFIX}kick @user - Remove member
▸ ${ctx.config.PREFIX}promote @user - Make admin

*👑 OWNER COMMANDS*
▸ ${ctx.config.PREFIX}eval - Execute code

╭━━━━━━━━━━━━━━━━━━╮
┃ Prefix: ${ctx.config.PREFIX}
╰━━━━━━━━━━━━━━━━━━╯`;
        
        await ctx.reply(helpText);
    }
};
