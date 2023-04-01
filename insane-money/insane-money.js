/** @param {NS} ns **/
export async function main(ns) {
    /*
        Adapted from `OP.ns` written by u/__Aimbot__
        found @ https://www.reddit.com/r/Bitburner/comments/rm48o1/the_best_hacking_approach_ive_seen_so_far/
    
        Updated 2/19/2023:
        -----------------
        Added the ability to run this on every servers from the one host. 
        Added ServerLis() to return an array of servers to hack dynamically.
        Excluded unwanted servers.
        Applied new maxRam implmentation from u/InactiveTerm.
        Removed fserver, player redundancies.
        Applied check for if we have enough RAM to do a full run and runs at minimum security level, from u/Jsmall6120.
        Only need to use protected_targets when scanning ALL servers to hack. If only doing a few, it's ignored.
    */
    //ns.disableLog("ALL");
    //ns.clearLog();
    //ns.tail();

    await ns.sleep(2000);

    var p_server = ns.getHostname(); // server to run scripts from
    var i = 0;
    var c = 0;
    var player = ns.getPlayer();

    var contstantRam = ns.getScriptRam("insane-money.ns"); //grabbing script RAM values
    var hackscriptRam = ns.getScriptRam("insane-hack.js");
    var growscriptRam = ns.getScriptRam("insane-grow.js");
    var weakenscriptRam = ns.getScriptRam("insane-weaken.js");

    // -----------------------------------

    var servers = [];

    // Grab the TOP $$$ from running the 'bestmoney' alias ... 'run find-targets.js maxMoney'
    var toptargets = ["ecorp", "megacorp", "nwo", "kuai-gong", "blade", "omnitek", "4sigma", "b-and-a", "clarkinc", "deltaone", "fulcrumtech"]; // serverList(ns); <--- grabbing all the servers is fine, but maxing out the TOP 10 from bestmoney is more fun.

    // add toptargets TO servers2
    toptargets.forEach(p => {
        servers.push(p);
    });

    // Grab all servers
    var servers3 = serverList(ns);

    servers3.forEach(p => {
        servers.push(p);
    });

    // List all the servers to AVOID
    var protected_targets = [".", "home", "darkweb", "CSEC", "I.I.I.I", "run4theh111z", "avmnite-02h", "The-Cave", "w0r1d_d43m0n",
        "pserv-0", "pserv-1", "pserv-2", "pserv-3", "pserv-4", "pserv-5", "pserv-6", "pserv-7", "pserv-8", "pserv-9",
        "pserv-10", "pserv-11", "pserv-12", "pserv-13", "pserv-14", "pserv-15", "pserv-16", "pserv-17", "pserv-18", "pserv-19", "pserv-20",
        "pserv-21", "pserv-22", "pserv-23", "pserv-24"]; // avoid these.

    // Now make a CLEAN list of hackable servers
    var unprotected_targets = servers.filter(function (server) {
        return protected_targets.indexOf(server) < 0;
    });


    let unique = [];
    for (i = 0; i < unprotected_targets.length; i++) {
        if (unique.indexOf(unprotected_targets[i]) === -1) {

            var our_HackingLevel = ns.getHackingLevel(); // Get our Hack level.
            var required_ServerHackingLevel = ns.getServerRequiredHackingLevel(unprotected_targets[i]); // Get the target's required Hack level.
            // Only hack if our hack level is greater that the server's required hacking level.
            if (our_HackingLevel >= required_ServerHackingLevel) {

                unique.push(unprotected_targets[i]);

            }
        }
    }

    unprotected_targets = []; // clear it

    unique.forEach(p => {
        unprotected_targets.push(p);
    });

    for (let x = 0; x < unprotected_targets.length; x++) {
        let target = unprotected_targets[x]; // host to hack
        ns.print(target);
    }

    var selected_target = [];

    if (p_server == "home") { selected_target.push("global-pharm"); }

    // temporary hack / Only applies if he we have 25 p-servers
    if (p_server == "pserv-0") { selected_target.push(unprotected_targets[0]); }
    if (p_server == "pserv-1") { selected_target.push(unprotected_targets[1]); }
    if (p_server == "pserv-2") { selected_target.push(unprotected_targets[2]); }
    if (p_server == "pserv-3") { selected_target.push(unprotected_targets[3]); }
    if (p_server == "pserv-4") { selected_target.push(unprotected_targets[4]); }
    if (p_server == "pserv-5") { selected_target.push(unprotected_targets[5]); }
    if (p_server == "pserv-6") { selected_target.push(unprotected_targets[6]); }
    if (p_server == "pserv-7") { selected_target.push(unprotected_targets[7]); }
    if (p_server == "pserv-8") { selected_target.push(unprotected_targets[8]); }
    if (p_server == "pserv-9") { selected_target.push(unprotected_targets[9]); }

    if (p_server == "pserv-10") { selected_target.push(unprotected_targets[randomIntFromInterval(10, unprotected_targets.length)]); }
    if (p_server == "pserv-11") { selected_target.push(unprotected_targets[randomIntFromInterval(10, unprotected_targets.length)]); }
    if (p_server == "pserv-12") { selected_target.push(unprotected_targets[randomIntFromInterval(10, unprotected_targets.length)]); }
    if (p_server == "pserv-13") { selected_target.push(unprotected_targets[randomIntFromInterval(10, unprotected_targets.length)]); }
    if (p_server == "pserv-14") { selected_target.push(unprotected_targets[randomIntFromInterval(10, unprotected_targets.length)]); }
    if (p_server == "pserv-15") { selected_target.push(unprotected_targets[randomIntFromInterval(10, unprotected_targets.length)]); }
    if (p_server == "pserv-16") { selected_target.push(unprotected_targets[randomIntFromInterval(10, unprotected_targets.length)]); }
    if (p_server == "pserv-17") { selected_target.push(unprotected_targets[randomIntFromInterval(10, unprotected_targets.length)]); }
    if (p_server == "pserv-18") { selected_target.push(unprotected_targets[randomIntFromInterval(10, unprotected_targets.length)]); }
    if (p_server == "pserv-19") { selected_target.push(unprotected_targets[randomIntFromInterval(10, unprotected_targets.length)]); }
    if (p_server == "pserv-20") { selected_target.push(unprotected_targets[randomIntFromInterval(10, unprotected_targets.length)]); }
    if (p_server == "pserv-21") { selected_target.push(unprotected_targets[randomIntFromInterval(10, unprotected_targets.length)]); }
    if (p_server == "pserv-22") { selected_target.push(unprotected_targets[randomIntFromInterval(10, unprotected_targets.length)]); }
    if (p_server == "pserv-23") { selected_target.push(unprotected_targets[randomIntFromInterval(10, unprotected_targets.length)]); }
    if (p_server == "pserv-24") { selected_target.push(unprotected_targets[randomIntFromInterval(10, unprotected_targets.length)]); }

    // -----------------------------------

    while (true) {

        for (var x = 0; x < selected_target.length; x++) { // Always one target.

            var server = selected_target[x]; // host to hack

            var fserver = ns.getServer(server);

            var maxRam = (ns.getServerMaxRam(p_server) - 10000 - contstantRam); // u/InactiveTerm

            var weakenThreads = (2000 - ((ns.getServerMinSecurityLevel(server)) / 0.05));
            var maxGrowThreads = ((maxRam / growscriptRam) - (weakenscriptRam * 2000));

            var cs = ns.getServerSecurityLevel(server);
            var ms = ns.getServerMinSecurityLevel(server);
            var mm = ns.getServerMaxMoney(server);
            var ma = ns.getServerMoneyAvailable(server);

            //Priming the server.  Max money and Min security must be acheived for this to work
            if ((ma < mm) == true) {
                ns.exec('insane-weaken.js', p_server, 2000, server, 0);
                ns.exec('insane-grow.js', p_server, Math.floor(maxGrowThreads), server, 0);

                var WeakenTime = (ns.formulas.hacking.weakenTime(fserver, player));

                await ns.sleep(WeakenTime + 1000);

                mm = ns.getServerMaxMoney(server);
                ma = ns.getServerMoneyAvailable(server);
                cs = ns.getServerSecurityLevel(server);
                ms = ns.getServerMinSecurityLevel(server);
            }

            //If Max Money is true, making sure security level is at its minimum
            if ((cs > ms) == true) {
                ns.exec('insane-weaken.js', p_server, 2000, server, 0);

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

                var UsedRam = ns.getServerUsedRam(p_server);

                {
                    // original.
                    // if ((totalRamForRun >= (maxRam - UsedRam)) == false) //making sure I have enough RAM to do a full run
                }
                if ((totalRamForRun >= (maxRam - UsedRam)) == false && cs == ms) // making sure I have enough RAM to do a full run and runs at minimum security level. - u/Jsmall6120
                {
                    try { ns.exec('insane-weaken.js', p_server, weakenThreads, server, wsleep, i); } catch (err) { ns.print(err); }
                    try { ns.exec('insane-grow.js', p_server, growThreads, server, gsleep, i); } catch (err) { ns.print(err); }
                    try { ns.exec('insane-hack.js', p_server, hackThreads, server, hsleep, i); } catch (err) { ns.print(err); }

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


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
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
