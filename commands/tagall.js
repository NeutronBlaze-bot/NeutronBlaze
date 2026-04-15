export default {
    name: "TagAll",
    triggers: ["tagall", "everyone", "all"],
    code: async (ctx) => {
        const isGroup = ctx.msg.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return ctx.reply("This command only works in groups.");

        const groupMetadata = await ctx.sock.groupMetadata(ctx.msg.key.remoteJid);
        const participants = groupMetadata.participants;
        
        let mentionText = `📢 *ATTENTION EVERYONE*\n`;
        if (ctx.args.length > 0) {
            mentionText += `📝 Message: ${ctx.args.join(' ')}\n\n`;
        }
        mentionText += `👥 Tagging ${participants.length} members:\n`;
        
        const mentions = [];
        for (let i = 0; i < participants.length; i++) {
            const p = participants[i];
            mentions.push(p.id);
            mentionText += `@${p.id.split('@')[0]} `;
            if ((i + 1) % 5 === 0) mentionText += '\n';
        }

        await ctx.sock.sendMessage(ctx.msg.key.remoteJid, {
            text: mentionText,
            mentions: mentions
        });
    }
};
