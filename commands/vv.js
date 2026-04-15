import { downloadContentFromMessage } from '@whiskeysockets/baileys';

export default {
    name: "ViewOnce Saver",
    triggers: ["vv", "viewonce"],
    code: async (ctx) => {
        const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted) return ctx.reply("Reply to a View Once message with .vv");

        const viewOnceMsg = quoted.viewOnceMessage || quoted.viewOnceMessageV2;
        if (!viewOnceMsg) return ctx.reply("Target is not a View Once message.");

        await ctx.react("⏳");
        let messageType = '';
        let mediaMessage = null;

        if (viewOnceMsg.imageMessage) {
            messageType = 'image';
            mediaMessage = viewOnceMsg.imageMessage;
        } else if (viewOnceMsg.videoMessage) {
            messageType = 'video';
            mediaMessage = viewOnceMsg.videoMessage;
        } else {
            return ctx.reply("Unsupported View Once media type.");
        }

        const stream = await downloadContentFromMessage(mediaMessage, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        await ctx.sock.sendMessage(ctx.msg.key.remoteJid, {
            [messageType]: buffer,
            caption: `[SAVED] ${mediaMessage.caption || ''}`
        });
        await ctx.react("✅");
    }
};
