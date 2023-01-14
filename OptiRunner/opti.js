/*
    Original script is from Reddit post @ https://www.reddit.com/r/Bitburner/comments/s81lg7/4_hacking_scripts_and_over_8_billions_per_second/

    NOTE:   I use a launcher to put files (opti.js, optiUtil.js, optiHack.js, optiGrow.js, optiWeaken.js) on all my purchased servers 
            pserv-0 through pserv-24.
            
            Each pserv is running 1PB of RAM (might be overkill?), I don't know.

            Also, I create an array of the purchased servers to use as a protected list so that we do not hack them.
*/
import {
    millisecondsToString,
    getServerNames
} from "optiUtil.js"

const HACK_SCRIPT = "optiHack.js"
const GROW_SCRIPT = "optiGrow.js"
const WEAKEN_SCRIPT = "optiWeaken.js"

function log(message) {
    ns.print(`${new Date().toLocaleTimeString()} ${message}`)
}

/** @type {NS} **/
let ns;
export async function main(_ns) {
    ns = _ns;
    ns.disableLog("ALL");
    ns.clearLog();

    const worker = ns.getHostname(); // ns.args[0], leave parameter empty from launcher, because we are running from here, where this was copied to, i.e.(pserv-0, pserv-1, etc.).
    const singleTarget = ns.args[1]; // ns.args[1], make parameter false from launcher, so that we use ALL prepped servers for attack.

    let targets = {};

    var protected_targets = ["pserv-0", "pserv-1", "pserv-2", "pserv-3", "pserv-4", "pserv-5", "pserv-6", "pserv-7", "pserv-8", "pserv-9", "pserv-10", "pserv-11", "pserv-12", "pserv-13", "pserv-14", "pserv-15", "pserv-16", "pserv-17", "pserv-18", "pserv-19", "pserv-20", "pserv-21", "pserv-22", "pserv-23", "pserv-24"];

    if (singleTarget) {
        targets[singleTarget] = {
            nextAction: "INIT",
            msDone: 0,
            hackPercent: 90,
        }
    } else {
        getServerNames(ns).forEach(hostname => {
            // Only go forward if the hostname is NOT one of our purchased servers.
            if (!protected_targets.includes(hostname)) {

                var our_HackingLevel = ns.getHackingLevel(); // Get our Hack level.
                var required_ServerHackingLevel = ns.getServerRequiredHackingLevel(hostname); // Get the server's required Hack level.
                // Only go forward if server is prepped. Meaning our Hack level is higher than the server security level. And we have root access.
                if (our_HackingLevel >= required_ServerHackingLevel) {

                    // Only go forward if we have ROOT ACCESS to the hostname.
                    if (ns.getServerMaxMoney(hostname) > 0 && ns.getServerGrowth(hostname) > 1 && ns.hasRootAccess(hostname)) {
                        targets[hostname] = {
                            nextAction: "INIT",
                            msDone: 0,
                            hackPercent: 90,
                        }
                    }
                }
            }
        });
    }

    await uploadScripts(worker);
    await hackLoop(worker, targets);
}

async function uploadScripts(worker) {
    await ns.scp(HACK_SCRIPT, worker);
    await ns.scp(GROW_SCRIPT, worker);
    await ns.scp(WEAKEN_SCRIPT, worker);
}

