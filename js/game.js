let player = {
    owo: new Decimal('10'),
    owoGenerators: {},
    weebEssence: new Decimal('0'),
    essenceReset: false,
    moe: new Decimal('0'),
    moeReset: false,
    uwu: new Decimal('0'),
    uwuReset: false,
    uwuGlitch: false,
};

let baseowoUpgradeMult = 1.15;
let baseMoeBonus = 0.03;
let baseEssenceBonus = 0.2;

// owo Stuff

function buyOwOGen(i) {
    if (!player.uwuGlitch) {
        if (player.owo.gte(player.owoGenerators[i - 1].cost)) {
            player.owoGenerators[i - 1].level = player.owoGenerators[i - 1].level.add(1);
            player.owoGenerators[i - 1].amount = player.owoGenerators[i - 1].amount.add(1);
            player.owo = player.owo.minus(player.owoGenerators[i - 1].cost);
            updateOwOGenMult(i);
            updateOwOGenCost(i);
        }
    }
}

function updateOwOGenMult(i) {
    player.owoGenerators[i - 1].mult = getowoUpgradeMult().pow(player.owoGenerators[i - 1].level).times(getEssenceMult());
}

function updateOwOGenCost(i) {
    player.owoGenerators[i - 1].cost = Decimal.pow(10, (player.owoGenerators[i - 1].cost.log10().add(Decimal.add(0.1, i * i * 0.1))));
}

function getowoUpgradeMult() {
    let mult = new Decimal(baseowoUpgradeMult).add(player.moe.times(baseMoeBonus));
    return mult;
}

function maxAllowo() {
    if (!player.uwuGlitch) {
        for (let i = 1; i <= 6; i++) {
            while (player.owo.gte(player.owoGenerators[i - 1].cost)) {
                buyOwOGen(i);
            }
        }
    }
}

// Essence Stuff

function getEssenceGain() {
    if (player.owo.gte('1e12')) {
        let gain = player.owo.log10().minus(11).times(player.owo.log10().minus(11)).floor();
        return gain;
    } else {
        return 0;
    }
}

function essenceReset() {
    if (player.owo.gte('1e12')) {
        player.weebEssence = player.weebEssence.add(getEssenceGain())
        player.owo = new Decimal(10);
        player.owoGenerators = getOwOGenerators();
        for (let i = 1; i <= 6; i++) {
            updateOwOGenMult(i)
        }
    }
    player.essenceReset = true;
}

function getEssenceMult() {
    let mult = player.weebEssence.times(baseEssenceBonus).add(1);
    return mult;
}

function getEssenceBonus() {
    let bonus = getEssenceMult();
    bonus = bonus.minus(1).times(100);
    return toScientific(bonus.toString()) + "%"
}

// Moe Stuff

function moeReset() {
    if (player.owo.gte(getMoeResetCost())) {
        player.moeReset = true;
        player.moe = player.moe.add(1);
        player.weebEssence = new Decimal(0);
        player.owo = new Decimal(10);
        player.owoGenerators = getOwOGenerators();
        for (let i = 1; i <= 6; i++) {
            updateOwOGenMult(i)
        }
    }
}

function getMoeResetCost() {
    let cost = Decimal.pow(10, Decimal.add(50, Decimal.times(50, player.moe.times(player.moe.add(1)).div(2))));
    return cost;
}

// uwu Stuff

function checkuwuReset() {
    if (player.owo.gte('1e400')) {
        player.uwuGlitch = true;
    } else {
        player.uwuGlitch = false;
    }
}

function uwuReset() {
    player.owo = new Decimal(10);
    player.uwuReset = true;
    player.uwu = player.uwu.add(1);
    player.uwuGlitch = false;
    player.moe = new Decimal(0);
    player.weebEssence = new Decimal(0);
    player.owoGenerators = getOwOGenerators();
    for (let i = 1; i <= 6; i++) {
        updateOwOGenMult(i)
    }
}

// function auto() {
//     for (let i = 1; i <= 6; i++) {
//         if (player.owo.gte(player.owoGenerators[i - 1].cost)) {
//             buyOwOGen(i);
//         }
//     }
// }


//Update Functions

function updateOwO() {
    for (i = 6; i > 1; i--) {
        player.owoGenerators[i - 2].amount = player.owoGenerators[i - 2].amount.add(player.owoGenerators[i - 1].amount.times(player.owoGenerators[i - 1].mult).div(33))
    }
    player.owo = player.owo.add(player.owoGenerators[0].amount.times(player.owoGenerators[0].mult).div(33));
}

function updateUwU() {
    checkuwuReset();
}

function update() {
    if (!player.uwuGlitch) {
        updateOwO();
    } else {
        player.owo = new Decimal('1e400');
    }
    updateUwU();
}

//Show Tab

function showtab(tabName) {
    document.getElementById("generatorstab").hidden = true;
    document.getElementById("otakutab").hidden = true;
    document.getElementById(tabName).hidden = false;
}

//Display Functions

