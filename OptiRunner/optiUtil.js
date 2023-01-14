/** @param {NS} ns */
export function getServerNames(ns) {
    return getServers(ns).map(s => {return s.hostname})
}

/** @param {NS} ns */
export function getServers(ns) {
    return [...recurseServers()].filter(s => {
        return s.hostname != "darkweb"
    })

    /**
     * @generator Traverses the connection tree in pre-order
     * @param fn Function called on each server
     * @param current Starting point default to home
     * @param {string[]} visited Array of already visited servers
     * @param depth The current depth in traversal
     */
    function* recurseServers(fn = () => { }, current = "home", visited = [], depth = 0) {
        if (!visited.includes(current)) {
            //ns.print(depth.toString().padStart(4) + " ||  ".repeat(depth + 1) + current)
            yield { hostname: current, depth: depth, path: [...visited.slice().reverse(), current] }
            let next = ns.scan(current)
            for (let n of next) {
                yield* recurseServers(fn, n, [current, ...visited], depth + 1)
            }
        }
    }
}

const secondsPerYear = 31536000
const secondsPerDay = 86400
const secondsPerHour = 3600
const secondsPerMinute = 60

export function millisecondsToString(milliseconds) {
    const secs = milliseconds / 1000 // convert to seconds
    var years = Math.floor(secs / secondsPerYear);
    var days = Math.floor((secs % secondsPerYear) / secondsPerDay);
    var hours = Math.floor(((secs % secondsPerYear) % secondsPerDay) / secondsPerHour);
    var minutes = Math.floor((((secs % secondsPerYear) % secondsPerDay) % secondsPerHour) / secondsPerMinute);
    var seconds = (((secs % secondsPerYear) % secondsPerDay) % secondsPerHour) % secondsPerMinute;

    let str = ""
    if (years > 0) {
        str += years + " years "
    }
    if (days > 0) {
        str += days + " days "
    }
    if (hours > 0) {
        str += hours + " hours "
    }
    if (hours > 0) {
        str += hours + " hours "
    }
    if (minutes > 0) {
        str += minutes + " minutes "
    }
    return str + seconds + " seconds";
}
