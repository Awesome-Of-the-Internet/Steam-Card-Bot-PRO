
// Copyright notice:

/*--------------------------------------------------------------------------------------------- 
* Original work: Copyright (c) 2020-2021 Refloow All rights reserved.

* Code origin: https://github.com/OSL-Works/Steam-Card-Bot-PRO
* Developer name: Veljko Vuckovic
* Licensed under the MIT License. See LICENSE in the project root for license information.
* Published License: https://github.com/OSL-Works/Steam-Card-Bot-PRO/master/LICENSE

* Contact information:
  Discord Support Server: https://discord.gg/D8WCtDD
  Main developer steam: https://steamcommunity.com/id/MajokingGames/ 
  Mail: refloowlibrarycontact@gmail.com

* Donations:
  Donate: https://ko-fi.com/refloow
 --------------------------------------------------------------------------------------------*/

 /* 

// legal advice: PERMISSIONS AND RIGHTS

* License does not prohibit modification, distribution, private/commercial use or sale of copies as long as the original LICENSE file
 and authors copyright notice are left ass they are in the project files.
* Copyright notice could be included ones or multiple times within the file.
* Copyright notice should not be removed even within the larger works (Larger modifications applied).
* Original file tags cannot be removed without creators exclusive permission.
* Adding own tags in files is possible in case of modification - even in that case original tags must be kept.
* Year on the copyright notice breakdown:
* Generally, the “year of first publication of the work” refers to the year in which the work was first distributed to the public (first year mentioned)
* Any year after represents the year of added modifications.
* Copyright cannot expire so therefore you cannot remove copyright notice if its not updated to the latest year.

===================================================================================
Removing copyright notice & distributing, using or selling the software without
the original license and copyright notice is licence agreement breach and its considered criminal offense and piracy.
===================================================================================

*/


const logcolors = require('./logcolors.js')

let _ = require('lodash'),
    request = require('request'),
    config = require("./SETTINGS/config.js"),
    fs = require("fs"),
    t = {};

t.getInventory = (SID, B, callback) => {
    B.getUserInventoryContents(SID, 753, 6, true, (ERR, INV, CURR) => {
        if (ERR) {
            callback(ERR);
        } else {
            INV = INV.filter((ITEM) => ITEM.getTag("item_class").internal_name == "item_class_2");
            INV = INV.filter((ITEM) => ITEM.getTag("cardborder").internal_name == "cardborder_0");

            var sInventory = INV;
            sInventory = _.groupBy(sInventory, (CEconItem) => CEconItem['market_hash_name'].split('-')[0]);

            _.forOwn(sInventory, function(CEconItemArray, appid) {
                sInventory[appid] = _.groupBy(CEconItemArray, 'classid');
            });

            callback(null, sInventory);
        }
    });
};

t.checkSets = (INV) => {

}

t.maxSets = function(cardsFromSortedInventory) {
    let cardCounts = _.mapValues(cardsFromSortedInventory, (cardsArray) => cardsArray.length);
    cardCounts = Object.keys(cardCounts).map((key) => cardCounts[key]);
    return Math.min(...cardCounts);
}

t.getCardsInSets = (callback) => {

            let c = require("./[DB] SetsData/set_data.json"),
                d = {};
            for (let i = 0; i < c.sets.length; i++) {
                d[c.sets[i].AppId] = { appid: c.sets[i].AppId, name: c.sets[i].Game, count: c.sets[i].Cards };
                d[c.sets[i].appid] = { appid: c.sets[i].appid, name: c.sets[i].game, count: c.sets[i].true_count };
            }
            callback(null, d);
};


