/** @param {NS} ns **/
export async function main(ns) {
    /*
        Original script by: u/I_hate_you_wasTaken, (https://www.reddit.com/r/Bitburner/comments/10urhbn/custom_overview_stats_but_better/)
        
        UPDATE 2/25/2023: 

        after the v2.2.2 release on 2/21/2023, the findPlayer() method used in the original script for 'globalThis.webpackJsonp.push()' and payload_id, stopped working.
        
        I refactored the script to use ns.getPlayer() and ns.gang.getGangInformation() as well as other methods to build out the previous data, and some new data for the HUD. 
        
        The HUD now also shows the following:    
            • City
            • Location
            • Faction
            • Gang Respect
            • Gang Income
            • Scripts Income $/sec
            • Script Experience XP/sec
            • Karma
            • Kills

        This has been tested on v2.2.2 (d3f9554a), and it is working/stable. 
 
        - u/DukeNukemDad    
    */
    
    // ns.clearLog();
    // ns.tail();

    const args = ns.flags([["help", false]]);
    if (args.help) {
        ns.tprint("This script will enhance your HUD (Heads up Display) with custom statistics.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    const doc = eval('document');
    const removeByClassName = (sel) => doc.querySelectorAll(sel).forEach(el => el.remove());
    const colorByClassName = (sel, col) => doc.querySelectorAll(sel).forEach(el => el.style.color = col);
    const hook0 = doc.getElementById('overview-extra-hook-0');
    const hook1 = doc.getElementById('overview-extra-hook-1');

    var theme = ns.ui.getTheme()

    while (true) {

        try {

            let player = ns.getPlayer();

            const gangInfo = ns.gang.getGangInformation();
            const gangFaction = gangInfo.faction;
            const gangIncome = ns.formatNumber(ns.gang.getGangInformation().moneyGainRate * 5, 2);  // A tick is every 200ms. To get the actual money/sec, multiple moneyGainRate by 5.
            const gangRespect = ns.formatNumber(ns.gang.getGangInformation().respect, 5);

            const playerCity = player.city; // city
            const playerLocation = player.location; // location
            const playerKills = player.numPeopleKilled; // numPeopleKilled
            const playerKarma = ns.heart.break();

            let purchased_servers = ns.getPurchasedServers(); // get every bought server if exists, else just create our blank array and add home to it.
            purchased_servers.push("home"); // add home to the array.
            let cumulative = 0;
            for (let pserv of purchased_servers) {
                let gains = 0;
                for (const script of ns.ps(pserv)) {
                    const s = ns.getRunningScript(script.pid)
                    if (s.onlineRunningTime > 0) gains += s.onlineMoneyMade / s.onlineRunningTime
                }
                cumulative += gains;
            }

            const scriptIncome = ns.formatNumber(cumulative, 2); // $/sec
            const scriptXP = ns.formatNumber(ns.getTotalScriptExpGain(), 2); // xp/sec

            // End paramaters, begin CSS: 

            removeByClassName('.HUD_el');
            var theme = ns.ui.getTheme();
            removeByClassName('.HUD_sep');

            hook0.insertAdjacentHTML('beforebegin', `<hr class="HUD_sep HUD_el">`);
            hook1.insertAdjacentHTML('beforebegin', `<hr class="HUD_sep HUD_el">`);

            // playerCity
            hook0.insertAdjacentHTML('beforeend', `<element class="HUD_GN_C HUD_el" title="The name of your gang faction.">City </element><br class="HUD_el">`)
            colorByClassName(".HUD_GN_C", theme['cha'])
            hook1.insertAdjacentHTML('beforeend', `<element class="HUD_GN_C HUD_el">${playerCity + '<br class="HUD_el">'}</element>`)
            colorByClassName(".HUD_GN_C", theme['cha'])

            // playerLocation
            hook0.insertAdjacentHTML('beforeend', `<element class="HUD_GN_L HUD_el" title="The name of your gang faction.">Location </element><br class="HUD_el">`)
            colorByClassName(".HUD_GN_L", theme['cha'])
            hook1.insertAdjacentHTML('beforeend', `<element class="HUD_GN_L HUD_el">${playerLocation + '<br class="HUD_el">'}</element>`)
            colorByClassName(".HUD_GN_L", theme['cha'])


            if (gangInfo != null) {
                // gangFaction
                hook0.insertAdjacentHTML('beforeend', `<element class="HUD_GN_F HUD_el" title="The name of your gang faction.">Faction </element><br class="HUD_el">`)
                colorByClassName(".HUD_GN_F", theme['int'])
                hook1.insertAdjacentHTML('beforeend', `<element class="HUD_GN_F HUD_el">${gangFaction + '<br class="HUD_el">'}</element>`)
                colorByClassName(".HUD_GN_F", theme['int'])

                // gangRespect
                hook0.insertAdjacentHTML('beforeend', `<element class="HUD_GN_R HUD_el" title="The respect of your gang.">Gang Respect</element><br class="HUD_el">`)
                colorByClassName(".HUD_GN_R", theme['int'])
                hook1.insertAdjacentHTML('beforeend', `<element class="HUD_GN_R HUD_el">${gangRespect + '<br class="HUD_el">'}</element>`)
                colorByClassName(".HUD_GN_R", theme['int'])

                // gangIncome
                hook0.insertAdjacentHTML('beforeend', `<element class="HUD_GN_I HUD_el" title="The income of your gang.">Gang Income</element><br class="HUD_el">`)
                colorByClassName(".HUD_GN_I", theme['int'])
                hook1.insertAdjacentHTML('beforeend', `<element class="HUD_GN HUD_el">${"$" + gangIncome + '/sec<br class="HUD_el">'}</element>`)
                colorByClassName(".HUD_GN", theme['int'])
            }

            // scriptIncome
            hook0.insertAdjacentHTML('beforeend', `<element class="HUD_ScrInc_H HUD_el" title="Money Gain from Scripts per Second.">ScrInc</element>`)
            colorByClassName(".HUD_ScrInc_H", theme['money'])
            hook1.insertAdjacentHTML('beforeend', `<element class="HUD_ScrInc HUD_el">${"$" + scriptIncome + '/sec'}</element>`)
            colorByClassName(".HUD_ScrInc", theme['money'])

            // scriptXP
            hook0.insertAdjacentHTML('beforeend', `<element class="HUD_ScrExp_H HUD_el" title="XP Gain from Scripts per Second."><br>ScrExp &nbsp;&nbsp;&nbsp;</element>`)
            colorByClassName(".HUD_ScrExp_H", theme['hack'])
            hook1.insertAdjacentHTML('beforeend', `<element class="HUD_ScrExp HUD_el"><br>${scriptXP + ' XP/sec'}</element>`)
            colorByClassName(".HUD_ScrExp", theme['hack'])

            // playerKarma
            hook0.insertAdjacentHTML('beforeend', `<element class="HUD_Karma_H HUD_el" title="Your karma."><br>Karma &nbsp;&nbsp;&nbsp;</element>`)
            colorByClassName(".HUD_Karma_H", theme['hp'])
            hook1.insertAdjacentHTML('beforeend', `<element class="HUD_Karma HUD_el"><br>${playerKarma}</element>`)
            colorByClassName(".HUD_Karma", theme['hp'])


            removeByClassName('.HUD_Kills_H')

            // playerKills
            hook0.insertAdjacentHTML('beforeend', `<element class="HUD_Kills_H HUD_el" title="Your kill count, increases every successful homicide."><br>Kills &nbsp;&nbsp;&nbsp;</element>`)
            colorByClassName(".HUD_Kills_H", theme['hp'])
            removeByClassName('.HUD_Kills')
            hook1.insertAdjacentHTML('beforeend', `<element class="HUD_Kills HUD_el"><br>${playerKills}</element>`)
            colorByClassName(".HUD_Kills", theme['hp'])

            var theme = ns.ui.getTheme()

        } catch (err) {
            ns.print("ERROR: Update Skipped: " + String(err));
        }

        ns.atExit(function () { removeByClassName('.HUD_el'); })
        await ns.sleep(200);
    }
}
