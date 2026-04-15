import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execPromise = promisify(exec);

export default {
    name: "Sticker",
    triggers: ["sticker", "s"],
    code: async (ctx) => {
        const quoted = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted) return ctx.reply("Reply to an image with .sticker");

        let imageMessage = quoted.imageMessage;
        if (!imageMessage) return ctx.reply("No image found in replied message.");

        await ctx.react("⏳");

        try {
            const stream = await downloadContentFromMessage(imageMessage, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            const tempDir = './temp';
            await fs.mkdir(tempDir, { recursive: true });
            const inputPath = path.join(tempDir, `${Date.now()}.jpg`);
            const outputPath = path.join(tempDir, `${Date.now()}.webp`);

            await fs.writeFile(inputPath, buffer);
            
            await execPromise(`ffmpeg -i ${inputPath} -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -lossless 1 -q:v 100 ${outputPath}`);

            const stickerBuffer = await fs.readFile(outputPath);
            await ctx.sock.sendMessage(ctx.msg.key.remoteJid, { sticker: stickerBuffer });

            await fs.unlink(inputPath);
            await fs.unlink(outputPath);
            await ctx.react("✅");
        } catch (e) {
            console.error(e);
            await ctx.reply("Sticker conversion failed. Ensure FFmpeg is installed.");
            await ctx.react("❌");
        }
    }
};