t.getSets = (INV, DATA, callback) => {
    let s = {};
    _.forOwn(INV, (c, id) => {
        DATA["448130"] = {
            appid: "448130",
            name: "Sharf",
            count: 5
        };
        DATA["586090"] = {
            appid: "586090",
            name: "Snowman",
            count: 7
        };
        DATA["392870"] = {
            appid: "392870",
            name: "Attrition: Nuclear Domination",
            count: 5
        };
        DATA["388870"] = {
            appid: "388870",
            name: "Devils Share",
            count: 5
        };
        DATA["314700"] = {
            appid: "314700",
            name: "Forsaken Uprising",
            count: 5
        };
        DATA["392050"] = {
            appid: "392050",
            name: "Galactic Hitman",
            count: 5
        };
        DATA["486340"] = {
            appid: "486340",
            name: "Gnarltoof's Revenge",
            count: 5
        };
        DATA["457940"] = {
            appid: "457940",
            name: "Krog Wars",
            count: 5
        };
        DATA["383030"] = {
            appid: "383030",
            name: "Medieval Mercs",
            count: 5
        };
        DATA["407740"] = {
            appid: "407740",
            name: "Operation: Global Shield",
            count: 5
        };
        DATA["407750"] = {
            appid: "407750",
            name: "Paranormal Psychosis",
            count: 5
        };
        DATA["457930"] = {
            appid: "457930",
            name: "Starship: Nova Strike",
            count: 5
        };
        DATA["491250"] = {
            appid: "491250",
            name: "The Decimation of Olarath",
            count: 5
        };
        DATA["473620"] = {
            appid: "473620",
            name: "Winged Knights: Penetration",
            count: 5
        };
        DATA["473650"] = {
            appid: "473650",
            name: "Withering Kingdom: Arcane War",
            count: 5
        };
        DATA["473640"] = {
            appid: "473640",
            name: "Wyatt Derp",
            count: 5
        };
        DATA["473580"] = {
            appid: "473580",
            name: "Wyatt Derp 2: Peacekeeper",
            count: 5
        };
        DATA["209670"] = {
            appid: "209670",
            name: "Cortex Command",
            count: 6
        };
        DATA["253980"] = {
            appid: "253980",
            name: "Enclave",
            count: 6
        };
        DATA["269710"] = {
            appid: "269710",
            name: "Tumblestone",
            count: 12
        };
        DATA["351940"] = {
            appid: "351940",
            name: "The Descendant",
            count: 5
        };

        let uc = Object.keys(c).length;
       
        if (DATA[id.toString()] && uc == DATA[id.toString()].count) {
            r = t.maxSets(c);
            s[id.toString()] = [];
            for (let i = 0; i < r; i++) {
                let set = [];
                _.forOwn(c, (e) => {
                    set.push(e[i]);
                });
                s[id.toString()].push(set);
            }
        } else if (!DATA[id.toString()]) {
            // If bot doesnt recognize the sets it will be stored in missing.txt
            fs.appendFile('./app/[DB] SetsData/MissingData.txt',id.toString()+"\n",(err)=>
            {
                if (err) throw err;
            }
            )
            logcolors.info("| [CardData] |: Card set non-existant, skipping it ID: " + id.toString());
            logcolors.true("| [CardData] |: Placed non-existing sets in Missing.txt");
            
        }
    });
    callback(null, s);
};

t.getBadges = (SID, callback) => {
    request("http://api.steampowered.com/IPlayerService/GetBadges/v1/?key=" + config.STEAMAPIKEY + "&steamid=" + SID, { json: true }, (ERR, RES, BODY) => {
        if (!ERR && RES.statusCode == 200 && BODY.response) {
            let badges = BODY.response,
                b = {};
				//console.log(badges);
            logcolors.info("| [Refloow] |: Checking badges request sent by #" + SID + "");
            if (badges.badges) {
                badges.badges.forEach(function(badge) {
                    if ('appid' in badge && badge.border_color == 0) {
                        b[badge.appid] = badge.level;
                    }
                });
                callback(null, b, badges.player_level, (badges.player_xp - badges.player_xp_needed_current_level));
            } else {
                callback(null, "nobadges")
            }
        } else {
            callback(ERR);
        }
    });
};

module.exports = t;

// Copyright notice:

/* Original work: Copyright (c) 2020-2021 Refloow All rights reserved.
  Code origin (Free GitHub publish): https://github.com/OSL-Works/Steam-Card-Bot-PRO*/
