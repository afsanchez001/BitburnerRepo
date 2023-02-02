/*
    https://www.reddit.com/r/Bitburner/comments/rhpp8p/scan_script_updated_for_bitburner_v110/

    "I've updated the excellent Scan Script by u/havoc_mayhem to work in the current version.
     Note these new scripts are quite RAM heavy and require ~33GB of RAM free to use.
     The previous version: https://www.reddit.com/r/Bitburner/comments/9nrz3v/scan_script_v2/"  
    - u/Tempest_42

    Features:
    --------
        • Lists every single server, irrespective of depth.
        • The servers you need to hack manually are highlighted in color.
        • Click on any server name to instantly connect to that server. There is no need to manually type in anything.
        • A small square before the server name shows if you have root access.
        • Hover over a server name, to pull up all relevant details about it. Example.
        • There's a purple '©' symbol next to servers with Coding Contracts on them, if you want to go over and solve the contract manually.
        • Hover over the '©' symbol to see what kind of contract it is. Example.

    "scan.js (32.75GB) This can be reduced to 27.75GB if you comment out the function that gets the Contract Name." - u/Tempest_42
    "I would recommend setting up the alias: alias scan="home; run scan.js" - u/Tempest_42

    My changes, edits:
    -----------------
    Applied all suggestions and edits to the script from u/LangyMD, u/h41nr1ch, u/levitt-red.
    Updated line 91, ("&#10;Memory: ", ns.getServerMaxRam(name), "GB",) addressing the ns.getServerRam() is no longer supported error.
    Added a new header with comments, css styling, lines 64 and 65
    Added a param for the current bitnode, line 70, (let bitnode = "BN" + ns.getPlayer().bitNodeN;)
    Edited the output lines, line 107, (output += ["<br>", "<font color=#646464>---</font>".repeat(server.depth),)
    Changed the ascii square symbol to a house, line 108, (`<font color=${hackColor}>⌂ </font>`,)
    Changed the css for contracts, line 110, ("'><span style='color:cornflowerblue; font-size: 16px; font-family: Verdana;'>©</font></a>")
    Added css styling to the faction, line 127, (style='color:${nameColor}; font-size: 16px; font-family: "Verdana";'>${name}${faction}</a> `,)

    - u/DukeNukemDad, 2/2/2023
*/

let facServers = {
    "CSEC": "yellow",
    "avmnite-02h": "yellow",
    "I.I.I.I": "yellow",
    "run4theh111z": "yellow",
    "The-Cave": "orange",
    "w0r1d_d43m0n": "red"
};

let svObj = (name = 'home', depth = 0) => ({
    name: name,
    depth: depth
});
export function getServers(ns) {
    let result = [];
    let visited = {
        'home': 0
    };
    let queue = Object.keys(visited);
    let name;
    while ((name = queue.pop())) {
        let depth = visited[name];
        result.push(svObj(name, depth));
        let scanRes = ns.scan(name);
        for (let i = scanRes.length; i >= 0; i--) {
            if (visited[scanRes[i]] === undefined) {
                queue.push(scanRes[i]);
                visited[scanRes[i]] = depth + 1;
            }
        }
    }
    return result;
}

export async function main(ns) {

    let bitnode = "BN" + ns.getPlayer().bitNodeN;
    let output = "<font style='color:cornflowerblue; font-size: 26px; font-family: Verdana;'>Network (" + bitnode + "):</font><br /><font style='color:#646464; font-size: 16px; font-family: Verdana;'>(By u/havoc_mayhem; additions/edits/suggestions by [/u/i3aizey & /u/AlecZorab], u/Tempest_42, u/LangyMD, u/h41nr1ch, u/levitt-red, u/DukeNukemDad)</font>";

    getServers(ns).forEach(server => {
        let name = server.name;

        let faction = '';
        switch (name) {
            case 'CSEC':
                faction = ' (CyberSec)';
                break;
            case 'avmnite-02h':
                faction = ' (NiteSec)';
                break;
            case 'I.I.I.I':
                faction = ' (The Black Hand)';
                break;
            case 'run4theh111z':
                faction = ' (Bitrunners)';
        }

        let hackColor = ns.hasRootAccess(name) ? "lime" : "red";
        let nameColor = facServers[name] ? facServers[name] : "white";

        let hoverText = ["Req Level: ", ns.getServerRequiredHackingLevel(name),
            "&#10;Req Ports: ", ns.getServerNumPortsRequired(name),            
            "&#10;Memory: ", ns.getServerMaxRam(name), "GB",
            "&#10;Security: ", ns.getServerSecurityLevel(name),
            "/", ns.getServerMinSecurityLevel(name),
            "&#10;Money: ", Math.round(ns.getServerMoneyAvailable(name)).toLocaleString(), " (",
            Math.round(100 * ns.getServerMoneyAvailable(name) / ns.getServerMaxMoney(name)), "%)"
        ].join("");

        let ctText = "";
        ns.ls(name, ".cct").forEach(ctName => {
            ctText += ["<a title='", ctName,
                //Comment out the next line to reduce footprint by 5 GB
                "&#10;", ns.codingcontract.getContractType(ctName, name),
                "'><span style='color:cornflowerblue; font-size: 16px; font-family: Verdana;'>©</font></a>"
            ].join("");
        });

        output += ["<br>", "<font color=#646464>---</font>".repeat(server.depth),
            `<font color=${hackColor}>⌂ </font>`,
            `<a class='scan-analyze-link' title='${hoverText}''

            onClick="(function()
            {
                const terminalInput = document.getElementById('terminal-input');
                terminalInput.value='home; run connect.js ${name}';
                const handler = Object.keys(terminalInput)[1];
                terminalInput[handler].onChange({target:terminalInput});
                terminalInput[handler].onKeyDown({keyCode:13,preventDefault:()=>null});
            })();"
            
            style='color:${nameColor}; font-size: 16px; font-family: "Verdana";'>${name}${faction}</a> `,
            `<font color='fuchisa'>${ctText}</font>`,
        ].join("");
    });

    const list = document.getElementById("terminal");
    list.insertAdjacentHTML('beforeend', output);
}
  /*
        Other ascii symbols I played with:
          ■   •   ⦿
  */
