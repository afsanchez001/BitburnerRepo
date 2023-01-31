/** @param {NS} ns */
export async function main(ns) {

    ns.disableLog('ALL');

    var servers = serverList(ns);
    var protected_targets = ["pserv-0", "pserv-1", "pserv-2", "pserv-3", "pserv-4", "pserv-5", "pserv-6", "pserv-7", "pserv-8", "pserv-9", "pserv-10", "pserv-11", "pserv-12", "pserv-13", "pserv-14", "pserv-15", "pserv-16", "pserv-17", "pserv-18", "pserv-19", "pserv-20", "pserv-21", "pserv-22", "pserv-23", "pserv-24", "home"];

    var unprotected_targets = servers.filter(function(server) {
        return protected_targets.indexOf(server) < 0;
    });

    // loop until we tell it to stop.
    while (true) {

        for (var i = 0; i < unprotected_targets.length; i++) {

            let server = unprotected_targets[i];

            let child_targets = ns.scan(server); // get child_targets of unprotected_targets

            // loop through all target servers.	
            for (var j = 0; j < child_targets.length; j++) {

                var target = child_targets[j];

                // ignore the target and server if they are one of our purchased servers or home listed in pserv[].
                if (!protected_targets.includes(target) && !protected_targets.includes(server)) {

                    // only go forward if we have ROOT ACCESS to both the server and target-server.
                    if (ns.hasRootAccess(server) && ns.hasRootAccess(target)) {

                        // Only weaken if security > minSecurity on the target-server.
                        if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {

                            let time = new Date().toLocaleTimeString();
                            let date = new Date().toLocaleDateString();

                            // HACK
                            var our_HackingLevel = ns.getHackingLevel(); // Get our Hack level.
                            var required_ServerHackingLevel = ns.getServerRequiredHackingLevel(target); // Get the target's required Hack level.
                            // Only hack if our hack level is greater that the server's required hacking level.
                            if (our_HackingLevel >= required_ServerHackingLevel) {
                                // We need to know how many threads are available on the server. 
                                let available_threads = threadCount(ns, server, 1.75); // 1.75Gb is the "script ram", that is the size of 'bin.hk.js'
                                available_threads = Math.floor(available_threads);
                                if (available_threads <= 0) {
                                    // ignore...
                                } else {
                                    let dt = '[' + date.padStart(10) + ' ' + time.padStart(11) + '] hacking ' + target + '[' + available_threads + ']' + '\n';
                                    ns.print(dt); // NEW, 12-18-2022
                                    ns.exec("bin.hk.js", "home", available_threads, target);
                                }
                            }

                            // WEAKEN
                            // Only weaken if security > minSecurity on the target-server.
                            if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
                                let available_threads = threadCount(ns, server, 1.8); // 1.8Gb is the "script ram", that is the size of 'bin.wk.js'
                                available_threads = Math.floor(available_threads);
                                if (available_threads <= 0) {
                                    // ignore...
                                } else {
                                    let dt = '[' + date.padStart(10) + ' ' + time.padStart(11) + '] weakening ' + target + '[' + available_threads + ']' + '\n';
                                    ns.print(dt); // NEW, 12-18-2022
                                    ns.exec("bin.wk.js", "home", available_threads, target);
                                }
                            }

                            // GROW
                            // Only grow the target while money < maxMoney.
                            if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
                                let available_threads = threadCount(ns, server, 1.8); // 1.8Gb is the "script ram", that is the size of 'bin.gr.js'
                                available_threads = Math.floor(available_threads);
                                if (available_threads <= 0) {
                                    // ignore...
                                } else {
                                    let dt = '[' + date.padStart(10) + ' ' + time.padStart(11) + '] growing ' + target + '[' + available_threads + ']' + '\n';
                                    ns.print(dt); // NEW, 12-18-2022
                                    ns.exec("bin.gr.js", "home", available_threads, target); 
                                }
                            }
                        }
                      
                    } else {
                        // open all possible ports on every server; then attempt to nuke the server
                        try {
                            if (ns.fileExists("BruteSSH.exe")) {
                                ns.brutessh(server);
                            }
                            if (ns.fileExists("FTPCrack.exe")) {
                                ns.ftpcrack(server);
                            }
                            if (ns.fileExists("relaySMTP.exe")) {
                                ns.relaysmtp(server);
                            }
                            if (ns.fileExists("HTTPWorm.exe")) {
                                ns.httpworm(server);
                            }
                            if (ns.fileExists("SQLInject.exe")) {
                                ns.sqlinject(server);
                            }
                        } catch {}

                        try {
                            ns.nuke(server); // Nuke it!
                        } catch {}
                    }
                }
                await ns.sleep(100);
            }
        }
        await ns.sleep(10);
    }
}

/* Return an array of servers to hack dynamically */
function serverList(ns, current = "home", set = new Set()) {
    let connections = ns.scan(current);
    let next = connections.filter(c => !set.has(c));
    next.forEach(n => {
        set.add(n);
        return serverList(ns, n, set);
    });
    return Array.from(set.keys());
}

// Convert hostname & scriptRam into a number of threads that represents the server's total capacity.
function threadCount(ns, hostname, scriptRam) {
    let threads = 0;
    let free_ram = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);
    threads = free_ram / scriptRam;
    return Math.floor(threads) // Flooring this returns an integer. Avoids returning half a thread, or 1.5 threads, etc. 
}
