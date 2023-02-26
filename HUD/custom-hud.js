/** @returns {Player}  */
export const findPlayer = () => {

    /*
    
        **************************************
        ***  THIS VERSION NO LONGER WORKS! ***
        ***  Use custom-HUD-v2.js          ***
        ***  2/25/2023                     ***
        **************************************    


        https://www.reddit.com/r/Bitburner/comments/10urhbn/custom_overview_stats_but_better/
        Posted by u/I_hate_you_wasTaken 

        Custom Overview stats, but better
        Netscript JS Script
        So basically there was this script in the official script repository and it sucks. 
        No coloring and only two stats which both don't work.
    
        Features:    
        Adds custom HUD stats, and you can add your own stats.    
        Has coloring based on your theme    
        Has a horizontal line separating your regular and custom stats.    
        Costs less than 2GB    
        Here's my edited version:    
        Costs 1.80GB

        - u/I_hate_you_wasTaken 
    
    */

    const objects = [];
    const payload_id = "payload" + String(Math.trunc(performance.now()));
    globalThis.webpackJsonp.push([payload_id, {
            [payload_id]: function(_e, _t, require) {
                for (const module of (Object.values(require.c))) {
                    for (const object of Object.values(module?.exports ?? {})) {
                        objects.push(object);
                    }
                }
            }
        },
        [
            [payload_id]
        ]
    ]);

    for (const obj of objects) {
        if (typeof obj.whoAmI === "function" && obj.whoAmI() === "Player") {
            return obj;
        }
    }
}

// FindPlayer().bladeburner != null
// FindPlayer().gang != null
// Gang.respect
// Bladeburner.rank

/** @param {NS} ns **/

