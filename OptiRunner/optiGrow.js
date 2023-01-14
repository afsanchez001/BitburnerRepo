/** @param {NS} ns */
export async function main(ns) {
	let target = ns.args[0];
	let repeat = ns.args[1];
	do {
		try {
			await ns.grow(target);
		} catch (Err) {
			ns.print("Warning: " + target + ", " + Err);
		}
	} while (repeat)
}
