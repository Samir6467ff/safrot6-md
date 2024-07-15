let ro = 3000
let handler = async (m, { conn, usedPrefix, command }) => {
    let time = global.db.data.users[m.sender].lastrob + 7200000
    if (new Date - global.db.data.users[m.sender].lastrob < 7200000) throw ` *🚓 الشرطة بتراقب، رجع بعد* ${msToTime(time - new Date())}\n\n‍`
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    else who = m.chat
    if (!who) return conn.reply(m.chat, ` *❗ خد بالك، محتاج تمنشن حد* `, m, { contextInfo: { externalAdReply: { mediaUrl: null, mediaType: 1, description: null, title: wm, body: '', previewType: 0, thumbnail: img.getRandom(), sourceUrl: redes.getRandom() } } })
    if (!(who in global.db.data.users)) throw ` *❗ مش لاقي الشخص ده في الداتا بيز* `
    let users = global.db.data.users[who]
    let rob = Math.floor(Math.random() * ro)
    if (users.exp < rob) return m.reply(`@${who.split`@`[0]} ده معاه أقل من ${ro} XP\n> *ماتسرقش الفقراء يا أخي* `, null, { mentions: [who] })
    global.db.data.users[m.sender].exp += rob
    global.db.data.users[who].exp -= rob
    conn.sendMessage(m.chat, { text: `*خدت ${rob} XP من @${who.split`@`[0]}*`, contextInfo: { mentions: [who] } }, { quoted: m })
    //m.reply(`*خدت ${rob} XP من @${who.split`@`[0]}*`, null, { mentions: [who] })
    global.db.data.users[m.sender].lastrob = new Date * 1
}
handler.help = ['rob']
handler.tags = ['econ']
handler.command = ['نهب']
handler.register = true
export default handler

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
    hours = (hours < 10) ? "0" + hours : hours
    minutes = (minutes < 10) ? "0" + minutes : minutes
    seconds = (seconds < 10) ? "0" + seconds : seconds
    return hours + " ساعة " + minutes + " دقيقة"
      }