function displayTabButtons() {
    if (player.uwuReset) {
        document.getElementById("uwuTabBtn").hidden = false;
    }
}

function displayOwO() {
    document.getElementById("owo").innerHTML = "You have " + toScientific(player.owo.toString()) + " owo";
    document.getElementById("owoGain").innerHTML = "You are gaining " + toScientific(
        player.owoGenerators[0].amount.times(player.owoGenerators[0].mult).toString()) + " owo per second";
}

function displayOwOGenerators() {
    for (let i = 1; i <= 6; i++) {
        document.getElementById("owomult" + i).innerHTML = "x" + toScientific(player.owoGenerators[i - 1].mult.toString());
        document.getElementById("owoamount" + i).innerHTML = toScientific(player.owoGenerators[i - 1].amount.toString());
        document.getElementById("owolvl" + i).innerHTML = "Lvl. " + toScientific(player.owoGenerators[i - 1].level.toString());
        document.getElementById("owobtn" + i).innerHTML = "Upgrade for :  " + toScientific(player.owoGenerators[i - 1].cost.toString());
    }
}

function displayEssenceGain() {
    document.getElementById("essenceReset").innerHTML = "Reset all generators and get " + toScientific(getEssenceGain().toString()) + " Weeb Essence";
    if (player.owo.gte('1e12') || player.essenceReset) {
        document.getElementById("essenceReset").hidden = false;
    }
    if (player.uwuGlitch) {
        document.getElementById("essenceReset").hidden = true;
    }
}

function displayEssenceAmount() {
    if (player.essenceReset) {
        document.getElementById("weebEssence").hidden = false;
    }
    document.getElementById("weebEssenceAmount").innerHTML = toScientific(player.weebEssence.toString());
}

function displayEssenceBonus() {
    document.getElementById("weebEssenceBonus").innerHTML = getEssenceBonus();
}

function displayEssenceStuff() {
    displayEssenceAmount();
    displayEssenceBonus();
}

function displayMoeButton() {
    if (player.owo.gte('1e50') || player.moeReset) {
        document.getElementById("moeReset").hidden = false;
    }
    document.getElementById("moeReset").innerHTML = "Reset all generators and all Weeb Essence to get a Moe. <br />Cost : " + toScientific(getMoeResetCost().toString()) + " owo";
    if (player.uwuGlitch) {
        document.getElementById("moeReset").hidden = true;
    }
}

function displayMoeMult() {
    if (player.moeReset) {
        document.getElementById("moeMult").hidden = false;
        document.getElementById("moeAmount").innerHTML = toScientific(player.moe.toString());
        document.getElementById("moeBonus").innerHTML = "+" + toScientific(player.moe.times(baseMoeBonus).toString()) + "x";
    }
}

function displayUpgradeMult() {
    document.getElementById("upgradeMultiplier").innerHTML = toScientific(getowoUpgradeMult().toString()) + "x";
}

function displayMoeStuff() {
    displayMoeButton();
    displayMoeMult();
}



function displayuwuStuff() {}

function display() {
    displayTabButtons();
    displayOwO();
    displayOwOGenerators();
    displayEssenceGain();
    if (player.essenceReset) {
        displayEssenceStuff();
    }
    displayMoeStuff();
    displayUpgradeMult();
    displayuwuStuff();
}

function gameLoop() {
    update();
    display();
}

function init() {
    player.owoGenerators = getOwOGenerators();
    if (localStorage.getItem("Weeb-Simulator-playerdata") != null) {
        loadSave();
    }
}

function loadSave() {
    player = JSON.parse(localStorage.getItem("Weeb-Simulator-playerdata"));
    player.owo = new Decimal(player.owo);
    player.owoGenerators.forEach(generator => {
        generator.amount = new Decimal(generator.amount);
        generator.level = new Decimal(generator.level);
        generator.mult = new Decimal(generator.mult);
        generator.cost = new Decimal(generator.cost);
        generator.baseCost = new Decimal(generator.baseCost);
    });
    player.weebEssence = new Decimal(player.weebEssence);
    player.moe = new Decimal(player.moe);
    player.uwu = new Decimal(player.uwu);
}

function save() {
    localStorage.setItem("Weeb-Simulator-playerdata", JSON.stringify(player));
    console.log("Saved on : " + Date.now())
}

//Hotkeys

window.addEventListener('keydown', function(event) {
    console.log(event.keyCode)
    switch (event.keyCode) {
        case 77: // M
            maxAllowo();
            break;
    }
}, false);


//String Formatting

function toScientific(string) {
    let a = new Decimal(string)
    if (!(a.gte(9e15))) {
        s = a.toPrecision(3);
        s = s.substring(0, s.indexOf("+")) + s.substring(s.indexOf("+") + 1, s.length);
        return s;
    } else {
        s = a.toString();
        if (s.indexOf("e") > 4) {
            s = s.substring(0, 4) + s.substring(s.indexOf("e"), s.length);
        }
        return s;
    }
}


init();
setInterval(gameLoop, 33);
setInterval(save, 30000);