export function formatNumber(number) {
    return number.replace(/\D/g, '');
}

export function isGroup(jid) {
    return jid.endsWith('@g.us');
}

export function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatUptime(ms) {
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${days}d ${hours}h ${minutes}m`;
}
