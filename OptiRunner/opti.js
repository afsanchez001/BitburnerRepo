/*
    Original script is from Reddit post @ https://www.reddit.com/r/Bitburner/comments/s81lg7/4_hacking_scripts_and_over_8_billions_per_second/

    NOTE:   
            (1/14/23) 
            I wrote a launcher to put files (opti.js, optiUtil.js, optiHack.js, optiGrow.js, optiWeaken.js) on all my purchased servers 
            pserv-0 through pserv-24.
            
            Each pserv is running 1PB of RAM (might be overkill?), I don't know.

            Also, I created an array of the purchased servers to use as a protected list so that we do not hack them.    
    UPDATE: 
            (1/28/23) 
            I removed the ns declared outside the scope of main, and am now passing the ns handle through to all functions from main.
            Actually, I decalred all the functions to be within the scope of main trying to kill 2 birds with 1 stone.

                So: 
                    let ns;
                    ns = _ns;

                is now:
                    function main(ns) ...

            Also, I removed the single_target argument. This script will only iterate through ALL available targets.

            And, I added port vulnerability programs (BruteSSH, FTPCrack, etc.), and 'Nuke' incase we need it.
*/

import {
    millisecondsToString,
    getServerNames
} from "optiUtil.js"

const HACK_SCRIPT = "optiHack.js"
const GROW_SCRIPT = "optiGrow.js"
const WEAKEN_SCRIPT = "optiWeaken.js"

