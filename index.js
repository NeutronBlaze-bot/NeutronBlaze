import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commands = new Map();

async function loadCommands() {
    const commandFiles = await fs.readdir(path.join(__dirname, 'commands'));
    for (const file of commandFiles) {
        if (!file.endsWith('.js')) continue;
        const cmdModule = await import(`./commands/${file}`);
        const cmd = cmdModule.default;
        if (cmd && cmd.triggers) {
            cmd.triggers.forEach(trigger => commands.set(trigger, cmd));
        }
    }
    console.log(`[KERNEL] Loaded ${commands.size} command triggers.`);
}

async function startBot() {
    await loadCommands();
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            qrcode.generate(qr, { small: true });
            console.log('[SCAN] QR displayed. Scan via WhatsApp > Linked Devices.');
        }
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom) &&
                lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
            console.log(`[CONNECTION] Closed. Reconnecting: ${shouldReconnect}`);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('[CONNECTION] Bot online. Ready for instruction.');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        
        const content = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        if (!content.startsWith(config.PREFIX)) return;

        const args = content.slice(config.PREFIX.length).trim().split(/ +/);
        const trigger = args.shift().toLowerCase();
        const command = commands.get(trigger);

        if (command) {
            console.log(`[EXEC] ${trigger} | From: ${msg.key.remoteJid}`);
            const ctx = {
                sock,
                msg,
                args,
                config,
                reply: async (text) => await sock.sendMessage(msg.key.remoteJid, { text }),
                react: async (emoji) => await sock.sendMessage(msg.key.remoteJid, { react: { text: emoji, key: msg.key } })
            };
            
            try {
                await command.code(ctx);
            } catch (e) {
                console.error(`[ERROR] ${trigger}:`, e);
                await ctx.reply('Command execution fault.');
            }
        }
    });
}

startBot();
