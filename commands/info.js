import os from 'os';

export default {
    name: "Info",
    triggers: ["info", "botinfo"],
    code: async (ctx) => {
        const uptime = Date.now() - ctx.config.START_TIME;
        const days = Math.floor(uptime / 86400000);
        const hours = Math.floor((uptime % 86400000) / 3600000);
        const minutes = Math.floor((uptime % 3600000) / 60000);
        const seconds = Math.floor((uptime % 60000) / 1000);

        const infoText = `╭━━━━━━━━━━━━━━━━━━╮
┃   *${ctx.config.BOT_NAME}*
╰━━━━━━━━━━━━━━━━━━╯

📌 *Version:* ${ctx.config.BOT_VERSION}
⏱️ *Uptime:* ${days}d ${hours}h ${minutes}m ${seconds}s
🖥️ *Platform:* ${os.platform()} ${os.arch()}
💾 *Memory:* ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB
🔧 *Node:* ${process.version}
👑 *Owner:* ${ctx.config.OWNER_NUMBER.split('@')[0]}`;

        await ctx.reply(infoText);
    }
};
