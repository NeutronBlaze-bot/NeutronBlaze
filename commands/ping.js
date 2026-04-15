export default {
    name: "Ping",
    triggers: ["ping", "p"],
    code: async (ctx) => {
        const start = Date.now();
        await ctx.reply("🏓 Ping...");
        const end = Date.now();
        await ctx.reply(`🏓 Pong! Latency: ${end - start}ms`);
    }
};
