export default {
    name: "Promote",
    triggers: ["promote", "admin", "demote"],
    code: async (ctx) => {
        const isGroup = ctx.msg.key.remoteJid.endsWith('@g.us');
        if (!isGroup) return ctx.reply("This command only works in groups.");

        const sender = ctx.msg.key.participant || ctx.msg.key.remoteJid;
        const groupMetadata = await ctx.sock.groupMetadata(ctx.msg.key.remoteJid);
        const senderParticipant = groupMetadata.participants.find(p => p.id === sender);
        
        if (!senderParticipant?.admin) {
            return ctx.reply("You need admin privileges to change member roles.");
        }

        let targetJid = null;
        if (ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            targetJid = ctx.msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (ctx.args[0]?.includes('@')) {
            targetJid = ctx.args[0] + '@s.whatsapp.net';
        }

        if (!targetJid) return ctx.reply("Mention the user or provide their number.");

        const isPromote = ctx.msg.message.conversation?.startsWith('.promote') || 
                         ctx.msg.message.extendedTextMessage?.text?.startsWith('.promote');

        try {
            await ctx.sock.groupParticipantsUpdate(
                ctx.msg.key.remoteJid, 
                [targetJid], 
                isPromote ? "promote" : "demote"
            );
            await ctx.reply(`✅ User ${isPromote ? 'promoted to admin' : 'demoted from admin'}.`);
        } catch (e) {
            await ctx.reply("Failed to update user role.");
        }
    }
};
