export default {
    name: "Owner",
    triggers: ["owner", "creator"],
    code: async (ctx) => {
        const ownerJid = ctx.config.OWNER_NUMBER;
        const ownerNumber = ownerJid.split('@')[0];
        
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${ctx.config.BOT_NAME} Owner
TEL;type=CELL;waid=${ownerNumber}:+${ownerNumber}
END:VCARD`;

        await ctx.sock.sendMessage(ctx.msg.key.remoteJid, {
            contacts: {
                displayName: `${ctx.config.BOT_NAME} Owner`,
                contacts: [{ vcard }]
            }
        });
        
        await ctx.reply(`👑 *Bot Owner*\n📞 +${ownerNumber}\n\nContact saved. Message for support/bug reports.`);
    }
};
