const {
    getModule,
    messages: { sendBotMessage }
} = require("powercord/webpack");
const { get } = require("powercord/http");
const { Plugin } = require("powercord/entities");
const { inject, uninject } = require("powercord/injector");

const ruEnMap = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "i",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "ch",
    ш: "sh",
    щ: "sh",
    ъ: "!",
    ы: "i",
    ь: "'",
    э: "e",
    ю: "u",
    я: "ya",
    А: "A",
    Б: "B",
    В: "V",
    Г: "G",
    Д: "D",
    Е: "E",
    Ё: "E",
    Ж: "ZH",
    З: "Z",
    И: "I",
    Й: "I",
    К: "K",
    Л: "L",
    М: "M",
    Н: "N",
    О: "O",
    П: "P",
    Р: "R",
    С: "S",
    Т: "T",
    У: "U",
    Ф: "F",
    Х: "H",
    Ц: "C",
    Ч: "CH",
    Ш: "SH",
    Щ: "SH",
    Ъ: "!",
    Ы: "I",
    Ь: "'",
    Э: "E",
    Ю: "U",
    Я: "YA"
};
const keyboardMap = {
    "`": "ё",
    "@": '"',
    "#": "№",
    $: ";",
    "^": ":",
    "&": "?",
    "|": "/",
    "~": "Ё",
    /*  */ q: "й",
    w: "ц",
    e: "у",
    r: "к",
    t: "е",
    y: "н",
    u: "г",
    i: "ш",
    o: "щ",
    p: "з",
    "[": "х",
    "]": "ъ",
    /*  */ Q: "Й",
    W: "Ц",
    E: "У",
    R: "К",
    T: "Е",
    Y: "Н",
    U: "Г",
    I: "Ш",
    O: "Щ",
    P: "З",
    "{": "Х",
    "}": "Ъ",
    /*  */ a: "ф",
    s: "ы",
    d: "в",
    f: "а",
    g: "п",
    h: "р",
    j: "о",
    k: "л",
    l: "д",
    ";": "ж",
    "'": "э",
    /*  */ A: "Ф",
    S: "Ы",
    D: "В",
    F: "А",
    G: "П",
    H: "Р",
    J: "О",
    K: "Л",
    L: "Д",
    ":": "Ж",
    '"': "Э",
    /*  */ z: "я",
    x: "ч",
    c: "с",
    v: "м",
    b: "и",
    n: "т",
    m: "ь",
    ",": "б",
    ".": "ю",
    "/": ".",
    /*  */ Z: "Я",
    X: "Ч",
    C: "С",
    V: "М",
    B: "И",
    N: "Т",
    M: "Ь",
    "<": "Б",
    ">": "Ю",
    "?": ","
};

function ruToEn(text) {
    return text
        .split("")
        .map(m => ruEnMap[m] || m)
        .join("");
}

function parseArgs(args) {
    const parsedArgs = {};
    for (var k in args) {
        parsedArgs[k] = args[k][0].text.trim();
    }
    return parsedArgs;
}

const ciphers = [
    {
        name: "keyboard",
        description: "Раскладка",
        execute: function (args) {
            return args.text
                .split("")
                .map(
                    m =>
                        (encode !== "true"
                            ? keyboardMap[m]
                            : (Object.entries(keyboardMap).find(
                                  v => v[1] == m
                              ) || [m])[0]) || m
                )
                .join("");
        },
        options: [
            {
                name: "encode",
                description: "Нужно кодировать?",
                type: 3,
                choices: [
                    { name: "true", value: "true" },
                    { name: "false", value: "false" }
                ]
            },
            {
                name: "text",
                description: "Текст для преобразования",
                type: 3,
                required: true
            }
        ]
    }
];

module.exports = class ClownTranslate extends Plugin {
    async startPlugin() {
        const getGuild = (await getModule(["getGuild"])).getGuild;
        const sectionsModule = await getModule(["getGuildSections"]);
        const autocompleteModule = await getModule(["AUTOCOMPLETE_OPTIONS"]);
        const clownEmoji = (
            await getModule(["filterUnsupportedEmojis", "getURL"])
        ).getURL("🤡");
        const parse = (await getModule(["parse", "parseTopic"])).parse;

        if (getGuild("584321061437571072")) {
            let extend;
            try {
                extend = require("./ciphers.js");
            } catch {
                powercord.api.notices.sendToast("clownTranslate-noCiphers", {
                    header: "А где модуль?",
                    content: parse(
                        "Никаких шифров не будет, пока ты не скачаешь модуль из <#694792497481646230>"
                    ),
                    image: location.origin + clownEmoji,
                    buttons: [
                        {
                            text: "Понял",
                            look: "filled",
                            color: "green"
                        }
                    ]
                });
            }
            extend && extend(ciphers, ruToEn);
        }
        inject(
            "clownTranslate-autocomplete-getSections",
            sectionsModule,
            "getGuildSections",
            function (args, res) {
                return [].concat(res, [
                    {
                        icon: location.origin + clownEmoji,
                        id: "clownTranslate",
                        name: "Тот самый переводчик"
                    }
                ]);
            }
        );
        inject(
            "clownTranslate-autocomplete-getSection",
            sectionsModule,
            "getGuildSection",
            function (args, res) {
                if (args[1] == "clownTranslate")
                    return {
                        icon: location.origin + clownEmoji,
                        id: "clownTranslate",
                        name: "Тот самый переводчик"
                    };
                return res;
            }
        );
        inject(
            "clownTranslate-autocomplete-queryResults",
            autocompleteModule.AUTOCOMPLETE_OPTIONS.COMMANDS,
            "queryResults",
            (args, res) => {
                return {
                    commands: [].concat(
                        res.commands,
                        ciphers
                            .filter(c => c.name.match(new RegExp(args[1])))
                            .map(c =>
                                Object.assign({}, c, {
                                    applicationId: "clownTranslate",
                                    execute: (args, location) => {
                                        const result = c.execute(
                                            parseArgs(args),
                                            location
                                        );
                                        if (result)
                                            sendBotMessage(
                                                location.channel.id,
                                                result
                                            );
                                    },
                                    id: "clownTranslate-" + c.name,
                                    type: 0
                                })
                            )
                    )
                };
            }
        );
    }

    pluginWillUnload() {
        uninject("clownTranslate-autocomplete-getSections");
        uninject("clownTranslate-autocomplete-getSection");
        uninject("clownTranslate-autocomplete-queryResults");
    }
};