async function hackLoop(worker, targets) {

    const updateInterval = 500;

    while (true) {

        await ns.sleep(updateInterval);

        for (const [target, meta] of Object.entries(targets)) {

            meta.msDone -= updateInterval;

            if (meta.msDone < 0) {
                if (meta.nextAction === "INIT") {
                    init(target, meta)
                } else if (meta.nextAction === "WEAKEN") {
                    weaken(target, meta)
                } else if (meta.nextAction === "GROW") {
                    grow(target, meta)
                } else if (meta.nextAction === "HACK") {
                    hack(target, meta)
                }
            }
        }
    }

    function init(target, meta) {
        log(`exec ${meta.nextAction} on ${target}`);
        meta.raisedSecurityLevel = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
        log(`initial weaken of ${target} ${meta.raisedSecurityLevel}`);
        meta.nextAction = "WEAKEN";
    }

    function weaken(target, meta) {
        log(`exec ${meta.nextAction} on ${target}`);

        let weakenThreads = 0;

        while (ns.weakenAnalyze(weakenThreads++, 1) <= meta.raisedSecurityLevel) {}

        if (weakenThreads > 0) {
            log(`weakening with ${weakenThreads} threads (${millisecondsToString(ns.getWeakenTime(target))})`);
            try {
                const wait = attack("weaken", worker, target, weakenThreads);
                if (wait >= 0) {
                    meta.msDone = wait;
                    meta.raisedSecurityLevel = 0;
                    meta.nextAction = "GROW";
                }
            } catch (Err) {
                log(`Skipping weaken() on ${target} due to 0 threads being available.`);
            }
        } else {
            meta.msDone = 0;
            meta.nextAction = "GROW";
        }
    }

    function grow(target, meta) {
        log(`exec ${meta.nextAction} on ${target}`);

        const growThreads = calcNumberOfThreadsToGrowToMax(target);

        if (growThreads > 0) {
            log(`growing with ${growThreads} threads (${millisecondsToString(ns.getGrowTime(target))})`);

            try {
                const wait = attack("grow", worker, target, growThreads);
                if (wait >= 0) {
                    meta.msDone = wait;
                    meta.raisedSecurityLevel += ns.growthAnalyzeSecurity(growThreads);
                    meta.nextAction = "HACK";
                }
            } catch (Err) {
                log(`Skipping grow() on ${target} due to 0 threads being available.`);
            }
        } else {
            meta.msDone = 0;
            meta.nextAction = "HACK";
        }

        function calcNumberOfThreadsToGrowToMax() {
            const maxMoney = ns.getServerMaxMoney(target);
            const availableMoney = ns.getServerMoneyAvailable(target);
            const alpha = (availableMoney > 0 ? (1 / (availableMoney / maxMoney)) : 100);
            return Math.round(ns.growthAnalyze(target, alpha, 1));
        }
    }

    function hack(target, meta) {
        log(`exec ${meta.nextAction} on ${target}`);

        const partHackableMoney = ns.hackAnalyze(target);
        const hackThreads = Math.floor(1 / partHackableMoney / (100 / meta.hackPercent));

        if (hackThreads > 0) {
            log(`hacking with ${hackThreads} threads (${millisecondsToString(ns.getHackTime(target))})`);
            try {
                const wait = attack("hack", worker, target, hackThreads);
                if (wait >= 0) {
                    meta.msDone = wait;
                    meta.raisedSecurityLevel += ns.hackAnalyzeSecurity(hackThreads);
                    meta.nextAction = "WEAKEN";
                }
            } catch (Err) {
                log(`Skipping hack() on ${target} due to 0 threads being available.`);
            }
        } else {
            meta.msDone = 0;
            meta.nextAction = "WEAKEN";
        }
    }
}

function attack(type, worker, target, maxThreads) {
    let wait = 0;

    let scriptName;

    if (type === "hack") {
        wait = ns.getHackTime(target);
        scriptName = HACK_SCRIPT;
    } else if (type === "grow") {
        wait = ns.getGrowTime(target);
        scriptName = GROW_SCRIPT;
    } else if (type === "weaken") {
        wait = ns.getWeakenTime(target);
        scriptName = WEAKEN_SCRIPT;
    } else {
        throw Error(`UNKNOWN TYPE: ${type}`);
    }
    const maxThreadsRam = calcMaxThreadsRam(scriptName);
    const threads = Math.min(maxThreads, maxThreadsRam);

    log(`ns.exec ${scriptName} ${worker} ${threads} ${target} ${wait}`);
    if (ns.exec(scriptName, worker, threads, target) === 0) {
        log(`Could not exec ${scriptName} on ${worker}. Ram full? Root?`);
        return -1;
    }

    return wait;

    function calcMaxThreadsRam(script) {
        const freeRam = ns.getServerMaxRam(worker) - ns.getServerUsedRam(worker);
        return Math.floor(freeRam / ns.getScriptRam(script, worker));
    }
}

export function autocomplete(data, args) {
    return [...data.servers]; // This script autocompletes the list of servers.
}
