/*
  Gives me a nice little compact view of the hacknet-nodes $/sec and $total-money-made.  Refreshes every second.
*/

import {
	TextTransforms
} from "./text-transform.js";

/** @param {NS} ns */
export async function main(ns) {

	while (true) {

		ns.disableLog("ALL");
		ns.clearLog();
		ns.tail();

		let time = new Date().toLocaleTimeString();
		let date = new Date().toLocaleDateString();
		let dt = '   [' + date + ' ' + time + '] \n';

		ns.print("\n");
		ns.print(dt);

		var amt0 = 0;
		var amt1 = 0;

		for (var i = 0; i < ns.hacknet.numNodes(); i++) {

			var production = ns.hacknet.getNodeStats(i).production;
			var totalProduction = ns.hacknet.getNodeStats(i).totalProduction;

			amt0 += production;
			amt1 += totalProduction;

			// Production: $5.979b ($50.773k / sec)
			if (i <= 9) {
				ns.print(
					TextTransforms.apply("    hacknet-node-" + i + ": Production: ", [TextTransforms.Color.ChartsGray]) +
					"$" +
					TextTransforms.apply(ns.formatNumber(totalProduction, 4), [TextTransforms.Color.ChartsCoral]) +
					TextTransforms.apply(" (", [TextTransforms.Color.ChartsGray]) +
					"$" +
					TextTransforms.apply(ns.formatNumber(production, 4), [TextTransforms.Color.ChartsGreen]) +
					TextTransforms.apply(" / sec)", [TextTransforms.Color.ChartsGray])
				);
			} else {
				ns.print(
					TextTransforms.apply("   hacknet-node-" + i + ": Production: ", [TextTransforms.Color.ChartsGray]) +
					"$" +
					TextTransforms.apply(ns.formatNumber(totalProduction, 4), [TextTransforms.Color.ChartsCoral]) +
					TextTransforms.apply(" (", [TextTransforms.Color.ChartsGray]) +
					"$" +
					TextTransforms.apply(ns.formatNumber(production, 4), [TextTransforms.Color.ChartsGreen]) +
					TextTransforms.apply(" / sec)", [TextTransforms.Color.ChartsGray])
				);
			}
		}
		ns.print("\n");
		ns.print(TextTransforms.apply("  Production: ", [TextTransforms.Color.ChartsGray]) + "" + TextTransforms.apply("$" + ns.formatNumber(amt0, 4) + "", [TextTransforms.Color.ChartsCoral]) + " / sec");
		ns.print(TextTransforms.apply("  Total Production: ", [TextTransforms.Color.ChartsGray]) + "" + TextTransforms.apply("$" + ns.formatNumber(amt1, 4) + "", [TextTransforms.Color.ChartsGreen]) + "");

		ns.print("\n");

		await ns.sleep(1000);
	}
}