export async function main(ns) {

    const args = ns.flags([
        ["help", false]
    ]);

    if (args.help) {
        ns.tprint("This script will enhance your HUD (Heads up Display) with custom statistics.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    const doc = eval('document'); // This is expensive! (0GB RAM) Perhaps there's a way around it? ;)
    var overview
    for (const obj of doc.getElementsByClassName('drag')) { // css-0
        let box = obj.className // .includes('drag')
        ns.tprint(box)
        overview = obj.parentNode.childNodes['0'].childNodes['0'].childNodes['0'].childNodes['0'].childNodes['0'] //.className
    }

    const removeByClassName = (sel) => doc.querySelectorAll(sel).forEach(el => el.remove());
    const colorByClassName = (sel, col) => doc.querySelectorAll(sel).forEach(el => el.style.color = col);
    const hook0 = doc.getElementById('overview-extra-hook-0');
    const hook1 = doc.getElementById('overview-extra-hook-1');

    var theme = ns.ui.getTheme()
    while (true) {
        try {
            let plr = findPlayer()
            removeByClassName('.HUD_el')
            var theme = ns.ui.getTheme()
            removeByClassName('.HUD_sep')
            hook0.insertAdjacentHTML('beforebegin', `<hr class="HUD_sep HUD_el">`)
            hook1.insertAdjacentHTML('beforebegin', `<hr class="HUD_sep HUD_el">`)
            // ns.tprint(Object.keys(plr.corporation))

            if (plr.gang != null) {
                hook0.insertAdjacentHTML('beforeend', `<element class="HUD_GN_H HUD_el" title="The respect of your gang with the faction: ${plr.gang.facName}">GN respect</element><br class="HUD_el">`)
                colorByClassName(".HUD_GN_H", theme['cha'])

                hook1.insertAdjacentHTML('beforeend', `<element class="HUD_GN HUD_el">${ns.nFormat(plr.gang.respect, '0.00a') + '<br class="HUD_el">'}</element>`)
                colorByClassName(".HUD_GN", theme['cha'])
            }

            if (plr.corporation != null) {
                hook0.insertAdjacentHTML('beforeend', `<element class="HUD_CP_H HUD_el" title="The funds of your corporation: ${plr.corporation.name}">CP funds</element><br class="HUD_el">`)
                colorByClassName(".HUD_CP_H", theme['money'])

                hook1.insertAdjacentHTML('beforeend', `<element class="HUD_CP HUD_el">${ns.nFormat(plr.corporation.funds, '0.00a') + '<br class="HUD_el">'}</element>`)
                colorByClassName(".HUD_CP", theme['money'])
            }

            if (plr.bladeburner != null) {
                hook0.insertAdjacentHTML('beforeend', `<element class="HUD_BB_H HUD_el" title="Your bladeburner rank">BB rank</element><br class="HUD_el">`)
                colorByClassName(".HUD_BB_H", theme['int'])

                hook1.insertAdjacentHTML('beforeend', `<element class="HUD_BB HUD_el">${ns.nFormat(plr.bladeburner.rank, '0.00a') + '<br class="HUD_el">'}</element>`)
                colorByClassName(".HUD_BB", theme['int'])
            }



            //   if (prevScrInc != ns.nFormat(ns.getTotalScriptIncome()[0], '$0.00a')) {
            hook0.insertAdjacentHTML('beforeend', `<element class="HUD_ScrInc_H HUD_el" title="Money Gain from Scripts per Second">ScrInc</element>`)
            colorByClassName(".HUD_ScrInc_H", theme['money'])

            hook1.insertAdjacentHTML('beforeend', `<element class="HUD_ScrInc HUD_el">${ns.nFormat(ns.getTotalScriptIncome()[0], '$0.00a') + '/sec'}</element>`)
            colorByClassName(".HUD_ScrInc", theme['money'])
            //   }

            // if (prevScrExp != ns.nFormat(ns.getTotalScriptExpGain(), '0.00a')) {

            hook0.insertAdjacentHTML('beforeend', `<element class="HUD_ScrExp_H HUD_el" title="XP Gain from Scripts per Second"><br>ScrExp &nbsp;&nbsp;&nbsp;</element>`)
            colorByClassName(".HUD_ScrExp_H", theme['hack'])


            hook1.insertAdjacentHTML('beforeend', `<element class="HUD_ScrExp HUD_el"><br>${ns.nFormat(ns.getTotalScriptExpGain(), '0.00a') + 'xp/sec'}</element>`)
            colorByClassName(".HUD_ScrExp", theme['hack'])
            //   }

            //   if (prevKarma != ns.nFormat(findPlayer().karma, '0.00a')) {

            hook0.insertAdjacentHTML('beforeend', `<element class="HUD_Karma_H HUD_el" title="Your karma"><br>Karma &nbsp;&nbsp;&nbsp;</element>`)
            colorByClassName(".HUD_Karma_H", theme['hp'])

            hook1.insertAdjacentHTML('beforeend', `<element class="HUD_Karma HUD_el"><br>${ns.nFormat(plr.karma, '0.00a')}</element>`)
            colorByClassName(".HUD_Karma", theme['hp'])
            //  }

            //  if (prevKills != ns.nFormat(findPlayer().numPeopleKilled, '0a')) {
            removeByClassName('.HUD_Kills_H')
            hook0.insertAdjacentHTML('beforeend', `<element class="HUD_Kills_H HUD_el" title="Your kill count, increase every successful homicide"><br>Kills &nbsp;&nbsp;&nbsp;</element>`)
            colorByClassName(".HUD_Kills_H", theme['hp'])

            removeByClassName('.HUD_Kills')
            hook1.insertAdjacentHTML('beforeend', `<element class="HUD_Kills HUD_el"><br>${ns.nFormat(findPlayer().numPeopleKilled, '0a')}</element>`)
            colorByClassName(".HUD_Kills", theme['hp'])
            //   }
            var prevScrInc = ns.nFormat(ns.getTotalScriptIncome()[0], '$0.00a') + '/sec'
            var prevScrExp = ns.nFormat(ns.getTotalScriptExpGain(), '0.00a') + 'xp/sec'
            var prevKarma = ns.nFormat(findPlayer().karma, '0.00a')
            var prevKills = ns.nFormat(findPlayer().numPeopleKilled, '0a')
            var theme = ns.ui.getTheme()


            // TODO: Add more neat stuff

            // Now drop it into the placeholder elements
            //hook0.innerText = headers.join(" \n");
            //hook1.innerText = values.join("\n");
        } catch (err) { // This might come in handy later
            ns.print("ERROR: Update Skipped: " + String(err));
        }
        ns.atExit(function() {
            removeByClassName('.HUD_el');
        })
        await ns.sleep(200);
    }


}