/** @type {NS} **/
export async function main(ns) {

    ns.disableLog("ALL");
    ns.clearLog();

    const worker = ns.getHostname(); // ns.args[0], leave parameter empty from launcher, because we are running from here, where this was copied to, i.e.(pserv-0, pserv-1, etc.).
    
    let targets = {};

    var protected_targets = ["home", "pserv-0", "pserv-1", "pserv-2", "pserv-3", "pserv-4", "pserv-5", "pserv-6", "pserv-7", "pserv-8", "pserv-9", "pserv-10", "pserv-11", "pserv-12", "pserv-13", "pserv-14", "pserv-15", "pserv-16", "pserv-17", "pserv-18", "pserv-19", "pserv-20", "pserv-21", "pserv-22", "pserv-23", "pserv-24"];
    
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
                } else {
                    // open all possible ports on every server; then attempt to nuke the server
                    try {
                        if (ns.fileExists("BruteSSH.exe")) {
                            ns.brutessh(hostname);
                        }
                        if (ns.fileExists("FTPCrack.exe")) {
                            ns.FTPCrack(hostname);
                        }
                        if (ns.fileExists("relaySMTP.exe")) {
                            ns.relaysmtp(hostname);
                        }
                        if (ns.fileExists("HTTPWorm.exe")) {
                            ns.httpworm(hostname);
                        }
                        if (ns.fileExists("SQLInject.exe")) {
                            ns.sqlinject(hostname);
                        }
                    } catch (Err) {
                        ns.print("cannot crack port for: " + hostname + ", (" + Err + ")");
                    }

                    try {
                        ns.nuke(hostname); // Nuke it!
                    } catch (Err) {
                        ns.print("cannot nuke: " + hostname + ", (" + Err + ")");
                    }
                }
            }
        }
    });
    
    await uploadScripts(ns, worker);
    await hackLoop(ns, worker, targets);

    async function uploadScripts(ns, worker) {
        await ns.scp(HACK_SCRIPT, worker);
        await ns.scp(GROW_SCRIPT, worker);
        await ns.scp(WEAKEN_SCRIPT, worker);
    }

    async function hackLoop(ns, worker, targets) {

        const updateInterval = 500;

        while (true) {
            
            await ns.sleep(updateInterval);

            for (const [target, meta] of Object.entries(targets)) {
                
                meta.msDone -= updateInterval;

                if (meta.msDone < 0) {
                    if (meta.nextAction === "INIT") {
                        init(ns, worker, target, meta)
                    } else if (meta.nextAction === "WEAKEN") {
                        // Only weaken if security > minSecurity on the target-server.
                        if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
                          await weaken(ns, worker, target, meta);
                        }
                    } else if (meta.nextAction === "GROW") {
                        // Only grow the target while money < maxMoney.
                        if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
                            grow(ns, worker, target, meta);
                        }
                    } else if (meta.nextAction === "HACK") {
                        var our_HackingLevel = ns.getHackingLevel(); // Get our Hack level.
                        var required_ServerHackingLevel = ns.getServerRequiredHackingLevel(target); // Get the target's required Hack level.
                        // Only hack if our hack level is greater that the server's required hacking level.
                        if (our_HackingLevel >= required_ServerHackingLevel) {
                            hack(ns, worker, target, meta);
                        }
                    }
                }
            }
        }
    }

    function init(ns, worker, target, meta) {
        log(ns, `exec ${meta.nextAction} on ${target}`);
        meta.raisedSecurityLevel = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
        log(ns, `initial weaken of ${target} ${meta.raisedSecurityLevel}`);
        meta.nextAction = "WEAKEN";
    }

    async function weaken(ns, worker, target, meta) {
        log(ns, `exec ${meta.nextAction} on ${target}`);


        //let weakenThreads = 0;
        let weakenThreads = meta.raisedSecurityLevel / 0.05;
        
        //while (ns.weakenAnalyze(weakenThreads++, 1) <= meta.raisedSecurityLevel) {}
        while (ns.weakenAnalyze(weakenThreads++, 1) <= meta.raisedSecurityLevel) 
        { 
            //await ns.sleep(0); 
        }


        if (weakenThreads > 0) {
            log(ns, `weakening with ${weakenThreads} threads (${millisecondsToString(ns.getWeakenTime(target))})`);
            try {
                const wait = attack(ns, "weaken", target, weakenThreads, worker);
                if (wait >= 0) {
                    meta.msDone = wait;
                    meta.raisedSecurityLevel = 0;
                    meta.nextAction = "GROW";
                }
            } catch (Err) {
                log(ns, worker);
                log(ns, Err); 
                log(ns, `Skipping weaken() on ${target} due to 0 threads being available.`);
            }
        } else {
            meta.msDone = 0;
            meta.nextAction = "GROW";
        }
    }

     function grow(ns, worker, target, meta) {
        log(ns, `exec ${meta.nextAction} on ${target}`);

        const growThreads = calcNumberOfThreadsToGrowToMax(ns, target);

        if (growThreads > 0) {
            log(ns, `growing with ${growThreads} threads (${millisecondsToString(ns.getGrowTime(target))})`);

            try {
                const wait = attack(ns, "grow", target, growThreads, worker);
                if (wait >= 0) {
                    meta.msDone = wait;
                    meta.raisedSecurityLevel += ns.growthAnalyzeSecurity(growThreads);
                    meta.nextAction = "HACK";
                }
            } catch (Err) {
                log(ns, worker);
                log(ns, Err);
                log(ns, `Skipping grow() on ${target} due to 0 threads being available.`);
            }
        } else {
            meta.msDone = 0;
            meta.nextAction = "HACK";
        }

        function calcNumberOfThreadsToGrowToMax(ns, target) {
            const maxMoney = ns.getServerMaxMoney(target);
            const availableMoney = ns.getServerMoneyAvailable(target);
            const alpha = (availableMoney > 0 ? (1 / (availableMoney / maxMoney)) : 100);
            return Math.round(ns.growthAnalyze(target, alpha, 1));
        }
    }

     function hack(ns, worker, target, meta) {
        log(ns, `exec ${meta.nextAction} on ${target}`);

        const partHackableMoney = ns.hackAnalyze(target);
        const hackThreads = Math.floor(1 / partHackableMoney / (100 / meta.hackPercent));

        if (hackThreads > 0) {
            log(ns, `hacking with ${hackThreads} threads (${millisecondsToString(ns.getHackTime(target))})`);
            try {
                const wait = attack(ns, "hack", target, hackThreads, worker);
                if (wait >= 0) {
                    meta.msDone = wait;
                    meta.raisedSecurityLevel += ns.hackAnalyzeSecurity(hackThreads);
                    meta.nextAction = "WEAKEN";
                }
            } catch (Err) {
                log(ns, worker); 
                log(ns, Err); 
                log(ns, `Skipping hack() on ${target} due to 0 threads being available.`);
            }
        } else {
            meta.msDone = 0;
            meta.nextAction = "WEAKEN";
        }
    }

    function attack(ns, type, target, maxThreads, worker) {
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
        const maxThreadsRam = calcMaxThreadsRam(ns, worker, scriptName);
        const threads = Math.min(maxThreads, maxThreadsRam);

        log(ns, `ns.exec ${scriptName} ${worker} ${threads} ${target} ${wait}`);
        if (ns.exec(scriptName, worker, threads, target) === 0) {
            log(ns, `Could not exec ${scriptName} on ${worker}. Ram full? Root?`);
            return -1;
        }

        return wait;

        function calcMaxThreadsRam(ns, worker, script) {
            const freeRam = ns.getServerMaxRam(worker) - ns.getServerUsedRam(worker);
            return Math.floor(freeRam / ns.getScriptRam(script, worker));
        }
    }

    function log(ns, message) {
        ns.print(`${new Date().toLocaleTimeString()} ${message}`)
    }
}

export function autocomplete(data, args) {
    return [...data.servers]; // This script autocompletes the list of servers.
}
