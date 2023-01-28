/** @param {NS} ns */
export async function main(ns) {

    ns.disableLog('ALL');

    var servers = ["pserv-0", "pserv-1", "pserv-2", "pserv-3", "pserv-4", "pserv-5", "pserv-6", "pserv-7", "pserv-8", "pserv-9",
        "pserv-10", "pserv-11", "pserv-12", "pserv-13", "pserv-14", "pserv-15", "pserv-16", "pserv-17", "pserv-18", "pserv-19",
        "pserv-20", "pserv-21", "pserv-22", "pserv-23", "pserv-24"
    ];

    // loop through purchased servers
    for (var i = 0; i < servers.length; i++) {

        var server = servers[i];

        // OPTI
        ns.print("Copying 'opti.js' to: " + server);
        await ns.scp("opti.js", server, "home");

        // OPTI UTIL
        ns.print("Copying 'optiUtil.js' to: " + server);
        await ns.scp("optiUtil.js", server, "home");

        // HACK
        ns.print("Copying 'optiHack.js' to: " + server);
        await ns.scp("optiHack.js", server, "home");

        // GROW
        ns.print("Copying 'optiGrow.js' to: " + server);
        await ns.scp("optiGrow.js", server, "home");

        // WEAKEN
        ns.print("Copying 'optiWeaken.js' to: " + server);
        await ns.scp("optiWeaken.js", server, "home");

        await ns.sleep(1000);

        // START opti.js on each pserv machine
        let available_threads = threadCount(ns, server, 10.20); // 10.20Gb is the "script ram", that is the size of opti.js

        let random_arg = Date.now() + Math.random();
        let pid = await ns.exec("opti.js", server, 1, "", false, random_arg); // only use ONE thred to start.
        let dt = i + '. PID: ' + pid + ', executing opti.js from on ' + server + ' using [' + available_threads + '] threads.' + '\n';
        ns.print(dt);

        await ns.sleep(1000);
    }
}

// Convert hostname & scriptRam into a number of threads that represents the server's total capacity.
function threadCount(ns, hostname, scriptRam) {
    let threads = 0;
    let free_ram = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);
    threads = free_ram / scriptRam;
    return Math.floor(threads) // Flooring this returns an integer. Avoids returning half a thread, or 1.5 threads, etc. 
}
