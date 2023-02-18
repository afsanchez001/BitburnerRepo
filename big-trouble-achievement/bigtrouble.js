/** @param {NS} ns */
export async function main(ns) {

	//ns.disableLog("getServerMaxMoney");
	//ns.disableLog("getServerMoneyAvailable");

	ns.disableLog("getServerMaxRam");
	ns.disableLog("getServerUsedRam");

	ns.disableLog("sleep");

	ns.clearLog();
	ns.tail();

	var spammy_line = "------------------------------------------"; 
	var target = "sigma-cosmetics"; // Change the target here.

	while (true) {
	
		let time = new Date().toLocaleTimeString();

		ns.print(spammy_line); // don't complain.

		ns.getServerMaxMoney(target);
		ns.getServerMoneyAvailable(target);

		let available_threads_hk = 0;
		let available_threads_wk = 0;

		available_threads_hk = threadCount(ns, target, 1.70); // bigtrouble-hack.js SCRIPT RAM, 1.70GB
		ns.exec("bigtrouble-hack.js", "home", available_threads_hk, target, false, time);

		available_threads_wk = threadCount(ns, target, 1.75); // bigtrouble-weaken.js SCRIPT RAM, 1.75GB
		ns.exec("bigtrouble-weaken.js", "home", available_threads_wk, target, false, time);

		await ns.sleep(100);
	}
}

// Convert hostname & scriptRam into a number of threads that represents the server's total capacity.
function threadCount(ns, hostname, scriptRam) {
	let threads = 0;
	let free_ram = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);
	threads = free_ram / scriptRam;
	return Math.floor(threads) // Flooring this returns an integer. Avoids returning half a thread, or 1.5 threads, etc. 
}
