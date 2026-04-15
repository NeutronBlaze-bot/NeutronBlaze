// Find the "connection.update" section in your index.js and replace/update it with this:

sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    // QR Code Fallback: If a QR is generated and we aren't registered, print it
    if (qr) {
        console.log('[QR] Scan this if pairing code fails:');
        qrcode.generate(qr, { small: true });
        
        // Attempt Pairing Code Automatically
        if (!sock.authState.creds.registered) {
            console.log('[PAIRING] Attempting to request pairing code...');
            // You can set your number in config.js or enter it manually
            const phoneNumber = config.OWNER_NUMBER.split('@')[0]; 
            try {
                const code = await sock.requestPairingCode(phoneNumber);
                console.log(`[PAIRING] Your Code: ${code}`);
                console.log(`[PAIRING] Enter this in WhatsApp > Linked Devices > Link with Phone Number`);
            } catch (err) {
                console.log('[PAIRING] Failed. Please scan the QR code above instead.');
            }
        }
    }

    // ... (rest of your existing connection.open and connection.close logic remains the same)
});
