/** @param {NS} ns **/
export async function main(ns) {
/*
    Adapted from `OP.ns` written by u/__Aimbot__ you, 
    found @ https://www.reddit.com/r/Bitburner/comments/rm48o1/the_best_hacking_approach_ive_seen_so_far/

    Updated 2/19/2023:
    -----------------
    Added the ability to run this on every servers from the one host. 
    Added ServerLis() to return an array of servers to hack dynamically.
    Excluded unwanted servers.
    Applied new maxRam implmentation from u/InactiveTerm.
    Removed fserver, player redundancies.
    Applied check for if we have enough RAM to do a full run and runs at minimum security level, from u/Jsmall6120.
    
    PERSONAL NOTE: Running this for 10 minutes, I reached $75b/sec. THAT IS INSANE!!! - u/DukeNukemDad
*/
    //ns.disableLog("ALL");
    ns.clearLog();
    ns.tail();

    var server2 = ns.getHostname(); // server to run scripts from
    var i = 0;
    var c = 0;
    var player = ns.getPlayer();

    var contstantRam = ns.getScriptRam("insane-money.ns"); //grabbing script RAM values
    var hackscriptRam = ns.getScriptRam("insane-hack.js");
    var growscriptRam = ns.getScriptRam("insane-grow.js");
    var weakenscriptRam = ns.getScriptRam("insane-weaken.js");

    // -----------------------------------

    // ONLY the TOP FOUR from 'bestmoney' alias ... 'run find-targets.js maxMoney'
    var servers = ["ecorp", "megacorp", "blade", "nwo"]; // serverList(ns); <--- grabbing all the servers is fine, but testing on the TOP 4 is more fun.
    var protected_targets = ["home", "pserv-1", "darkweb", "CSEC", "I.I.I.I", "run4theh111z", "avmnite-02h", "The-Cave", "w0r1d_d43m0n"]; // avoid these.
    var unprotected_targets = servers.filter(function (server) {
        return protected_targets.indexOf(server) < 0;
    });

    var hosts = []; // build it

    // fill it
    unprotected_targets.forEach(p => {
        hosts.push(p);
    });

    // -----------------------------------

    while (true) {

        for (var x = 0; x < unprotected_targets.length; x++) {

            var server = unprotected_targets[x]; // host to hack
            var fserver = ns.getServer(server); 
            {
                // original.
                // var maxRam = (ns.getServerMaxRam(server2) - contstantRam); //getting total RAM I can use that doesnt include the OP script
            }
            var maxRam = (ns.getServerMaxRam(server2) - 10000 - contstantRam); // u/InactiveTerm

            var weakenThreads = (2000 - ((ns.getServerMinSecurityLevel(server)) / 0.05));
            var maxGrowThreads = ((maxRam / growscriptRam) - (weakenscriptRam * 2000));

            var cs = ns.getServerSecurityLevel(server);
            var ms = ns.getServerMinSecurityLevel(server);
            var mm = ns.getServerMaxMoney(server);
            var ma = ns.getServerMoneyAvailable(server);

            //Priming the server.  Max money and Min security must be acheived for this to work
            if ((ma < mm) == true) {
                ns.exec('insane-weaken.js', server2, 2000, server, 0);
                ns.exec('insane-grow.js', server2, maxGrowThreads, server, 0);

                var WeakenTime = (ns.formulas.hacking.weakenTime(fserver, player));
                
                await ns.sleep(WeakenTime + 1000);

                mm = ns.getServerMaxMoney(server);
                ma = ns.getServerMoneyAvailable(server);
                cs = ns.getServerSecurityLevel(server);
                ms = ns.getServerMinSecurityLevel(server);
            }

            //If Max Money is true, making sure security level is at its minimum
            if ((cs > ms) == true) {
                ns.exec('insane-weaken.js', server2, 2000, server, 0);

                WeakenTime = (ns.formulas.hacking.weakenTime(fserver, player));

                await ns.sleep(WeakenTime + 1000);

                cs = ns.getServerSecurityLevel(server);
                ms = ns.getServerMinSecurityLevel(server);
            }

            // Refreshing server stats now that the security level is at the minmum, and maybe our player stats have changed as priming can take a while
            var HPercent = (ns.formulas.hacking.hackPercent(fserver, player) * 100);
            var GPercent = (ns.formulas.hacking.growPercent(fserver, 1, player, 1));

            WeakenTime = (ns.formulas.hacking.weakenTime(fserver, player));

            var GrowTime = (ns.formulas.hacking.growTime(fserver, player));
            var HackTime = (ns.formulas.hacking.hackTime(fserver, player));

            var growThreads = Math.round(((5 / (GPercent - 1)))); //Getting the amount of threads I need to grow 200%.  I only need 100% but I'm being conservative here
            var hackThreads = Math.round((50 / HPercent)); //Getting the amount of threads I need to hack 50% of the funds

            weakenThreads = Math.round((weakenThreads - (growThreads * 0.004))); //Getting required threads to fully weaken the server

            var totalRamForRun = (hackscriptRam * hackThreads) + (growscriptRam * growThreads) + (weakenscriptRam * weakenThreads) //Calculating how much RAM is used for a single run
            var sleepTime = (WeakenTime / (maxRam / totalRamForRun)) //finding how many runs this server can handle and setting the time between run execution

            var shiftCount = maxRam / totalRamForRun;
            var offset = sleepTime / 2;
            var gOffset = offset / 4;
            var hOffset = offset / 2;

            for (var j = 0; j < 100000; j++) {

                var wsleep = 0; //At one point I made the weaken call sleep so I've kept it around
                var gsleep = ((WeakenTime - GrowTime - gOffset)); //Getting the time to have the Growth execution sleep, then shaving some off to beat the weaken execution
                var hsleep = ((WeakenTime - HackTime - hOffset)); //Getting time for hack, shaving off more to make sure it beats both weaken and growth

                var UsedRam = ns.getServerUsedRam(server2);

                {
                    // original.
                    // if ((totalRamForRun >= (maxRam - UsedRam)) == false) //making sure I have enough RAM to do a full run
                }                
                if ((totalRamForRun >= (maxRam - UsedRam)) == false && cs == ms) // making sure I have enough RAM to do a full run and runs at minimum security level. - u/Jsmall6120
                {
                    try { ns.exec('insane-weaken.js', server2, weakenThreads, server, wsleep, i); } catch (err) { ns.print(err); }
                    try { ns.exec('insane-grow.js', server2, growThreads, server, gsleep, i); } catch (err) { ns.print(err); }
                    try { ns.exec('insane-hack.js', server2, hackThreads, server, hsleep, i); } catch (err) { ns.print(err); }

                    if (c < shiftCount) {
                        await ns.sleep(sleepTime);
                        c++
                    } else {
                        await ns.sleep(sleepTime + offset);
                        c = 0;
                    }

                    i++
                } else {
                    await ns.sleep(1);
                }
            }
            await ns.sleep(1);
        }
    }
}

// Return an array of servers to hack dynamically 
function serverList(ns, current = "home", set = new Set()) {
    let connections = ns.scan(current);
    let next = connections.filter(c => !set.has(c));
    next.forEach(n => {
        set.add(n);
        return serverList(ns, n, set);
    });
    return Array.from(set.keys());
}
