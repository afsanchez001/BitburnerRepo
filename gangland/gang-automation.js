import {
    TextTransforms
} from "./text-transform.js";

/** @param {NS} ns */
export async function main(ns) {

    /*
    General gang action plan: 
        Gain Respect 
            -> 12 members 
                -> power 
                    -> all win chances > 55% 
                        -> if engage in territory warfare is on 
                            -> power/money (keep win chances > 55%) 
                                -> territory 100% 
                                    -> gain money/rep
    ---------------------------------------------------------------
        OVERRIDE PARAM 
        (Forces all members to perform a singular task.)

        No [args] = normal operation.
        
        NORMAL USAGE: run gang-automation.js        // Script will use stats to determine tasks, equipment purchases (prepping), and ascending.
        
        Optional OVERRIDE parameters are:        
         • respect
         • earn
         • decrease
         • train
         • warfare
         (Only one override arg can be passed in.)
         
         USAGE: run gang-automation.js respect      // Script will assign tasks that earn you respect | Cyberterrorism, DDoS Attacks, Plant Virus, Money Laundering
                run gang-automation.js earn         // Script will assign tasks that earn you top $money | Ransomware, Phishing, Identity Theft, Fraud & Counterfeiting, Money Laundering
                run gang-automation.js decrease     // Script will assign tasks to lower your wanted level | Ethical Hacking, Vigilante Justice
                run gang-automation.js train        // Script will detect your gang type, and assign appropriate training regimen | Train Combat, Train Hacking, Train Charisma
                run gang-automation.js warfare      // Script will assing your gang to Territory Warfare
    */

    const [override] = ns.args;
    var overrideTask = "";

    if (override == undefined || override.trim() == "") {
        overrideTask = ""; // ignore
    } else if (override == "respect") {
        overrideTask = "Cyberterrorism"; // Cyberterrorism, DDoS Attacks, Plant Virus, Money Laundering
    } else if (override == "earn") {
        overrideTask = "Money Laundering"; // Ransomware, Phishing, Identity Theft, Fraud & Counterfeiting, Money Laundering
    } else if (override == "decrease") {
        overrideTask = "Ethical Hacking"; // Ethical Hacking, Vigilante Justice  
    } else if (override == "train") {
        overrideTask = "Train Hacking"; // Train Combat, Train Hacking, Train Charisma
    } else if (override == "warfare") {
        overrideTask = "Territory Warfare"; // Territory Warfare
    }

    ns.disableLog("ALL");
    ns.clearLog();
    ns.tail();

    const buyingWeapons = true;
    const buyingArmor = true;
    const buyingVehicles = true;
    const buyingRootkits = true;
    const buyingAugmentations = true;

    const memberHackAugs = [];
    const memberCrimeAugs = [];
    const memberWeapons = [];
    const memberVehicles = [];
    const memberArmor = [];
    const memberRootkits = [];

    const memberPrepped = [];
    const membersAscended = [];
    const memberStats = [];

    const delay = 100;

    const HackAugs = ["DataJack", "Neuralstimulator", "BitWire"];
    const CrimeAugs = ["Bionic Spine", "Bionic Arms", "Bionic Legs", "Graphene Bone Lacings", "Synthetic Heart", "BrachiBlades", "Nanofiber Weave", "Synfibril Muscle"];
    const Weapons = ["Baseball Bat", "Katana", "Glock 18C", "P90C", "Steyr AUG", "AK-47", "M15A10 Assault Rifle", "AWM Sniper Rifle"];
    const Armor = ["Liquid Body Armor", "Bulletproof Vest", "Full Body Armor", "Graphene Plating Armor"];
    const Vehicles = ["Ford Flex V20", "White Ferrari", "ATX1070 Superbike", "Mercedes-Benz S9001"];
    const Rootkits = ["NUKE Rootkit", "Soulstealer Rootkit", "Demon Rootkit", "Hmap Node", "Jack the Ripper"];

    const MemberNames = ["Genie", "Myconid", "Ogre", "Pixie", "Treant", "Troglodyte", "Loco", "Puppet", "Stretch", "Eternity", "Zen", "Cable"];
    /*
        , "Impulse", "Cent", "Canine", "Nova", "Night", "Artemis", "Game", "Bone", "Rebel", "Friction"
        https://www.fantasynamegenerators.com/cyberpunk-names.php
    */

    var topEarners = []; // Ransomware, Phishing, Identity Theft, Fraud & Counterfeiting, Money Laundering
    var topRespect = []; // Cyberterrorism, DDoS Attacks, Plant Virus, Money Laundering
    var topVirtuous = []; // Ethical Hacking, Vigilante Justice  

    var training = []; // Train Combat, Train Hacking, Train Charisma
    var warfare = []; // Territory Warfare
    var idle = []; // Unassigned

    var tasks = ns.gang.getTaskNames(); // Get the name of all valid tasks that can be assigned.

    // loop through all valid tasks.
    for (var i = 0; i < tasks.length; ++i) {
        // TOP EARNERS
        if (tasks[i].toString() == "Ransomware" ||
            tasks[i].toString() == "Phishing" ||
            tasks[i].toString() == "Identity Theft" ||
            tasks[i].toString() == "Fraud & Counterfeiting" ||
            tasks[i].toString() == "Money Laundering") {
            topEarners.push(tasks[i]);
            // TOP RESPECT
        } else if (tasks[i].toString() == "Cyberterrorism" ||
            tasks[i].toString() == "DDoS Attacks" ||
            tasks[i].toString() == "Plant Virus" ||
            tasks[i].toString() == "Money Laundering") {
            topRespect.push(tasks[i]);
            // TOP VIRTUOUS
        } else if (tasks[i].toString() == "Ethical Hacking" ||
            tasks[i].toString() == "Vigilante Justice") {
            topVirtuous.push(tasks[i]);
            // TRAINING
        } else if (tasks[i].toString() == "Train Combat" ||
            tasks[i].toString() == "Train Hacking" ||
            tasks[i].toString() == "Train Charisma" ||
            tasks[i].toString() == "Train Warfare") {
            training.push(tasks[i]);
            // WARFARE
        } else if (tasks[i].toString() == "Territory Warfare") {
            warfare.push(tasks[i]);
            // UNASSIGNED
        } else if (tasks[i].toString() == "Unassigned") {
            idle.push(tasks[i]);
        }
    }

    // Engine
    while (true) {

        ns.clearLog();

        var money = ns.getServerMoneyAvailable("home");

        const gangInfo = ns.gang.getGangInformation();
        const gangIncome = ns.gang.getGangInformation().moneyGainRate * 5; // A tick is every 200ms. To get the actual money/sec, multiple moneyGainRate by 5.
        const gangRespect = parseFloat(ns.gang.getGangInformation().respect).toFixed(2);

        ns.print(" \n");
        ns.print(" 🌆 Gang: " + TextTransforms.apply(gangInfo.faction, [TextTransforms.Color.Orange]) + " 💣");
        ns.print(" 🏦 Money available: 💲" + TextTransforms.apply(FormatNumber(money), [TextTransforms.Color.LGreen]));
        ns.print(" 💵 Gang income/sec: 💲" + TextTransforms.apply(FormatNumber(gangIncome), [TextTransforms.Color.LGreen]));
        ns.print(" 🦾 Gang respect: " + TextTransforms.apply(gangRespect, [TextTransforms.Color.LPurple]));

        var members = ns.gang.getMemberNames();
        var prospects = MemberNames.filter(c => !members.includes(c));

        // FULL MEMBERS
        ns.print("\n" + " 😈 Current Members:" + "\n");
        var activeteam = members.join(", "); // Suggested by u/Aeraggo, 2-23-2023
        ns.print("    " + TextTransforms.apply(activeteam, [TextTransforms.Color.ChartsBlue]) + "\n");

        // PROSPECTS
        ns.print("\n" + " 😐 Prospects:" + "\n");
        var waitteam = ""; // reset
        waitteam = prospects.join(", "); // Suggested by u/Aeraggo, 2-23-2023

        if (waitteam.length == 0) {
            ns.print("    Your gang is maxed out. Good job! Now go do some crime.\n");
        } else {
            ns.print("    " + TextTransforms.apply(waitteam, [TextTransforms.Color.LPurple]) + "\n");
        }

        // RECRUIT
        if (ns.gang.canRecruitMember()) {
            ns.print("\n" + " Recruiting new prospect..." + "\n");
            await RecruitProspect();
        } else {
        }




        // GET ALL HACK SKILL LEVELS. Sort members from highest to lowest Hack().
        const skillSort = members.sort((b, a) => ns.gang.getMemberInformation(a).hack - ns.gang.getMemberInformation(b).hack)

        // SHOW STATS
        ns.print("\n" + " ✨ Members sorted by Hack Skill Level:");
        for (var i = 0; i < skillSort.length; ++i) {
            var level = ns.gang.getMemberInformation(skillSort[i]).hack;

            //ns.print("   " + "💻 " + skillSort[i] + ", Hack skill level: " + level + "");
            memberStats.push(skillSort[i] + "|" + level);

            // ASSIGN JOBS
            GiveAssignments(skillSort[i], level);
        }

        // MEMBER STATS        
        let memberDataObj = {}; // Initialize empty object to store data
        let memberData = []; // Initialize empty array to store final data

        let longest0 = 0;
        let longest1 = 0;
        let longest2 = 0;
        let longest3 = 0;
        let longest4 = 0;

        // Loop through each record in _memberStats array
        for (let i = 0; i < memberStats.length; i++) {
            let retval = memberStats[i] + ''; // Split each record into name and stat using the pipe symbol
            let record = retval.split("|");
            let name = record[0];
            let stat = record[1];

            // Check if name already exists in memberDataObj
            if (memberDataObj.hasOwnProperty(name)) {
                memberDataObj[name] += "|" + stat; // If it exists, concatenate the stat with existing data
            } else {
                memberDataObj[name] = name + "|" + stat; // If it doesn't exist, create a new entry for the name in memberDataObj
            }
        }

        // Loop through memberDataObj and add each entry to memberData array
        for (let name in memberDataObj) {
            memberData.push(memberDataObj[name]);
        }

        // Loop through to format
        memberData.forEach((e) => {
            var data = e + '';
            var splitStr = data.split("|");

            var name = splitStr[0];
            var hacklevel = splitStr[1];
            var wantedlevel = splitStr[2];
            var respect = splitStr[3];
            var task = splitStr[4];

            longest0 = Math.max(name.length, longest0)
            longest1 = Math.max(hacklevel.length, longest1)
            longest2 = Math.max(wantedlevel.length, longest2)
            longest3 = Math.max(respect.length, longest3)
            longest4 = Math.max(task.length, longest4)
        });

        // Show it.
        memberData.forEach((e) => {
            var data = e + '';
            var splitStr = data.split("|");

            var name = splitStr[0];
            var hacklevel = splitStr[1];
            var wantedlevel = splitStr[2];
            var respect = splitStr[3];
            var task = splitStr[4];

            var num0 = parseFloat(wantedlevel).toFixed(4);
            var num1 = parseFloat(respect).toFixed(2);

            ns.print(TextTransforms.apply(name.padStart(longest0 + 1), [TextTransforms.Color.ChartsBlue])
                + ", 💻hack: " + TextTransforms.apply(hacklevel.padStart(longest1 + 1), [TextTransforms.Color.ChartsGreen])
                + ", 🕶️wanted: " + TextTransforms.apply(num0.padStart(9), [TextTransforms.Color.ChartsGreen])
                + ", 🦾respect: " + TextTransforms.apply(num1.padStart(9), [TextTransforms.Color.ChartsGreen])
                + ", 💵task: " + TextTransforms.apply(task.padStart(longest4 + 1), [TextTransforms.Color.ChartsGreen])
                + " \n");
        });

        // ASCEND & PREP
        let longest = 0;
        let _members = members;

        for (let _member of _members) {
            longest = Math.max(_member.length, longest)
        };

        ns.print("\n" + " ⬆ Ascension✨ & Prep🔪💣🛡️ stats: " + "\n");

        var lbracket = TextTransforms.apply("[", [TextTransforms.Color.ChartsGray])
        var rbracket = TextTransforms.apply("]", [TextTransforms.Color.ChartsGray])

        for (let _mem of _members) {

            var prepping = "";
            var output = "";
            var member_name = "" + TextTransforms.apply(_mem.padStart(longest + 1), [TextTransforms.Color.ChartsBlue]) + "";
            var numTimesAscended = await NumberOfTimesAscended(membersAscended, _mem);

            // PREP
            if (memberPrepped.includes(_mem.trim())) {
                // ALREADY PREPPED OUT
                prepping = " " + lbracket + TextTransforms.apply("Fully Prepped 🔪💣🛡️", [TextTransforms.Color.ChartsGreen]) + rbracket + "";
            } else {
                // PREP MEMBER        
                prepping = " " + lbracket + TextTransforms.apply("✨Prepping✨", [TextTransforms.Color.ChartsGray]) + rbracket + "";
                Prepare(_mem);
            }

            // ASCEND
            var multchange = 0;
            try {
                var memberInfo = ns.gang.getMemberInformation(_mem); // Get entire gang meber onject from name.
                var ascResult = ns.gang.getAscensionResult(_mem);  // Get the result of an ascension without ascending.

                if (ascResult != undefined) {                    
                    var hackingMultiplier = ascResult.hack; // Hacking multiplier gained from ascending // This is a HACKING GANG. Use [hack] Hacking, not [str] Strength.
                    //var currentMultiplier = memberInfo.hack_asc_mult; // Hacking multiplier from ascensions // This is a HACKING GANG. Use [hack_asc_mult] Hacking, not [str_asc_mult] Strength.
                    var currentMultiplier = CalculateAscendTreshold(ns,_mem); // Credit: Mysteyes.

                    // Only ascend if the multiplier is less than 10 and will increase by at least 2
                    if (currentMultiplier < 10) {
                        {
                            //  ns.print(" \n");
                            //  ns.print("Ascend checking: " + _mem);
                            //  ns.print("Hacking multiplier gained from ascending: " + ascResult.hack);
                            //  ns.print("currentMultiplier: " + currentMultiplier);
                        }
                        // multiply the current multiplier by the ascension results, and then subtract the current multiplier. 
                        // The difference is the increase.
                        var multchange = (currentMultiplier * hackingMultiplier) - currentMultiplier;

                        var doAsc = false;
                        if (multchange <= 2.0) {
                            // Do nothing.
                            output = "no. times ascended: " + numTimesAscended + " " + lbracket + TextTransforms.apply("Waiting...", [TextTransforms.Color.ChartsGray]) + rbracket + " " + multchange;
                        } else if (multchange >= 2.0) {
                            // Give message to ascend.
                            output = "no. times ascended: " + numTimesAscended + " " + lbracket + TextTransforms.apply("✨Ascending✨", [TextTransforms.Color.ChartsGreen]) + rbracket + " " + multchange;
                            doAsc = true;
                        }

                        ns.print(member_name + ", " + output + " " + prepping + " \n");

                        /*
                            ASCEND
                            ------
                            Doing Ascend(_mem) here, because there is a glitch that prevents
                            the output string from displaying when Ascend(_mem)
                            is lumped into the 'else if (multchange >= 2.0){ ... }' conditional area.
                        */
                        if (doAsc) {
                            await ns.sleep(5);
                            Ascend(_mem); // ascend the member
                            membersAscended.push(_mem); // let this grow.
                        }

                    }

                }
            } catch {
                // ignore.                        
            }
        }

        // RESET ENVIRONMNENT
        memberDataObj = {};
        memberStats.length = 0;

        ns.print(" \n");
        await ns.sleep(delay);
    }

    // Credit: Mysteyes. https://discord.com/channels/415207508303544321/415207923506216971/940379724214075442
    function CalculateAscendTreshold(ns, member) {
        let mult = ns.gang.getMemberInformation(member)['hack_asc_mult'];
        if (mult < 1.632) return 1.6326;
        if (mult < 2.336) return 1.4315;
        if (mult < 2.999) return 1.284;
        if (mult < 3.363) return 1.2125;
        if (mult < 4.253) return 1.1698;
        if (mult < 4.860) return 1.1428;
        if (mult < 5.455) return 1.1225;
        if (mult < 5.977) return 1.0957;
        if (mult < 6.496) return 1.0869;
        if (mult < 7.008) return 1.0789;
        if (mult < 7.519) return 1.073;
        if (mult < 8.025) return 1.0673;
        if (mult < 8.513) return 1.0631;
        return 1.0591;
    }

    function NumberOfTimesAscended(membersAscended, name) {
        var timesAscended = 0;
        for (var i = 0; i < membersAscended.length; i++) {
            if (membersAscended[i] == name) {
                timesAscended++;
            }
        }
        return timesAscended;
    }

    // Recruit a new prospect to a full gang member.
    async function RecruitProspect() {
        var currentMembers = ns.gang.getMemberNames();
        var availableNames = MemberNames.filter(x => !currentMembers.includes(x));
        ns.gang.recruitMember(availableNames[0]);
        ns.gang.setMemberTask(availableNames[0], "Train Hacking"); // Set to train initially.
        await ns.sleep(10);
    }

    // Ascend this current gang member
    async function Ascend(name) {
        return ns.gang.ascendMember(name); // Ascend the specified Gang Member.       
    }

    // Buy HackTools, HackAugs, CrimeAugs, Weapons, Armor, Vehicles
    function Prepare(name) {

        var alreadyOwns_HackAugs = "";
        var alreadyOwns_CrimeAugs = "";
        var alreadyOwns_Weapons = "";
        var alreadyOwns_Armor = "";
        var alreadyOwns_Vehicles = "";
        var alreadyOwns_Rootkits = "";

        //ns.print(" \n");

        HackAugs.forEach((e) => {
            if (memberHackAugs == null) {
                if (buyingAugmentations) { // buy first item
                    memberHackAugs.push(name + "|" + e);
                    ns.gang.purchaseEquipment(name, e);
                }
            } else if (memberHackAugs.includes(name + "|" + e)) {
                alreadyOwns_HackAugs += e + ", ";
            } else {
                // buy item
                if (buyingAugmentations) {
                    memberHackAugs.push(name + "|" + e);
                    //ns.print("   buying " + name + ": " + e);
                    ns.gang.purchaseEquipment(name, e); // ["DataJack", "Neuralstimulator", "BitWire"];
                }
            }
        });

        CrimeAugs.forEach((e) => {
            if (memberCrimeAugs == null) {
                if (buyingAugmentations) { // buy first item
                    memberCrimeAugs.push(name + "|" + e);
                    ns.gang.purchaseEquipment(name, e);
                }
            } else if (memberCrimeAugs.includes(name + "|" + e)) {
                alreadyOwns_CrimeAugs += e + ", ";
            } else {
                // buy item
                if (buyingAugmentations) {
                    memberCrimeAugs.push(name + "|" + e);
                    //ns.print("   buying " + name + ": " + e);
                    ns.gang.purchaseEquipment(name, e); // ["Bionic Spine", "Bionic Arms", "Bionic Legs", "Graphene Bone Lacings", "Synthetic Heart", "BrachiBlades", "Nanofiber Weave", "Synfibril Muscle"];
                }
            }
        });

        Weapons.forEach((e) => {
            if (memberWeapons == null) {
                if (buyingWeapons) { // buy first item
                    memberWeapons.push(name + "|" + e);
                    ns.gang.purchaseEquipment(name, e);
                }
            } else if (memberWeapons.includes(name + "|" + e)) {
                alreadyOwns_Weapons += e + ", ";
            } else {
                // buy item
                if (buyingWeapons) {
                    memberWeapons.push(name + "|" + e);
                    //ns.print("   buying " + name + ": " + e);
                    ns.gang.purchaseEquipment(name, e); // ["Baseball Bat", "Katana", "Glock 18C", "P90C", "Steyr AUG", "AK-47", "M15A10 Assault Rifle", "AWM Sniper Rifle"];
                }
            }
        });

        Armor.forEach((e) => {
            if (memberArmor == null) {
                if (buyingArmor) { // buy first item
                    memberArmor.push(name + "|" + e);
                    ns.gang.purchaseEquipment(name, e);
                }
            } else if (memberArmor.includes(name + "|" + e)) {
                alreadyOwns_Armor += e + ", ";
            } else {
                // buy item
                if (buyingArmor) {
                    memberArmor.push(name + "|" + e);
                    //ns.print("   buying " + name + ": " + e);
                    ns.gang.purchaseEquipment(name, e); // ["Liquid Body Armor", "Bulletproof Vest", "Full Body Armor", "Graphene Plating Armor"];
                }
            }
        });

        Vehicles.forEach((e) => {
            if (memberVehicles == null) {
                if (buyingVehicles) { // buy first item
                    memberArmor.push(name + "|" + e);
                    ns.gang.purchaseEquipment(name, e);
                }
            } else if (memberVehicles.includes(name + "|" + e)) {
                alreadyOwns_Vehicles += e + ", ";
            } else {
                // buy item
                if (buyingVehicles) {
                    memberVehicles.push(name + "|" + e);
                    //ns.print("   buying " + name + ": " + e);
                    ns.gang.purchaseEquipment(name, e); // ["Liquid Body Armor", "Bulletproof Vest", "Full Body Armor", "Graphene Plating Armor"];
                }
            }
        });

        Rootkits.forEach((e) => {
            if (memberRootkits == null) {
                if (buyingRootkits) { // buy first item
                    memberRootkits.push(name + "|" + e);
                    ns.gang.purchaseEquipment(name, e);
                }
            } else if (memberRootkits.includes(name + "|" + e)) {
                alreadyOwns_Rootkits += e + ", ";
            } else {
                // buy item
                if (buyingRootkits) {
                    memberRootkits.push(name + "|" + e);
                    //ns.print("   buying " + name + ": " + e);
                    ns.gang.purchaseEquipment(name, e); // "NUKE Rootkit", "Soulstealer Rootkit", "Demon Rootkit", "Hmap Node", "Jack the Ripper"];
                }
            }
        });

        // SHOW INVENTORY
        if (alreadyOwns_HackAugs != "" ||
            alreadyOwns_CrimeAugs != "" ||
            alreadyOwns_Weapons != "" ||
            alreadyOwns_Armor != "" ||
            alreadyOwns_Vehicles != "" ||
            alreadyOwns_Rootkits != "") {

            var result = alreadyOwns_HackAugs + alreadyOwns_CrimeAugs + alreadyOwns_Weapons + alreadyOwns_Armor + alreadyOwns_Vehicles + alreadyOwns_Rootkits;
            result = result.substring(0, result.length - 2); // remove last comma.
            ns.print("   " + name + " already owns: " + result);
            memberPrepped.push(name); // Add member to list of completed prepped names.
        }
    }

    // Attempt to assign Gang Member specified tasks
    function GiveAssignments(member, hackSkillLevel) {

        // hackSkillLevel is just 'memberInfo.hacking' passed in.

        var gangInfo = null;
        var gangInfo = ns.gang.getGangInformation();

        var memberInfo = null;
        var memberInfo = ns.gang.getMemberInformation(member);

        var wantedLevel = memberInfo.wantedLevelGain;
        var earnedRespect = memberInfo.earnedRespect;

        // GET STATS
        memberStats.push(member + "|" + wantedLevel);
        memberStats.push(member + "|" + earnedRespect);

        // HACKING
        var task = "";
        // var statsTarget = 50; // strength, agility, charisma, defense
        // var statsTargetHacking = 500; // hacking
        // var statsTargetRespect = 10000; // respect

        if (overrideTask != "") {
            task = overrideTask; // GRAB OVERRIDE TASK
            // Territory Warfare!
            if (overrideTask == "Territory Warfare" && earnedRespect > 10000) {

                // ASSIGN TASK
                if (ns.gang.setMemberTask(member, task)) {
                    memberStats.push(member + "|" + task);
                    return; // GET OUT.
                }

                // NOT POWERFUL ENOUGH FOR WARFARE. SO, IGNORE 'Territory Warfare', DO SEOMTHING ELSE...             
            } else if (overrideTask == "Territory Warfare" && earnedRespect < 10000) {

                // THIS IS NON-NEGOTIABLE. IF HACK LEVEL IS < 500, WE REQUIRE STRICT TRAINING. 
                // IGNORE ALL OTHER JOBS/TASKS.
                // TRAIN
                if (hackSkillLevel < 400 && earnedRespect < 500) {
                    // Are we a Hacking gang? 
                    // TRAIN HACKING
                    if (gangInfo.isHacking) {
                        task = training[1]; // Train Combat 0, Train Hacking 1, Train Charisma 2
                    }
                    // Are we a Combat gang? 
                    // TRAIN COMBAT
                    if (!gangInfo.isHacking) {
                        task = training[0]; // Train Combat 0, Train Hacking 1, Train Charisma 2
                    }
                    // ASSIGN TRAINING task
                    if (ns.gang.setMemberTask(member, task)) {
                        memberStats.push(member + "|" + task);
                        return; // GET OUT.
                    }
                    // DON'T TRAIN. TOO EXPERIENCED.
                } else if (wantedLevel >= 100) {
                    // DECREASE WANTED LEVEL
                    task = topVirtuous[getRandomInt(topVirtuous.length)]; // Ethical Hacking, Vigilante Justice  
                } else if (earnedRespect < 1000) {
                    // BUILD RESPECT
                    task = topRespect[getRandomInt(topRespect.length)]; // Cyberterrorism, DDoS Attacks, Plant Virus, Money Laundering
                } else {
                    // EARN MONEY				
                    task = topEarners[getRandomInt(topEarners.length)]; // Ransomware, Phishing, Identity Theft, Fraud & Counterfeiting, Money Laundering
                }

                // ASSIGN NON-TRAINING TASK
                if (ns.gang.setMemberTask(member, task)) {
                    memberStats.push(member + "|" + task);
                    return; // GET OUT.
                }

            } else if (overrideTask != "Territory Warfare") {

                // TYPE
                if (override == "respect") {
                    task = topRespect[getRandomInt(topRespect.length)]; // Cyberterrorism, DDoS Attacks, Plant Virus, Money Laundering
                } else if (override == "earn") {
                    task = topEarners[getRandomInt(topEarners.length)]; // Ransomware, Phishing, Identity Theft, Fraud & Counterfeiting, Money Laundering
                } else if (override == "decrease") {
                    task = topVirtuous[getRandomInt(topVirtuous.length)]; // Ethical Hacking, Vigilante Justice  
                } else if (override == "train") {
                    task = task = training[1]; // Train Combat 0, Train Hacking 1, Train Charisma 2
                }

                // ASSIGN TASK
                if (ns.gang.setMemberTask(member, task)) {
                    memberStats.push(member + "|" + task);
                    return; // GET OUT.
                }
            }
        }

        // THIS IS NON-NEGOTIABLE. IF HACK LEVEL IS < 500, WE REQUIRE STRICT TRAINING. 
        // IGNORE ALL OTHER JOBS/TASKS.

        // TRAIN
        if (hackSkillLevel < 400 && earnedRespect < 500) {
            // Are we a Hacking gang? 
            // TRAIN HACKING
            if (gangInfo.isHacking) {
                task = training[1]; // Train Combat 0, Train Hacking 1, Train Charisma 2
            }
            // Are we a Combat gang? 
            // TRAIN COMBAT
            if (!gangInfo.isHacking) {
                task = training[0]; // Train Combat 0, Train Hacking 1, Train Charisma 2
            }
            // ASSIGN TRAINING task
            if (ns.gang.setMemberTask(member, task)) {
                memberStats.push(member + "|" + task);
                return; // GET OUT.
            }
        } else if (wantedLevel >= 100) {
            // DECREASE WANTED LEVEL
            task = topVirtuous[getRandomInt(topVirtuous.length)]; // Ethical Hacking, Vigilante Justice  
        } else if (earnedRespect < 1000) {
            // BUILD RESPECT
            task = topRespect[getRandomInt(topRespect.length)]; // Cyberterrorism, DDoS Attacks, Plant Virus, Money Laundering
        } else if (earnedRespect > 1000) {
            // EARN MONEY				
            task = topEarners[getRandomInt(topEarners.length)]; // Ransomware, Phishing, Identity Theft, Fraud & Counterfeiting, Money Laundering
        }

        // ASSIGN NON-TRAINING TASK
        if (ns.gang.setMemberTask(member, task)) {
            memberStats.push(member + "|" + task);
        } else {
            ns.print("   unable to assign " + member + " with " + task + "\n");
        }
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function FormatNumber(num) {
        let symbols = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"];
        let i = 0;
        for (; (num >= 1000) && (i < symbols.length); i++) num /= 1000;

        return ((Math.sign(num) < 0) ? "-$" : "$") + num.toFixed(3) + symbols[i];
    }

}
