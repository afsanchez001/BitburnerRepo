/*
https://www.reddit.com/r/Bitburner/comments/rhpp8p/scan_script_updated_for_bitburner_v110/

Connect.js enables you to directly connect to a server when you use the scan command by simply clicking on a server.

It can also be used separately to connect you to any server without worrying about how to navigate to it.

Usage: run connect.js SERVER

E.g. 'run connect.js run4theh111z' - Directly connects to the run4theh111z server.

I would recommend setting up the alias: alias connect="home; run connect.js"

*/
export async function main(ns) {
    let target = ns.args[0];
    let paths = { "home": "" };
    let queue = Object.keys(paths);
    let name;
    let output;
    let pathToTarget = [];
    while ((name = queue.shift())) {
        let path = paths[name];
        let scanRes = ns.scan(name);
        for (let newSv of scanRes) {
            if (paths[newSv] === undefined) {
                queue.push(newSv);
                paths[newSv] = `${path},${newSv}`;
                if (newSv == target)
                    pathToTarget = paths[newSv].substr(1).split(",");
                    
            }
        }
    }
    output = "home; ";

    pathToTarget.forEach(server=> output += " connect " + server + ";");

    const terminalInput = document.getElementById("terminal-input");
    terminalInput.value=output;
    const handler = Object.keys(terminalInput)[1];
    terminalInput[handler].onChange({target:terminalInput});
    terminalInput[handler].onKeyDown({keyCode:13,preventDefault:()=>null});
}

export function autocomplete(data, args) {
    return [...data.servers];
}
