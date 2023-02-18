/** @param {NS} ns */
export async function main(ns) {

    /*
            General gang action plan: 
                Respect 
                    -> 12 members 
                        -> power 
                            -> all win chances >55% 
                                -> engage in territory warfare on 
                                    -> power/money (keep win chances > 55%) 
                                        -> territory 100% 
                                            -> money/rep
    */

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

    const membersToAscend = [];
    const memberStats = [];

    const delay = 100;

    const HackAugs = ["DataJack", "Neuralstimulator", "BitWire"];
    const CrimeAugs = ["Bionic Spine", "Bionic Arms", "Bionic Legs", "Graphene Bone Lacings", "Synthetic Heart", "BrachiBlades", "Nanofiber Weave", "Synfibril Muscle"];
    const Weapons = ["Baseball Bat", "Katana", "Glock 18C", "P90C", "Steyr AUG", "AK-47", "M15A10 Assault Rifle", "AWM Sniper Rifle"];
    const Armor = ["Liquid Body Armor", "Bulletproof Vest", "Full Body Armor", "Graphene Plating Armor"];
    const Vehicles = ["Ford Flex V20", "White Ferrari", "ATX1070 Superbike", "Mercedes-Benz S9001"];
    const Rootkits = ["NUKE Rootkit", "Soulstealer Rootkit", "Demon Rootkit", "Hmap Node", "Jack the Ripper"];

    const MemberNames = ["Genie", "Myconid", "Ogre", "Pixie", "Treant", "Troglodyte", "Loco", "Puppet", "Stretch", "Eternity", "Zen", "Cable", "Craven"];

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
        const gangIncome = ns.gang.getGangInformation().moneyGainRate * 5;
        const gangRespect = parseFloat(ns.gang.getGangInformation().respect).toFixed(2);

        ns.print(" \n");
        ns.print(" Money available: " + "🏦💲 " + ns.nFormat(money, "0.000a"));
        ns.print(" Gang: 🌆 " + gangInfo.faction + " 💣");
        ns.print(" Gang income/sec: 💵 " + ns.nFormat(gangIncome, "0.000a"));
        ns.print(" Gang respect: 🦾" + gangRespect);

        var members = ns.gang.getMemberNames();
        var prospects = MemberNames.filter(c => !members.includes(c));

        ns.print("\n" + " Current Members:" + "\n");
        for (var i = 0; i < members.length; ++i) {
            ns.print("    " + "😈 " + members[i] + "\n");
        }

        ns.print("\n" + " Prospects:" + "\n");
        for (var i = 0; i < prospects.length; ++i) {
            ns.print("    " + "😐 " + prospects[i] + "\n");
        }

        // RECRUIT
        if (ns.gang.canRecruitMember()) {
            ns.print("\n" + " Recruiting new prospect..." + "\n");
            await RecruitProspect();
        } else {
            ns.print("\n" + "🔼 Increased 'Respect' level required to recruit new 'Prospects'." + "\n"); // 🆙⬆️
            //ns.print(" \n");
        }

        // ASCEND
        for (var i = 0; i < members.length; ++i) {
            if (await DoAscension(members[i])) {
                ns.print(" Ascending member: " + members[i] + "\n")
                await Ascend(members[i]);
            } else {
                // PUT IN ASCENDING WAIT-LIST
                // if (membersToAscend.includes(members[i])) {
                //     continue; // ignore
                // } else {
                //     membersToAscend.push(members[i]); // add them
                // }
            }
        }

        // Get our list of people to ascend.  
        // var ascendList = "";        
        // membersToAscend.forEach((e) => {
        //     ascendList += e + ", ";
        // });
        // ascendList = ascendList.substring(0, ascendList.length - 2); // remove last comma.
        // ns.print("🛑 Not optimal to ascend current member wait-list: "+ ascendList +" \n");

        // CHECK IF ALREADY PREPPED
        for (var i = 0; i < members.length; ++i) {
            if (memberPrepped.includes(members[i])) {
                continue;
            } else {
                // PREP MEMBER        
                ns.print(" Prepping member: " + members[i] + "\n")
                Prepare(members[i]);
            }
        }

        // GET ALL HACK SKILL LEVELS. Sort members from highest to lowest Hack().
        const skillSort = members.sort((b, a) => ns.gang.getMemberInformation(a).hack - ns.gang.getMemberInformation(b).hack)

        // SHOW STATS
        ns.print("\n" + " Members sorted by Hack Skill Level:");
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

            ns.print(name.padStart(longest0 + 1)
                + ", 💻hack: " + hacklevel.padStart(longest1 + 1)
                + ", 🕶️wanted: " + num0.padStart(9)
                + ", 🦾respect: " + num1.padStart(9)
                + ", 💵task: " + task.padStart(longest4 + 1)
                + " \n");
        });

        // RESET ENVIRONMNENT
        memberDataObj = {};
        memberStats.length = 0;

        ns.print(" \n");
        await ns.sleep(delay);
    }

    // Recruit a new prospect to a full gang member.
    async function RecruitProspect() {
        var currentMembers = ns.gang.getMemberNames();
        var availableNames = MemberNames.filter(x => !currentMembers.includes(x));
        ns.gang.recruitMember(availableNames[0]);
        ns.gang.setMemberTask(availableNames[0], "Train Hacking"); // Set to train initially.
        await ns.sleep(10);
    }


    // Determine if we should ascend this gang member
    async function DoAscension(name) {
        let memberInfo = ns.gang.getMemberInformation(name);
        var ascResult = ns.gang.getAscensionResult(memberInfo.name); // Get the result of an ascension without ascending.
        var strengthMultiplier = ascResult.str; // Strength multiplier gained from ascending
        var currentMultiplier = memberInfo.str_asc_mult; // CURRENT multiplier

        // Only ascend if the multiplier is less than 10 and will increase by at least 2
        if (memberInfo.str_asc_mult < 10 && ascResult != undefined) {
            let multchange = (currentMultiplier * strengthMultiplier) - currentMultiplier;
            if (multchange >= 2) {
                // Ascend
                return (ascResult.hack >= 2); // Hacking multiplier gained from ascending
            }
        } else if (ascResult == undefined) {

            return false;
        }
    }

    // Ascend this current gang member
    async function Ascend(name) {
        ns.gang.ascendMember(name); // Ascend the specified Gang Member.
        ns.print(name + " Has ascended⏫.")
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
                    ns.print("   buying " + name + ": " + e);
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
                    ns.print("   buying " + name + ": " + e);
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
                    ns.print("   buying " + name + ": " + e);
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
                    ns.print("   buying " + name + ": " + e);
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
                    ns.print("   buying " + name + ": " + e);
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
                    ns.print("   buying " + name + ": " + e);
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
            //ns.print("   " + name + " already owns: " + result);
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

        // CRIME
        if (!gangInfo.isHacking) {
            ns.gang.setMemberTask(member, warfare[0]);
        }

        // HACKING
        var task = "";
        var statsTarget = 50; // strength, agility, charisma, defense
        var statsTargetHacking = 500; // hacking
        var statsTargetRespect = 1000; // respect

        // THIS IS NON-NEGOTIABLE. IF HACK LEVEL IS < 500, WE REQUIRE STRICT TRAINING. 
        // IGNORE ALL OTHER JOBS/TASKS.
        if (hackSkillLevel < statsTargetHacking && earnedRespect < statsTargetRespect) {

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

            // not using ... && memberInfo.strength < statsTarget && memberInfo.agility < statsTarget && memberInfo.charisma < statsTarget && memberInfo.defense < statsTarget
            // not using ... task = training[getRandomInt(training.length)]; // not using 

            // ASSIGN task
            if (ns.gang.setMemberTask(member, task)) {
                memberStats.push(member + "|" + task);
                return; // GET OUT.
            }

        } else if (wantedLevel >= 10) {
            // DECREASE WANTED LEVEL
            task = topVirtuous[getRandomInt(topVirtuous.length)]; // Ethical Hacking, Vigilante Justice  
        } else if (earnedRespect < 1000) {
            // BUILD RESPECT
            task = topRespect[getRandomInt(topRespect.length)]; // Cyberterrorism, DDoS Attacks, Plant Virus, Money Laundering
        } else if (earnedRespect > 1000) {
            // EARN MONEY				
            task = topEarners[getRandomInt(topEarners.length)]; // Ransomware, Phishing, Identity Theft, Fraud & Counterfeiting, Money Laundering
        }

        // ASSIGN TASK
        if (ns.gang.setMemberTask(member, task)) {
            memberStats.push(member + "|" + task);
        } else {
            ns.print("   unable to assign " + member + " with " + task + "\n");
        }
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

}
