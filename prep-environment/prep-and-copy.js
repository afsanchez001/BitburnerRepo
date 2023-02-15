/** @param {NS} ns */
export async function main(ns) {

	/*
		I wrote this to prep my network when I prestige and start on a new netowrk. 
		
			• Scans network for all servers.
			• Opens ports on each server using the root access programs.
			• Nukes the servers to allow backdoor manually (now), programmatically (later). 
		
		Note: To backdoor programatically you will need the Singularity API which requires Source-File 4-1 to run.

			  This is because to backdoor, you have to connect to that server first, then backdoor it:
			
				ns.singularity.connect(server);
				ns.installBackdoor();
			
			(SEE: https://github.com/bitburner-official/bitburner-src/blob/dev/markdown/bitburner.singularity.installbackdoor.md)
			
		UPDATE:
			This version adds line 31 to incorporate three files to be copied on all servers.
			They are copied at lines 46 through 50.
	*/

    //ns.disableLog("ALL");
    ns.clearLog();
    ns.tail();

    var servers = serverList(ns); // Get all the servers.
    var protected_targets = ["home", "pserv-0"]; // Make sure we ignore these servers.

    var files = ["targted-hack.js", "targted-grow.js", "targted-weaken.js"];

    // Create our unprotected targets list.
    var unprotected_targets = servers.filter(function(server) {
        return protected_targets.indexOf(server) < 0;
    });

    // Prep all the servers for our eventual backdoor.
    for (var i = 0; i < unprotected_targets.length; i++) {

        var server = unprotected_targets[i];

        try {

            // copy all three files to target server.
            for (var j = 0; j < files.length; j++) { 
                ns.print("copying: " + files[j] + " to: " + server + ", from: home"); 
                //await ns.scp(files[j], server, "home"); 
            }

            // Open ports using root access programs.
            if (ns.fileExists("BruteSSH.exe")) {
                await ns.brutessh(server);
            } else {
                /* BruteSSH unavilable */ }
            if (ns.fileExists("FTPCrack.exe")) {
                await ns.ftpcrack(server);
            } else {
                /* FTPCrack unavilable */ }
            if (ns.fileExists("relaySMTP.exe")) {
                await ns.relaysmtp(server);
            } else {
                /* relaySMTP unavilable */ }
            if (ns.fileExists("HTTPWorm.exe")) {
                await ns.httpworm(server);
            } else {
                /* HTTPWorm unavilable */ }
            if (ns.fileExists("SQLInject.exe")) {
                await ns.sqlinject(server);
            } else {
                /* SQLInject unavilable */ }

            // Nuke the target.
            await ns.nuke(server);
        } catch (err) {
            ns.print("Exception occured: " + err);
        }

        await ns.sleep(10); // 10 milliseconds to avoid 'not using await' error.			
    }

    ns.printf(unprotected_targets.length + " targets prepped.");
}

// Return an array of servers to hack dynamically.
function serverList(ns, current = "home", set = new Set()) {
    let connections = ns.scan(current);
    let next = connections.filter(c => !set.has(c));

    next.forEach(n => {
        set.add(n);
        return serverList(ns, n, set);
    });

    return Array.from(set.keys());
}
