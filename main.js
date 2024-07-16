process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
import './config.js';
import { createRequire } from "module"; // استيراد القدرة على إنشاء الدالة 'require'
import path, { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import * as ws from 'ws';
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync } from 'fs';
import yargs from 'yargs';
import { spawn } from 'child_process';
import lodash from 'lodash';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import { tmpdir } from 'os';
import { format } from 'util';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import pino from 'pino';
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js';
import store from './lib/store.js';
import { Boom } from '@hapi/boom';
const { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, MessageRetryMap, makeCacheableSignalKeyStore, jidNormalizedUser, PHONENUMBER_MCC } = await import('@whiskeysockets/baileys');
import moment from 'moment-timezone';
import NodeCache from 'node-cache';
import readline from 'readline';
import fs from 'fs';
const { CONNECTING } = ws;
const { chain } = lodash;
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

protoType();
serialize();

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString(); };
global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)); };
global.__require = function require(dir = import.meta.url) { return createRequire(dir); };

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })).toString() : '');
global.timestamp = {
  start: new Date()
};

const __dirname = global.__dirname(import.meta.url);

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp('^[' + (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');

//global.opts['db'] = "mongodb+srv://dbdyluxbot:password@cluster0.xwbxda5.mongodb.net/?retryWrites=true&w=majority";

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ?
new cloudDBAdapter(opts['db']) : /mongodb(\+srv)?:\/\//i.test(opts['db']) ? (opts['mongodbv2'] ? new mongoDBV2(opts['db']) : new mongoDB(opts['db'])) :
new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`)
);

global.DATABASE = global.db;
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(async function () {
    if (!global.db.READ) {
      clearInterval(this);
      resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
    }
  }, 1 * 1000));
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read().catch(console.error);
  global.db.READ = null;
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {})
  };
  global.db.chain = chain(global.db.data);
};
loadDatabase();

global.authFile = `BotSession`;
const { state, saveState, saveCreds } = await useMultiFileAuthState(global.authFile);
const msgRetryCounterMap = (MessageRetryMap) => {};
const msgRetryCounterCache = new NodeCache();
const { version } = await fetchLatestBaileysVersion();
let phoneNumber = global.botNumber;

const methodCodeQR = process.argv.includes("qr");
const methodCode = !!phoneNumber || process.argv.includes("code");
const MethodMobile = process.argv.includes("mobile");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver));

let opcion;
if (!fs.existsSync(`./${authFile}/creds.json`) && !methodCodeQR && !methodCode) {
  while (true) {
let lineM = '⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》'
opcion = await question(`╭${lineM}  
┊ ${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊ ${chalk.blueBright('┊')} ${chalk.blue.bgBlue.bold.cyan('طريقة الربط')}
┊ ${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}   
┊ ${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}     
┊ ${chalk.blueBright('┊')} ${chalk.green.bgMagenta.bold.yellow('كيف ترغب في الاتصال؟')}
┊ ${chalk.blueBright('┊')} ${chalk.bold.redBright('⇢  الخيار 1:')} ${chalk.greenBright('رمز الاستجابة السريعة (QR).')}
┊ ${chalk.blueBright('┊')} ${chalk.bold.redBright('⇢  الخيار 2:')} ${chalk.greenBright('رمز من 8 أرقام.')}
┊ ${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊ ${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}     
┊ ${chalk.blueBright('┊')} ${chalk.italic.magenta('أدخل رقم الخيار المطلوب فقط للاتصال.')}
┊ ${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')} 
╰${lineM}\n${chalk.bold.magentaBright('---> ')}`);

if (opcion === '1' || opcion === '2') {
  // استجابة الاستخدام اللاحقة تعتمد على الخيار المحدد هنا
                             }
break;
} else {
  console.log(chalk.bold.redBright(`لا يُسمح إلا بأرقام ${chalk.bold.greenBright("1")} أو ${chalk.bold.greenBright("2")} فقط، ولا يُسمح بالحروف أو الرموز الخاصة. ${chalk.bold.yellowBright("نصيحة: قم بنسخ رقم الخيار ولصقه في الواجهة.")}`));
}}
opcion = opcion;

console.info = () => {}; 
const connectionOptions = {
  logger: pino({ level: 'silent' }),
  printQRInTerminal: opcion === '1' ? true : false,
  mobile: MethodMobile, 
  browser: opcion === '1' ? ['LoliBot-MD', 'Edge', '1.0.0'] : methodCodeQR ? ['LoliBot-MD', 'Edge', '1.0.0'] : ["Ubuntu", "Chrome", "20.0.04"],
  auth: { 
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
  },
  markOnlineOnConnect: true, 
  generateHighQualityLinkPreview: true, 
  getMessage: async (key) => {
    let jid = jidNormalizedUser(key.remoteJid);
    let msg = await store.loadMessage(jid, key.id);
    return msg?.message || "";
  },
  msgRetryCounterCache,
  msgRetryCounterMap,
  defaultQueryTimeoutMs: undefined,   
  version
};

global.conn = makeWASocket(connectionOptions);

if (opcion === '2' || methodCode) {
  if (!conn.authState.creds.registered) {  
    if (MethodMobile) throw new Error('⚠️ حدث خطأ في واجهة برمجة التطبيقات للهاتف المحمول');
    
    let phoneNumberCleaned;
    if (!!phoneNumber) {
      phoneNumberCleaned = phoneNumber.replace(/[^0-9]/g, '');
      if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumberCleaned.startsWith(v))) {
        console.log(chalk.bgBlack(chalk.bold.redBright("\n\n✴️ يجب أن يبدأ رقمك برمز البلد")));
        process.exit(0);
      }
    } else {
      while (true) {
        phoneNumberCleaned = await question(chalk.bgBlack(chalk.bold.greenBright("\n\n✳️ أدخل رقمك\n\nمثال: 5491168xxxx\n\n\n\n")));
        phoneNumberCleaned = phoneNumberCleaned.replace(/[^0-9]/g, '');
        
        if (phoneNumberCleaned.match(/^\d+$/) && Object.keys(PHONENUMBER_MCC).some(v => phoneNumberCleaned.startsWith(v))) {
          break; 
        } else {
          console.log(chalk.bgBlack(chalk.bold.redBright("\n\n✴️ تأكد من إضافة رمز البلد")));
        }
      }
    }
    
    setTimeout(async () => {
      let pairingCode = await conn.requestPairingCode(phoneNumberCleaned);
      pairingCode = pairingCode?.match(/.{1,4}/g)?.join("-") || pairingCode;
      console.log(chalk.bold.white(chalk.bgMagenta(`رمز الربط:`)), chalk.bold.white(chalk.white(pairingCode)));
      rl.close();
    }, 3000);
  }
}

conn.isInit = false;

if (!opts['test']) {
  setInterval(async () => {
    if (global.db.data) await global.db.write().catch(console.error);
    if (opts['autocleartmp']) {
      try {
        clearTmp();
      } catch (e) { 
        console.error(e);
      }
    }
  }, 60 * 1000);
}

if (opts['server']) (await import('./server.js')).default(global.conn, PORT);

/* Clear */
async function clearTmp() {
  const tmpDirs = [tmpdir(), join(__dirname, './tmp')];
  const fileNames = [];
  tmpDirs.forEach(dir => readdirSync(dir).forEach(file => fileNames.push(join(dir, file))));
  
  return fileNames.map(file => {
    const stats = statSync(file);
    if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 1)) return unlinkSync(file); // 1 دقيقة
    return false;
  });
}

setInterval(async () => {
  await clearTmp();
  console.log(chalk.cyan(`┏━━━━━━⪻♻️ تنظيف تلقائي 🗑️⪼━━━━━━•\n┃→ تم حذف ملفات مجلد TMP\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━•`));
}, 60000); // 1 دقيقة

function purgeSession() {
  let prekey = [];
  let directory = readdirSync("./BotSession");
  let filesFolderPreKeys = directory.filter(file => {
    return file.startsWith('pre-key-');
  });
  prekey = [...prekey, ...filesFolderPreKeys];
  filesFolderPreKeys.forEach(file => {
    unlinkSync(`./BotSession/${file}`);
  });
}

function purgeSessionSB() {
  try {
    let directoryList = readdirSync('./jadibts/');
    let SBprekey = [];
    directoryList.forEach(dir => {
      if (statSync(`./jadibts/${dir}`).isDirectory()) {
        let DSBPreKeys = readdirSync(`./jadibts/${dir}`).filter(fileInDir => {
          return fileInDir.startsWith('pre-key-');
        });
        SBprekey = [...SBprekey, ...DSBPreKeys];
        DSBPreKeys.forEach(fileInDir => {
          unlinkSync(`./jadibts/${dir}/${fileInDir}`);
        });
      }
    });
    if (SBprekey.length === 0) return; //console.log(chalk.cyanBright(`=> مفيش ملفات ليها حذف.`))
  } catch (err) {
    console.log(chalk.bold.red(`[ ℹ️ ] حصل خطأ أثناء الحذف، ملفات مش حذفت`));
  }
}

function purgeOldFiles() {
  const directories = ['./BotSession/', './jadibts/'];
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  directories.forEach(dir => {
    readdirSync(dir, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        const filePath = path.join(dir, file);
        stat(filePath, (err, stats) => {
          if (err) throw err;
          if (stats.isFile() && stats.mtimeMs < oneHourAgo && file !== 'creds.json') { 
            unlinkSync(filePath, err => {  
              if (err) throw err;
              console.log(chalk.bold.green(`تم حذف الملف ${file} بنجاح`));
            });
          } else {  
            console.log(chalk.bold.red(`ملف ${file} متحذفش` + err));
} }) }) }) })
}

async function connectionUpdate(update) {
async function connectionUpdate(update) {
  const { connection, lastDisconnect, isNewLogin } = update;
  global.stopped = connection;
  if (isNewLogin) conn.isInit = true;

  const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
  if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
    await global.reloadHandler(true).catch(console.error);
    global.timestamp.connect = new Date();
  }

  if (global.db.data == null) loadDatabase();

  if (update.qr != 0 && update.qr != undefined || methodCodeQR) {
    if (opcion == '1' || methodCodeQR) {
      console.log(chalk.cyan('✅ امسح الكود الشريطي في 45 ثانية ✅.'));
    }
  }

  if (connection == 'open') {
    console.log(chalk.bold.greenBright('\n▣─────────────────────────────···\n│\n│❧ الإتصال تم بنجاح بالواتساب ✅\n│\n▣─────────────────────────────···'));
  }

  let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

  if (reason == 405) {
    await fs.unlinkSync("./BotSession/" + "creds.json");
    console.log(chalk.bold.redBright(`[ ⚠ ] تم استبدال الاتصال، يرجى الانتظار قليلاً لإعادة التشغيل...\nإذا ظهرت أخطاء، قم بإعادة التشغيل عبر: npm start`));
    process.send('reset');
  }

  if (connection === 'close') {
    if (reason === DisconnectReason.badSession) {
      conn.logger.error(`[ ⚠ ] جلسة غير صالحة، يرجى حذف مجلد ${global.authFile} وإعادة المحاولة.`);
    } else if (reason === DisconnectReason.connectionClosed) {
      conn.logger.warn(`[ ⚠ ] اتصال مغلق، جاري إعادة الاتصال...`);
      await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.connectionLost) {
      conn.logger.warn(`[ ⚠ ] اتصال مفقود مع الخادم، جاري إعادة الاتصال...`);
      await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.connectionReplaced) {
      conn.logger.error(`[ ⚠ ] تم استبدال الاتصال، تم فتح جلسة جديدة. يرجى إغلاق الجلسة الحالية أولاً.`);
    } else if (reason === DisconnectReason.loggedOut) {
      conn.logger.error(`[ ⚠ ] اتصال مغلق، يرجى حذف مجلد ${global.authFile} وإعادة المحاولة.`);
    } else if (reason === DisconnectReason.restartRequired) {
      conn.logger.info(`[ ⚠ ] إعادة التشغيل مطلوبة، يرجى إعادة تشغيل الخادم إذا كانت هناك مشاكل.`);
      await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.timedOut) {
      conn.logger.warn(`[ ⚠ ] انتهاء وقت الاتصال، جاري إعادة الاتصال...`);
      await global.reloadHandler(true).catch(console.error);
    } else {
      conn.logger.warn(`[ ⚠ ] سبب الفصل غير معروف. ${reason || ''}: ${connection || ''}`);
      await global.reloadHandler(true).catch(console.error);
    }
  }
}

conn.welcome = 'أهلاً وسهلاً!! @user إزيك؟ 😃\n\n『*اسم الروم* *@subject*』\n\n*نورت يا قلب اخوك الروم🧚🏽‍♂️*\n\n_اتأكد إنك قرأت قوانين الجروب عشان متواجهش مشاكل 🧐_\n\n*اتفضل واستمتع في الجروب وخليك مبسوط 🥳*`'
conn.bye = 'راح @user 👋\n\nربنا يبارك فيك 😎`'
conn.spromote = 'يا @user صارتلك مناصب جديدة 👑'
conn.sdemote = 'ههههه @user مش إدارة دلوقتي'
conn.sDesc = 'تم تغيير وصف الجروب لـ\n@desc'
conn.sSubject = 'تم تغيير اسم الجروب لـ\n@group'
conn.sIcon = 'تم تغيير أيقونة الجروب'
conn.sRevoke = 'تم تغيير رابط الجروب لـ\n@revoke'
conn.handler = handler.handler.bind(global.conn)
conn.participantsUpdate = handler.participantsUpdate.bind(global.conn)
conn.groupsUpdate = handler.groupsUpdate.bind(global.conn)
conn.onDelete = handler.deleteUpdate.bind(global.conn)
conn.connectionUpdate = connectionUpdate.bind(global.conn)
conn.credsUpdate = saveCreds.bind(global.conn, true)

conn.ev.on('messages.upsert', conn.handler)
conn.ev.on('group-participants.update', conn.participantsUpdate)
conn.ev.on('groups.update', conn.groupsUpdate)
conn.ev.on('message.delete', conn.onDelete)
conn.ev.on('connection.update', conn.connectionUpdate)
conn.ev.on('creds.update', conn.credsUpdate)
isInit = false
return true
}

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = (filename) => /\.js$/.test(filename)
global.plugins = {}
async function filesInit() {
for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
try {
const file = global.__filename(join(pluginFolder, filename))
const module = await import(file)
global.plugins[filename] = module.default || module;
} catch (e) {
conn.logger.error(e)
delete global.plugins[filename]
}}}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error)

global.reload = async (_ev, filename) => {
if (pluginFilter(filename)) {
const dir = global.__filename(join(pluginFolder, filename), true)
if (filename in global.plugins) {
if (existsSync(dir)) conn.logger.info(`تم تحديث الإضافة: '${filename}'`)
else { 
conn.logger.warn(`حذف الإضافة: '${filename}'`)
return delete global.plugins[filename]
}
} else conn.logger.info(`إضافة جديدة: '${filename}'`)
const err = syntaxerror(readFileSync(dir), filename, {
sourceType: 'module',
allowAwaitOutsideFunction: true,
});
if (err) conn.logger.error(`❌ خطأ في الصياغة عند تحميل '${filename}'\n${format(err)}`)
else {
try { 
const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`))
global.plugins[filename] = module.default || module
} catch (e) {
conn.logger.error(`❌ خطأ في طلب الإضافة: '${filename}\n${format(e)}'`);
} finally {
global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
}}}}

Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()

async function _quickTest() {
let test = await Promise.all([
spawn('ffmpeg'),
spawn('ffprobe'),
spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
spawn('convert'),
spawn('magick'),
spawn('gm'),
spawn('find', ['--version'])].map(p => {
return Promise.race([
new Promise(resolve => {
p.on('close', code => {
resolve(code !== 127)
})
}),
new Promise(resolve => {
p.on('error', _ => resolve(false))
})
])}))

let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
console.log(test)
let s = global.support = {ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find }
Object.freeze(global.support)
}

_quickTest()
.then(() => conn.logger.info('جاري التحميل．．．.\n'))
.catch(console.error)
