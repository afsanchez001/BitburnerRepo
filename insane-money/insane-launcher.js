/** @param {NS} ns */
export async function main(ns) {

    ns.disableLog('ALL');

    var servers = [ "pserv-0", "pserv-1", "pserv-2", "pserv-3", "pserv-4", "pserv-5", "pserv-6", "pserv-7", "pserv-8", "pserv-9", "pserv-10", 
                    "pserv-11", "pserv-12", "pserv-13", "pserv-14", "pserv-15", "pserv-16", "pserv-17", "pserv-18", "pserv-19", "pserv-20", 
                    "pserv-21", "pserv-22", "pserv-23", "pserv-24"];
    /*    
        make sure that list above only has the servers you bought!  
    */
    
    var origin = ns.getHostname();

    for (var i = 0; i < servers.length; i++) {

        var server = servers[i];

        if (server == "home") {
            // ignore.
        } else {
            // copy to server.
            ns.scp("insane-money.js", server, "home"); // 6.25 gb
            ns.scp("insane-hack.js", server, "home"); // 1.70 gb 
            ns.scp("insane-grow.js", server, "home"); // 1.75 gb
            ns.scp("insane-weaken.js", server, "home"); // 1.75 gb
        }

        await ns.sleep(100);

        let random_arg = Date.now() + Math.random();
        let pid = ns.exec("insane-money.js", server, 1, "", random_arg); // only use ONE thread to start.
        let dt = i + '. PID: ' + pid + ', insane-money.js from ' + origin + ' on ' + server + '.\n';
        ns.print(dt);

        await ns.sleep(1000);
    }
}
