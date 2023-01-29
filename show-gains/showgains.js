import {
    TextTransforms
} from "./text-transform.js";

/** @param {NS} ns */
export async function main(ns) {

    ns.disableLog("ALL");
    ns.clearLog();
    ns.tail();

    while (true) {

        let longest = 0;

        let purchased_servers = ns.getPurchasedServers(); // get every bought server.

        purchased_servers.push("home"); // add home to the array.

        for (let pserv of purchased_servers) {
            longest = Math.max(pserv.length, longest)
        };

        ns.clearLog();

        let time = new Date().toLocaleTimeString();
        let date = new Date().toLocaleDateString();
        let dt = '[' + date + ' ' + time + '] ';
        let cumulative = 0;

        for (let pserv of purchased_servers) {

            let gains = 0;

            for (const script of ns.ps(pserv)) {
                const s = ns.getRunningScript(script.pid)
                if (s.onlineRunningTime > 0) gains += s.onlineMoneyMade / s.onlineRunningTime
            }

            if (gains <= 0.999) {
                ns.print(dt + " " + pserv.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.White]));

            } else if (gains > 0.999 && gains <= 999) {
                ns.print(dt + " " + pserv.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.Orange]));

            } else if (gains >= 1000 && gains <= 9999) {
                ns.print(dt + " " + pserv.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.Green]));

            } else if (gains >= 10000 && gains <= 99999) {
                ns.print(dt + " " + pserv.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.LGreen]));

            } else if (gains >= 100000 && gains <= 999999) {
                ns.print(dt + " " + pserv.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.LGreen]));

            } else if (gains >= 1000000) {
                ns.print(dt + " " + pserv.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.LCyan]));
            }

            cumulative += gains;
        }

        ns.print('\n');
        ns.print(dt + " " + " all-svrs" + ": " + TextTransforms.apply(ns.nFormat(cumulative, "0.000a"), [TextTransforms.Color.LGreen]) + " / sec");

        await ns.sleep(1000);
    }
}
