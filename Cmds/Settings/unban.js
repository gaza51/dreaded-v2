const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

const { getBannedUsers, unbanUser } = require('../../Database/config');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;

        let numberToUnban;

      
        if (m.quoted) {
            numberToUnban = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
            numberToUnban = m.mentionedJid[0];
        } else {
            numberToUnban = args[0];
        }

        if (!numberToUnban) {
            return await m.reply('❌ Please provide a valid number or quote a user.');
        }

        if (!numberToUnban.includes('@s.whatsapp.net')) {
            numberToUnban = `${numberToUnban.trim()}@s.whatsapp.net`;
        }

        const bannedUsers = await getBannedUsers();

        if (!bannedUsers.includes(numberToUnban)) {
            return await m.reply('⚠️ This user was not banned before.');
        }

        
        await unbanUser(numberToUnban);

        await m.reply(`✅ ${numberToUnban.split('@')[0]} has been unbanned.`);
    });
};