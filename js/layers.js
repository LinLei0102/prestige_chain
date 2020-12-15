function getPointGen() {
	//if (!canGenPoints()) return new Decimal(0)

	let gain = new Decimal(1)

        for (let i = 0; i < LAYERS.length; i++){
                if (layers[LAYERS[i]].row == "side") continue
                gain = gain.times(tmp[LAYERS[i]].effect)
        }

        if (hasUpgrade("a", 11))  gain = gain.times(upgradeEffect("a", 11))
        if (hasUpgrade("a", 12))  gain = gain.times(upgradeEffect("a", 12))
                                  gain = gain.times(getBuyableEffect("a", 11))
                                  gain = gain.times(getBuyableEffect("a", 23))
                                  gain = gain.times(getBuyableEffect("b", 11))
        if (hasUpgrade("c", 51))  gain = gain.times(100)
                                  gain = gain.times(tmp.goalsii.effect)


        gain = gain.pow(getPointGenExp())

	return gain
}

function getPointGenExp(){
        let exp = new Decimal(1)
        if (inChallenge("b", 22)) exp = exp.div(2)
        exp = exp.times(Decimal.pow(.9, getChallengeDepth(2)))
        return exp
}

function filter(list, keep){
        return list.filter(x => keep.includes(x))
}

function filterout(list, remove){
        return list.filter(x => !remove.includes(x))
}

function canBuyMax(layer, id) {
	return false
}

function getBuyableEffect(layer, id){
        return tmp[layer].buyables[id].effect
}

function getsReset(layer, layerPrestiging) {
        if (layerPrestiging == "goalsii"){
                return ["a", "b", "c", "d", "e", "f"].includes(layer)
        }
        order = LAYERS
        for (let i = 0; i < order.length; i++) {
                if (layers[LAYERS[i]].row == "side") continue
                if (layerPrestiging == order[i]) return false
                if (layer == order[i]) return true
        }
        return false
}

function hasUnlockedPast(layer){
        if (["a", "b", "c", "d", "e", "f"].includes(layer)) {
                if (layers["goalsii"].layerShown()) return true
        }
        let on = false
        for (let i = 0; i < LAYERS.length; i++) {
                if (layers[LAYERS[i]].row == "side") continue
                if (on && layers[LAYERS[i]].layerShown()) return true
                if (layer == LAYERS[i]) on = true
        }
        return false
}

function getChallengeFactor(comps){
        let b1 = new Decimal(comps).pow(1.5).plus(1)
        if (b1.gt(10)) b1 = Decimal.pow(10, b1.div(10))
        if (b1.gt(1e10)) b1 = b1.tetrate(1.01) 
        return b1
}

function isBuyableActive(layer, thang){
        if (layer == "g") return true
        if (layer == "f") return true
        if (layer == "e") return true
        if (layer == "d") return true
        let depth = getChallengeDepth(3)
        if (depth > 2) return thang%10 != 1
        if (layer == "c") return true
        if (inChallenge("c", 11)) return false
        if (depth > 1) return thang%10 != 1
        if (layer == "b") return true
        if (inChallenge("b", 11)) return false
        if (depth > 0) return thang%10 != 1
        if (layer == "a") return true
}

function isPrestigeEffectActive(layer){
        if (layer == "g") return true
        if (layer == "f") return true
        if (layer == "e") return true
        if (layer == "d") return true
        if (layer == "c") return true
        if (layer == "b") return true
        if (inChallenge("b", 21)) return false
        if (layer == "a") return true
}

function totalChallengeComps(layer){
        let a = challengeCompletions(layer, 11) || 0
        let b = challengeCompletions(layer, 12) || 0
        let c = challengeCompletions(layer, 21) || 0
        let d = challengeCompletions(layer, 22) || 0
        return a + b + c + d
}

function getABBulk(layer){
        let amt = 1
        if (hasUpgrade("e", 11))           amt *= Math.max(player.ach.achievements.length, 1)
        if (hasUpgrade("d", 35))           amt *= 100
        if (hasUpgrade("e", 23))           amt *= 100
        if (hasMilestone("ach", 4))        amt *= 100
        if (hasMilestone("goalsii", 0))    amt *= 10
        if (hasMilestone("goalsii", 1))    amt *= 10
        if (hasMilestone("goalsii", 8))    amt *= player.goalsii.points.max(1).toNumber()
        if (hasMilestone("goalsii", 11))   amt *= Math.pow(2, player.goalsii.milestones.length)
        if (layer == "a") {
                if (hasUpgrade("a", 35)) amt *= 10
                if (hasUpgrade("b", 21)) {
                        amt *= 2
                        if (hasUpgrade("b", 22)) amt *= 2
                        if (hasUpgrade("b", 23)) amt *= 2
                        if (hasUpgrade("b", 24)) amt *= 2
                        if (hasUpgrade("b", 25)) amt *= 2
                }
                if (hasUpgrade("b", 32)) {
                        amt *= 2
                        if (hasUpgrade("b", 31)) amt *= 2
                        if (hasUpgrade("b", 33)) amt *= 2
                        if (hasUpgrade("b", 34)) amt *= 2
                        if (hasUpgrade("b", 35)) amt *= 2
                }
                if (hasUpgrade("c", 41)) amt *= 10
                return amt
        }
        if (layer == "b") {
                if (hasUpgrade("b", 32)) {
                        amt *= 2
                        if (hasUpgrade("b", 31)) amt *= 2
                        if (hasUpgrade("b", 33)) amt *= 2
                        if (hasUpgrade("b", 34)) amt *= 2
                        if (hasUpgrade("b", 35)) amt *= 2
                }
                if (hasUpgrade("c", 41)) amt *= 2
                return amt
        }
        if (layer == "c"){
                return amt
        }
        if (layer == "d"){
                return amt
        }
        if (layer == "e"){
                return amt
        }
        if (layer == "f"){
                return amt
        }
        if (layer == "g"){
                return amt
        }
        return amt
}

function getABSpeed(layer){
        let diffmult = 1
        if (hasUpgrade("e", 22)) diffmult *= 2
        if (hasUpgrade("e", 24)) diffmult *= 3
        if (hasMilestone("goalsii", 0)) diffmult *= 3
        if (layer == "a"){
                if (hasUpgrade("b", 45)) diffmult *= 2
        }
        if (layer == "b"){
                if (hasUpgrade("b", 45)) diffmult *= 2
        }
        if (layer == "c"){
                if (hasUpgrade("d", 41)) diffmult *= 3
        }
        if (layer == "d"){
                if (hasUpgrade("e", 21)) diffmult *= 3
        }

        return diffmult
}

function getPrestigeGainChangeExp(layer){
        let exp = new Decimal(1)
        if (layer == "a" && inChallenge("c", 12)) exp = exp.div(2)
        if (["a", "b", "c", "d", "e", "f"].includes(layer)) {
                exp = exp.times(Decimal.pow(.985, getChallengeDepth(1)))
                if (hasMilestone("g", 1)) exp = exp.times(1.001)
        }       
        if (layer == "f") {
                exp = exp.times(Decimal.pow(.9, getChallengeDepth(2) + getChallengeDepth(4)))
        }
        if (layer == "e"){
                exp = exp.times(Decimal.pow(.9, getChallengeDepth(2)))
                exp = exp.times(Decimal.pow(.8, getChallengeDepth(3)))
                if (hasUpgrade("goalsii", 14) && getChallengeDepth(4) > 0) exp = exp.times(2)
        }
        return exp
}

function doPrestigeGainChange(amt, layer){
        let exp = getPrestigeGainChangeExp(layer)
        amt = amt.pow(exp)
        return amt
}

function getMaxBuyablesAmount(layer){
        return Decimal.pow(10, 20)
}

function getPrestigeName(layer){
        return {
                a: "Amoebas",
                b: "Bacterias",
                c: "Circles",
                d: "Doodles",
                e: "Eggs",
                f: "Features",
                g: "Games",
        }[layer]
}

function getTimesRequired(chance){
        let r1 = Math.random()
        //we want (1-chance)^n < r1
        let n = Math.log(r1)/Math.log(1-chance) 
        //log(1-chance) of r2
        return Math.floor(n) + 1
}

var devSpeedUp = false


/*
bacteria
circles
doodles
eggs
features
games
hooks
*/

//upgrade names:
// https://github.com/first20hours/google-10000-english/blob/master/google-10000-english.txt

addLayer("a", {
        name: "Amoebas", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#BB4C83",
        branches: [],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Amoebas", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let a = pts.div(div)
                if (a.lt(1)) return new Decimal(0)

                let ret = a.log10().times(pre).pow(exp).times(pst)

                ret = doPrestigeGainChange(ret, "a")

                return ret.floor()
        },
        getBaseDiv(){
                let x = new Decimal(1)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasUpgrade("a", 32)) x = x.times(3)

                x = x.plus(tmp.a.buyables[21].effect)
                x = x.plus(getGoalChallengeReward("00"))

                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)

                let yet = false
                for (let i = 0; i < LAYERS.length; i++){
                        if (layers[LAYERS[i]].row == "side") continue
                        if (yet) x = x.times(tmp[LAYERS[i]].effect)
                        if (LAYERS[i] == "a") yet = true
                }

                if (hasUpgrade("a", 13)) x = x.times(upgradeEffect("a", 13))
                if (hasUpgrade("a", 14)) x = x.times(upgradeEffect("a", 14))
                if (hasUpgrade("a", 23)) x = x.times(2)
                                         x = x.times(getBuyableEffect("a", 12))
                if (hasUpgrade("b", 11)) x = x.times(upgradeEffect("b", 11))
                                         x = x.times(getBuyableEffect("a", 31))
                                         x = x.times(getBuyableEffect("b", 21))
                                         x = x.times(getBuyableEffect("c", 23))
                                         x = x.times(tmp.goalsii.effect)

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("a")) return new Decimal(1)

                let amt = player.a.points

                let ret = amt.plus(1).sqrt()

                ret = softcap(ret, "a_eff")

                return ret
        },
        effectDescription(){
                let eff = this.effect()
                let a = "which buffs point and all previous prestige gain by "

                return a + format(eff) + "."
        },
        update(diff){
                player.a.best = player.a.best.max(player.a.points)
                if (hasUpgrade("a", 23)) {
                        player.a.points = player.a.points.plus(this.getResetGain().times(diff))
                        player.a.total = player.a.total.plus(this.getResetGain().times(diff))
                        player.a.autotimes += diff
                        if (player.a.autotimes > 3) player.a.autotimes = 3
                        if (player.a.autotimes > 1) {
                                player.a.autotimes += -1
                                player.a.times ++
                        }
                }
                if (hasUpgrade("b", 14) || hasMilestone("goalsii", 1)) {
                        player.a.abtime += diff * getABSpeed("a")

                        if (player.a.abtime > 10) player.a.abtime = 10
                        if (player.a.abtime > 1) {
                                player.a.abtime += -1
                                let amt = getABBulk("a")
                                if (tmp.a.buyables[11].unlocked) layers.a.buyables[11].buyMax(amt)
                                if (tmp.a.buyables[12].unlocked) layers.a.buyables[12].buyMax(amt)
                                if (tmp.a.buyables[13].unlocked) layers.a.buyables[13].buyMax(amt)
                                if (tmp.a.buyables[21].unlocked) layers.a.buyables[21].buyMax(amt)
                                if (tmp.a.buyables[22].unlocked) layers.a.buyables[22].buyMax(amt)
                                if (tmp.a.buyables[23].unlocked) layers.a.buyables[23].buyMax(amt)
                                if (tmp.a.buyables[31].unlocked) layers.a.buyables[31].buyMax(amt)
                                if (tmp.a.buyables[32].unlocked) layers.a.buyables[32].buyMax(amt)
                                if (tmp.a.buyables[33].unlocked) layers.a.buyables[33].buyMax(amt)
                        }
                } else {
                        player.a.abtime = 0
                }
                player.a.time += diff
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "]", description: "]: Buy max of all upgrades", 
                onPress(){
                        let l =  ["a", "b", "c", "d", "e", "goalsii", "f", "g"]
                        let trylist = [11, 12, 13, 14, 15, 
                                21, 22, 23, 24, 25,
                                31, 32, 33, 34, 35,
                                41, 42, 43, 44, 45,
                                51, 52, 53, 54, 55,]
                        for (j in l){
                                i = l[j] //i is our layer
                                if (layers[i] == undefined) continue
                                for (k in trylist) {
                                        //if we have the upgrade continue
                                        if (hasUpgrade(i, trylist[k])) continue
                                        if (layers[i].upgrades[trylist[k]] == undefined) continue
                                        //if the upgrade is undefined continue
                                        
                                        //if we dont have it, try to buy it 
                                        buyUpgrade(i, trylist[k])
                                }
                        }
                }
            },
            {key: "a", description: "A: Reset for Amoeba", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return true},
        prestigeButtonText(){
                let gain= this.getResetGain()
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let nextnum = Decimal.pow(10, gain.plus(1).div(pst).root(exp).div(pre)).times(div).ceil()

                let nextAt = ""
                if (gain.lt(1e6)) {
                        nextAt = "<br>Next at " + format(nextnum) + " " + this.baseResource
                        let ps = gain.div(player.a.time || 1)

                        if (ps.lt(1000/60)) nextAt += "<br>" + format(ps.times(60)) + "/m"
                        else nextAt += "<br>" + format(ps) + "/s"
                }

                let a = "Reset for " + formatWhole(gain) + " " + this.resource

                return a + nextAt
        },
        canReset(){
                return this.getResetGain().gt(0) && player.a.time >= 2 && !hasUpgrade("a", 23)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "And",
                        description: "Amoebas boost point gain",
                        cost: new Decimal(2),
                        effect(){
                                if (inChallenge("b", 12)) return new Decimal(1)
                                
                                let exp = 3
                                if (hasUpgrade("a", 21)) exp += player.a.upgrades.length * .5

                                if (hasUpgrade("a", 44)) exp *= exp
                                if (hasUpgrade("c", 11)) exp *= 2

                                let ret = player.a.points.times(10).plus(20).log10().pow(exp)
                                return ret
                        },
                        unlocked(){
                                return player.a.best.gt(0) || hasUnlockedPast("a")
                        }
                },
                12: {
                        title: "A",
                        description: "Each Amoeba Upgrade doubles point gain",
                        cost: new Decimal(15),
                        effect(){
                                let base = 2
                                if (hasUpgrade("a", 25)) base += player.a.upgrades.length * .02

                                let exp = player.a.upgrades.length
                                if (hasUpgrade("a", 53)) exp *= player.a.upgrades.length
                                
                                return Decimal.pow(base, exp)
                        },
                        unlocked(){
                                return hasUpgrade("a", 11) || hasUnlockedPast("a")
                        }
                },
                13: {
                        title: "Are",
                        description: "Each Amoeba Upgrade multiplies Amoeba gain by 1.2",
                        cost: new Decimal(100),
                        effect(){
                                let exp = new Decimal(player.a.upgrades.length)
                                exp = exp.times(tmp.a.buyables[13].effect)
                                return Decimal.pow(1.2, exp)
                        },
                        unlocked(){
                                return hasUpgrade("a", 12) || hasUnlockedPast("a")
                        }
                },
                14: {
                        title: "At",
                        description: "Amoebas boost Amoeba gain",
                        cost: new Decimal(300),
                        effect(){
                                let exp = new Decimal(1)
                                if (hasUpgrade("a", 35)) exp = exp.times(3)
                                if (hasUpgrade("c", 12)) exp = exp.times(player.b.upgrades.length).max(exp)
                                return player.a.points.plus(10).log10().pow(exp)
                        },
                        unlocked(){
                                return hasUpgrade("a", 13) || hasUnlockedPast("a")
                        }
                },
                15: {
                        title: "As",
                        description: "Unlock the first Amoeba buyable",
                        cost: new Decimal(1000),
                        unlocked(){
                                return hasUpgrade("a", 14) || hasUnlockedPast("a")
                        }
                },
                21: {
                        title: "An",
                        description: "Each Amoeba upgrade adds .5 to the <b>And</b> exponent",
                        cost: new Decimal(2500),
                        effect(){
                                return 3 + player.a.upgrades.length
                        },
                        effectDisplay(){
                                return "3 -> " + format(3 + player.a.upgrades.length * .5, 1)
                        },
                        unlocked(){
                                return getBuyableAmount("a", 11).gte(3) || hasUnlockedPast("a")
                        }
                },
                22: {
                        title: "About",
                        description: "Unlock the second Amoeba buyable",
                        cost: new Decimal(2e4),
                        unlocked(){
                                return getBuyableAmount("a", 11).gte(6) || hasUnlockedPast("a")
                        }
                },
                23: {
                        title: "Also",
                        description: "Remove the ability to prestige but gain 100% of Amoebas on prestige per second, also double Amoeba gain",
                        cost: new Decimal(3e4),
                        unlocked(){
                                return getBuyableAmount("a", 12).gte(2) || hasUnlockedPast("a")
                        }
                },
                24: {
                        title: "Am",
                        description: "<b>Any</b> gives free levels to <b>All</b>",
                        cost: new Decimal(15e4),
                        unlocked(){
                                return getBuyableAmount("a", 12).gte(3) || hasUnlockedPast("a")
                        }
                },
                25: {
                        title: "Add",
                        description: "Each Amoeba upgrade adds .02 to the <b>A</b> base",
                        cost: new Decimal(5e5),
                        unlocked(){
                                return getBuyableAmount("a", 11).gte(11) || hasUnlockedPast("a")
                        }
                },
                31: {
                        title: "Available",
                        description: "Unlock a third Amoeba buyable",
                        cost: new Decimal(1e7),
                        unlocked(){
                                return hasUpgrade("b", 13) || hasUnlockedPast("b")
                        }
                },
                32: {
                        title: "Address",
                        description: "Cube base Amoeba gain",
                        cost: new Decimal(1e26),
                        unlocked(){
                                return hasUpgrade("b", 14) || hasUnlockedPast("b")
                        }
                },
                33: {
                        title: "Area",
                        description: "Remove the first Amoeba effect softcap",
                        cost: new Decimal(1e40),
                        unlocked(){
                                return hasUpgrade("a", 32) || hasUnlockedPast("b")
                        }
                },
                34: {
                        title: "Action",
                        description: "Each <b>After</b> gives a free level to <b>All</b> and adds .01 to the base",
                        cost: new Decimal(3e50),
                        unlocked(){
                                return hasUpgrade("a", 33) || hasUnlockedPast("b")
                        }
                },
                35: {
                        title: "American",
                        description: "<b>Business</b> can buy 10, cube <b>At</b>, and Amoeba buyables cost nothing",
                        cost: new Decimal(1e54),
                        unlocked(){
                                return hasUpgrade("a", 34) || hasUnlockedPast("b")
                        }
                },
                41: {
                        title: "Art",
                        description: "Get a free <b>Access</b> level",
                        cost: new Decimal(1e88),
                        unlocked(){
                                return hasUpgrade("a", 35) || hasUnlockedPast("b")
                        }
                }, 
                42: {
                        title: "Another",
                        description: "<b>Account</b> gives free <b>Access</b> levels",
                        cost: new Decimal(1e195),
                        unlocked(){
                                return hasUpgrade("a", 41) || hasUnlockedPast("b")
                        }
                },
                43: {
                        title: "Article",
                        description: "<b>Account</b> adds .05 to the <b>Any</b> base",
                        cost: new Decimal(1e284),
                        unlocked(){
                                return hasUpgrade("a", 42) || hasUnlockedPast("b")
                        }
                },
                44: {
                        title: "Author",
                        description: "Square <b>And</b> exponent",
                        cost: new Decimal("5e524"),
                        unlocked(){
                                return hasUpgrade("a", 43) || hasUnlockedPast("b")
                        }
                },
                45: {
                        title: "Around",
                        description: "Each <b>Account</b> adds .01 to its base",
                        cost: new Decimal("1e568"),
                        unlocked(){
                                return hasUpgrade("a", 44) || hasUnlockedPast("b")
                        }
                },
                51: {
                        title: "Air",
                        description: "Each <b>Access</b> adds .01 to the <b>Any</b> base",
                        cost: new Decimal("5e1228"),
                        unlocked(){
                                return hasUpgrade("a", 45) || hasUnlockedPast("c")
                        }
                },
                52: {
                        title: "Accessories",
                        description: "<b>Account</b> adds levels to <b>After</b>",
                        cost: new Decimal("1e1654"),
                        unlocked(){
                                return hasUpgrade("a", 51) || hasUnlockedPast("c")
                        }
                },
                53: {
                        title: "Application",
                        description: "Unlock a seventh Amoeba buyable and raise <b>A</b> to the number of Amoeba upgrades",
                        cost: new Decimal("1e1797"),
                        unlocked(){
                                return hasUpgrade("a", 52) || hasUnlockedPast("c")
                        }
                },
                54: {
                        title: "Again",
                        description: "<b>Advanced</b> gives free levels to <b>Account</b>",
                        cost: new Decimal("1e1948"),
                        unlocked(){
                                return hasUpgrade("a", 53) || hasUnlockedPast("c")
                        }
                },
                55: {
                        title: "Act",
                        description: "Unlock a second Bacteria buyable and remove the second Amoeba effect softcap",
                        cost: new Decimal("1e4256"),
                        unlocked(){
                                return hasUpgrade("a", 53) || hasUnlockedPast("c")
                        }
                },
                /*
                august
                america
                */
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "All",
                        display(){
                                return getBuyableDisplay("a", 11)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a11"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 11)
                        },
                        total(){
                                return getBuyableAmount("a", 11).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 11)
                        },
                        buy(){
                                buyManualBuyable("a", 11)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 11, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("a", 15) || hasUnlockedPast("a")
                        },
                },
                12: {
                        title: "Any",
                        display(){
                                return getBuyableDisplay("a", 12)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a12"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 12)
                        },
                        total(){
                                return getBuyableAmount("a", 12).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 12)
                        },
                        buy(){
                                buyManualBuyable("a", 12)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 12, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("a", 22) || hasUnlockedPast("a")
                        },
                },
                13: {
                        title: "After",
                        display(){
                                return getBuyableDisplay("a", 13)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a13"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 13)
                        },
                        total(){
                                return getBuyableAmount("a", 13).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 13)
                        },
                        buy(){
                                buyManualBuyable("a", 13)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 13, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("a", 31) || hasUnlockedPast("b")
                        },
                },
                21: {
                        title: "Access",
                        display(){
                                return getBuyableDisplay("a", 21)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a21"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 21)
                        },
                        total(){
                                return getBuyableAmount("a", 21).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 21)
                        },
                        buy(){
                                buyManualBuyable("a", 21)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 21, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 21) || hasUnlockedPast("b")
                        },
                },
                22: {
                        title: "Account",
                        display(){
                                return getBuyableDisplay("a", 22)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a22"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 22)
                        },
                        total(){
                                return getBuyableAmount("a", 22).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 22)
                        },
                        buy(){
                                buyManualBuyable("a", 22)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 22, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 24) || hasUnlockedPast("b")
                        },
                },
                23: {
                        title: "Advanced",
                        display(){
                                return getBuyableDisplay("a", 23)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a23"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 23)
                        },
                        total(){
                                return getBuyableAmount("a", 23).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 23)
                        },
                        buy(){
                                buyManualBuyable("a", 23)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 23, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("c", 12) || hasUnlockedPast("c")
                        },
                },
                31: {
                        title: "Against",
                        display(){
                                return getBuyableDisplay("a", 31)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a31"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 31)
                        },
                        total(){
                                return getBuyableAmount("a", 31).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 31)
                        },
                        buy(){
                                buyManualBuyable("a", 31)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 31, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("a", 53) || hasUnlockedPast("c")
                        },
                },
                32: {
                        title: "Above",
                        display(){
                                return getBuyableDisplay("a", 32)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a32"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 32)
                        },
                        total(){
                                return getBuyableAmount("a", 32).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 32)
                        },
                        buy(){
                                buyManualBuyable("a", 32)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 32, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 43) || hasUnlockedPast("c")
                        },
                },
                33: {
                        title: "Omnipotent I",
                        display(){
                                return getBuyableDisplay("a", 33)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a33"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 33)
                        },
                        total(){
                                return getBuyableAmount("a", 33).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 33)
                        },
                        buy(){
                                buyManualBuyable("a", 33)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 33, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 51) || hasUnlockedPast("d")
                        },
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("a", 23) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {return shiftDown ? "Your best Amoebas is " + format(player.a.best) : ""}],
                                ["display-text",
                                        function() {
                                                if (hasUnlockedPast("a")) return ""
                                                return "You have done " + formatWhole(player.a.times) + " Amoeba resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (hasUpgrade("a", 23)) return "You are gaining " + format(tmp.a.getResetGain) + " Amoebas per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.a.time)) + ")" 
                                        },
                                        //{"font-size": "20px"}
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                if (hasUpgrade("a", 23) && shiftDown) return "You are gaining " + format(tmp.a.getResetGain) + " Amoebas per second"
                                                return ""
                                        },
                                ],
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("a", 15) || hasUnlockedPast("a")
                        },
                },
        },
        doReset(layer){
                if (layer == "a") player.a.time = 0
                if (!getsReset("a", layer)) return
                player.a.time = 0
                player.a.times = 0

                if (!hasMilestone("ach", 1)) {
                        //upgrades
                        let keep = []
                        if (hasUpgrade("b", 13)) keep.push(11,12,13,14,15,21,22,23,24,25)
                        if (hasUpgrade("b", 14)) keep.push(31,32,33,34,35,41,42,43,44,45)
                        if (hasMilestone("goalsii", 2)) keep.push(23)
                        if (!hasUpgrade("c", 11)) player.a.upgrades = filter(player.a.upgrades, keep)
                }

                //resources
                player.a.points = new Decimal(0)
                player.a.total = new Decimal(0)
                player.a.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.a.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})

addLayer("b", {
        name: "Bacteria", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#0B4CC3",
        branches: ["a"],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Bacterias", // Name of prestige currency
        baseResource: "Amoebas", // Name of resource prestige is based on
        baseAmount() {return player.a.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let a = pts.div(div)
                if (a.lt(1)) return new Decimal(0)

                let ret = a.log10().times(pre).pow(exp).times(pst)

                if (!hasUnlockedPast("b") && player.b.best.eq(0)) ret = ret.min(1)

                ret = doPrestigeGainChange(ret, "b")

                return ret.floor()
        },
        getBaseDiv(){
                let x = new Decimal(1e5)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasUpgrade("c", 25)) x = x.plus(1)
                if (hasUpgrade("d", 12)) x = x.plus(totalChallengeComps("b") ** 2)
                                         x = x.plus(tmp.a.buyables[33].effect)
                                         x = x.plus(getGoalChallengeReward("00"))
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                x = x.times(tmp.c.buyables[21].effect)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)

                let yet = false
                for (let i = 0; i < LAYERS.length; i++){
                        if (layers[LAYERS[i]].row == "side") continue
                        if (yet) x = x.times(tmp[LAYERS[i]].effect)
                        if (LAYERS[i] == "b") yet = true
                }

                x = x.times(tmp.a.buyables[22].effect)
                x = x.times(tmp.b.buyables[12].effect)
                x = x.times(tmp.goalsii.effect)

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("b")) return new Decimal(1)

                let amt = player.b.points

                let ret = amt.times(3).plus(1).sqrt()

                ret = softcap(ret, "b_eff")

                return ret
        },
        effectDescription(){
                let eff = this.effect()
                let a = "which buffs point and all previous prestige gain by "

                return a + format(eff) + "."
        },
        update(diff){
                player.b.best = player.b.best.max(player.b.points)
                if (hasUpgrade("b", 22)) {
                        player.b.points = player.b.points.plus(this.getResetGain().times(diff))
                        player.b.total = player.b.total.plus(this.getResetGain().times(diff))
                        player.b.autotimes += diff
                        if (player.b.autotimes > 3) player.b.autotimes = 3
                        if (player.b.autotimes > 1) {
                                player.b.autotimes += -1
                                player.b.times ++
                        }
                }
                if (hasUpgrade("b", 32) || hasMilestone("goalsii", 1)) {
                        player.b.abtime += diff * getABSpeed("b")
                        
                        if (player.b.abtime > 10) player.b.abtime = 10
                        if (player.b.abtime > 1) {
                                player.b.abtime += -1
                                let amt = getABBulk("b")
                                if (tmp.b.buyables[11].unlocked) layers.b.buyables[11].buyMax(amt)
                                if (tmp.b.buyables[12].unlocked) layers.b.buyables[12].buyMax(amt)
                                if (tmp.b.buyables[13].unlocked) layers.b.buyables[13].buyMax(amt)
                                if (tmp.b.buyables[21].unlocked) layers.b.buyables[21].buyMax(amt)
                                if (tmp.b.buyables[22].unlocked) layers.b.buyables[22].buyMax(amt)
                                if (tmp.b.buyables[23].unlocked) layers.b.buyables[23].buyMax(amt)
                                if (tmp.b.buyables[31].unlocked) layers.b.buyables[31].buyMax(amt)
                                if (tmp.b.buyables[32].unlocked) layers.b.buyables[32].buyMax(amt)
                                if (tmp.b.buyables[33].unlocked) layers.b.buyables[33].buyMax(amt)
                        }
                } else {
                        player.b.abtime = 0
                }
                player.b.time += diff
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "b", description: "B: Reset for Bacteria", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.a.best.gt(1e6) || player.b.best.gt(0) || hasUnlockedPast("b")},
        prestigeButtonText(){
                let gain= this.getResetGain()
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let nextnum = Decimal.pow(10, gain.plus(1).div(pst).root(exp).div(pre)).times(div).ceil()

                let nextAt = ""
                if (gain.lt(1e6) && (hasUnlockedPast("b") || player.b.best.neq(0))) {
                        nextAt = "<br>Next at " + format(nextnum) + " " + this.baseResource
                        let ps = gain.div(player.b.time || 1)

                        if (ps.lt(1000/60)) nextAt += "<br>" + format(ps.times(60)) + "/m"
                        else nextAt += "<br>" + format(ps) + "/s"
                }

                let a = "Reset for " + formatWhole(gain) + " " + this.resource

                return a + nextAt
        },
        canReset(){
                return this.getResetGain().gt(0) && player.b.time >= 5 && !hasUpgrade("b", 22)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "By",
                        description: "Bacteria boosts Amoeba gain",
                        cost: new Decimal(2),
                        effect(){
                                let ret = player.b.points.plus(8).sqrt()
                                ret = softcap(ret, "b_upg11")

                                if (hasUpgrade("c", 11)) ret = ret.pow(2)
                                return ret
                        },
                        unlocked(){
                                return player.b.best.gte(1) || hasUnlockedPast("b")
                        }
                },
                12: {
                        title: "Be",
                        description: "Each Bacteria upgrade adds .1 to the <b>Any</b> gain base",
                        cost: new Decimal(3),
                        unlocked(){
                                return hasUpgrade("b", 11) || hasUnlockedPast("b")
                        }
                },
                13: {
                        title: "But",
                        description: "Keep the first two rows of Amoeba upgrades and unlock more",
                        cost: new Decimal(15),
                        unlocked(){
                                return hasUpgrade("b", 12) || hasUnlockedPast("b")
                        }
                },
                14: {
                        title: "Business",
                        description: "Keep the third and fourth rows of Amoeba upgrades and buy each Amoeba buyable once per second",
                        cost: new Decimal(1000),
                        unlocked(){
                                return hasUpgrade("b", 13) || hasUnlockedPast("b")
                        }
                },
                15: {
                        title: "Been",
                        description: "<b>After</b> gives free levels to <b>Any</b>",
                        cost: new Decimal(5000),
                        unlocked(){
                                return hasUpgrade("b", 14) || hasUnlockedPast("b")
                        }
                },
                21: {
                        title: "Back",
                        description: "<b>Business</b> can buy twice as much per this row upgrade and unlock a fourth Amoeba buyable",
                        cost: new Decimal(25000),
                        unlocked(){
                                return hasUpgrade("a", 35) || hasUnlockedPast("b")
                        }
                },
                22: {
                        title: "Buy",
                        description: "Remove the ability to prestige but gain 100% of Bacteria on prestige per second",
                        cost: new Decimal(5e4),
                        unlocked(){
                                return hasUpgrade("a", 41) || hasUnlockedPast("b")
                        }
                },
                23: {
                        title: "Best",
                        description: "Access gives free Any levels",
                        cost: new Decimal(5e5),
                        unlocked(){
                                return hasUpgrade("b", 22) || hasUnlockedPast("b")
                        }
                },
                24: {
                        title: "Books",
                        description: "Unlock the fifth Amoeba buyable and each Amoeba upgrade gives a free <b>Any</b>",
                        cost: new Decimal(7e5),
                        unlocked(){
                                return hasUpgrade("b", 23) || hasUnlockedPast("b")
                        }
                },
                25: {
                        title: "Book",
                        description: "Access gives free After levels",
                        cost: new Decimal(3e6),
                        unlocked(){
                                return hasUpgrade("b", 24) || hasUnlockedPast("b")
                        }
                },
                31: {
                        title: "Before",
                        description: "Unlock a Bacteria buyable and get a free <b>Account</b>",
                        cost: new Decimal(1e15),
                        unlocked(){
                                return hasUpgrade("c", 13) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 31)
                },
                32: {
                        title: "Between",
                        description: "Autobuy <b>B</b> buyables once per second and each upgrade in this row allows <b>A</b> and <b>B</b> autobuyers to buy 2x more",
                        cost: new Decimal(5e68),
                        unlocked(){
                                return hasUpgrade("a", 54) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 32)
                },
                33: {
                        title: "Black",
                        description: "<b>Against</b> gives free <b>Account</b> levels",
                        cost: new Decimal(1e73),
                        unlocked(){
                                return hasUpgrade("a", 55) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 33)
                },
                34: {
                        title: "Being",
                        description: "<b>Based</b> gives free <b>Because</b> levels",
                        cost: new Decimal(3e173),
                        unlocked(){
                                return hasUpgrade("b", 33) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 34)
                },
                35: {
                        title: "Both",
                        description: "Unlock the first Bacteria challenge",
                        cost: new Decimal(5e180),
                        unlocked(){
                                return hasUpgrade("c", 14) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 35)
                },
                41: {
                        title: "Board",
                        description: "Each <b>All</b> adds .001 to <b>Based</b> base",
                        cost: new Decimal(1e196),
                        unlocked(){
                                return challengeCompletions("b", 11) >= 1 || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 41)
                },
                42: {
                        title: "Box",
                        description: "<b>Against</b> gives free <b>Advanced</b> levels",
                        cost: new Decimal(1e201),
                        unlocked(){
                                return hasUpgrade("b", 41) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 42)
                },
                43: {
                        title: "Better",
                        description: "Unlock the eighth Amoeba buyable",
                        cost: new Decimal("5e415"),
                        unlocked(){
                                return hasUpgrade("b", 42) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 43)
                },
                44: {
                        title: "Below",
                        description: "<b>Above</b> gives free <b>Access</b> levels",
                        cost: new Decimal("5e425"),
                        unlocked(){
                                return hasUpgrade("b", 43) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 44)
                },
                45: {
                        title: "Blog",
                        description: "<b>A</b> and <b>B</b> autobuyers trigger twice as often",
                        cost: new Decimal("5e476"),
                        unlocked(){
                                return (hasUpgrade("b", 44) && hasUpgrade("c", 15)) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 45)
                },
                51: {
                        title: "Browse",
                        description: "Unlock the final <b>A</b> buyable, <b>Omnipotent I</b>, which gives free levels to all <b>A</b> buyables",
                        cost: new Decimal("1e1104"),
                        unlocked(){
                                return hasUpgrade("c", 12) || hasUnlockedPast("d")
                        }, //hasUpgrade("b", 51)
                },
                52: {
                        title: "Building",
                        description: "Each <b>C</b> upgrade adds .2 to the <b>C</b> gain exponent and <b>B</b> buyables cost nothing",
                        cost: new Decimal("1e1252"),
                        unlocked(){
                                return hasUpgrade("b", 51) || hasUnlockedPast("d")
                        }, //hasUpgrade("b", 52)
                },
                53: {
                        title: "Blue",
                        description: "Unlock two <b>B</b> buyables and each <b>B</b> challenge completion adds .1 to the <b>Omnipotent I</b> base",
                        cost: new Decimal("1e1259"),
                        unlocked(){
                                return hasUpgrade("b", 52) || hasUnlockedPast("d")
                        }, //hasUpgrade("b", 53)
                },
                54: {
                        title: "Bill",
                        description: "<b>Become</b> gives free <b>Based</b> and <b>Because</b> levels",
                        cost: new Decimal("1e7576"),
                        unlocked(){
                                return hasUpgrade("c", 34) || hasUnlockedPast("d")
                        }, //hasUpgrade("b", 54)
                },
                55: {
                        title: "Bad",
                        description: "Unlock two new <b>B</b> buyables which both give free levels to <b>Baby</b>",
                        cost: new Decimal("1e10964"),
                        unlocked(){
                                return hasUpgrade("c", 35) || hasUnlockedPast("d")
                        }, //hasUpgrade("b", 55)
                },
                /*
                Base
                */
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "Because",
                        display(){
                                return getBuyableDisplay("b", 11)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b11"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 11)
                        },
                        total(){
                                return getBuyableAmount("b", 11).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 11)
                        },
                        buy(){
                                buyManualBuyable("b", 11)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 11, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 31) || hasUnlockedPast("c")
                        },
                },
                12: {
                        title: "Based",
                        display(){
                                return getBuyableDisplay("b", 12)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b12"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 12)
                        },
                        total(){
                                return getBuyableAmount("b", 12).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 1)
                        },
                        buy(){
                                buyManualBuyable("b", 12)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 12, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("a", 55) || hasUnlockedPast("c")
                        },
                },
                13: {
                        title: "Become",
                        display(){
                                return getBuyableDisplay("b", 13)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b13"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 13)
                        },
                        total(){
                                return getBuyableAmount("b", 13).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 13)
                        },
                        buy(){
                                buyManualBuyable("b", 13)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 13, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 53) || hasUnlockedPast("d")
                        },
                },
                21: {
                        title: "Baby",
                        display(){
                                return getBuyableDisplay("b", 21)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b21"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 21)
                        },
                        total(){
                                return getBuyableAmount("b", 21).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 21)
                        },
                        buy(){
                                buyManualBuyable("b", 21)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 21, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 53) || hasUnlockedPast("d")
                        },
                },
                22: {
                        title: "Bank",
                        display(){
                                return getBuyableDisplay("b", 22)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b22"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 22)
                        },
                        total(){
                                return getBuyableAmount("b", 22).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 22)
                        },
                        buy(){
                                buyManualBuyable("b", 22)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 22, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 55) || hasUnlockedPast("d")
                        },
                },
                23: {
                        title: "Beauty",
                        display(){
                                return getBuyableDisplay("b", 23)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b23"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 23)
                        },
                        total(){
                                return getBuyableAmount("b", 23).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 23)
                        },
                        buy(){
                                buyManualBuyable("b", 23)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 23, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 55) || hasUnlockedPast("d")
                        },
                },
                31: {
                        title: "Basic",
                        display(){
                                return getBuyableDisplay("b", 31)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b31"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 31)
                        },
                        total(){
                                return getBuyableAmount("b", 31).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 31)
                        },
                        buy(){
                                buyManualBuyable("b", 31)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 31, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("d", 24) || hasUnlockedPast("d")
                        },
                },
                32: {
                        title: "Brand",
                        display(){
                                return getBuyableDisplay("b", 32)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b32"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 32)
                        },
                        total(){
                                return getBuyableAmount("b", 32).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 32)
                        },
                        buy(){
                                buyManualBuyable("b", 32)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 32, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("c", 44) || hasUnlockedPast("d")
                        },
                },
                33: {
                        title: "Omnipotent II",
                        display(){
                                return getBuyableDisplay("b", 33)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b33"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 33)
                        },
                        total(){
                                return getBuyableAmount("b", 33).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 33)
                        },
                        buy(){
                                buyManualBuyable("b", 33)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 33, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("c", 51) || hasUnlockedPast("e")
                        },
                },
        },
        challenges: {
                rows: 2,
                cols: 2,
                11: {
                        name: "Big",
                        challengeDescription: "All previous layer buyables have no effect",
                        rewardDescription: "Give free <b>Based</b> levels",
                        rewardEffect(){
                                let c = challengeCompletions("b", 11)
                                let ret = Math.pow(c, 3) + c * 5
                                ret = softcap(ret, "b_chall")
                                return Math.floor(ret)
                        },
                        goal(){
                                let init = new Decimal("1e2456")
                                let factor = getChallengeFactor(challengeCompletions("b", 11))
                                return init.pow(factor)
                        },
                        unlocked(){
                                return hasUpgrade("b", 35) || hasUnlockedPast("c")
                        },
                        currencyInternalName: "points",
                        completionLimit: 20,
                },
                12: {
                        name: "Body",
                        challengeDescription: "<b>Big</b> and <b>And</b> effect is 1",
                        rewardDescription: "Give free <b>Against</b> levels",
                        rewardEffect(){
                                let c = challengeCompletions("b", 12)
                                let ret = Math.pow(c, 3) + c * 5
                                ret = softcap(ret, "b_chall")
                                return Math.floor(ret)
                        },
                        goal(){
                                let init = new Decimal("1e4992")
                                let factor = getChallengeFactor(challengeCompletions("b", 12))
                                return init.pow(factor)
                        },
                        unlocked(){
                                return hasUpgrade("c", 24) || hasUnlockedPast("c")
                        },
                        currencyInternalName: "points",
                        completionLimit: 20,
                        countsAs: [11],
                },
                21: {
                        name: "Beach",
                        challengeDescription: "<b>Body</b> and all previous prestige effects are 1",
                        rewardDescription: "Give free <b>Omnipotent I</b> levels",
                        rewardEffect(){
                                let c = challengeCompletions("b", 21)
                                let ret = Math.pow(c, 3) + Math.pow(c, 2) * 5 + c * 9
                                ret = softcap(ret, "b_chall")
                                return Math.floor(ret)
                        },
                        goal(){
                                let init = new Decimal("1e14538")
                                let factor = getChallengeFactor(challengeCompletions("b", 21))
                                factor = factor.pow(.9636)
                                return init.pow(factor)
                        },
                        unlocked(){
                                return hasUpgrade("c", 33) || hasUnlockedPast("d")
                        },
                        currencyInternalName: "points",
                        completionLimit: 20,
                        countsAs: [11, 12],
                },
                22: {
                        name: "Bit",
                        challengeDescription: "<b>Beach</b> and square root point gain",
                        rewardDescription: "Add to the <b>D</b> gain exponent",
                        rewardEffect(){
                                let c = challengeCompletions("b", 22)
                                let ret = c * c * .1 + c * 1
                                ret = softcap(ret, "b_chall")
                                return ret
                        },
                        goal(){
                                let init = Decimal.pow(10, 72e6)
                                let factor = getChallengeFactor(challengeCompletions("b", 22))
                                return init.pow(factor)
                        },
                        unlocked(){
                                return hasUpgrade("c", 51) || hasUnlockedPast("e")
                        },
                        currencyInternalName: "points",
                        completionLimit: 20,
                        countsAs: [11, 12, 21],
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("b", 22) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                let a = hasUnlockedPast("b") ? "" : "You have done " + formatWhole(player.b.times) + " Bacteria resets<br>"
                                                if (hasUpgrade("b", 22)) return a + "You are gaining " + format(tmp.b.getResetGain) + " Bacteria per second"
                                                return a + "There is a five second cooldown for prestiging (" + format(Math.max(0, 5-player.b.time)) + ")" 
                                        },
                                        //{"font-size": "20px"}
                                ],
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                return "Each buyable gives free levels to all previous layers corresponding buyable"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (!shiftDown || !hasUpgrade("b", 22)) return ""
                                                return "You are gaining " + format(tmp.b.getResetGain) + " Bacteria per second"
                                        }
                                ],
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("b", 31) || hasUnlockedPast("c")
                        },
                },
                "Challenges": {
                        content: [
                                ["display-text",
                                        function() {
                                                return "Challenge completions are never reset, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                return "You have completed " + formatWhole(totalChallengeComps("b")) + " Bacteria Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return hasUpgrade("b", 35) || hasUnlockedPast("c")
                        },
                },
        },
        doReset(layer){
                if (layer == "b") player.b.time = 0
                if (!getsReset("b", layer)) return
                player.b.time = 0
                player.b.times = 0

                if (!hasMilestone("ach", 2)) {
                        //upgrades
                        let keep = []
                        if (hasUpgrade("c", 12)) keep.push(11,12,13,14,15,21,22,23,24,25,31,32,33,34,35)
                        if (hasUpgrade("c", 15)) keep.push(41,42,43,44,45)
                        if (hasMilestone("goalsii", 3)) keep.push(22)
                        if (!hasUpgrade("d", 11)) player.b.upgrades = filter(player.b.upgrades, keep)
                }

                //resources
                player.b.points = new Decimal(0)
                player.b.total = new Decimal(0)
                player.b.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.b.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})


addLayer("c", {
        name: "Circles", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#CBCCC3",
        branches: ["b"],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Circles", // Name of prestige currency
        baseResource: "Bacterias", // Name of resource prestige is based on
        baseAmount() {return player.b.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let a = pts.div(div)
                if (a.lt(1)) return new Decimal(0)

                let ret = a.log10().times(pre).pow(exp).times(pst)

                if (!hasUnlockedPast("c") && player.c.best.eq(0)) ret = ret.min(1)

                ret = doPrestigeGainChange(ret, "c")

                return ret.floor()
        },
        getBaseDiv(){
                let x = new Decimal(1e9)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasUpgrade("c", 25)) x = x.plus(1)
                if (hasUpgrade("b", 52)) x = x.plus(player.c.upgrades.length * .2)
                x = x.plus(tmp.b.buyables[32].effect)
                x = x.plus(getGoalChallengeReward("00"))
                return x
        },
        getGainMultPre(){
                let x = new Decimal(.5)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)

                let yet = false
                for (let i = 0; i < LAYERS.length; i++){
                        if (layers[LAYERS[i]].row == "side") continue
                        if (yet) x = x.times(tmp[LAYERS[i]].effect)
                        if (LAYERS[i] == "c") yet = true
                }

                if (hasUpgrade("c", 23)) x = x.times(player.c.upgrades.length).max(x)
                                         x = x.times(getBuyableEffect("b", 13))
                                         x = x.times(tmp.goalsii.effect)
                                         x = x.times(getBuyableEffect("c", 32))

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("c")) return new Decimal(1)
                
                let amt = player.c.points

                let ret = amt.times(8).plus(1).sqrt()

                ret = softcap(ret, "c_eff")

                ret = ret.times(tmp.c.buyables[12].effect)

                return ret
        },
        effectDescription(){
                let eff = this.effect()
                let a = "which buffs point and all previous prestige gain by "

                return a + format(eff) + "."
        },
        update(diff){
                let data = player.c

                data.best = data.best.max(data.points)
                if (hasUpgrade("c", 22)) {
                        data.points = player.c.points.plus(this.getResetGain().times(diff))
                        data.total = player.c.total.plus(this.getResetGain().times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (hasUpgrade("e", 11) || hasMilestone("goalsii", 1)) {
                        data.abtime += diff * getABSpeed("c")
                        if (data.abtime > 10) data.abtime = 10
                        if (data.abtime > 1) {
                                data.abtime += -1
                                let amt = getABBulk("c")
                                if (tmp.c.buyables[11].unlocked) layers.c.buyables[11].buyMax(amt)
                                if (tmp.c.buyables[12].unlocked) layers.c.buyables[12].buyMax(amt)
                                if (tmp.c.buyables[13].unlocked) layers.c.buyables[13].buyMax(amt)
                                if (tmp.c.buyables[21].unlocked) layers.c.buyables[21].buyMax(amt)
                                if (tmp.c.buyables[22].unlocked) layers.c.buyables[22].buyMax(amt)
                                if (tmp.c.buyables[23].unlocked) layers.c.buyables[23].buyMax(amt)
                                if (tmp.c.buyables[31].unlocked) layers.c.buyables[31].buyMax(amt)
                                if (tmp.c.buyables[32].unlocked) layers.c.buyables[32].buyMax(amt)
                                if (tmp.c.buyables[33].unlocked) layers.c.buyables[33].buyMax(amt)
                        }
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 2, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "c", description: "C: Reset for Circles", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.b.best.gt(5e10) || player.c.best.gt(0) || hasUnlockedPast("c")},
        prestigeButtonText(){
                let gain= this.getResetGain()
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let nextnum = Decimal.pow(10, gain.plus(1).div(pst).root(exp).div(pre)).times(div).ceil()

                let nextAt = ""
                if (gain.lt(1e6) && (hasUnlockedPast("c") || player.c.best.neq(0))) {
                        nextAt = "<br>Next at " + format(nextnum) + " " + this.baseResource
                        let ps = gain.div(player.c.time || 1)

                        if (ps.lt(1000/60)) nextAt += "<br>" + format(ps.times(60)) + "/m"
                        else nextAt += "<br>" + format(ps) + "/s"
                }

                let a = "Reset for " + formatWhole(gain) + " " + this.resource

                return a + nextAt
        },
        canReset(){
                return this.getResetGain().gt(0) && player.c.time >= 5 && !hasUpgrade("c", 22)
        },
        upgrades:{
                rows: 5,
                cols: 5,
                11: {
                        title: "Can",
                        description: "Keep all Amoeba upgrades, square <b>And</b> and <b>By</b>",
                        cost: new Decimal(3),
                        unlocked(){ 
                                return player.c.best.gte(4) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 11)
                },
                12: {
                        title: "Contact",
                        description: "Keep three rows of Bacteria upgrades, raise <b>At</b> effect to the number of Bacteria upgrades, and unlock a Amoeba buyable",
                        cost: new Decimal(3),
                        unlocked(){ 
                                return hasUpgrade("c", 11) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 12)
                },
                13: {
                        title: "Click",
                        description: "<b>Advanced</b> gives free <b>Access</b> levels",
                        cost: new Decimal(20),
                        unlocked(){ 
                                return hasUpgrade("c", 12) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 13)
                },
                14: {
                        title: "City",
                        description: "Remove the first Bacteria effect softcap",
                        cost: new Decimal(5e4),
                        unlocked(){ 
                                return hasUpgrade("b", 34) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 14)
                },
                15: {
                        title: "Copyright",
                        description: "Each Bacteria upgrade gives a free <b>Based</b> level and keep the fourth row of Bacteria upgrades",
                        cost: new Decimal(3e5),
                        unlocked(){ 
                                return player.ach.achievements.includes("34") || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 15)
                },
                21: {
                        title: "Company",
                        description: "Total <b>Any</b> buyables squared multiply <b>Because</b> base",
                        cost: new Decimal(5e5),
                        unlocked(){ 
                                return hasUpgrade("b", 45) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 21)
                },
                22: {
                        title: "County",
                        description: "Remove the ability to prestige but gain 100% of Circles on prestige per second",
                        cost: new Decimal(5e5),
                        unlocked(){ 
                                return hasUpgrade("c", 21) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 22)
                },
                23: {
                        title: "Care",
                        description: "<b>Above</b> gives free <b>Advanced</b> levels and multiply Circle gain by the number of Circle upgrades",
                        cost: new Decimal(3e6),
                        unlocked(){ 
                                return hasUpgrade("c", 22) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 23)
                },
                24: {
                        title: "Could",
                        description: "Unlock the second Bacteria Challenge",
                        cost: new Decimal(5e7),
                        unlocked(){ 
                                return hasUpgrade("c", 23) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 24)
                },
                25: {
                        title: "Center",
                        description: "Add 1 to the <b>B</b> and <b>C</b> gain exponents",
                        cost: new Decimal(1e8),
                        unlocked(){ 
                                return challengeCompletions("b", 12) >= 1 || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 25)
                },
                31: {
                        title: "Comments",
                        description: "Gain a free <b>Omnipotent I</b> level per ugprade in this row",
                        cost: new Decimal(2e19),
                        unlocked(){ 
                                return hasUpgrade("b", 53) || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 31)
                },
                32: {
                        title: "Car",
                        description: "<b>Above</b> gives free <b>Account</b> levels",
                        cost: new Decimal(1e31),
                        unlocked(){ 
                                return player.ach.achievements.includes("43") || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 32)
                },
                33: {
                        title: "Community",
                        description: "Unlock a third <b>B</b> challenge and <b>Advanced</b> gives free <b>After</b> levels",
                        cost: new Decimal(2e79),
                        unlocked(){ 
                                return hasUpgrade("c", 32) || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 33)
                },
                34: {
                        title: "Code",
                        description: "<b>Baby</b> gives free <b>Become</b> and <b>Based</b> levels",
                        cost: new Decimal(2e88),
                        unlocked(){ 
                                return hasUpgrade("c", 33) || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 34)
                },
                35: {
                        title: "Check",
                        description: "Each <b>Advanced</b> adds .0001 to the <b>Omnipotent I</b> base",
                        cost: new Decimal(1e152),
                        unlocked(){ 
                                return hasUpgrade("c", 34) || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 35)
                },
                41: {
                        title: "Computer",
                        description: "<b>Basic</b> gives free <b>Bank</b> and <b>Beauty</b> levels and <b>B</b> and <b>A</b> autobuyers can buy 10x more",
                        cost: new Decimal("1e584"),
                        unlocked(){ 
                                return player.ach.achievements.includes("53") || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 41)
                },
                42: {
                        title: "Current",
                        description: "<b>Bank</b> gives free <b>Become</b> levels",
                        cost: new Decimal("1e685"),
                        unlocked(){ 
                                return hasUpgrade("d", 24) || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 42)
                },
                43: {
                        title: "Control",
                        description: "<b>Basic</b> gives free <b>Baby</b> levels and unlock a <b>C</b> challenge",
                        cost: new Decimal("1e942"),
                        unlocked(){ 
                                return hasUpgrade("c", 42) || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 43)
                },
                44: {
                        title: "Class",
                        description: "<b>Basic</b> gives free <b>Omntipotent I</b> levels and unlock a <b>B</b> buyable",
                        cost: new Decimal("1e1046"),
                        unlocked(){ 
                                return hasUpgrade("c", 43) || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 44)
                },
                45: {
                        title: "Children",
                        description: "<b>Brand</b> gives free <b>Basic</b> and <b>Beauty</b> levels and unlock a <b>C</b> buyable",
                        cost: new Decimal("2e1151"),
                        unlocked(){ 
                                return hasUpgrade("c", 44) || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 45)
                },
                51: {
                        title: "Content",
                        description: "Unlock <b>Omnipotent II</b> which gives free levels to all <b>B</b> buyables, unlock the final <b>B</b> challenge, and gain 100x points",
                        cost: new Decimal("2e2674"),
                        unlocked(){ 
                                return hasAchievement("ach", 62) || hasUnlockedPast("e")
                        }, //hasUpgrade("c", 51)
                },
                52: {
                        title: "Customer",
                        description: "<b>Country</b> gives free levels to <b>Call</b> and <b>Case</b>",
                        cost: new Decimal("1e5443"),
                        unlocked(){ 
                                return hasUpgrade("d", 31) || hasUnlockedPast("e")
                        }, //hasUpgrade("c", 52)
                },
                53: {
                        title: "College",
                        description: "<b>Compare</b> gives free levels to <b>Call</b> and <b>Case</b>",
                        cost: new Decimal("1e34974"),
                        unlocked(){ 
                                return hasUpgrade("d", 32) || hasUnlockedPast("e")
                        }, //hasUpgrade("c", 53)
                },
                54: {
                        title: "Course",
                        description: "<b>Card</b> gives free levels to <b>Omnipotent II</b> and <b>Compare</b>",
                        cost: new Decimal("1e100012"),
                        unlocked(){ 
                                return hasUpgrade("d", 33) || hasUnlockedPast("e")
                        }, //hasUpgrade("c", 54)
                },
                55: {
                        title: "Credit",
                        description: "<b>Canada</b> gives free levels to <b>Omnipotent II</b> and <b>Compare</b> and unlock a <b>C</b> challange",
                        cost: new Decimal("1e826733"),
                        unlocked(){ 
                                return hasUpgrade("d", 35) || hasUnlockedPast("e")
                        }, //hasUpgrade("c", 55)
                },

                /*
                cost
                come
                cart
                complete
                comment
                create
                club
                */
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "Case",
                        display(){
                                return getBuyableDisplay("c", 11)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c11"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 11)
                        },
                        total(){
                                return getBuyableAmount("c", 11).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 11)
                        },
                        buy(){
                                buyManualBuyable("c", 11)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 11, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("d", 22) || hasUnlockedPast("d")
                        },
                },
                12: {
                        title: "Call",
                        display(){
                                return getBuyableDisplay("c", 12)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c12"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 12)
                        },
                        total(){
                                return getBuyableAmount("c", 12).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 12)
                        },
                        buy(){
                                buyManualBuyable("c", 12)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 12, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("c", 45) || hasUnlockedPast("d")
                        },
                },
                13: {
                        title: "Country",
                        display(){
                                return getBuyableDisplay("c", 13)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c13"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 13)
                        },
                        total(){
                                return getBuyableAmount("c", 13).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 13)
                        },
                        buy(){
                                buyManualBuyable("c", 13)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 13, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("d", 31) || hasUnlockedPast("e")
                        },
                },
                21: {
                        title: "Compare",
                        display(){
                                return getBuyableDisplay("c", 21)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c21"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 21)
                        },
                        total(){
                                return getBuyableAmount("c", 21).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 21)
                        },
                        buy(){
                                buyManualBuyable("c", 21)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 21, maximum)
                        },
                        unlocked(){ 
                                return (hasUpgrade("d", 31) && hasUpgrade("d", 32)) || hasUnlockedPast("e")
                        },
                },
                22: {
                        title: "Card",
                        display(){
                                return getBuyableDisplay("c", 22)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c22"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 22)
                        },
                        total(){
                                return getBuyableAmount("c", 22).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 22)
                        },
                        buy(){
                                buyManualBuyable("c", 22)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 22, maximum)
                        },
                        unlocked(){ 
                                return (hasUpgrade("d", 31) && hasUpgrade("d", 33)) || hasUnlockedPast("e")
                        },
                },
                23: {
                        title: "Canada",
                        display(){
                                return getBuyableDisplay("c", 23)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c23"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 23)
                        },
                        total(){
                                return getBuyableAmount("c", 23).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 23)
                        },
                        buy(){
                                buyManualBuyable("c", 23)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 23, maximum)
                        },
                        unlocked(){ 
                                return (hasUpgrade("d", 31) && hasUpgrade("d", 34)) || hasUnlockedPast("e")
                        },
                },
                31: {
                        title: "Conditions",
                        display(){
                                return getBuyableDisplay("c", 31)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c31"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 31)
                        },
                        total(){
                                return getBuyableAmount("c", 31).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 31)
                        },
                        buy(){
                                buyManualBuyable("c", 31)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 31, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("e", 13) || hasUnlockedPast("e")
                        },
                },
                32: {
                        title: "Category",
                        display(){
                                return getBuyableDisplay("c", 32)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c32"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 32)
                        },
                        total(){
                                return getBuyableAmount("c", 32).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 32)
                        },
                        buy(){
                                buyManualBuyable("c", 32)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 32, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("goalsii", 8) || hasUnlockedPast("g") || player.g.best.gt(0)
                        },
                },
                33: {
                        title: "Omnipotent III",
                        display(){
                                return getBuyableDisplay("c", 33)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c33"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 33)
                        },
                        total(){
                                return getBuyableAmount("c", 33).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 33)
                        },
                        buy(){
                                buyManualBuyable("c", 33)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 33, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("goalsii", 15) || hasUnlockedPast("g") || player.g.best.gt(0)
                        },
                },
        },
        challenges: {
                rows: 2,
                cols: 2,
                11: {
                        name: "Change",
                        challengeDescription: "All previous layer buyables have no effect",
                        rewardDescription: "Multiply <b>Bank</b> base",
                        rewardEffect(){
                                let c = challengeCompletions("c", 11)
                                let exp = c
                                if (c >= 2) exp += c
                                let ret = Decimal.pow(100, exp)
                                return ret
                        },
                        goal(){
                                let init = Decimal.pow(10, 4473)
                                let factor = getChallengeFactor(challengeCompletions("c", 11))
                                return init.pow(factor)
                        },
                        unlocked(){
                                return hasUpgrade("c", 43) || hasUnlockedPast("d")
                        },
                        currencyInternalName: "points",
                        completionLimit: 20,
                },
                12: {
                        name: "Categories",
                        challengeDescription: "<b>Change</b> and square root <b>A</b> gain",
                        rewardDescription: "Give free <b>Canada</b> levels",
                        rewardEffect(){
                                let c = challengeCompletions("c", 12)
                                let ret = (c) * (c + 10) * (c + 11) / 6
                                return ret
                        },
                        goal(){
                                let init = Decimal.pow(10, 34136600)
                                let factor = getChallengeFactor(challengeCompletions("c", 12))
                                return init.pow(factor)
                        },
                        unlocked(){
                                return hasUpgrade("c", 55) || hasUnlockedPast("e")
                        },
                        currencyInternalName: "points",
                        completionLimit: 20,
                        countsAs: [11],
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("c", 22) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {return shiftDown ? "Your best Circles is " + format(player.c.best) : ""}],
                                ["display-text",
                                        function() {
                                                if (hasUnlockedPast("c")) return ""
                                                return "You have done " + formatWhole(player.c.times) + " Circle resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (hasUpgrade("c", 22)) return "You are gaining " + format(tmp.c.getResetGain) + " Circles per second"
                                                return "There is a five second cooldown for prestiging (" + format(Math.max(0, 5-player.c.time)) + ")" 
                                        },
                                        //{"font-size": "20px"}
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                return "Each buyable gives free levels to all previous layers corresponding buyable"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (!shiftDown || !hasUpgrade("c", 22)) return ""
                                                return "You are gaining " + format(tmp.c.getResetGain) + " Circles per second"
                                        }
                                ],
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("d", 22) || hasUnlockedPast("d")
                        },
                },
                "Challenges": {
                        content: [
                                ["display-text",
                                        function() {
                                                return "Challenge completions are never reset, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                return "You have completed " + formatWhole(totalChallengeComps("c")) + " Circle Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return hasUpgrade("c", 43) || hasUnlockedPast("d")
                        },
                },
        },
        doReset(layer){
                if (layer == "c") player.c.time = 0
                if (!getsReset("c", layer)) return
                player.c.time = 0
                player.c.times = 0

                if (!hasMilestone("ach", 3)) {
                        //upgrades
                        let keep = []
                        if (hasUpgrade("d", 11)) keep.push(11,12,13,14,15,21,22,23,24,25,31,32,33,34,35)
                        if (hasMilestone("goalsii", 4)) keep.push(22)
                        if (!hasUpgrade("e", 11)) player.c.upgrades = filter(player.c.upgrades, keep)
                }

                //resources
                player.c.points = new Decimal(0)
                player.c.total = new Decimal(0)
                player.c.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.c.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})


addLayer("d", {
        name: "Doodles", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#306363",
        branches: ["c"],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Doodles", // Name of prestige currency
        baseResource: "Circles", // Name of resource prestige is based on
        baseAmount() {return player.c.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let a = pts.div(div)
                if (a.lt(1)) return new Decimal(0)

                let ret = a.log10().times(pre).pow(exp).times(pst)

                if (!hasUnlockedPast("d") && player.d.best.eq(0)) ret = ret.min(1)

                ret = doPrestigeGainChange(ret, "d")

                return ret.floor()
        },
        getBaseDiv(){
                let x = new Decimal(1e9)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasUpgrade("d", 25)) x = x.plus(1)
                x = x.plus(tmp.b.challenges[22].rewardEffect)
                x = x.plus(getGoalChallengeReward("00"))
                if (hasUpgrade("goalsii", 14)) x = x.plus(100 * player.goalsii.upgrades.length)
                x = x.plus(getBuyableEffect("e", 23))
                return x
        },
        getGainMultPre(){
                let x = new Decimal(.5)
                if (hasUpgrade("goalsii", 14)) x = x.times(100 * player.goalsii.upgrades.length + 1)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)

                let yet = false
                for (let i = 0; i < LAYERS.length; i++){
                        if (layers[LAYERS[i]].row == "side") continue
                        if (yet) x = x.times(tmp[LAYERS[i]].effect)
                        if (LAYERS[i] == "d") yet = true
                }

                x = x.times(tmp.c.buyables[22].effect)
                x = x.times(tmp.d.buyables[11].effect)
                x = x.times(tmp.goalsii.effect)


                return x
        },
        effect(){
                if (!isPrestigeEffectActive("d")) return new Decimal(1)

                let amt = player.d.points

                let exp = new Decimal(.5)
                exp = exp.plus(getGoalChallengeReward("02"))

                let ret = amt.times(15).plus(1).pow(exp)

                ret = softcap(ret, "d_eff")


                return ret
        },
        effectDescription(){
                let eff = this.effect()
                let a = "which buffs point and all previous prestige gain by "

                return a + format(eff) + "."
        },
        update(diff){
                let data = player.d
                
                data.best = data.best.max(data.points)
                if (hasUpgrade("d", 22)) {
                        data.points = data.points.plus(this.getResetGain().times(diff))
                        data.total = data.total.plus(this.getResetGain().times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (hasUpgrade("e", 14) || hasMilestone("goalsii", 1)) {
                        data.abtime += diff * getABSpeed("d")
                        if (data.abtime > 10) data.abtime = 10
                        if (data.abtime > 1) {
                                data.abtime += -1
                                let amt = getABBulk("d")
                                if (tmp.d.buyables[11].unlocked) layers.d.buyables[11].buyMax(amt)
                                if (tmp.d.buyables[12].unlocked) layers.d.buyables[12].buyMax(amt)
                                if (tmp.d.buyables[13].unlocked) layers.d.buyables[13].buyMax(amt)
                                if (tmp.d.buyables[21].unlocked) layers.d.buyables[21].buyMax(amt)
                                if (tmp.d.buyables[22].unlocked) layers.d.buyables[22].buyMax(amt)
                                if (tmp.d.buyables[23].unlocked) layers.d.buyables[23].buyMax(amt)
                                if (tmp.d.buyables[31].unlocked) layers.d.buyables[31].buyMax(amt)
                                if (tmp.d.buyables[32].unlocked) layers.d.buyables[32].buyMax(amt)
                                if (tmp.d.buyables[33].unlocked) layers.d.buyables[33].buyMax(amt)
                        }
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 3, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "d", description: "D: Reset for Doodles", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.c.best.gt(5e10) || player.d.best.gt(0) || hasUnlockedPast("d")},
        prestigeButtonText(){
                let gain= this.getResetGain()
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let nextnum = Decimal.pow(10, gain.plus(1).div(pst).root(exp).div(pre)).times(div).ceil()

                let nextAt = ""
                if (gain.lt(1e6) && (hasUnlockedPast("d") || player.d.best.neq(0))) {
                        nextAt = "<br>Next at " + format(nextnum) + " " + this.baseResource
                        let ps = gain.div(player.d.time || 1)

                        if (ps.lt(1000/60)) nextAt += "<br>" + format(ps.times(60)) + "/m"
                        else nextAt += "<br>" + format(ps) + "/s"
                }

                let a = "Reset for " + formatWhole(gain) + " " + this.resource

                return a + nextAt
        },
        canReset(){
                return this.getResetGain().gt(0) && player.d.time >= 5 && !hasUpgrade("d", 22)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Do",
                        description: "Keep <b>B</b> and three rows of <b>C</b> upgrades and <b>Above</b> adds to the <b>All</b> base",
                        cost: new Decimal(4),
                        unlocked(){ 
                                return player.ach.achievements.includes("41") || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 11)
                },
                12: {
                        title: "Date",
                        description: "<b>B</b> challenge completions squared add to the <b>B</b> gain formula exponent",
                        cost: new Decimal(4),
                        unlocked(){ 
                                return hasUpgrade("d", 11) || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 12)
                },
                13: {
                        title: "Day",
                        description: "Each <b>D</b> upgrade gives a free <b>Above</b> level",
                        cost: new Decimal(500),
                        unlocked(){ 
                                return hasUpgrade("c", 32) || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 13)
                },
                14: {
                        title: "Data",
                        description: "<b>Above</b> gives free <b>Against</b> levels",
                        cost: new Decimal(2000),
                        unlocked(){ 
                                return hasUpgrade("d", 13) || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 14)
                },
                15: {
                        title: "Does",
                        description: "<b>Beauty</b> gives free <b>Bank</b> levels",
                        cost: new Decimal(5e4),
                        unlocked(){ 
                                return player.ach.achievements.includes("47") || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 15)
                },
                21: {
                        title: "Days",
                        description: "Each <b>Become</b> adds .01 to its base",
                        cost: new Decimal(15e4),
                        unlocked(){ 
                                return player.ach.achievements.includes("51") || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 21)
                },
                22: {
                        title: "Development",
                        description: "Remove the ability to prestige but gain 100% of Doodles on prestige per second and unlock a <b>C</b> buyable",
                        cost: new Decimal(5e5),
                        unlocked(){ 
                                return hasUpgrade("d", 21) || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 22)
                },
                23: {
                        title: "Details",
                        description: "<b>Case</b> gives free <b>Omnipotent I</b> levels",
                        cost: new Decimal(5e6),
                        unlocked(){ 
                                return hasUpgrade("d", 22) || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 23)
                },
                24: {
                        title: "Did",
                        description: "<b>Become</b> gives free <b>Against</b> levels and unlock the seventh <b>B</b> buyable",
                        cost: new Decimal(5e6),
                        unlocked(){ 
                                return hasUpgrade("d", 23) || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 24)
                },
                25: {
                        title: "Design",
                        description: "<b>Call</b> gives free <b>Case</b> levels and one to the <b>D</b> gain exponent",
                        cost: new Decimal(5e8),
                        unlocked(){ 
                                return player.ach.achievements.includes("57") || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 25)
                },
                31: {
                        title: "Down",
                        description: "Each upgrade in this row unlocks a <b>C</b> buyable and <b>Brand</b> gives free <b>Bank</b> levels",
                        cost: new Decimal(5e28),
                        unlocked(){ 
                                return player.ach.achievements.includes("63") || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 31)
                },
                32: {
                        title: "Download",
                        description: "Per <b>Omnipotent I</b> squared add 1 to <b>Based</b> base",
                        cost: new Decimal(1e42),
                        unlocked(){ 
                                return player.ach.achievements.includes("64") || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 32)
                },
                33: {
                        title: "Directory",
                        description: "<b>Compare</b> gives free <b>Country</b> levels",
                        cost: new Decimal(1e77),
                        unlocked(){ 
                                return hasUpgrade("c", 53) || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 33)
                },
                34: {
                        title: "During",
                        description: "<b>Compare</b> gives free <b>Brand</b> levels",
                        cost: new Decimal(1e246),
                        unlocked(){ 
                                return hasUpgrade("e", 12) || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 34)
                },
                35: {
                        title: "Digital",
                        description: "<b>Canada</b> gives free <b>Card</b> levels and all autobuyers buy 100x more",
                        cost: new Decimal("1e314"),
                        unlocked(){ 
                                return player.ach.achievements.includes("71") || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 35)
                },
                41: {
                        title: "Description",
                        description: "<b>Department</b> gives free <b>Brand</b> levels and <b>C</b> autobuyers buy 3x faster",
                        cost: new Decimal("1e619"),
                        unlocked(){ 
                                return player.ach.achievements.includes("74") || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 41)
                },
                42: {
                        title: "Different",
                        description: "<b>Department</b> gives free <b>Basic</b> and <b>Beauty</b> levels",
                        cost: new Decimal("1e619"),
                        unlocked(){ 
                                return hasUpgrade("d", 41) || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 42)
                },
                43: {
                        title: "Discussion",
                        description: "<b>Conditions</b> gives free <b>Card</b> and <b>Canada</b> levels",
                        cost: new Decimal("1e778"),
                        unlocked(){ 
                                return hasUpgrade("d", 42) || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 43)
                },
                44: {
                        title: "Display",
                        description: "<b>Delivery</b> gives free <b>December</b> levels",
                        cost: new Decimal("5e1667"),
                        unlocked(){ 
                                return hasUpgrade("e", 14) || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 44)
                },
                45: {
                        title: "Daily",
                        description: "<b>Director</b> gives free <b>Delivery</b> levels",
                        cost: new Decimal("1e2333"),
                        unlocked(){ 
                                return hasUpgrade("e", 15) || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 45)
                },
                51: {
                        title: "Done",
                        description: "Unlock a <b>D</b> buyable",
                        cost: new Decimal("1e305977"),
                        currencyLayer: "f",
                        currencyInternalName: "points",
                        currencyDisplayName: "Features",
                        unlocked(){ 
                                return hasUpgrade("g", 15) || hasUnlockedPast("g")
                        }, //hasUpgrade("d", 51)
                },
                52: {
                        title: "District",
                        description: "Each upgrade multiplies base <b>G</b> gain by 1.01",
                        cost: new Decimal("1e306001"),
                        currencyLayer: "f",
                        currencyInternalName: "points",
                        currencyDisplayName: "Features",
                        unlocked(){ 
                                return hasUpgrade("d", 51) || hasUnlockedPast("g")
                        }, // hasUpgrade("d", 52)
                },
                53: {
                        title: "Downloads",
                        description: "Raise charge gain ^1.1",
                        cost: new Decimal("1e307059"),
                        currencyLayer: "f",
                        currencyInternalName: "points",
                        currencyDisplayName: "Features",
                        unlocked(){ 
                                return hasUpgrade("d", 52) || hasUnlockedPast("g")
                        }, // hasUpgrade("d", 53)
                },
                54: {
                        title: "Document",
                        description: "Increase the <b>G</b> effect exponent by +.1",
                        cost: new Decimal("1e307113"),
                        currencyLayer: "f",
                        currencyInternalName: "points",
                        currencyDisplayName: "Features",
                        unlocked(){ 
                                return hasUpgrade("d", 53) || hasUnlockedPast("g")
                        }, // hasUpgrade("d", 54)
                },
                55: {
                        title: "Deals",
                        description: "Raise charge gain ^1.1",
                        cost: new Decimal("1e310424"),
                        currencyLayer: "f",
                        currencyInternalName: "points",
                        currencyDisplayName: "Features",
                        unlocked(){ 
                                return hasUpgrade("d", 54) || hasUnlockedPast("g")
                        }, // hasUpgrade("d", 55)
                },

                /*
                domain
                designed
                death
                */
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "Department",
                        display(){
                                return getBuyableDisplay("d", 11)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d11"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 11)
                        },
                        total(){
                                return getBuyableAmount("d", 11).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 11)
                        },
                        buy(){
                                buyManualBuyable("d", 11)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 11, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("e", 13) || hasUnlockedPast("e")
                        },
                },
                12: {
                        title: "December",
                        display(){
                                return getBuyableDisplay("d", 12)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d12"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 12)
                        },
                        total(){
                                return getBuyableAmount("d", 12).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 12)
                        },
                        buy(){
                                buyManualBuyable("d", 12)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 12, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("e", 13) || hasUnlockedPast("e")
                        },
                },
                13: {
                        title: "Delivery",
                        display(){
                                return getBuyableDisplay("d", 13)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d13"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 13)
                        },
                        total(){
                                return getBuyableAmount("d", 13).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 13)
                        },
                        buy(){
                                buyManualBuyable("d", 13)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 13, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("e", 13) || hasUnlockedPast("e")
                        },
                },
                21: {
                        title: "Drive",
                        display(){
                                return getBuyableDisplay("d", 21)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d21"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 21)
                        },
                        total(){
                                return getBuyableAmount("d", 21).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 21)
                        },
                        buy(){
                                buyManualBuyable("d", 21)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 21, maximum)
                        },
                        unlocked(){ 
                                return (hasUpgrade("e", 13) && hasUpgrade("e", 14)) || hasUnlockedPast("e")
                        },
                },
                22: {
                        title: "Director",
                        display(){
                                return getBuyableDisplay("d", 22)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d22"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 22)
                        },
                        total(){
                                return getBuyableAmount("d", 22).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 22)
                        },
                        buy(){
                                buyManualBuyable("d", 22)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 22, maximum)
                        },
                        unlocked(){ 
                                return (hasUpgrade("e", 13) && hasUpgrade("e", 15)) || hasUnlockedPast("e")
                        },
                },
                23: {
                        title: "Due",
                        display(){
                                return getBuyableDisplay("d", 23)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d23"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 23)
                        },
                        total(){
                                return getBuyableAmount("d", 23).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 23)
                        },
                        buy(){
                                buyManualBuyable("d", 23)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 23, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("goalsii", 21) || hasUnlockedPast("e")
                        },
                },
                31: {
                        title: "Database",
                        display(){
                                return getBuyableDisplay("d", 31)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d31"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 31)
                        },
                        total(){
                                return getBuyableAmount("d", 31).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 31)
                        },
                        buy(){
                                buyManualBuyable("d", 31)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 31, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("goalsii", 24) || hasUnlockedPast("e")
                        },
                },
                32: {
                        title: "Done",
                        display(){
                                return getBuyableDisplay("d", 32)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d32"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 32)
                        },
                        total(){
                                return getBuyableAmount("d", 32).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 32)
                        },
                        buy(){
                                buyManualBuyable("d", 32)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 32, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("g", 4) || hasUnlockedPast("g")
                        },
                },
                33: {
                        title: "Omnipotent IV",
                        display(){
                                return getBuyableDisplay("d", 33)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d33"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 33)
                        },
                        total(){
                                return getBuyableAmount("d", 33).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 33)
                        },
                        buy(){
                                buyManualBuyable("d", 33)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 33, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("d", 51) || hasUnlockedPast("g")
                        },
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("d", 22) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {return shiftDown ? "Your best Doodles is " + format(player.d.best) : ""}],
                                ["display-text",
                                        function() {
                                                if (hasUnlockedPast("d")) return ""
                                                return "You have done " + formatWhole(player.d.times) + " Doodle resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (hasUpgrade("d", 22)) return "You are gaining " + format(tmp.d.getResetGain) + " Doodles per second"
                                                return "There is a five second cooldown for prestiging (" + format(Math.max(0, 5-player.d.time)) + ")" 
                                        },
                                        //{"font-size": "20px"}
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                return "Each buyable gives free levels to all previous layers corresponding buyable"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (!shiftDown || !hasUpgrade("d", 22)) return ""
                                                return "You are gaining " + format(tmp.d.getResetGain) + " Doodles per second"
                                        }
                                ],
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("e", 13) || hasUnlockedPast("e")
                        },
                },
                "Challenges": {
                        content: [
                                ["display-text",
                                        function() {
                                                return "Challenge completions are never reset, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                return "You have completed " + formatWhole(totalChallengeComps("d")) + " Doodle Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return false || hasUnlockedPast("h")
                        },
                },
        },
        doReset(layer){
                if (layer == "d") player.d.time = 0
                if (!getsReset("d", layer)) return
                player.d.time = 0
                player.d.times = 0

                if (!hasMilestone("ach", 5)) {
                        //upgrades
                        let keep = []
                        if (hasMilestone("goalsii", 5)) keep.push(22)
                        if (!hasUpgrade("e", 11)) player.d.upgrades = filter(player.d.upgrades, keep)
                }

                //resources
                player.d.points = new Decimal(0)
                player.d.total = new Decimal(0)
                player.d.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.d.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})


addLayer("e", {
        name: "Eggs", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#FFFFCC",
        branches: ["d"],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Eggs", // Name of prestige currency
        baseResource: "Doodles", // Name of resource prestige is based on
        baseAmount() {return player.d.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let a = pts.div(div)
                if (a.lt(1)) return new Decimal(0)

                let ret = a.log10().times(pre).pow(exp).times(pst)

                if (!hasUnlockedPast("e") && player.e.best.eq(0)) ret = ret.min(1)

                ret = doPrestigeGainChange(ret, "e")

                return ret.floor()
        },
        getBaseDiv(){
                let x = new Decimal(1e9)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasUpgrade("e", 25)) x = x.plus(1)
                x = x.plus(getGoalChallengeReward("00"))
                let l = player.goalsii.milestones.length
                if (hasMilestone("goalsii", 11)) x = x.plus(l*l*.01)
                x = x.plus(getGoalChallengeReward("23"))
                x = x.plus(getGoalChallengeReward("33"))
                x = x.plus(getBuyableEffect("e", 12))
                return x
        },
        getGainMultPre(){
                let x = new Decimal(.5)
                x = x.times(getGoalChallengeReward("31"))
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)

                let yet = false
                for (let i = 0; i < LAYERS.length; i++){
                        if (layers[LAYERS[i]].row == "side") continue
                        if (yet) x = x.times(tmp[LAYERS[i]].effect)
                        if (LAYERS[i] == "e") yet = true
                }

                x = x.times(tmp.goalsii.effect)
                x = x.times(getGoalChallengeReward("21"))
                if (hasMilestone("goalsii", 18)) {
                        let b = Math.max(1, player.ach.achievements.length)
                        x = x.times(Decimal.pow(b, b))
                }
                x = x.times(getBuyableEffect("e", 11))
                x = x.times(getBuyableEffect("d", 23))


                return x
        },
        effect(){
                if (!isPrestigeEffectActive("e")) return new Decimal(1)

                let amt = player.e.points

                let ret = amt.times(24).plus(1).pow(2)

                ret = softcap(ret, "e_eff")

                return ret
        },
        effectDescription(){
                let eff = this.effect()
                let a = "which buffs point and all previous prestige gain by "

                return a + format(eff) + "."
        },
        update(diff){
                let data = player.e

                data.best = data.best.max(data.points)
                if (hasUpgrade("e", 22)) {
                        data.points = data.points.plus(this.getResetGain().times(diff))
                        data.total = data.total.plus(this.getResetGain().times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (hasMilestone("goalsii", 20)) {
                        data.abtime += diff * getABSpeed("e")
                        if (data.abtime > 10) data.abtime = 10
                        if (data.abtime > 1) {
                                data.abtime += -1
                                let amt = getABBulk("e")
                                if (tmp.e.buyables[11].unlocked) layers.e.buyables[11].buyMax(amt)
                                if (tmp.e.buyables[12].unlocked) layers.e.buyables[12].buyMax(amt)
                                if (tmp.e.buyables[13].unlocked) layers.e.buyables[13].buyMax(amt)
                                if (tmp.e.buyables[21].unlocked) layers.e.buyables[21].buyMax(amt)
                                if (tmp.e.buyables[22].unlocked) layers.e.buyables[22].buyMax(amt)
                                if (tmp.e.buyables[23].unlocked) layers.e.buyables[23].buyMax(amt)
                                if (tmp.e.buyables[31].unlocked) layers.e.buyables[31].buyMax(amt)
                                if (tmp.e.buyables[32].unlocked) layers.e.buyables[32].buyMax(amt)
                                if (tmp.e.buyables[33].unlocked) layers.e.buyables[33].buyMax(amt)
                        }
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 4, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "e", description: "E: Reset for Eggs", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.d.best.gt(5e10) || player.e.best.gt(0) || hasUnlockedPast("e")},
        prestigeButtonText(){
                let gain= this.getResetGain()
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let nextnum = Decimal.pow(10, gain.plus(1).div(pst).root(exp).div(pre)).times(div).ceil()

                let nextAt = ""
                if (gain.lt(1e6) && (hasUnlockedPast("e") || player.e.best.neq(0))) {
                        nextAt = "<br>Next at " + format(nextnum) + " " + this.baseResource
                        let ps = gain.div(player.e.time || 1)

                        if (ps.lt(1000/60)) nextAt += "<br>" + format(ps.times(60)) + "/m"
                        else nextAt += "<br>" + format(ps) + "/s"
                }

                let a = "Reset for " + formatWhole(gain) + " " + this.resource

                return a + nextAt
        },
        canReset(){
                return this.getResetGain().gt(0) && player.e.time >= 5 && !hasUpgrade("e", 22)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Email",
                        description: "Keep <b>C</b> and <b>D</b> upgrades, autobuy <b>C</b> buyables once per second, and multiply all autobuyer bulk by the number of goals",
                        cost: new Decimal(10),
                        unlocked(){ 
                                return player.ach.achievements.includes("61") || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 11)
                },
                12: {
                        title: "Each",
                        description: "<b>Card</b> gives free <b>Country</b> and <b>Call</b> level and <b>C</b> buyables cost nothing",
                        cost: new Decimal(1e5),
                        unlocked(){ 
                                return hasUpgrade("c", 54) || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 12)
                },
                13: {
                        title: "Education",
                        description: "Unlock a <b>C</b> buyable and each upgrade in this row unlocks a <b>D</b> buyable",
                        cost: new Decimal(1e6),
                        unlocked(){ 
                                return player.ach.achievements.includes("73") || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 13)
                },
                14: {
                        title: "Even",
                        description: "<b>Delivery</b> gives free <b>Department</b> buyables and autobuy <b>D</b> buyables once per second",
                        cost: new Decimal(1e6),
                        unlocked(){ 
                                return player.ach.achievements.includes("75") || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 14)
                },
                15: {
                        title: "End",
                        description: "<b>Drive</b> gives free <b>December</b> and <b>Delivery</b> buyables",
                        cost: new Decimal(1e6),
                        unlocked(){ 
                                return player.ach.achievements.includes("75") || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 15)
                },
                21: {
                        title: "Events",
                        description: "<b>December</b> gives free <b>Department</b> levels and gain a free <b>Drive</b> level and triple <b>D</b> autobuyer speed",
                        cost: new Decimal(3e6),
                        unlocked(){ 
                                return hasUpgrade("d", 45) || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 21)
                },
                22: {
                        title: "Every",
                        description: "Remove the ability to prestige but gain 100% of Eggs on prestige per second and all autobuyers work 2x faster",
                        cost: new Decimal(1e7),
                        unlocked(){ 
                                return hasUpgrade("e", 21) || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 22)
                },
                23: {
                        title: "English",
                        description: "<b>Director</b> gives free <b>December</b> levels and all autobuyers buy 100x more",
                        cost: new Decimal(1e9),
                        unlocked(){ 
                                return hasUpgrade("e", 22) || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 23)
                },
                24: {
                        title: "Estate",
                        description: "<b>Director</b> gives free <b>Drive</b> levels and all autobuyers buy 3x faster",
                        cost: new Decimal(3e9),
                        unlocked(){ 
                                return hasUpgrade("e", 23) || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 24)
                },
                25: {
                        title: "Equipment",
                        description: "Add one to the <b>Director</b> base and <b>E</b> gain exponent",
                        cost: new Decimal(1e10),
                        unlocked(){ 
                                return hasUpgrade("e", 24) || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 25)
                },
                31: {
                        title: "Edition",
                        description: "Each upgrade multiplies base <b>G</b> gain by 1.1",
                        cost: new Decimal("1e32684"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("g", 21) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 31)
                },
                32: {
                        title: "Electronics",
                        description: "Unlock a fully completed effect",
                        cost: new Decimal("1e34851"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 31) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 32)
                },
                33: {
                        title: "Environment",
                        description: "Square <b>Edition</b>",
                        cost: new Decimal("1e38276"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 32) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 33)
                },
                34: {
                        title: "Ever",
                        description: "Square <b>Edition</b>",
                        cost: new Decimal("1e39436"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 33) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 34)
                },
                35: {
                        title: "Early",
                        description: "Gain one free Rebirth level",
                        cost: new Decimal("1e45201"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 34) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 35)
                },
                41: {
                        title: "Either",
                        description: "Raise Charge gain ^1.1",
                        cost: new Decimal("1e46297"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("g", 22) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 41)
                },
                42: {
                        title: "Else",
                        description: "Raise the successfully deved boosted to Features to the 20",
                        cost: new Decimal("1e46653"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 41) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 42)
                },
                43: {
                        title: "Europe",
                        description: "Raise the successfully deved boosted to Max Charges to the 2",
                        cost: new Decimal("1e47094"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 42) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 43)
                },
                44: {
                        title: "Edit",
                        description: "Raise charge gain ^1.1",
                        cost: new Decimal("1e49220"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 43) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 44)
                },
                45: {
                        title: "Economic",
                        description: "Raise charge gain ^1.1",
                        cost: new Decimal("1e49590"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 44) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 45)
                },
                51: {
                        title: "Everything",
                        description: "Unlock an <b>E</b> buyable",
                        cost: new Decimal("1e50660"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("g", 23) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 51)
                },
                //53691
                /*
                error
                engineering
                enough
                effects
                environmental
                entry
                european
                employment
                */
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "Experience",
                        display(){
                                return getBuyableDisplay("e", 11)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e11"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 11)
                        },
                        total(){
                                return getBuyableAmount("e", 11).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 11)
                        },
                        buy(){
                                buyManualBuyable("e", 11)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 11, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("goalsii", 19) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                12: {
                        title: "East",
                        display(){
                                return getBuyableDisplay("e", 12)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e12"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 12)
                        },
                        total(){
                                return getBuyableAmount("e", 12).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 12)
                        },
                        buy(){
                                buyManualBuyable("e", 12)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 12, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("goalsii", 22) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                13: {
                        title: "Example",
                        display(){
                                return getBuyableDisplay("e", 13)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e13"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 13)
                        },
                        total(){
                                return getBuyableAmount("e", 13).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 13)
                        },
                        buy(){
                                buyManualBuyable("e", 13)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 13, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("goalsii", 24) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                21: {
                        title: "Easy",
                        display(){
                                return getBuyableDisplay("e", 21)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e21"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 21)
                        },
                        total(){
                                return getBuyableAmount("e", 21).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 21)
                        },
                        buy(){
                                buyManualBuyable("e", 21)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 21, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 21) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                22: {
                        title: "Event",
                        display(){
                                return getBuyableDisplay("e", 22)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e22"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 22)
                        },
                        total(){
                                return getBuyableAmount("e", 22).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 22)
                        },
                        buy(){
                                buyManualBuyable("e", 22)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 22, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 22) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                23: {
                        title: "Enter",
                        display(){
                                return getBuyableDisplay("e", 23)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e23"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 23)
                        },
                        total(){
                                return getBuyableAmount("e", 23).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 23)
                        },
                        buy(){
                                buyManualBuyable("e", 23)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 23, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 23) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                31: {
                        title: "Energy",
                        display(){
                                return getBuyableDisplay("e", 31)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e31"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 31)
                        },
                        total(){
                                return getBuyableAmount("e", 31).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 31)
                        },
                        buy(){
                                buyManualBuyable("e", 31)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 31, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 24) || hasUnlockedPast("g")
                        },
                },
                32: {
                        title: "Entertainment",
                        display(){
                                return getBuyableDisplay("e", 32)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e32"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 32)
                        },
                        total(){
                                return getBuyableAmount("e", 32).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 32)
                        },
                        buy(){
                                buyManualBuyable("e", 32)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 32, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 25) || hasUnlockedPast("g")
                        },
                },
                33: {
                        title: "Omnipotent V",
                        display(){
                                return getBuyableDisplay("e", 33)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e33"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 33)
                        },
                        total(){
                                return getBuyableAmount("e", 33).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 33)
                        },
                        buy(){
                                buyManualBuyable("e", 33)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 33, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("e", 51) || hasUnlockedPast("g")
                        },
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("e", 22) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {return shiftDown ? "Your best Eggs is " + format(player.e.best) : ""}],
                                ["display-text",
                                        function() {
                                                if (hasUnlockedPast("e")) return ""
                                                return "You have done " + formatWhole(player.e.times) + " Egg resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (hasUpgrade("e", 22)) return "You are gaining " + format(tmp.e.getResetGain) + " Eggs per second"
                                                return "There is a five second cooldown for prestiging (" + format(Math.max(0, 5-player.e.time)) + ")" 
                                        },
                                        //{"font-size": "20px"}
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                if (!hasUpgrade("e", 22)) return ""
                                                if (!shiftDown) return ""
                                                return "You are gaining " + format(tmp.e.getResetGain) + " Eggs per second"
                                        },
                                        //{"font-size": "20px"}
                                ], 
                                "buyables"],
                        unlocked(){
                                return hasMilestone("goalsii", 19) || hasUnlockedPast("g") || player.g.best.gt(0)
                        },
                },
                "Challenges": {
                        content: [
                                ["display-text",
                                        function() {
                                                return "Challenge completions are never reset, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                return "You have completed " + formatWhole(totalChallengeComps("e")) + " Egg Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return false || hasUnlockedPast("h")
                        },
                },
        },
        doReset(layer){
                if (layer == "e") player.e.time = 0
                if (!getsReset("e", layer)) return
                player.e.time = 0
                player.e.times = 0

                if (!hasMilestone("ach", 6)) {
                        //upgrades
                        let keep = []
                        if (hasMilestone("goalsii", 6)) keep.push(22)
                        player.e.upgrades = filter(player.e.upgrades, keep)
                }

                //resources
                player.e.points = new Decimal(0)
                player.e.total = new Decimal(0)
                player.e.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.e.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})

addLayer("f", {
        name: "Features", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                bestc44: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#660099",
        branches: ["e"],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Features", // Name of prestige currency
        baseResource: "Eggs", // Name of resource prestige is based on
        baseAmount() {return player.e.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let a = pts.div(div)
                if (a.lt(1)) return new Decimal(0)

                let ret = a.log10().times(pre).pow(exp).times(pst)

                if (!hasUnlockedPast("f") && player.f.best.eq(0)) ret = ret.min(1)

                ret = doPrestigeGainChange(ret, "f")

                return ret.floor()
        },
        getBaseDiv(){
                let x = new Decimal(1e11)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                x = x.plus(getGoalChallengeReward("00"))
                x = x.plus(getGoalChallengeReward("30"))
                if (hasMilestone("ach", 6)) x = x.plus(1.5)
                if (hasUpgrade("goalsii", 13)) x = x.plus(0.2 * player.goalsii.upgrades.length)
                x = x.plus(layers.g.clickables.getRebirthEffects()["F gain exponent"][0])
                if (hasUpgrade("f", 25)) x = x.plus(player.f.upgrades.length ** 2)
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1/3)
                x = x.times(getGoalChallengeReward("13"))
                if (hasMilestone("goalsii", 14)) x = x.times(player.goalsii.points.plus(10).log10())
                x = x.times(player.e.best.max(10).log10().pow(getGoalChallengeReward("24")))
                x = x.times(layers.g.clickables.getRebirthEffects()["Base F gain"][0])
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)

                let yet = false
                for (let i = 0; i < LAYERS.length; i++){
                        if (layers[LAYERS[i]].row == "side") continue
                        if (yet) x = x.times(tmp[LAYERS[i]].effect)
                        if (LAYERS[i] == "f") yet = true
                }

                x = x.times(tmp.goalsii.effect)
                x = x.times(getBuyableEffect("c", 33))
                x = x.times(upgradeEffect("goalsii", 15))
                if (hasUpgrade("goalsii", 24) && getChallengeDepth(4) > 0) {
                        x = x.times(Decimal.pow(1.25, player.goalsii.upgrades.length ** 2))
                }
                x = x.times(layers.g.clickables.getAllPartialEffects()["Features"][0])
                x = x.times(layers.g.clickables.getAllCompletedEffects()["Features"][0])


                return x
        },
        effect(){
                if (!isPrestigeEffectActive("f")) return new Decimal(1)

                let amt = player.f.points

                let ret = amt.times(4).plus(1)

                if (ret.gt(10)) ret = ret.pow(2).div(10)
                if (ret.gt(1000)) ret = ret.pow(2).div(1000)

                ret = softcap(ret, "f_eff")

                return ret
        },
        effectDescription(){
                let eff = this.effect()
                let a = "which buffs point and all previous prestige gain by "

                return a + format(eff) + "."
        },
        update(diff){
                let data = player.f

                data.best = data.best.max(data.points)
                if (player.goalsii.currentChallenge == "44"){
                        data.bestc44 = data.bestc44.max(data.points)
                }
                if (hasMilestone("goalsii", 9)) {
                        data.points = data.points.plus(this.getResetGain().times(diff))
                        data.total = data.total.plus(this.getResetGain().times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (false) {
                        data.abtime += diff
                        if (data.abtime > 10) data.abtime = 10
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 5, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "f", description: "F: Reset for Features", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.e.best.gt(5e13) || player.f.best.gt(0) || hasUnlockedPast("f")},
        prestigeButtonText(){
                let gain= this.getResetGain()
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let nextnum = Decimal.pow(10, gain.plus(1).div(pst).root(exp).div(pre)).times(div).ceil()

                let nextAt = ""
                if (gain.lt(1e6) && (hasUnlockedPast("f") || player.f.best.neq(0))) {
                        nextAt = "<br>Next at " + format(nextnum) + " " + this.baseResource
                        let ps = gain.div(player.f.time || 1)

                        if (ps.lt(1000/60)) nextAt += "<br>" + format(ps.times(60)) + "/m"
                        else nextAt += "<br>" + format(ps) + "/s"
                }

                let a = "Reset for " + formatWhole(gain) + " " + this.resource

                return a + nextAt
        },
        canReset(){
                return this.getResetGain().gt(0) && player.f.time >= 2 && !hasMilestone("goalsii", 9)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "For",
                        description: "Keep <b>F</b> upgrades and make <b>G</b> gain based on best <b>F</b>",
                        cost: new Decimal("1e10533"),
                        unlocked(){ 
                                return player.g.rebirths[1] >= 16 || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 11)
                },
                12: {
                        title: "From",
                        description: "Remove the successful dev boost to Feature gain softcap",
                        cost: new Decimal("1e13524"),
                        unlocked(){ 
                                return hasUpgrade("f", 11) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 12)
                },
                13: {
                        title: "Free",
                        description: "Remove the successful dev boost to Medal gain softcap",
                        cost: new Decimal("1e14099"),
                        unlocked(){ 
                                return hasUpgrade("f", 12) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 13)
                },
                14: {
                        title: "First",
                        description: "Remove the successful dev boost to Game gain softcap",
                        cost: new Decimal("1e14746"),
                        unlocked(){ 
                                return hasUpgrade("f", 13) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 14)
                },
                15: {
                        title: "Find",
                        description: "Multiply base <b>G</b> gain by 1.15",
                        cost: new Decimal("1e26221"),
                        unlocked(){ 
                                return hasUpgrade("f", 14) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 15)
                },
                21: {
                        title: "Full",
                        description: "Each upgrade in this row unlocks a rebirth reward",
                        cost: new Decimal("1e28545"),
                        unlocked(){ 
                                return hasUpgrade("f", 15) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 21)
                },
                22: {
                        title: "Forum",
                        description: "Raise charge gain ^1.1",
                        cost: new Decimal("1e45342"),
                        unlocked(){ 
                                return hasUpgrade("f", 21) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 22)
                },
                23: {
                        title: "Family",
                        description: "Raise charge gain ^1.1 and buff Base G gain from rebirths",
                        cost: new Decimal("1e53420"),
                        unlocked(){ 
                                return hasUpgrade("f", 22) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 23)
                },
                24: {
                        title: "File",
                        description: "Per upgrade squared add one to <b>G</b> gain exponent",
                        cost: new Decimal("1e61495"),
                        unlocked(){ 
                                return hasUpgrade("f", 23) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 24)
                },
                25: {
                        title: "Found",
                        description: "Per upgrade squared add one to <b>F</b> gain exponent",
                        cost: new Decimal("1e78988"),
                        unlocked(){ 
                                return hasUpgrade("f", 24) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 25)
                },
                31: {
                        title: "Following",
                        description: "Per upgrade multiply base <b>G</b> gain by 1.01",
                        cost: new Decimal("1e99330"),
                        unlocked(){ 
                                return hasUpgrade("f", 25) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 31)
                },
                32: {
                        title: "Form",
                        description: "Remove the G gain exponent softcap",
                        cost: new Decimal("1e109555"),
                        unlocked(){ 
                                return hasUpgrade("f", 31) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 32)
                },
                33: {
                        title: "Food",
                        description: "Once per second attempt to Rebirth I",
                        cost: new Decimal("1e130130"),
                        unlocked(){ 
                                return hasUpgrade("f", 32) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 33)
                },
                34: {
                        title: "Features",
                        description: "You can also autobuy the first four games",
                        cost: new Decimal("1e136640"),
                        unlocked(){ 
                                return hasUpgrade("f", 33) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 34)
                },
                35: {
                        title: "Forums",
                        description: "Goals multiply base <b>G</b> gain",
                        cost: new Decimal("1e149215"),
                        unlocked(){ 
                                return hasUpgrade("f", 34) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 35)
                },
                41: {
                        title: "Friend",
                        description: "Raise charge gain ^1.1",
                        cost: new Decimal("1e190803"),
                        unlocked(){ 
                                return hasUpgrade("f", 35) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 41)
                },
                42: {
                        title: "Feedback",
                        description: "Each upgrade adds 1 to the Medal gain exponent",
                        cost: new Decimal("1e206577"),
                        unlocked(){ 
                                return hasUpgrade("f", 41) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 42)
                },
                43: {
                        title: "Financial",
                        description: "Medals challenges no longer do anything",
                        cost: new Decimal("1e216218"),
                        unlocked(){ 
                                return hasUpgrade("f", 42) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 43)
                },
                44: {
                        title: "Field",
                        description: "Per upgrade squared multiply base <b>G</b> gain by 1.001",
                        cost: new Decimal("1e226195"),
                        unlocked(){ 
                                return hasUpgrade("f", 43) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 44)
                },
                45: {
                        title: "Few",
                        description: "log(Games) boosts base medal gain",
                        cost: new Decimal("1e245725"),
                        unlocked(){ 
                                return hasUpgrade("f", 44) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 45)
                },

                // 

                /*
                four
                february
                files
                fax
                future
                film
                
                */
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasMilestone("goalsii", 9) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {return shiftDown ? "Your best Features is " + format(player.f.best) : ""}],
                                ["display-text",
                                        function() {
                                                if (hasUnlockedPast("f")) return ""
                                                return "You have done " + formatWhole(player.f.times) + " Feature resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (hasMilestone("goalsii", 9)) return "You are gaining " + format(tmp.f.getResetGain) + " Features per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.f.time)) + ")" 
                                        },
                                        //{"font-size": "20px"}
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return false || hasUnlockedPast("h")
                        },
                },
                "Challenges": {
                        content: [
                                ["display-text",
                                        function() {
                                                return "Challenge completions are never reset, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                return "You have completed " + formatWhole(totalChallengeComps("f")) + " Feature Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return false || hasUnlockedPast("h")
                        },
                },
        },
        doReset(layer){
                if (layer == "f") player.f.time = 0
                if (!getsReset("f", layer)) return
                player.f.time = 0
                player.f.times = 0

                if (!hasUpgrade("f", 11)) {
                        //upgrades
                        let keep = []
                        player.f.upgrades = filter(player.f.upgrades, keep)
                }

                //resources
                player.f.points = new Decimal(0)
                player.f.total = new Decimal(0)
                player.f.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        break
                        player.f.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})

addLayer("ach", {
        name: "Goals", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "⭑", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                bestOverGoalsii: new Decimal(0),
                total: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#FFC746",
        branches: [],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Goals", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return new Decimal(0)}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                return new Decimal(0)
        },
        getBaseDiv(){
                let x = new Decimal(1)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)
                return x
        },
        effect(){
                return new Decimal(1)
        },
        effectDescription(){
                return ""
        },
        update(diff){
                let data = player.ach
                data.points = new Decimal(data.achievements.length).max(data.points)
                data.best = data.best.max(data.points)
                data.bestOverGoalsii = data.bestOverGoalsii.max(data.best)
        },
        row: "side", // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return true},
        prestigeButtonText(){
                return ""
        },
        canReset(){
                return false
        },
        achievements: {
                rows: 20,
                cols: 7,
                11: {
                        name: "One",
                        done(){
                                return PROGRESSION_MILESTONES[1]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[1]
                        },
                },
                12: {
                        name: "Two",
                        done(){
                                return PROGRESSION_MILESTONES[2]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[2]
                        },
                },
                13: {
                        name: "Three",
                        done(){
                                return PROGRESSION_MILESTONES[3]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[3]
                        },
                },
                14: {
                        name: "Four",
                        done(){
                                return PROGRESSION_MILESTONES[4]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[4]
                        },
                },
                15: {
                        name: "Five",
                        done(){
                                return PROGRESSION_MILESTONES[5]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[5]
                        },
                },
                16: {
                        name: "Six",
                        done(){
                                return PROGRESSION_MILESTONES[6]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[6]
                        },
                },
                17: {
                        name: "Seven",
                        done(){
                                return PROGRESSION_MILESTONES[7]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[7]
                        },
                },
                21: {
                        name: "Eight",
                        done(){
                                return PROGRESSION_MILESTONES[8]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[8]
                        },
                },
                22: {
                        name: "Nine",
                        done(){
                                return PROGRESSION_MILESTONES[9]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[9]
                        },
                },
                23: {
                        name: "Ten",
                        done(){
                                return PROGRESSION_MILESTONES[10]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[10]
                        },
                },
                24: {
                        name: "Eleven",
                        done(){
                                return PROGRESSION_MILESTONES[11]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[11]
                        },
                },
                25: {
                        name: "Twelve",
                        done(){
                                return PROGRESSION_MILESTONES[12]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[12]
                        },
                },
                26: {
                        name: "Thirteen",
                        done(){
                                return PROGRESSION_MILESTONES[13]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[13]
                        },
                },
                27: {
                        name: "Fourteen",
                        done(){
                                return PROGRESSION_MILESTONES[14]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[14]
                        },
                },
                31: {
                        name: "Fifteen",
                        done(){
                                return PROGRESSION_MILESTONES[15]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[15]
                        },
                },
                32: {
                        name: "Sixteen",
                        done(){
                                return PROGRESSION_MILESTONES[16]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[16]
                        },
                },
                33: {
                        name: "Seventeen",
                        done(){
                                return PROGRESSION_MILESTONES[17]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[17]
                        },
                },
                34: {
                        name: "Eighteen",
                        done(){
                                return PROGRESSION_MILESTONES[18]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[18]
                        },
                },
                35: {
                        name: "Nineteen",
                        done(){
                                return PROGRESSION_MILESTONES[19]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[19]
                        },
                },
                36: {
                        name: "Twenty",
                        done(){
                                return PROGRESSION_MILESTONES[20]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[20]
                        },
                },
                37: {
                        name: "Twenty-one",
                        done(){
                                return PROGRESSION_MILESTONES[21]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[21]
                        },
                },
                41: {
                        name: "Twenty-two",
                        done(){
                                return PROGRESSION_MILESTONES[22]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[22]
                        },
                },
                42: {
                        name: "Twenty-three",
                        done(){
                                return PROGRESSION_MILESTONES[23]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[23]
                        },
                },
                43: {
                        name: "Twenty-four",
                        done(){
                                return PROGRESSION_MILESTONES[24]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[24]
                        },
                },
                44: {
                        name: "Twenty-five",
                        done(){
                                return PROGRESSION_MILESTONES[25]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[25]
                        },
                },
                45: {
                        name: "Twenty-six",
                        done(){
                                return PROGRESSION_MILESTONES[26]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[26]
                        },
                },
                46: {
                        name: "Twenty-seven",
                        done(){
                                return PROGRESSION_MILESTONES[27]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[27]
                        },
                },
                47: {
                        name: "Twenty-eight",
                        done(){
                                return PROGRESSION_MILESTONES[28]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[28]
                        },
                },
                51: {
                        name: "Twenty-nine",
                        done(){
                                return PROGRESSION_MILESTONES[29]()
                        },
                        tooltip() {
                                return "Be able to get " + PROGRESSION_MILESTONES_TEXT[29]
                        },
                },
                52: {
                        name: "Thirty",
                        done(){
                                return PROGRESSION_MILESTONES[30]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[30]
                        },
                },
                53: {
                        name: "Thirty-one",
                        done(){
                                return PROGRESSION_MILESTONES[31]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[31]
                        },
                },
                54: {
                        name: "Thirty-two",
                        done(){
                                return PROGRESSION_MILESTONES[32]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[32]
                        },
                },
                55: {
                        name: "Thirty-three",
                        done(){
                                return PROGRESSION_MILESTONES[33]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[33]
                        },
                },
                56: {
                        name: "Thirty-four",
                        done(){
                                return PROGRESSION_MILESTONES[34]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[34]
                        },
                },
                57: {
                        name: "Thirty-five",
                        done(){
                                return PROGRESSION_MILESTONES[35]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[35]
                        },
                },
                61: {
                        name: "Thirty-six",
                        done(){
                                return PROGRESSION_MILESTONES[36]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[36]
                        },
                },
                62: {
                        name: "Thirty-seven",
                        done(){
                                return PROGRESSION_MILESTONES[37]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[37]
                        },
                },
                63: {
                        name: "Thirty-eight",
                        done(){
                                return PROGRESSION_MILESTONES[38]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[38]
                        },
                },
                64: {
                        name: "Thirty-nine",
                        done(){
                                return PROGRESSION_MILESTONES[39]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[39]
                        },
                },
                65: {
                        name: "Forty",
                        done(){
                                return PROGRESSION_MILESTONES[40]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[40]
                        },
                },
                66: {
                        name: "Forty-one",
                        done(){
                                return PROGRESSION_MILESTONES[41]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[41]
                        },
                },
                67: {
                        name: "Forty-two",
                        done(){
                                return PROGRESSION_MILESTONES[42]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[42]
                        },
                }, 
                71: {
                        name: "Forty-three",
                        done(){
                                return PROGRESSION_MILESTONES[43]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[43]
                        },
                },
                72: {
                        name: "Forty-four",
                        done(){
                                return PROGRESSION_MILESTONES[44]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[44]
                        },
                },
                73: {
                        name: "Forty-five",
                        done(){
                                return PROGRESSION_MILESTONES[45]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[45]
                        },
                },
                74: {
                        name: "Forty-six",
                        done(){
                                return PROGRESSION_MILESTONES[46]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[46]
                        },
                },
                75: {
                        name: "Forty-seven",
                        done(){
                                return PROGRESSION_MILESTONES[47]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[47]
                        },
                },
                76: {
                        name: "Forty-eight",
                        done(){
                                return PROGRESSION_MILESTONES[48]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[48]
                        },
                },
                77: {
                        name: "Forty-nine",
                        done(){
                                return PROGRESSION_MILESTONES[49]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[49]
                        },
                },
                81: {
                        name: "Fifty",
                        done(){
                                return PROGRESSION_MILESTONES[50]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[50]
                        },
                },
                82: {
                        name: "Fifty-one",
                        done(){
                                return PROGRESSION_MILESTONES[51]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[51]
                        },
                },
                83: {
                        name: "Fifty-two",
                        done(){
                                return PROGRESSION_MILESTONES[52]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[52]
                        },
                },
                84: {
                        name: "Fifty-three",
                        done(){
                                return PROGRESSION_MILESTONES[53]()
                        },
                        tooltip() {
                                return PROGRESSION_MILESTONES_TEXT[53]
                        },
                },
                85: {
                        name: "Fifty-four",
                        done(){
                                return PROGRESSION_MILESTONES[54]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[54]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                86: {
                        name: "Fifty-five",
                        done(){
                                return PROGRESSION_MILESTONES[55]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[55]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                87: {
                        name: "Fifty-six",
                        done(){
                                return PROGRESSION_MILESTONES[56]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[56]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                91: {
                        name: "Fifty-seven",
                        done(){
                                return PROGRESSION_MILESTONES[57]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[57]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                92: {
                        name: "Fifty-eight",
                        done(){
                                return PROGRESSION_MILESTONES[58]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[58]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                93: {
                        name: "Fifty-nine",
                        done(){
                                return PROGRESSION_MILESTONES[59]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[59]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                94: {
                        name: "Sixty",
                        done(){
                                return PROGRESSION_MILESTONES[60]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[60]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                95: {
                        name: "Sixty-one",
                        done(){
                                return PROGRESSION_MILESTONES[61]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[61]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                96: {
                        name: "Sixty-two",
                        done(){
                                return PROGRESSION_MILESTONES[62]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[62]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                97: {
                        name: "Sixty-three",
                        done(){
                                return PROGRESSION_MILESTONES[63]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[63]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                101: {
                        name: "Sixty-four",
                        done(){
                                return PROGRESSION_MILESTONES[64]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[64]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                102: {
                        name: "Sixty-five",
                        done(){
                                return PROGRESSION_MILESTONES[65]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[65]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                103: {
                        name: "Sixty-six",
                        done(){
                                return PROGRESSION_MILESTONES[66]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[66]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                104: {
                        name: "Sixty-seven",
                        done(){
                                return PROGRESSION_MILESTONES[67]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[67]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                105: {
                        name: "Sixty-eight",
                        done(){
                                return PROGRESSION_MILESTONES[68]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[68]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                106: {
                        name: "Sixty-nine",
                        done(){
                                return PROGRESSION_MILESTONES[69]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[69]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                107: {
                        name: "Seventy",
                        done(){
                                return PROGRESSION_MILESTONES[70]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[70]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                111: {
                        name: "Seventy-one",
                        done(){
                                return PROGRESSION_MILESTONES[71]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[71]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                112: {
                        name: "Seventy-two",
                        done(){
                                return PROGRESSION_MILESTONES[72]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[72]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                113: {
                        name: "Seventy-three",
                        done(){
                                return PROGRESSION_MILESTONES[73]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[73]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                114: {
                        name: "Seventy-four",
                        done(){
                                return PROGRESSION_MILESTONES[74]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[74]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                115: {
                        name: "Seventy-five",
                        done(){
                                return PROGRESSION_MILESTONES[75]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[75]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                116: {
                        name: "Seventy-six",
                        done(){
                                return PROGRESSION_MILESTONES[76]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[76]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                117: {
                        name: "Seventy-seven",
                        done(){
                                return PROGRESSION_MILESTONES[77]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[77]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                121: {
                        name: "Seventy-eight",
                        done(){
                                return PROGRESSION_MILESTONES[78]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[78]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                122: {
                        name: "Seventy-nine",
                        done(){
                                return PROGRESSION_MILESTONES[79]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[79]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                123: {
                        name: "Eighty",
                        done(){
                                return PROGRESSION_MILESTONES[80]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[80]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                124: {
                        name: "Eighty-one",
                        done(){
                                return PROGRESSION_MILESTONES[81]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[81]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                125: {
                        name: "Eighty-two",
                        done(){
                                return PROGRESSION_MILESTONES[82]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[82]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                126: {
                        name: "Eighty-three",
                        done(){
                                return PROGRESSION_MILESTONES[83]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[83]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                127: {
                        name: "Eighty-four",
                        done(){
                                return PROGRESSION_MILESTONES[84]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[84]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                131: {
                        name: "Eighty-five",
                        done(){
                                return PROGRESSION_MILESTONES[85]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[85]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                132: {
                        name: "Eighty-six",
                        done(){
                                return PROGRESSION_MILESTONES[86]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[86]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                133: {
                        name: "Eighty-seven",
                        done(){
                                return PROGRESSION_MILESTONES[87]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[87]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                134: {
                        name: "Eighty-eight",
                        done(){
                                return PROGRESSION_MILESTONES[88]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[88]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                135: {
                        name: "Eighty-nine",
                        done(){
                                return PROGRESSION_MILESTONES[89]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[89]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                136: {
                        name: "Ninety",
                        done(){
                                return PROGRESSION_MILESTONES[90]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[90]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                137: {
                        name: "Ninety-one",
                        done(){
                                return PROGRESSION_MILESTONES[91]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[91]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                141: {
                        name: "Ninety-two",
                        done(){
                                return PROGRESSION_MILESTONES[92]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[92]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                142: {
                        name: "Ninety-three",
                        done(){
                                return PROGRESSION_MILESTONES[93]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[93]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                143: {
                        name: "Ninety-four",
                        done(){
                                return PROGRESSION_MILESTONES[94]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[94]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                144: {
                        name: "Ninety-five",
                        done(){
                                return PROGRESSION_MILESTONES[95]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[95]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                145: {
                        name: "Ninety-six",
                        done(){
                                return PROGRESSION_MILESTONES[96]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[96]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                146: {
                        name: "Ninety-seven",
                        done(){
                                return PROGRESSION_MILESTONES[97]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[97]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                147: {
                        name: "Ninety-eight",
                        done(){
                                return PROGRESSION_MILESTONES[98]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[98]
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                /*
                */
        },
        milestones: {
                1: {
                        requirementDescription(){
                                return "<b>Life</b><br>Requires: " + formatWhole(this.req()) + " Goals"
                        }, 
                        effectDescription: "You permanently keep all <b>A</b> upgrades",
                        done(){
                                return player.ach.points.gte(this.req())
                        },
                        req(){
                                let a = 30
                                if (hasMilestone("goalsii", 7)) a /= 2
                                return new Decimal(a).floor()
                        },
                        unlocked(){
                                return true
                        },
                },
                2: {
                        requirementDescription() {
                                return "<b>The Universe</b><br>Requires: " + formatWhole(this.req()) + " Goals"
                        }, 
                        effectDescription: "You permanently keep all <b>B</b> upgrades",
                        done(){
                                return player.ach.points.gte(this.req())
                        },
                        req(){
                                let a = 36
                                if (hasMilestone("goalsii", 7)) a /= 2
                                return new Decimal(a).floor()
                        },
                        unlocked(){
                                return true
                        },
                },
                3: {
                        requirementDescription(){
                                return "<b>And Everything</b><br>Requires: " + formatWhole(this.req()) + " Goals"
                        }, 
                        effectDescription: "You permanently keep all <b>C</b> upgrades",
                        done(){
                                return player.ach.points.gte(this.req())
                        },
                        req(){
                                let a = 49
                                if (hasMilestone("goalsii", 7)) a /= 2
                                return new Decimal(a).floor()
                        },
                        unlocked(){
                                return true
                        },
                },
                4: {
                        requirementDescription() {
                                return "<b>Tell me and I forget</b><br>Requires: " + formatWhole(this.req()) + " Goals"
                        }, 
                        effectDescription: "All autobuyers buy 100x more",
                        done(){
                                return player.ach.points.gte(this.req())
                        },
                        req(){
                                let a = 52
                                if (hasMilestone("goalsii", 7)) a /= 2
                                return new Decimal(a).floor()
                        },
                        unlocked(){
                                return true
                        },
                },
                5: {
                        requirementDescription() {
                                return "<b>Teach me and I remember</b><br>Requires: " + formatWhole(this.req()) + " Goals"
                        }, 
                        effectDescription: "You permanently keep all <b>D</b> upgrades",
                        done(){
                                return player.ach.points.gte(this.req())
                        },
                        req(){
                                let a = 70
                                if (hasMilestone("goalsii", 7)) a /= 2
                                return new Decimal(a).floor()
                        },
                        unlocked(){
                                return true
                        },
                },
                6: {
                        requirementDescription() {
                                return "<b>Involve me and I learn</b><br>Requires: " + formatWhole(this.req()) + " Goals (needs Eighty or in Challenge 4)"
                        }, 
                        effectDescription: "You permanently keep all <b>E</b> upgrades and add 1.5 to the <b>F</b> gain exponent",
                        done(){
                                return player.ach.points.gte(this.req()) && (getChallengeDepth(4) > 0 || hasAchievement("ach", 123))
                        },
                        req(){
                                let a = 69
                                return new Decimal(a).floor()
                        },
                        unlocked(){
                                return true
                        },
                },
                //
                //Benjamin Franklin
        },
        tabFormat: {
                "Achievements": {
                        content: [
                                "main-display-goals",
                                "achievements",
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Milestones": {
                        content: [
                                "main-display-goals",
                                "milestones",
                        ],
                        unlocked(){
                                return player.ach.points.gte(28) || player.goalsii.times > 0
                        },
                },
        },
        doReset(layer){
                if (layers[layer].row != "side") return 
                if (layer == "ach") return

                let data = player.ach

                let remove = [
                        "11", "12", "13", "14", "15", "16", "17", 
                        "21", "22", "23", "24", "25", "26", "27", 
                        "31", "32", "33", "34", "35", "36", "37", 
                        "41", "42", "43", "44", "45", "46", "47", 
                        "51", "52", "53", "54", "55", "56", "57", 
                        "61", "62", "63", "64", "65", "66", "67", 
                        "71", "72", "73", "74", "75", "76", "77", 
                        "81", "82", "83", "84"]

                data.achievements = filterout(data.achievements, remove)
                data.best = new Decimal(0)
                data.points = new Decimal(0)

                let keep = []
                data.milestones = filter(data.milestones, keep)
                updateAchievements("ach")
                updateMilestones("ach")
        },
})

addLayer("ghostONE", {
        position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {} },
        color: "#CC66CC",
        branches: [],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Medals", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return new Decimal(0)}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                return new Decimal(0)
        },
        row: "side", // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
        ],
        layerShown(){return "ghost"},
        prestigeButtonText(){
                return ""
        },
        canReset(){
                return false
        },
        tabFormat: {
                "Challenges": {
                        content: [
                                "main-display",
                                "clickables",
                        ],
                        unlocked(){
                                return false
                        },
                },
        },
})

addLayer("goalsii", {
        name: "Goals II", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "✦", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { 
                let a = {}
                let b = {}
                let c = {}
                let d = {}
                let e = {}
                let l = ["00", "01", "02", "03", "04",
                         "10", "11", "12", "13", "14",
                         "20", "21", "22", "23", "24",
                         "30", "31", "32", "33", "34",
                         "40", "41", "42", "43", "44",
                        ]
                for (j in l){
                        i = l[j]
                        a[i] = new Decimal(0)
                        b[i] = new Decimal(0)
                        c[i] = new Decimal(0)
                        d[i] = 0
                        e[i] = new Decimal(0)
                }
                return {
                        unlocked: true,
                        abtime: 0,
                        time: 0,
                        times: 0,
                        challtimes: d,
                        autotimes: 0,
                        autobuyA: false,
                        autobuyB: false,
                        autobuyC: false,
                        autobuyD: false,
                        autobuyE: false,
                        abupgstime: 0,
                        currentChallenge: "00",
                        points: new Decimal(0),
                        best: new Decimal(0),
                        total: new Decimal(0),
                        bestOnce: new Decimal(0),
                        tokens: {
                                points: a,
                                best: b,
                                total: c,
                                copy: e,
                        },
                }
        },
        color: "#CC66CC",
        branches: ["ach"],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Medals", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return new Decimal(0)}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let a 
                if (player.f.best.eq(0)) a = new Decimal(0)
                else a = new Decimal(1)

                let b = player.f.best.max(1).log10().div(9.5).plus(1)

                if (getChallengeDepth(3) > 0) b = b.minus(2).max(0)

                a = a.times(b)

                if (a.lt(1)) return new Decimal(0)

                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()

                let ret = a.times(pre).pow(exp).times(pst)

                if (ret.gt(1e4) && !hasMilestone("g", 10)) ret = ret.div(1e4).sqrt().times(1e4)

                return ret.floor()
        },
        getGainExp(){
                let x = new Decimal(1)
                if (hasMilestone("goalsii", 13)) x = x.plus(1)
                if (hasUpgrade("f", 42)) x = x.plus(player.f.upgrades.length)
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                if (hasUpgrade("f", 45)) x = x.times(player.g.points.max(10).log10())
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)
                x = x.times(getGoalChallengeReward("31"))
                x = x.times(getGoalChallengeReward("41"))
                if (hasMilestone("g", 1)) x = x.times(2)
                if (hasMilestone("g", 3)) x = x.times(Decimal.pow(1.5, player.g.milestones.length))
                if (hasUpgrade("goalsii", 24)) x = x.times(Decimal.pow(1.1, player.goalsii.upgrades.length))
                x = x.times(getBuyableEffect("e", 32))
                x = x.times(layers.g.clickables.getAllPartialEffects()["Medals"][0])
                x = x.times(layers.g.clickables.getRebirthEffects()["Medals"][0])
                if (hasMilestone("g", 14)) {
                        x = x.times(Decimal.pow(2, player.g.milestones.length))
                }
                return x
        },
        effect(){
                let amt = player.goalsii.points

                let ret = amt.times(3).plus(1)

                if (ret.gt(1e1))  ret = ret.pow(2).div(1e1)
                if (ret.gt(1e2))  ret = ret.pow(2).div(1e2)
                if (ret.gt(1e4))  ret = ret.pow(2).div(1e4)
                if (ret.gt(1e8))  ret = ret.pow(2).div(1e8)

                if (hasMilestone("goalsii", 6)) ret = ret.times(2)

                ret = softcap(ret, "goalsii_eff")

                ret = ret.times(getBuyableEffect("e", 22))
                if (hasUpgrade("goalsii", 23)) ret = ret.pow(2)

                return ret
        },
        effectDescription(){
                let eff = this.effect()
                let a = "which buffs point and all previous prestige gain by "

                return a + format(eff) + "."
        },
        update(diff){
                let data = player.goalsii
                let gain = this.getResetGain()

                data.best = data.best.max(data.points)
                for (i in data.tokens.best){
                        data.tokens.best[i] = data.tokens.best[i].max(data.tokens.points[i])
                        data.tokens.copy[i] = data.tokens.points[i]
                }
                if (hasUpgrade("goalsii", 22)) {
                        data.points = data.points.plus(gain.times(diff))
                        data.total = data.total.plus(gain.times(diff))
                        data.bestOnce = data.bestOnce.max(gain)
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (false) {
                        data.abtime += diff
                        if (data.abtime > 10) data.abtime = 10
                } else {
                        data.abtime = 0
                }
                data.time += diff
                data.abupgstime += diff

                if (data.abupgstime > 10) data.abupgstime = 10
                if (data.abupgstime < 1) return
                data.abupgstime += -1

                //Autobuy A-E 
                let l =  ["a", "b", "c", "d", "e"]
                let l2 = ["A", "B", "C", "D", "E"]
                let trylist = [11, 12, 13, 14, 15, 
                               21, 22, 23, 24, 25,
                               31, 32, 33, 34, 35,
                               41, 42, 43, 44, 45,
                               51, 52, 53, 54, 55,]
                for (j in l){
                        i = l[j] //i is our layer
                        let can = data["autobuy" + l2[j]] && hasMilestone("goalsii", String(Number(j) + 2))
                        // check if the ab is on and unlocked
                        if (!can) continue
                        for (k in trylist) {
                                //if we have the upgrade continue
                                if (hasUpgrade(i, trylist[k])) continue
                                if (layers[i].upgrades[trylist[k]] == undefined) continue
                                
                                //if we dont have it, try to buy it and then break, so we only buy one
                                buyUpgrade(i, trylist[k])
                                if (!hasMilestone("goalsii", 8)) break
                        }
                }
                
                if (hasMilestone("goalsii", 18)) {
                        completeMaxPossibleChallenges("b")
                        completeMaxPossibleChallenges("c")
                }

                if (hasUpgrade("goalsii", 22)) {
                        layers.goalsii.onPrestige(gain)
                }
        },
        row: "side", // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "[", description: "[: Reset for Medals", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.goalsii.times > 0 || player.f.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")},
        prestigeButtonText(){
                let b = ""
                if (player.goalsii.times > 0) {
                        b = "This will keep you in the same challenge <br>"
                }

                let gain = this.getResetGain()

                let a = "Reset for " + formatWhole(gain) + " " + this.resource

                let mid = ""
                if (!hasMilestone("goalsii", 12)) mid += " " + player.goalsii.currentChallenge

                a += "<br> and " + formatWhole(this.getTokenToMedalGain(gain)) + mid + " tokens"

                return b + a
        },
        canReset(){
                return player.f.best.gt(0) && this.getResetGain().gt(0)
        },
        clickables: {
                rows: 5,
                cols: 5,
                11: {
                        title(){
                                if (player.goalsii.tokens.best["00"].gt(0)) return "<h3 style='color: #13ACDF'>00</h3>"
                                return "<h3 style='color: #C03000'>00</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["00"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("00"), 4) + " to<br>"
                                let c = "all prior prestige gain exponents"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset || player.goalsii.currentChallenge != "00"
                        },
                        onClick(){
                                if (!this.canClick()) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "00"
                                player.goalsii.times ++
                        },
                },
                12: {
                        title(){
                                if (player.goalsii.tokens.best["01"].gt(0)) return "<h3 style='color: #13ACDF'>01</h3>"
                                return "<h3 style='color: #C03000'>01</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["01"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("01").times(100), 4) + "<br>"
                                let c = "/100 to <b>Country</b> and <b>Omnipotent I</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["00"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "01"
                                player.goalsii.times ++
                        },
                },
                13: {
                        title(){
                                if (player.goalsii.tokens.best["02"].gt(0)) return "<h3 style='color: #13ACDF'>02</h3>"
                                return "<h3 style='color: #C03000'>02</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["02"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("02"), 4) + " to<br>"
                                let c = "Doodle effect exponent"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["01"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "02"
                                player.goalsii.times ++
                        },
                },
                14: {
                        title(){
                                if (player.goalsii.tokens.best["03"].gt(0)) return "<h3 style='color: #13ACDF'>03</h3>"
                                return "<h3 style='color: #C03000'>03</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["03"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("03"), 4) + " to<br>"
                                let c = "<b>Delivery</b> and <b>December</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["02"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "03"
                                player.goalsii.times ++
                        },
                },
                15: {
                        title(){
                                if (player.goalsii.tokens.best["04"].gt(0)) return "<h3 style='color: #13ACDF'>04</h3>"
                                return "<h3 style='color: #C03000'>04</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["04"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("04"), 4) + "<br>"
                                let c = "to <b>Experience</b> and <b>Card</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["03"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "04"
                                player.goalsii.times ++
                        },
                },
                21: {
                        title(){
                                if (player.goalsii.tokens.best["10"].gt(0)) return "<h3 style='color: #13ACDF'>10</h3>"
                                return "<h3 style='color: #C03000'>10</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["10"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("10")) + "<br>"
                                let c = "Free <b>Director</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["00"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "10"
                                player.goalsii.times ++
                        },
                },
                22: {
                        title(){
                                if (player.goalsii.tokens.best["11"].gt(0)) return "<h3 style='color: #13ACDF'>11</h3>"
                                return "<h3 style='color: #C03000'>11</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["11"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("11")) + "<br>"
                                let c = "Free <b>Omnipotent II</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["10"].gt(0) && player.goalsii.tokens.best["01"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "11"
                                player.goalsii.times ++
                        },
                },
                23: {
                        title(){
                                if (player.goalsii.tokens.best["12"].gt(0)) return "<h3 style='color: #13ACDF'>12</h3>"
                                return "<h3 style='color: #C03000'>12</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["12"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("12")) + "<br>"
                                let c = "Free <b>Category</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["11"].gt(0) && player.goalsii.tokens.best["02"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "12"
                                player.goalsii.times ++
                        },
                },
                24: {
                        title(){
                                if (player.goalsii.tokens.best["13"].gt(0)) return "<h3 style='color: #13ACDF'>13</h3>"
                                return "<h3 style='color: #C03000'>13</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["13"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: *" + format(getGoalChallengeReward("13"), 4) + " <br>to "
                                let c = "base <b>F</b> gain"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["12"].gt(0) && player.goalsii.tokens.best["03"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "13"
                                player.goalsii.times ++
                        },
                },
                25: {
                        title(){
                                if (player.goalsii.tokens.best["14"].gt(0)) return "<h3 style='color: #13ACDF'>14</h3>"
                                return "<h3 style='color: #C03000'>14</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["14"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("14")) + "<br>"
                                let c = "free <b>Experience</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["13"].gt(0) && player.goalsii.tokens.best["04"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "14"
                                player.goalsii.times ++
                        },
                },
                31: {
                        title(){
                                if (player.goalsii.tokens.best["20"].gt(0)) return "<h3 style='color: #13ACDF'>20</h3>"
                                return "<h3 style='color: #C03000'>20</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["20"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("20"), 4) + "<br>"
                                let c = "to <b>Department</b><br>base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["10"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "20"
                                player.goalsii.times ++
                        },
                },
                32: {
                        title(){
                                if (player.goalsii.tokens.best["21"].gt(0)) return "<h3 style='color: #13ACDF'>21</h3>"
                                return "<h3 style='color: #C03000'>21</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["21"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: x" + format(getGoalChallengeReward("21")) + "<br>"
                                let c = "<b>Egg</b> gain and <b>Account</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["20"].gt(0) && player.goalsii.tokens.best["11"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "21"
                                player.goalsii.times ++
                        },
                },
                33: {
                        title(){
                                if (player.goalsii.tokens.best["22"].gt(0)) return "<h3 style='color: #13ACDF'>22</h3>"
                                return "<h3 style='color: #C03000'>22</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["22"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("22")) + "<br>"
                                let c = "free <b>Drive</b><br>levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["21"].gt(0) && player.goalsii.tokens.best["12"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "22"
                                player.goalsii.times ++
                        },
                },
                34: {
                        title(){
                                if (player.goalsii.tokens.best["23"].gt(0)) return "<h3 style='color: #13ACDF'>23</h3>"
                                return "<h3 style='color: #C03000'>23</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["23"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("23"), 4) + " to<br>"
                                let c = "<b>E</b> gain exp"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["22"].gt(0) && player.goalsii.tokens.best["13"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "23"
                                player.goalsii.times ++
                        },
                },
                35: {
                        title(){
                                if (player.goalsii.tokens.best["24"].gt(0)) return "<h3 style='color: #13ACDF'>24</h3>"
                                return "<h3 style='color: #C03000'>24</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["24"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: log(eggs)^" + format(getGoalChallengeReward("24"), 4) + "<br>"
                                let c = "boosts base <b>F</b> gain"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["23"].gt(0) && player.goalsii.tokens.best["14"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "24"
                                player.goalsii.times ++
                        },
                },
                41: {
                        title(){
                                if (player.goalsii.tokens.best["30"].gt(0)) return "<h3 style='color: #13ACDF'>30</h3>"
                                return "<h3 style='color: #C03000'>30</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["30"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("30"), 4) + " to<br>"
                                let c = "<b>F</b> gain exp"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["20"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "30"
                                player.goalsii.times ++
                        },
                },
                42: {
                        title(){
                                if (player.goalsii.tokens.best["31"].gt(0)) return "<h3 style='color: #13ACDF'>31</h3>"
                                return "<h3 style='color: #C03000'>31</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["31"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: *" + format(getGoalChallengeReward("31"), 4) + " to<br>"
                                let c = "medal and base <b>E</b> gain"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["30"].gt(0) && player.goalsii.tokens.best["21"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "31"
                                player.goalsii.times ++
                        },
                },
                43: {
                        title(){
                                if (player.goalsii.tokens.best["32"].gt(0)) return "<h3 style='color: #13ACDF'>32</h3>"
                                return "<h3 style='color: #C03000'>32</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["32"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("32"), 4) + " to<br>"
                                let c = "<b>Director</b> base per <b>Director</b>"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["31"].gt(0) && player.goalsii.tokens.best["22"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "32"
                                player.goalsii.times ++
                        },
                },
                44: {
                        title(){
                                if (player.goalsii.tokens.best["33"].gt(0)) return "<h3 style='color: #13ACDF'>33</h3>"
                                return "<h3 style='color: #C03000'>33</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["33"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("33"), 2) + " to<br>"
                                let c = "<b>E</b> gain exp"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["32"].gt(0) && player.goalsii.tokens.best["23"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "33"
                                player.goalsii.times ++
                        },
                },
                45: {
                        title(){
                                if (player.goalsii.tokens.best["34"].gt(0)) return "<h3 style='color: #13ACDF'>34</h3>"
                                return "<h3 style='color: #C03000'>34</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["34"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: /" + format(getGoalChallengeReward("34")) + "<br>"
                                let c = "<b>East</b> cost and <b>Due</b> linear scaling"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["33"].gt(0) && player.goalsii.tokens.best["24"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "34"
                                player.goalsii.times ++
                        },
                },
                51: {
                        title(){
                                if (player.goalsii.tokens.best["40"].gt(0)) return "<h3 style='color: #13ACDF'>40</h3>"
                                return "<h3 style='color: #C03000'>40</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["40"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("40")) + "<br>"
                                let c = "free <b>Example</b> and <b>Database</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["30"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "40"
                                player.goalsii.times ++
                        },
                },
                52: {
                        title(){
                                if (player.goalsii.tokens.best["41"].gt(0)) return "<h3 style='color: #13ACDF'>41</h3>"
                                return "<h3 style='color: #C03000'>41</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["41"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: *" + format(getGoalChallengeReward("41")) + " to<br>"
                                let c = "medal gain and <b>Department</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["40"].gt(0) && player.goalsii.tokens.best["31"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "41"
                                player.goalsii.times ++
                        },
                },
                53: {
                        title(){
                                if (player.goalsii.tokens.best["42"].gt(0)) return "<h3 style='color: #13ACDF'>42</h3>"
                                return "<h3 style='color: #C03000'>42</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["42"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("42"), 4) + " to<br>"
                                let c = "<b>Omnipotent III</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["41"].gt(0) && player.goalsii.tokens.best["32"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "42"
                                player.goalsii.times ++
                        },
                },
                54: {
                        title(){
                                if (player.goalsii.tokens.best["43"].gt(0)) return "<h3 style='color: #13ACDF'>43</h3>"
                                return "<h3 style='color: #C03000'>43</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["43"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("43")) + "<br>"
                                let c = "free <b>Easy</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["42"].gt(0) && player.goalsii.tokens.best["33"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "43"
                                player.goalsii.times ++
                        },
                },
                55: {
                        title(){
                                if (player.goalsii.tokens.best["44"].gt(0)) return "<h3 style='color: #13ACDF'>44</h3>"
                                return "<h3 style='color: #C03000'>44</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["44"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("44")) + "<br>"
                                let c = "free <b>Enter</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["43"].gt(0) && player.goalsii.tokens.best["34"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "44"
                                player.goalsii.times ++
                        },
                },
        },
        milestones: {
                0: {
                        requirementDescription: "<b>άλφα (Alpha)</b><br>Requires: 1 Medal", 
                        effectDescription: "Autobuyers are 3x faster and buy 10x more",
                        done(){
                                return player.goalsii.points.gte(1)
                        },
                        unlocked(){
                                return true
                        },
                }, // hasMilestone("goalsii", 0)
                1: {
                        requirementDescription: "<b>βήτα (Beta)</b><br>Requires: 2 Medals", 
                        effectDescription: "You keep all autobuyers and they buy 10x more",
                        done(){
                                return player.goalsii.points.gte(2)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 0) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 1)
                2: {
                        requirementDescription: "<b>γάμμα (Gamma)</b><br>Requires: 3 Medals", 
                        effectDescription: "Automatically buy <b>A</b> upgrades, <b>A</b> buyables don't cost anything, and keep <b>Also</b>",
                        done(){
                                return player.goalsii.points.gte(3)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 1) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        toggles: [["goalsii", "autobuyA"]]
                }, // hasMilestone("goalsii", 2)
                3: {
                        requirementDescription: "<b>δέλτα (Delta)</b><br>Requires: 5 Medals", 
                        effectDescription: "Automatically buy <b>B</b> upgrades, <b>B</b> buyables don't cost anything, and keep <b>Buy</b>",
                        done(){
                                return player.goalsii.points.gte(5)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 2) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        toggles: [["goalsii", "autobuyB"]]
                }, // hasMilestone("goalsii", 3)
                4: {
                        requirementDescription: "<b>έψιλον (Epsilon)</b><br>Requires: 7 Medals", 
                        effectDescription: "Automatically buy <b>C</b> upgrades, <b>C</b> buyables don't cost anything, and keep <b>County</b>",
                        done(){
                                return player.goalsii.points.gte(7)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 3) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        toggles: [["goalsii", "autobuyC"]]
                }, // hasMilestone("goalsii", 4)
                5: {
                        requirementDescription: "<b>ζήτα (Zeta)</b><br>Requires: 11 Medals", 
                        effectDescription: "Automatically buy <b>D</b> upgrades, <b>D</b> buyables don't cost anything, and keep <b>Development</b>",
                        done(){
                                return player.goalsii.points.gte(11)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 4) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        toggles: [["goalsii", "autobuyD"]]
                }, // hasMilestone("goalsii", 5)
                6: {
                        requirementDescription: "<b>ήτα (Eta)</b><br>Requires: 15 Medals", 
                        effectDescription: "Automatically buy <b>E</b> upgrades, keep <b>Every</b>, and double Medal effect",
                        done(){
                                return player.goalsii.points.gte(15)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 5) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        toggles: [["goalsii", "autobuyE"]]
                }, // hasMilestone("goalsii", 6)
                7: {
                        requirementDescription: "<b>θήτα (Theta)</b><br>Requires: 22 Medals", 
                        effectDescription: "The first five <b>Goal</b> milestones require half as many goals to unlock",
                        done(){
                                return player.goalsii.points.gte(22)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 6) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 7)
                8: {
                        requirementDescription: "<b>ιώτα (Iota)</b><br>Requires: 1 11 Token", 
                        effectDescription: "The above autobuyers can bulk and unlock a <b>C</b> buyable and buyable autobuyers bulk is multiplied by medals",
                        done(){
                                return player.goalsii.tokens.best["11"].gte(1)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 8)
                9: {
                        requirementDescription: "<b>κάππα (Kappa)</b><br>Requires: 1 22 Token", 
                        effectDescription: "Remove the ability to <b>F</b> reset but gain 100% of Features on prestige per second",
                        done(){
                                return player.goalsii.tokens.best["22"].gte(1)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 8) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 9)
                10: {
                        requirementDescription: "<b>λάμβδα (Lambda)</b><br>Requires: 1 03 Token", 
                        effectDescription: "<b>Category</b> gives free <b>Conditions</b> and <b>Canada</b> levels",
                        done(){
                                return player.goalsii.tokens.best["03"].gte(1)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 9) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 10)
                11: {
                        requirementDescription: "<b>μυ (Mu)</b><br>Requires: 20 03 Tokens", 
                        effectDescription: "Per milestone squared add .01 to the <b>E</b> gain exponent and each milestone lets the buyable autobuyer buy 2x more",
                        done(){
                                return player.goalsii.tokens.best["03"].gte(20)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 10) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 11)
                12: {
                        requirementDescription: "<b>νυ (Nu)</b><br>Requires: 20 13 Tokens", 
                        effectDescription: "Upon completing a challenge you get tokens for all challenges to the left and above",
                        done(){
                                return player.goalsii.tokens.best["13"].gte(20)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 11) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 12)
                13: {
                        requirementDescription: "<b>ξι (Xi)</b><br>Requires: 3 23 Token", 
                        effectDescription: "Add one to the medal gain exponent (1 -> 2)",
                        done(){
                                return player.goalsii.tokens.best["23"].gte(3)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 12) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 13)
                14: {
                        requirementDescription: "<b>όμικρον (Omicron)</b><br>Requires: 20 31 Token", 
                        effectDescription(){
                                let a = "log10(10+medals) boosts base <b>F</b> gain, currently: "
                                return a + format(player.goalsii.points.plus(10).log10(), 4)
                        },
                        done(){
                                return player.goalsii.tokens.best["31"].gte(20)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 13) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 14)
                15: {
                        requirementDescription: "<b>πι (Pi)</b><br>Requires: 3 32 Tokens", 
                        effectDescription: "Unlock <b>Omnipotent III</b> which gives free levels to all <b>C</b> buyables",
                        done(){
                                return player.goalsii.tokens.best["32"].gte(3)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 14) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 15)
                16: {
                        requirementDescription: "<b>ρώ (Rho)</b><br>Requires: 20 32 Tokens", 
                        effectDescription: "Each milestone adds .1 to the <b>Omnipotent III</b> base and gives two free levels",
                        done(){
                                return player.goalsii.tokens.best["32"].gte(20)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 15) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 16)
                18: {
                        requirementDescription: "<b>σίγμα (Sigma)</b><br>Requires: 10 33 Tokens", 
                        effectDescription(){
                                let a = "Once per second, automatically complete <b>B</b> and <b>C</b> challenges if you have enough points and Goals^Goals multiply <b>E</b> gain, currently: "
                                let b = Math.max(1, player.ach.achievements.length)
                                return a + format(Decimal.pow(b, b))
                        },
                        done(){
                                return player.goalsii.tokens.best["33"].gte(10)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 16) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 18) 
                19: {
                        requirementDescription: "<b>ταυ (Tau)</b><br>Requires: 1 04 Tokens", 
                        effectDescription: "Unlock an <b>E</b> buyable and <b>Drive</b> gives free <b>Department</b> levels",
                        done(){
                                return player.goalsii.tokens.best["04"].gte(1)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 18) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 19) 
                20: {
                        requirementDescription: "<b>ύψιλον (Upsilon)</b><br>Requires: 4 04 Tokens", 
                        effectDescription: "Autobuy <b>E</b> buyables once per second and <b>Experience</b> gives free <b>Director</b> levels",
                        done(){
                                return player.goalsii.tokens.best["04"].gte(4)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 19) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 20) 
                21: {
                        requirementDescription: "<b>φι (Phi)</b><br>Requires: 16 04 Tokens", 
                        effectDescription: "Unlock a <b>D</b> buyable, remove <b>Drive</b>'s logarithimic softcap, and get a free <b>Experience</b> level",
                        done(){
                                return player.goalsii.tokens.best["04"].gte(16)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 20) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 21) 
                22: {
                        requirementDescription: "<b>χι (Chi)</b><br>Requires: 20 14 Tokens", 
                        effectDescription: "Unlock a <b>E</b> buyable, <b>Due</b> gives free <b>Drive</b> and <b>Director</b> levels, and remove <b>Experience</b> linear scaling",
                        done(){
                                return player.goalsii.tokens.best["14"].gte(20)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 21) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 22) 
                23: {
                        requirementDescription: "<b>ψι (Psi)</b><br>Requires: 50 24 Tokens", 
                        effectDescription: "<b>East</b> gives free <b>Experience</b> and <b>Due</b> levels, remove <b>East</b> linear scaling, and get a free <b>East</b> level per milestone",
                        done(){
                                return player.goalsii.tokens.best["24"].gte(50)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 22) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 23)
                24: {
                        requirementDescription: "<b>ωμέγα (Omega)</b><br>Requires: 10 34 Tokens", 
                        effectDescription: "Unlock a <b>E</b> and <b>D</b> buyable, <b>E</b> buyables cost nothing, each goal adds .002 to the <b>East</b> base, and unlock upgrades",
                        done(){
                                return player.goalsii.tokens.best["34"].gte(10)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 23) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 24)
                //https://en.wikipedia.org/wiki/Greek_alphabet
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Artin",
                        description: "<b>Example</b> gives free <b>East</b> levels and each upgrade adds .01 to the <b>East</b> base",
                        cost: new Decimal(6660),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return true || player.g.best.gt(0) || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 11)
                },
                12: {
                        title: "Bernard",
                        description: "<b>Example</b> gives free <b>Experience</b> levels and challenge 34 reward effects <b>Example</b>",
                        cost: new Decimal(3330),
                        currencyDisplayName: "<br><b style='color: #6600FF'>01</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "01"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 11)  || player.g.best.gt(0) || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 12)
                },
                13: {
                        title: "Cauchy",
                        description: "Each upgrade adds .02 to the <b>Example</b> base and .2 to the <b>F</b> gain exponent",
                        cost: new Decimal(5000),
                        currencyDisplayName: "<br><b style='color: #6600FF'>02</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "02"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 12) || player.g.best.gt(0) || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 13)
                },
                14: {
                        title: "Diophantine",
                        description: "Square <b>E</b> gain in challenge 4 and each upgrade adds 100 to the <b>D</b> gain exponent and base gain",
                        cost: new Decimal(2000),
                        currencyDisplayName: "<br><b style='color: #6600FF'>03</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "03"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 13) || player.g.best.gt(0) || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 14)
                },
                15: {
                        title: "Erdős",
                        description: "Upgrades make medals multiply <b>F</b> gain",
                        cost: new Decimal(1000),
                        currencyDisplayName: "<br><b style='color: #6600FF'>04</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "04"
                        },
                        effect(){
                                let base = player.goalsii.best.plus(1)
                                let exp = Math.sqrt(player.goalsii.upgrades.length) / 3
                                return Decimal.pow(base, exp) 
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 14) || player.g.best.gt(0) || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 15)
                },
                21: {
                        title: "Fermat",
                        description: "Each upgrade in this row unlocks an <b>E</b> buyable",
                        cost: new Decimal(20),
                        currencyDisplayName: "<br><b style='color: #6600FF'>42</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "42"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 15) || player.g.best.gt(0) || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 21)
                },
                22: {
                        title: "Gödel",
                        description: "Gain tokens and medals per second as if you prestiged",
                        cost: new Decimal(20),
                        currencyDisplayName: "<br><b style='color: #6600FF'>43</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "43"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 21) || player.g.best.gt(0) || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 22)
                },
                23: {
                        title: "Hilbert",
                        description: "Square medal effect and <b>Easy</b> gives free <b>Example</b> levels",
                        cost: new Decimal(1000),
                        currencyDisplayName: "<br><b style='color: #6600FF'>43</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "43"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 22) || player.g.best.gt(0) || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 23)
                },
                24: {
                        title: "Iwasawa",
                        description: "Per upgrade, gain 1.1x medals and gain 1.25^upgrades more <b>F</b> in challenge 4",
                        cost: new Decimal(500),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasMilestone("g", "4") || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 24)
                },
                25: {
                        title: "Jacobsin",
                        description: "Start with 1e5 medals",
                        cost: new Decimal(1e3),
                        currencyDisplayName: "<br><b style='color: #6600FF'>44</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "44"
                        },
                        unlocked(){ 
                                return hasMilestone("g", "6") || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 25)
                },

                /*
                Kempe
                Laplace
                M
                Noether
                O
                Poison
                Russell
                Schrier
                Turing
                U
                Villiani
                Wiles
                Xi
                Yin
                Zhao
                */
                
        },
        tabFormat: {
                "Challenges": {
                        content: [
                                "main-display",
                                ["display-text", "This resets all prior Goals and all layers before and including F"],
                                ["display-text", "Click a button below to enter a challenge", function (){ return !player.goalsii.best.gt(0) ? {'display': 'none'} : {}}],
                                ["display-text", function() {
                                        return "You are currently in challenge <h3 style = 'color: #CC00FF'>" + player.goalsii.currentChallenge + "</h3>"
                                }],
                                ["display-text", function() {
                                        return getChallengeDepth(3) == 0 ? "" : "You have " + format(player.f.points) + " features"
                                }],
                                "prestige-button",
                                "clickables",
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Details": {
                        content: [
                                "main-display",
                                ["display-text", function() {
                                        return "You are currently in challenge <h3 style = 'color: #CC00FF'>" + player.goalsii.currentChallenge + "</h3>"
                                }],
                                ["display-text", function() {
                                        let a = "That means you have the following effects due to challenges: " 
                                        if (getChallengeDepth(1) == 0) return ""
                                        a += "<br>Prestige Gain: <h3 style = 'color: #CC00FF'>^" + format(Decimal.pow(.985, getChallengeDepth(1)), 4) + "</h3>"
                                        if (getChallengeDepth(2) == 0) return a
                                        a += ", Feature Gain: <h3 style = 'color: #CC00FF'>^" + format(Decimal.pow(.9, getChallengeDepth(2) + getChallengeDepth(4)), 4) + "</h3>"
                                        a += ", Point Gain: <h3 style = 'color: #CC00FF'>^" + format(Decimal.pow(.9, getChallengeDepth(2)), 4) + "</h3>"
                                        a += ", <br>Egg Gain: <h3 style = 'color: #CC00FF'>^" + format(Decimal.pow(.9, getChallengeDepth(2)).times(Decimal.pow(.8, getChallengeDepth(3))), 4) + "</h3>"
                                        if (getChallengeDepth(3) == 0) return a
                                        a += ",<br>First column buyables have no effect in the first <h3 style = 'color: #CC00FF'>" + formatWhole(Math.min(getChallengeDepth(3), 4)) + "</h3> layers"
                                        if (getChallengeDepth(4) == 0) return a
                                        a += ",<br>You get no extra buyables in the first <h3 style = 'color: #CC00FF'>" + formatWhole(getChallengeDepth(4)) + "</h3> layers"
                                        return a
                                }],
                                ["display-text", function(){
                                        let a = `<br><br>
                                        <h2 style = 'color: #CC0033'>Explanation</h2><h2>:</h2> <br><br>

                                        Each challenge has a reward, and upon claiming said reward<br>
                                        all prior unlocked main layers are totally reset, and goals are also reset<br>
                                        <br>
                                        There are 5 challenges, and the first is nothing<br>
                                        <br>
                                        Challenge AB means you are in Challenge A twice and Challenge B once<br>
                                        For example Challenge 03 means you are in challenge 0 twice and challenge 3 once<br>
                                        <br>
                                        The Challenge table is as follows:<br>
                                        00, 01, 02, 03, 04<br>
                                        10, 11, 12, 13, 14<br>
                                        20, 21, 22, 23, 24<br>
                                        30, 31, 32, 33, 34<br>
                                        40, 41, 42, 43, 44<br>
                                        <br>
                                        Each completion gives tokens<br>
                                        The following only applies to layers unlocked before Goals II<br>
                                        C0: Nothing<br>
                                        C1: Raise all prestige gains ^.985 + C0<br>
                                        C2: Raise point, Egg, and Feature gain ^.9 + C1<br>
                                        C3: First column buyables do not give effects in the first n layers<br> and raise <b>Egg</b> gain ^.8 + 2xC2<br>
                                        C4: No buyables give free levels to buyables in the first n layers<br> and raise <b>Feature</b> gain ^.9 + 3xC3<br>
                                        <br>
                                        You can only enter challenges if you can medal reset, or if you aren't in challenge 00,<br>
                                        and want to enter challenge 00 to avoid softlocking <br>
                                        To unlock the ability to enter a given challenge you need to have gotten<br> at least one token for the challenge
                                        to the left and above<br>
                                        <br><br>
                                        Complete a challenge by medal resetting, which requires <b>F</b> resetting at least once.<br>
                                        To get tokens in challenge 3 you need at least 1e19 Features.<br>
                                        <br>
                                        Completion of a challenge gives a token to that "upgrade" which gives an effect<br>
                                        You get tokens per reset based on Medals gained, with the base gain being 1
                                        <br><br><br><br>`
                                        return a
                                        },
                                ],
                        ],
                        unlocked(){
                                return player.goalsii.best.gt(0) || hasUnlockedPast("g") || layers.g.layerShown()
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                "milestones",
                        ],
                        unlocked(){
                                return player.goalsii.times > 1 || hasUnlockedPast("g") || layers.g.layerShown()
                        },
                },
                "Upgrades": {
                        content: [
                                "main-display",
                                ["display-text", function(){
                                        return "Upgrades require a certain number of tokens, but do not cost tokens"
                                        },
                                ],
                                "upgrades",
                        ],
                        unlocked(){
                                return hasMilestone("goalsii", 24) || hasUnlockedPast("g") || layers.g.layerShown()
                        },
                },
        },
        doReset(layer){
                if (["a","b","c","d","e","f","ach","goalsii"].includes(layer)) return

                let data = player.goalsii

                let init = hasUpgrade("goalsii", 25) ? 1e5: 0

                data.points   = new Decimal(init)
                data.best     = new Decimal(init)
                data.total    = new Decimal(init)
                data.bestOnce = new Decimal(0)
                if (!hasMilestone("g", 8)) data.currentChallenge = "00"
                data.times = 0
                let keep2 = []
                for (i = 0; i < Math.min(25, player.g.times); i++){
                        if (!hasMilestone("g", 5)) break
                        keep2.push([
                                11, 12, 13, 14, 15,
                                21, 22, 23, 24, 25,
                                31, 32, 33, 34, 35,
                                41, 42, 43, 44, 45,
                                51, 52, 53, 54, 55,
                        ][i])
                }
                if (!hasUpgrade("g", 14)) data.upgrades = filter(data.upgrades, keep2)
                let keep1 = []
                if (hasMilestone("g", 2)) {
                        let qw = Math.min(25, player.g.times * 3)
                        let all = [
                                 "0",  "1",  "2",  "3",  "4",  "5",  "6",  "7",  "8",  "9",
                                "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
                                "20", "21", "22", "23", "24"
                        ]
                        for (i = 0; i < qw; i ++){
                                keep1.push(all[i])
                        }
                }
                if (!hasUpgrade("g", 14)) data.milestones = filter(data.milestones, keep1)
                let remove1 = [
                        "11", "12", "13", "14", "15", "16", "17", 
                        "21", "22", "23", "24", "25", "26", "27", 
                        "31", "32", "33", "34", "35", "36", "37", 
                        "41", "42", "43", "44", "45", "46", "47", 
                        "51", "52", "53", "54", "55", "56", "57", 
                        "61", "62", "63", "64", "65", "66", "67", 
                        "71", "72", "73", "74", "75", "76", "77", 
                        "81", "82", "83", "84", "85", "86", "87", 
                        "91", "92", "93", "94", "95", "96", "97", 
                        "101","102","103","104","105","106","107", 
                        "111","112","113","114","115","116","117", 
                        "121","122","123"]
                player.ach.achievements = filterout(player.ach.achievements, remove1)
                player.ach.milestones = []
                player.f.bestc44 = new Decimal(0)
                player.ach.points = new Decimal(0)
                updateAchievements("ach")
                updateMilestones("ach")

                let k = ["a", "b", "c", "d", "e", "f"]
                for (abcd in k){
                        i = k[abcd]
                        z = player[i].challenges
                        if (z == undefined) continue
                        for (j in z){
                                z[j] = 0
                        }
                }

                if (hasMilestone("g", 8)) return
                if (hasUpgrade("g", 14)) return

                let a = {}
                let b = {}
                let c = {}
                let e = {}
                let l = ["00", "01", "02", "03", "04",
                         "10", "11", "12", "13", "14",
                         "20", "21", "22", "23", "24",
                         "30", "31", "32", "33", "34",
                         "40", "41", "42", "43", "44",
                        ]
                let initTokens = hasMilestone("g", 7) ? 1 : 0
                for (j in l){
                        i = l[j]
                        a[i] = new Decimal(initTokens)
                        b[i] = new Decimal(initTokens)
                        c[i] = new Decimal(initTokens)
                        e[i] = new Decimal(initTokens)
                }

                data.tokens = {
                                points: a,
                                best: b,
                                total: c,
                                copy: e,
                        }
        },
        getTokenToMedalGain(gain){
                if (getChallengeDepth(3) > 0 && player.f.best.lt(1e19)) return new Decimal(0)
                return gain.times(2).pow(.75).floor()
        },
        getAllPrior(chall){
                if (chall == undefined) chall = player.goalsii.currentChallenge
                let a = Number(chall.slice(0,1))
                let b = Number(chall.slice(1,2))
                let l = []
                for (i = 0; i <= a; i ++){
                        for (j = 0; j <= b; j ++){
                                l.push(String(i)+String(j)) 
                        }
                }
                return l
        },
        onPrestige(gain){
                gain = this.getTokenToMedalGain(gain)
                let data = player.goalsii.tokens
                let chall = player.goalsii.currentChallenge
                let toAdd = [chall]
                if (hasMilestone("goalsii", 12)) toAdd = this.getAllPrior()

                for (i in toAdd) {
                        c = toAdd[i]
                        data.points[c] = data.points[c].plus(gain)
                        data.total[c]  = data.total[c].plus(gain)
                }
        },
})

addLayer("g", {
        name: "Games", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { 
                let l = [11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44,51,52,53,54]
                let b = {}
                for (j in l){
                        b[l[j]] = new Decimal(0)
                }
                
                return {
                        unlocked: true,
                        points: new Decimal(0),
                        best: new Decimal(0),
                        total: new Decimal(0),
                        abtime: 0,
                        time: 0,
                        times: 0,
                        autotimes: 0,
                        clickableAmounts: b,
                        charges: new Decimal(3),
                        chargesMax: new Decimal(10),
                        chargesTime: 0,
                        partialTally: 0,
                        completedTally: 0,
                        rebirths: {
                                1: 0,
                                2: 0,
                                3: 0,
                                4: 0,
                                5: 0,
                        },
                        autodev: false,
                        autotime: 0,
                }
        },
        color: "#996600",
        branches: ["f"],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Games", // Name of prestige currency
        baseResource: "Features", // Name of resource prestige is based on
        baseAmount() {
                if (hasUpgrade("f", 11)) return player.f.best
                return player.f.bestc44.floor()
        }, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let a = pts.div(div)
                if (a.lt(1)) return new Decimal(0)
                if (pts.lt(1e19)) return new Decimal(0)

                let ret = a.log10().times(pre).pow(exp).times(pst)

                if (!hasUnlockedPast("g") && player.g.best.eq(0)) ret = ret.min(1)

                ret = doPrestigeGainChange(ret, "g")

                return ret.floor()
        },
        getBaseDiv(){
                let x = new Decimal(1e9)
                return x
        },
        getGainExp(){
                let x = new Decimal(1.5)
                if (hasMilestone("g", 10)) x = x.plus(player.g.partialTally.times(.01))
                x = x.plus(layers.g.clickables.getAllPartialEffects()["G Gain exponent"][0])
                if (hasUpgrade("f", 24)) x = x.plus(player.f.upgrades.length ** 2)
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1/10)
                if (hasMilestone("g", 15)) x = x.times(2)
                x = x.times(layers.g.clickables.getAllPartialEffects()["Base G Gain"][0])
                x = x.times(layers.g.clickables.getRebirthEffects()["Base G Gain"][0])
                x = x.times(layers.g.clickables.getAllCompletedEffects()["Base G Gain"][0])
                if (hasMilestone("g", 20)) x = x.times(3)
                if (hasUpgrade("f", 15)) x = x.times(1.15)
                if (hasUpgrade("f", 31)) x = x.times(Decimal.pow(1.01, player.f.upgrades.length))
                if (hasUpgrade("f", 44)) x = x.times(Decimal.pow(1.001, player.f.upgrades.length ** 2))
                if (hasUpgrade("f", 35)) x = x.times(player.ach.points.max(1))
                if (hasUpgrade("g", 13)) x = x.times(Decimal.pow(2, player.g.upgrades.length))
                if (hasUpgrade("d", 52)) x = x.times(Decimal.pow(1.01, player.d.upgrades.length))
                if (hasUpgrade("e", 31)) {
                        let a = player.e.upgrades.length
                        if (hasUpgrade("e", 33)) a *= 2
                        if (hasUpgrade("e", 34)) a *= 2
                        x = x.times(Decimal.pow(1.1, a))
                }
                x = x.times(getBuyableEffect("e", 33))
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)

                let yet = false
                for (let i = 0; i < LAYERS.length; i++){
                        if (layers[LAYERS[i]].row == "side") continue
                        if (yet) x = x.times(tmp[LAYERS[i]].effect)
                        if (LAYERS[i] == "g") yet = true
                }

                x = x.times(layers.g.clickables.getAllPartialEffects()["Games"][0])
                x = x.times(layers.g.clickables.getAllCompletedEffects()["Games"][0])
                x = x.times(layers.g.clickables.getRebirthEffects()["Games"][0])
                if (hasMilestone("g", 13)) x = x.times(Math.sqrt(Math.max(player.g.charges, 1)))

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("g")) return new Decimal(1)

                let amt = player.g.best

                let exp = 3
                if (hasMilestone("g", 14)) exp *= 2
                if (hasUpgrade("d", 54)) exp += .1

                let ret = amt.times(4).plus(1).pow(exp)

                //ret = softcap(ret, "g_eff")

                return ret
        },
        effectDescription(){
                let eff = this.effect()
                let a = "which buffs point and all previous prestige gain by "

                return a + format(eff) + "."
        },
        getMaxCharges(){
                let ret = new Decimal(10)
                if (hasMilestone("g", 11)) ret = ret.plus(90)
                ret = ret.plus(layers.g.clickables.getAllPartialEffects()["Max Charges"][0])
                if (hasMilestone("g", 18)) ret = ret.times(3)
                if (hasMilestone("g", 21)) ret = ret.times(6)
                if (hasMilestone("g", 23)){
                        ret = ret.times(Decimal.pow(2, layers.g.clickables.getPrimaryRebirths()))
                }
                if (hasUpgrade("g", 12)) ret = Decimal.pow(ret, 1.3)
                return ret.floor()
        },
        update(diff){
                let data = player.g

                data.best = data.best.max(data.points)
                if (hasMilestone("g", 9)) {
                        let gain = this.getResetGain()
                        data.points = data.points.plus(gain.times(diff))
                        data.total = data.total.plus(gain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (false) {
                        data.abtime += diff
                        if (data.abtime > 10) data.abtime = 10
                } else {
                        data.abtime = 0
                }
                let cpm = layers.g.clickables.getChargesPerMinute()
                if (cpm > 0 && data.charges.lt(data.chargesMax)) {
                        data.chargesTime += diff
                        let a = data.chargesTime > Decimal.div(60, cpm)
                        let b = cpm.gt(1e10)
                        if (a || b)  {
                                let x = cpm.times(data.chargesTime/60).floor()
                                if (!b) {
                                        data.chargesTime += Decimal.div(x, cpm).times(-60).toNumber()
                                } else {
                                        data.chargesTime = 0
                                }
                                data.charges = data.charges.plus(x)
                                if (data.charges.gt(data.chargesMax)) data.charges = data.chargesMax
                        }
                } else {
                        data.chargesTime = 0
                }

                let rb = layers.g.clickables.getPrimaryRebirths()

                data.completedTally = Decimal.times(16, rb)
                
                data.partialTally = Decimal.times(160, rb * (rb+1) / 2)
                for (i in data.clickableAmounts){
                        if (["11","12","13","14"].includes(i)) continue
                        j = data.clickableAmounts[i]
                        if (j.eq(layers.g.clickables.getCompletionsReq())) {
                                data.completedTally = data.completedTally.plus(1)
                        }
                        data.partialTally = data.partialTally.plus(j)
                }

                data.chargesMax = this.getMaxCharges()

                if (hasMilestone("g", 19) && data.autodev){
                        data.autotime += diff
                        if (data.autotime > 10) data.autotime = 10
                        if (data.autotime > 1){
                                data.autotime += -1
                                //layers.g.clickables[id].onClick(true)
                                let l = [21, 22, 23, 24,
                                         31, 32, 33, 34,
                                         41, 42, 43, 44,
                                         51, 52, 53, 54,]

                                if (hasUpgrade("f", 34)) l.push(11,12,13,14)

                                for (j in l){
                                        i = layers.g.clickables[l[j]]
                                        i.onClick(true)
                                }
                                if (hasUpgrade("f", 33)) layers.g.clickables[15].onClick()
                        }
                } else {
                        data.autotime = 0
                }

                

                data.time += diff
        },
        row: 6, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "g", description: "G: Reset for Games", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.goalsii.tokens.best["44"].gt(0) || player.g.best.gt(0) || hasUnlockedPast("g")},
        prestigeButtonText(){
                let gain= this.getResetGain()
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let nextnum = Decimal.pow(10, gain.plus(1).div(pst).root(exp).div(pre)).times(div).ceil()
                if (gain.eq(0)) nextnum = new Decimal(1e19)

                let nextAt = ""
                if (gain.lt(1e6) && (hasUnlockedPast("g") || player.g.best.neq(0))) {
                        nextAt = "<br>Next at " + format(nextnum) + " " + this.baseResource + (hasUpgrade("f", 11) ? "" : " in challenge 44")             
                        let ps = gain.div(player.g.time || 1)

                        if (ps.lt(10/3600)) nextAt += "<br>" + format(ps.times(3600)) + "/h"
                        else if (ps.lt(1000/60)) nextAt += "<br>" + format(ps.times(60)) + "/m"
                        else nextAt += "<br>" + format(ps) + "/s"
                }

                let a = "Reset for " + formatWhole(gain) + " " + this.resource

                return a + nextAt
        },
        canReset(){
                return this.getResetGain().gt(0) && player.g.time >= 2 && !hasMilestone("g", 9)
        },
        milestones: {
                1: {
                        requirementDescription: "<b>Get</b><br>Requires: 1 Games", 
                        effectDescription: "Raise all prior prestige gain ^1.001 and double medal gain",
                        done(){
                                return player.g.points.gte(1)
                        },
                        unlocked(){
                                return true
                        },
                }, // hasMilestone("g", 1)
                2: {
                        requirementDescription: "<b>Go</b><br>Requires: 2 Games", 
                        effectDescription: "Each <b>G</b> reset allows you to keep three medal milestones",
                        done(){
                                return player.g.points.gte(2)
                        },
                        unlocked(){
                                return hasMilestone("g", 1)
                        },
                }, // hasMilestone("g", 2)
                3: {
                        requirementDescription: "<b>Good</b><br>Requires: 3 Games", 
                        effectDescription: "Each <b>G</b> milestone multiplies medal gain by 1.5",
                        done(){
                                return player.g.points.gte(3)
                        },
                        unlocked(){
                                return hasMilestone("g", 2)
                        },
                }, // hasMilestone("g", 3)
                4: {
                        requirementDescription: "<b>Group</b><br>Requires: 4 Games", 
                        effectDescription: "Unlock a Medal upgrade and unlock a <b>D</b> buyable",
                        done(){
                                return player.g.points.gte(4)
                        },
                        unlocked(){
                                return hasMilestone("g", 3)
                        },
                }, // hasMilestone("g", 4)
                5: {
                        requirementDescription: "<b>General</b><br>Requires: 5 Games", 
                        effectDescription: "Each <b>G</b> reset allows you to keep one Medal upgrade",
                        done(){
                                return player.g.points.gte(5)
                        },
                        unlocked(){
                                return hasMilestone("g", 4)
                        },
                }, // hasMilestone("g", 5)
                6: {
                        requirementDescription: "<b>Great</b><br>Requires: 6 Games", 
                        effectDescription: "Unlock a Medal upgrade",
                        done(){
                                return player.g.points.gte(6)
                        },
                        unlocked(){
                                return hasMilestone("g", 5)
                        },
                }, // hasMilestone("g", 6)
                7: {
                        requirementDescription: "<b>Government</b><br>Requires: 10 Games", 
                        effectDescription: "Start with one of each token",
                        done(){
                                return player.g.points.gte(10)
                        },
                        unlocked(){
                                return hasMilestone("g", 6)
                        },
                }, // hasMilestone("g", 7)
                8: {
                        requirementDescription: "<b>Guide</b><br>Requires: 13 Games", 
                        effectDescription: "Game resetting no longer forces you into challenge 00, keep tokens, and unlock Games",
                        done(){
                                return player.g.points.gte(13)
                        },
                        unlocked(){
                                return hasMilestone("g", 7)
                        },
                }, // hasMilestone("g", 8)
                9: {
                        requirementDescription: "<b>Gallery</b><br>Requires: 40% Completion on Portal", 
                        effectDescription: "Remove the ability to prestige but gain 100% of Games on prestige per second",
                        done(){
                                return player.g.clickableAmounts[31].gte(4)
                        },
                        unlocked(){
                                return hasMilestone("g", 8)
                        },
                }, // hasMilestone("g", 9)
                10: {
                        requirementDescription: "<b>Going</b><br>Requires: 72 Successful devs", 
                        effectDescription: "Remove the medal gain softcap and each successful dev adds .01 to the <b>G</b> gain exponent",
                        done(){
                                return player.g.partialTally.gte(72)
                        },
                        unlocked(){
                                return hasMilestone("g", 9)
                        },
                }, // hasMilestone("g", 10)
                11: {
                        requirementDescription: "<b>Got</b><br>Requires: 77 Successful devs", 
                        effectDescription: "Your maximum charges is 100 and raise charge gain per minute ^1.2",
                        done(){
                                return player.g.partialTally.gte(77)
                        },
                        unlocked(){
                                return hasMilestone("g", 10)
                        },
                }, // hasMilestone("g", 11)
                12: {
                        requirementDescription: "<b>Give</b><br>Requires: 2 Completed games", 
                        effectDescription: "Raise charge gain per minute ^1.2 and hold shift to attempt buy 10 clickables",
                        done(){
                                return player.g.completedTally.gte(2)
                        },
                        unlocked(){
                                return hasMilestone("g", 11)
                        },
                }, // hasMilestone("g", 12)
                13: {
                        requirementDescription: "<b>Girls</b><br>Requires: 8 Completed games", 
                        effectDescription: "Raise charge gain per minute ^1.2 and sqrt(Charges) multiplies <b>G</b> gain",
                        done(){
                                return player.g.completedTally.gte(8)
                        },
                        unlocked(){
                                return hasMilestone("g", 12)
                        },
                }, // hasMilestone("g", 13)
                14: {
                        requirementDescription: "<b>Gift</b><br>Requires: 136 Successful devs", 
                        effectDescription: "Square <b>G</b> effect and double medal gain per milestone",
                        done(){
                                return player.g.partialTally.gte(136)
                        },
                        unlocked(){
                                return hasMilestone("g", 13)
                        },
                }, // hasMilestone("g", 14)
                15: {
                        requirementDescription: "<b>Groups</b><br>Requires: 138 Successful devs", 
                        effectDescription: "Unlock Game Rebirth and double base <b>G</b> gain",
                        done(){
                                return player.g.partialTally.gte(138)
                        },
                        unlocked(){
                                return hasMilestone("g", 14)
                        },
                }, // hasMilestone("g", 15)
                16: {
                        requirementDescription: "<b>Given</b><br>Requires: 300 Successful devs", 
                        effectDescription: "Raise charge gain ^1.1",
                        done(){
                                return player.g.partialTally.gte(300)
                        },
                        unlocked(){
                                return hasMilestone("g", 15)
                        },
                }, // hasMilestone("g", 16)
                17: {
                        requirementDescription: "<b>Garden</b><br>Requires: 400 Successful devs", 
                        effectDescription: "Raise charge gain ^1.1 and shift can bulk 10x more",
                        done(){
                                return player.g.partialTally.gte(400)
                        },
                        unlocked(){
                                return hasMilestone("g", 16)
                        },
                }, // hasMilestone("g", 17)
                18: {
                        requirementDescription: "<b>Green</b><br>Requires: 470 Successful devs", 
                        effectDescription: "Raise charge gain ^1.1, triple maximum charges, and attempting to dev a game no longer costs games",
                        done(){
                                return player.g.partialTally.gte(470)
                        },
                        unlocked(){
                                return hasMilestone("g", 17)
                        },
                }, // hasMilestone("g", 18)
                19: {
                        requirementDescription: "<b>Gold</b><br>Requires: 950 Successful devs", 
                        effectDescription: "Raise charge gain ^1.1 and be able to automatically attempt to bulk dev each game once per second",
                        done(){
                                return player.g.partialTally.gte(950)
                        },
                        unlocked(){
                                return hasMilestone("g", 18)
                        },
                        toggles: [["g", "autodev"]]
                }, // hasMilestone("g", 19)
                20: {
                        requirementDescription: "<b>Gifts</b><br>Requires: 1590 Successful devs", 
                        effectDescription: "Raise charge gain ^1.1 and triple base <b>G</b> gain and you can bulk 4x more",
                        done(){
                                return player.g.partialTally.gte(1590)
                        },
                        unlocked(){
                                return hasMilestone("g", 19)
                        },
                }, // hasMilestone("g", 20)
                21: {
                        requirementDescription: "<b>Getting</b><br>Requires: 4470 Successful devs", 
                        effectDescription: "Raise charge gain ^1.2 and 6x max charges",
                        done(){
                                return player.g.partialTally.gte(4470)
                        },
                        unlocked(){
                                return hasMilestone("g", 20)
                        },
                }, // hasMilestone("g", 21)
                22: {
                        requirementDescription: "<b>Global</b><br>Requires: 7 Rebirth I", 
                        effectDescription: "Raise charge gain ^1.1 and the first four games do not cost charges",
                        done(){
                                return player.g.rebirths[1] >= 7
                        },
                        unlocked(){
                                return hasMilestone("g", 21)
                        },
                }, // hasMilestone("g", 22)
                23: {
                        requirementDescription: "<b>Germany</b><br>Requires: 8 Rebirth I", 
                        effectDescription: "Raise charge gain ^1.1, deving costs 10x less charges, and each Rebith doubles max charges",
                        done(){
                                return player.g.rebirths[1] >= 8
                        },
                        unlocked(){
                                return hasMilestone("g", 22)
                        },
                }, // hasMilestone("g", 23)
                
        },
        clickables: {
                rows: 5,
                cols: 5,
                getChargesPerMinuteExp(){
                        let exp = 1
                        if (hasMilestone("g", 11)) exp *= 1.2
                        if (hasMilestone("g", 12)) exp *= 1.2
                        if (hasMilestone("g", 13)) exp *= 1.2
                        if (hasMilestone("g", 16)) exp *= 1.1
                        if (hasMilestone("g", 17)) exp *= 1.1
                        if (hasMilestone("g", 18)) exp *= 1.1
                        if (hasMilestone("g", 19)) exp *= 1.1
                        if (hasMilestone("g", 20)) exp *= 1.1
                        if (hasMilestone("g", 21)) exp *= 1.2
                        if (hasMilestone("g", 22)) exp *= 1.1
                        if (hasMilestone("g", 23)) exp *= 1.1
                        if (hasUpgrade("f", 22))   exp *= 1.1
                        if (hasUpgrade("f", 23))   exp *= 1.1
                        if (hasUpgrade("f", 41))   exp *= 1.1
                        if (hasUpgrade("d", 53))   exp *= 1.1
                        if (hasUpgrade("d", 55))   exp *= 1.1
                        if (hasUpgrade("e", 41))   exp *= 1.1
                        if (hasUpgrade("e", 44))   exp *= 1.1
                        if (hasUpgrade("e", 45))   exp *= 1.1
                        return exp
                },
                getChargesPerMinute(){
                        let data = player.g.clickableAmounts
                        let a = data[11].plus(data[12])
                        let b = data[13].plus(data[14])
                        let ret = a.plus(b)
                        let exp = this.getChargesPerMinuteExp()
                        return Decimal.pow(ret, exp)
                },
                getGlobalChanceFactor(){
                        let ret = 1
                        return ret
                },
                succChance(x, change = 1){
                        let div = layers.g.clickables.getCompletionsReq()
                        return Decimal.minus(1, x.div(div)).pow(2).times(change).times(this.getGlobalChanceFactor())
                },
                getEffectivePartialDevs(){
                        let arg = new Decimal(player.g.partialTally)
                        if (arg == undefined) arg = new Decimal(0)
                        arg = arg.plus(getBuyableEffect("d", 33))
                        return arg
                },
                getAllPartialEffects(){
                        let names = ["Features", "Games", "Medals", "Max Charges", "G Gain exponent", "Base G Gain"]
                        let symbols = ["*", "*", "*", "+", "+", "*"]
                        let functions = [
                                function(x){
                                        let ret = Decimal.pow(x.plus(1), x.sqrt())

                                        if (ret.gt(1e100) && !hasUpgrade("f", 12)) ret = ret.log10().pow(50)

                                        if (hasUpgrade("e", 42)) ret = ret.pow(20)
                                        
                                        return ret
                                },
                                function(x){
                                        if (x.lte(4)) return new Decimal(1)
                                        let exp = Math.max(.5, Math.min(1.5, x.div(30).toNumber()))
                                        if (x.gte(129)) {
                                                let j = x.div(100)
                                                if (j.gt(256)) j = j.sqrt().times(16)
                                                exp = Decimal.times(exp, j)
                                        }
                                        let ret = x.div(2).pow(exp)
                                        
                                        if (ret.gt(1e10) && !hasUpgrade("f", 14)) ret = ret.log10().pow(10)
                                        return ret
                                },
                                function(x){
                                        if (x.lte(80)) return new Decimal(1)
                                        let exp = x.sqrt().div(3)
                                        let ret = x.pow(exp)
                                        
                                        if (ret.gt(1e10) && !hasUpgrade("f", 13)) ret = ret.log10().pow(10)
                                        return ret
                                },
                                function(x){
                                        if (x.lte(108)) return new Decimal(0)
                                        let ret = x.minus(50).sqrt().times(20)
                                        if (ret.gt(200))  ret = ret.div(1e2).pow(2).times(1e2)
                                        if (ret.gt(15e2)) ret = ret.div(5e2).pow(2).times(5e2)
                                        if (ret.gt(75e3)) ret = ret.div(5e4).pow(2).times(5e4)

                                        if (hasUpgrade("e", 43)) ret = ret.pow(2)

                                        return ret.floor()
                                },
                                function(x){
                                        if (x.lte(110)) return new Decimal(0)
                                        let ret = x.minus(102).sqrt().div(3)
                                        
                                        if (ret.gt(10) && !hasUpgrade("f", 32)) ret = ret.log10().times(10)
                                        return ret
                                },
                                function(x){
                                        if (x.lte(144)) return new Decimal(1)
                                        let exp = x.div(100)
                                        if (exp.gt(2)) exp = exp.div(2).log10().plus(2)
                                        let ret = x.log10().pow(exp)
                                        
                                        return ret
                                }
                        ]
                        let ret = {}
                        let arg = this.getEffectivePartialDevs()
                        for (i in names){
                                let v = functions[i](arg)
                                ret[names[i]] = [v, symbols[i], v.neq(functions[i](new Decimal(0)))]
                        }
                        return ret
                },
                getEffectiveCompletedDevs(){
                        let arg = new Decimal(player.g.completedTally)
                        if (arg == undefined) arg = new Decimal(0)
                        arg = arg.plus(layers.g.clickables.getRebirthEffects()["Effective Completed Games"][0])
                        return arg
                },
                getAllCompletedEffects(){
                        let names = ["Features", "Games", "Base G Gain"]
                        let symbols = ["*", "*", "*"]
                        let functions = [
                                function(x){
                                        return Decimal.pow(x.plus(4), x.sqrt().times(4))
                                },
                                function(x){
                                        if (x.lte(6)) return new Decimal(1)
                                        let exp = x.sqrt()
                                        if (x.gte(10)) exp = exp.times(2)
                                        if (x.gte(96)) exp = exp.times(1.25)
                                        let ret = x.div(6).pow(exp)
                                        return ret
                                },
                                function(x){
                                        if (!hasUpgrade("e", 32)) return new Decimal(1)
                                        if (x.lt(100)) return new Decimal(1)
                                        let base = x.div(100)
                                        let exp = x.pow(.2).div(4)
                                        let ret = Decimal.pow(base, exp)
                                        return ret
                                },
                        ]
                        let ret = {}
                        let arg = this.getEffectiveCompletedDevs()
                        
                        for (i in names){
                                let v = functions[i](arg)
                                ret[names[i]] = [v, symbols[i], v.neq(functions[i](new Decimal(0)))]
                        }
                        return ret
                },
                getEffectiveRebirths(){
                        let arg = new Decimal(layers.g.clickables.getPrimaryRebirths())
                        if (arg == undefined) arg = new Decimal(0)
                        if (hasUpgrade("g", 11)) arg = arg.plus(player.g.upgrades.length)
                        if (hasUpgrade("e", 35)) arg = arg.plus(1)
                        return arg
                },
                getRebirthEffects(){
                        let names = ["Games", "Manual Bulk", "Base G Gain", "F gain exponent", "Base F gain", "Medals", "Effective Completed Games"]
                        let symbols = ["*", "*", "*", "+", "*", "*", "+"]
                        let functions = [
                                function(x){
                                        if (x.lte(2)) return new Decimal(1)
                                        let exp = x.times(3).sqrt()
                                        let base = new Decimal(100)
                                        if (x.gte(5)) base = base.times(x)
                                        if (x.gte(7)) base = base.times(x.pow(.6))
                                        let ret = Decimal.pow(base, exp)
                                        return ret
                                },
                                function(x){
                                        if (x.lte(8)) return new Decimal(1)
                                        let base = x.sqrt()
                                        let exp = x.sqrt()
                                        return Decimal.pow(base, exp)
                                },
                                function(x){
                                        if (!hasUpgrade("f", 21)) return new Decimal(1)
                                        if (x.eq(0)) return new Decimal(1)
                                        let ret = x
                                        if (hasUpgrade("f", 23)) ret = ret.pow(1.5)
                                        return ret
                                },
                                function(x){
                                        if (!hasUpgrade("f", 22)) return new Decimal(0)
                                        if (x.eq(0)) return new Decimal(0)
                                        let ret = x.pow(.75).times(5)
                                        return ret
                                },
                                function(x){
                                        if (!hasUpgrade("f", 23)) return new Decimal(1)
                                        if (x.eq(0)) return new Decimal(1)
                                        let ret = x.pow(x)
                                        return ret
                                },
                                function(x){
                                        if (!hasUpgrade("f", 24)) return new Decimal(1)
                                        if (x.eq(0)) return new Decimal(1)
                                        let ret = x.pow(x.pow(1.1))
                                        return ret
                                },
                                function(x){
                                        if (!hasUpgrade("f", 25)) return new Decimal(0)
                                        if (x.eq(0)) return new Decimal(0)
                                        let ret = x.pow(1.5)
                                        return ret
                                },
                        ]
                        let ret = {}
                        let arg = this.getEffectiveRebirths()
                        for (i in names){
                                let v = functions[i](arg)
                                ret[names[i]] = [v, symbols[i], v.neq(functions[i](new Decimal(0)))]
                        }
                        return ret
                },
                getAttemptAmount(force = false){
                        let ret = new Decimal(1)
                        if (!shiftDown && !force) return ret
                        if (hasMilestone("g", 12)) ret = ret.times(10)
                        if (hasMilestone("g", 17)) ret = ret.times(10)
                        if (hasMilestone("g", 20)) ret = ret.times(4)
                        ret = ret.times(layers.g.clickables.getRebirthEffects()["Manual Bulk"][0])
                        return ret 
                },
                getPrimaryRebirths(){
                        let data = player.g.rebirths
                        return data[1] + 10 * data[2] + 100 * data[3] + 1e3 * data[4] + 1e4 * data[5] 
                },// layers.g.clickables.getPrimaryRebirths()
                getRebirthExp2(a){
                        let r = a || this.getPrimaryRebirths()
                        let exp2 = 1.45
                        if (r >= 9) exp2 += .005 * Math.min(r - 8, 10)
                        if (r >= 14) exp2 += .014 * Math.min(r - 13, 5) ** 2
                        if (r >= 22) exp2 += .01 * (r - 21)
                        return exp2
                },
                getRebirthCostIncrease(){
                        let r = this.getPrimaryRebirths()
                        let exp2 = this.getRebirthExp2(r)
                        let exp = Decimal.pow(r, exp2)
                        return Decimal.pow(1e18, exp)
                },  // layers.g.clickables.getRebirthCostIncrease()
                getCompletionsReq(){
                        let ret = 10 + 10 * this.getPrimaryRebirths()
                        return ret
                }, // layers.g.clickables.getCompletionsReq()
                getChargeComsumption(){
                        let rb = this.getPrimaryRebirths()
                        let ret = Decimal.pow(10, Decimal.pow(rb, .8))
                        if (hasMilestone("g", 23)) ret = ret.div(10)
                        return ret.floor()
                }, // layers.g.clickables.getChargeComsumption()
                11: {
                        title(){
                                return "<h3 style='color: #903000'>Tetris</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Cost</h3>: " + formatWhole(this.cost()) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Gives</h3>: " + formatWhole(player.g.clickableAmounts[11]) + " charges per minute"
                                let c = ""
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        cost(){
                                return Decimal.pow(2, player.g.clickableAmounts[11]).times(10)
                        },
                        canClick(){
                                return player.g.points.gte(this.cost()) && (player.g.charges.gte(1) || hasMilestone("g", 22))
                        },
                        onClick(force = false){
                                for (let i = 0; i < layers.g.clickables.getAttemptAmount(force).toNumber(); i++){
                                        if (!this.canClick()) return 
                                        let cost = this.cost()
                                        if (!hasMilestone("g", 22)) player.g.charges = player.g.charges.minus(1)
                                        player.g.clickableAmounts[11] = player.g.clickableAmounts[11].plus(1)
                                        player.g.points = player.g.points.minus(cost).max(0)
                                }
                        },
                },
                12: {
                        title(){
                                return "<h3 style='color: #903000'>Pac-man</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Cost</h3>: " + format(this.cost()) + " Medals<br>"
                                let b = "<h3 style='color: #00CC66'>Gives</h3>: " + formatWhole(player.g.clickableAmounts[12]) + " charges per minute"
                                let c = ""
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        cost(){
                                return Decimal.pow(10, player.g.clickableAmounts[12].pow(2)).times(1e8)
                        },
                        canClick(){
                                return player.goalsii.points.gte(this.cost()) && (player.g.charges.gte(1) || hasMilestone("g", 22))
                        },
                        onClick(force = false){
                                for (let i = 0; i < layers.g.clickables.getAttemptAmount(force).toNumber(); i++){
                                        if (!this.canClick()) return 
                                        let cost = this.cost()
                                        if (!hasMilestone("g", 22)) player.g.charges = player.g.charges.minus(1)
                                        player.g.clickableAmounts[12] = player.g.clickableAmounts[12].plus(1)
                                        player.goalsii.points = player.goalsii.points.minus(cost).max(0)
                                }
                        },
                },
                13: {
                        title(){
                                return "<h3 style='color: #903000'>Asteroids</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Requires</h3>: " + formatWhole(this.cost()) + " Goals<br>"
                                let b = "<h3 style='color: #00CC66'>Gives</h3>: " + formatWhole(player.g.clickableAmounts[13]) + " charges per minute"
                                let c = ""
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        cost(){
                                return 82 + player.g.clickableAmounts[13].sqrt().times(3).floor().toNumber()
                        },
                        canClick(){
                                return player.ach.points.gte(this.cost()) && (player.g.charges.gte(1) || hasMilestone("g", 22))
                        },
                        onClick(force = false){
                                for (let i = 0; i < layers.g.clickables.getAttemptAmount(force).toNumber(); i++){
                                        if (!this.canClick()) return 
                                        let cost = this.cost()
                                        if (!hasMilestone("g", 22)) player.g.charges = player.g.charges.minus(1)
                                        player.g.clickableAmounts[13] = player.g.clickableAmounts[13].plus(1)
                                }
                        },
                },
                14: {
                        title(){
                                return "<h3 style='color: #903000'>Half life</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + format(this.cost()) + " Features<br>"
                                let b = "<h3 style='color: #00CC66'>Gives</h3>: " + formatWhole(player.g.clickableAmounts[14]) + " charges per minute"
                                let c = ""
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        cost(){
                                return Decimal.pow(1e10, player.g.clickableAmounts[14].pow(1.5)).times("1e1900")
                        },
                        canClick(){
                                return player.f.points.gte(this.cost()) && (player.g.charges.gte(1) || hasMilestone("g", 22))
                        },
                        onClick(force = false){
                                for (let i = 0; i < layers.g.clickables.getAttemptAmount(force).toNumber(); i++){
                                        if (!this.canClick()) return 
                                        let cost = this.cost()
                                        if (!hasMilestone("g", 22)) player.g.charges = player.g.charges.minus(1)
                                        player.g.clickableAmounts[14] = player.g.clickableAmounts[14].plus(1)
                                        player.f.points = player.f.points.sub(cost).max(0)
                                }
                        },
                },
                21: {
                        title(){
                                return "<h3 style='color: #903000'>Quake</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(this.cost()) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[21].times(100).div(layers.g.clickables.getCompletionsReq())) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[21]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let a = player.g.clickableAmounts[11].gt(0) && player.g.clickableAmounts[12].gt(0) && player.g.clickableAmounts[13].gt(0) && player.g.clickableAmounts[14].gt(0)
                                let b = layers.g.clickables.getPrimaryRebirths() > 0
                                return a || b
                        },
                        cost(){
                                return player.g.clickableAmounts[21].plus(3).pow(2).div(4).times(layers.g.clickables.getRebirthCostIncrease()).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(layers.g.clickables.getChargeComsumption())
                                let c = player.g.clickableAmounts[21].lt(layers.g.clickables.getCompletionsReq())
                                return a && b && c
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 21

                                while (b < 1000){
                                        b ++ 
                                        if (b > 990) console.log(b)
                                        if (!this.canClick()) break 
                                        let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                        let cc = layers.g.clickables.getChargeComsumption()
                                        let cost = this.cost()

                                        let times = getTimesRequired(chance)
                                        // the random chance factor
                                        let maxCharges = data.charges.div(cc).floor()
                                        // max num at current charges
                                        let maxGames = data.points.div(cost).floor()
                                        //max num at current games

                                        let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                        //max num overall
                                        
                                        remaining = remaining.minus(target) //how many bulks left
                                        if (!hasMilestone("g", 18)) {
                                                data.points = data.points.sub(cost.times(target)).max(0)
                                        } // remove games
                                        data.charges = data.charges.minus(cc.times(target))
                                        //remove charges

                                        if (target != times) break
                                        //didnt do it enough times
                                        
                                        //if did do enough, add one
                                        data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                }
                        },
                },
                22: {
                        title(){
                                return "<h3 style='color: #903000'>Minecraft</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(this.cost()) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[22].times(100).div(layers.g.clickables.getCompletionsReq())) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[22]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let a = player.g.clickableAmounts[11].gt(0) && player.g.clickableAmounts[12].gt(0) && player.g.clickableAmounts[13].gt(0) && player.g.clickableAmounts[14].gt(0)
                                let b = layers.g.clickables.getPrimaryRebirths() > 0
                                return a || b                        },
                        cost(){
                                return player.g.clickableAmounts[22].plus(3).pow(2).div(4).times(layers.g.clickables.getRebirthCostIncrease()).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(layers.g.clickables.getChargeComsumption())
                                let c = player.g.clickableAmounts[22].lt(layers.g.clickables.getCompletionsReq())
                                return a && b && c
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 22

                                while (b < 1000){
                                        b ++ 
                                        if (b > 990) console.log(b)
                                        if (!this.canClick()) break 
                                        let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                        let cc = layers.g.clickables.getChargeComsumption()
                                        let cost = this.cost()

                                        let times = getTimesRequired(chance)
                                        // the random chance factor
                                        let maxCharges = data.charges.div(cc).floor()
                                        // max num at current charges
                                        let maxGames = data.points.div(cost).floor()
                                        //max num at current games

                                        let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                        //max num overall
                                        
                                        remaining = remaining.minus(target) //how many bulks left
                                        if (!hasMilestone("g", 18)) {
                                                data.points = data.points.sub(cost.times(target)).max(0)
                                        } // remove games
                                        data.charges = data.charges.minus(cc.times(target))
                                        //remove charges

                                        if (target != times) break
                                        //didnt do it enough times
                                        
                                        //if did do enough, add one
                                        data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                }
                        },
                },
                23: {
                        title(){
                                return "<h3 style='color: #903000'>GTA V</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(this.cost()) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[23].times(100).div(layers.g.clickables.getCompletionsReq())) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[23]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let a = player.g.clickableAmounts[11].gt(0) && player.g.clickableAmounts[12].gt(0) && player.g.clickableAmounts[13].gt(0) && player.g.clickableAmounts[14].gt(0)
                                let b = layers.g.clickables.getPrimaryRebirths() > 0
                                return a || b   
                        },
                        cost(){
                                return player.g.clickableAmounts[23].plus(3).pow(2).div(4).times(layers.g.clickables.getRebirthCostIncrease()).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(layers.g.clickables.getChargeComsumption())
                                let c = player.g.clickableAmounts[23].lt(layers.g.clickables.getCompletionsReq())
                                return a && b && c
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 23

                                while (b < 1000){
                                        b ++ 
                                        if (b > 990) console.log(b)
                                        if (!this.canClick()) break 
                                        let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                        let cc = layers.g.clickables.getChargeComsumption()
                                        let cost = this.cost()

                                        let times = getTimesRequired(chance)
                                        // the random chance factor
                                        let maxCharges = data.charges.div(cc).floor()
                                        // max num at current charges
                                        let maxGames = data.points.div(cost).floor()
                                        //max num at current games

                                        let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                        //max num overall
                                        
                                        remaining = remaining.minus(target) //how many bulks left
                                        if (!hasMilestone("g", 18)) {
                                                data.points = data.points.sub(cost.times(target)).max(0)
                                        } // remove games
                                        data.charges = data.charges.minus(cc.times(target))
                                        //remove charges

                                        if (target != times) break
                                        //didnt do it enough times
                                        
                                        //if did do enough, add one
                                        data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                }
                        },
                },
                24: {
                        title(){
                                return "<h3 style='color: #903000'>FIFA</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(this.cost()) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[24].times(100).div(layers.g.clickables.getCompletionsReq())) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[24]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let a = player.g.clickableAmounts[11].gt(0) && player.g.clickableAmounts[12].gt(0) && player.g.clickableAmounts[13].gt(0) && player.g.clickableAmounts[14].gt(0)
                                let b = layers.g.clickables.getPrimaryRebirths() > 0
                                return a || b 
                        },
                        cost(){
                                return player.g.clickableAmounts[24].plus(3).pow(2).div(4).times(layers.g.clickables.getRebirthCostIncrease()).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(layers.g.clickables.getChargeComsumption())
                                let c = player.g.clickableAmounts[24].lt(layers.g.clickables.getCompletionsReq())
                                return a && b && c
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 24

                                while (b < 1000){
                                        b ++ 
                                        if (b > 990) console.log(b)
                                        if (!this.canClick()) break 
                                        let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                        let cc = layers.g.clickables.getChargeComsumption()
                                        let cost = this.cost()

                                        let times = getTimesRequired(chance)
                                        // the random chance factor
                                        let maxCharges = data.charges.div(cc).floor()
                                        // max num at current charges
                                        let maxGames = data.points.div(cost).floor()
                                        //max num at current games

                                        let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                        //max num overall
                                        
                                        remaining = remaining.minus(target) //how many bulks left
                                        if (!hasMilestone("g", 18)) {
                                                data.points = data.points.sub(cost.times(target)).max(0)
                                        } // remove games
                                        data.charges = data.charges.minus(cc.times(target))
                                        //remove charges

                                        if (target != times) break
                                        //didnt do it enough times
                                        
                                        //if did do enough, add one
                                        data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                }
                        },
                },
                31: {
                        title(){
                                return "<h3 style='color: #903000'>Portal</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(this.cost()) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[31].times(100).div(layers.g.clickables.getCompletionsReq())) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[31]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = layers.g.clickables.getPrimaryRebirths() > 0
                                let a = player.g.clickableAmounts[21].gt(0) && player.g.clickableAmounts[22].gt(0) && player.g.clickableAmounts[23].gt(0) && player.g.clickableAmounts[24].gt(0)
                                return a || b
                        },
                        cost(){
                                return player.g.clickableAmounts[31].plus(3).pow(3).div(4).times(layers.g.clickables.getRebirthCostIncrease()).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(layers.g.clickables.getChargeComsumption())
                                let c = player.g.clickableAmounts[31].lt(layers.g.clickables.getCompletionsReq())
                                return a && b && c
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 31

                                while (b < 1000){
                                        b ++ 
                                        if (b > 990) console.log(b)
                                        if (!this.canClick()) break 
                                        let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                        let cc = layers.g.clickables.getChargeComsumption()
                                        let cost = this.cost()

                                        let times = getTimesRequired(chance)
                                        // the random chance factor
                                        let maxCharges = data.charges.div(cc).floor()
                                        // max num at current charges
                                        let maxGames = data.points.div(cost).floor()
                                        //max num at current games

                                        let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                        //max num overall
                                        
                                        remaining = remaining.minus(target) //how many bulks left
                                        if (!hasMilestone("g", 18)) {
                                                data.points = data.points.sub(cost.times(target)).max(0)
                                        } // remove games
                                        data.charges = data.charges.minus(cc.times(target))
                                        //remove charges

                                        if (target != times) break
                                        //didnt do it enough times
                                        
                                        //if did do enough, add one
                                        data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                }
                        },
                },
                32: {
                        title(){
                                return "<h3 style='color: #903000'>Pokemon</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(this.cost()) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[32].times(100).div(layers.g.clickables.getCompletionsReq())) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[32]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = layers.g.clickables.getPrimaryRebirths() > 0
                                let a = player.g.clickableAmounts[21].gt(0) && player.g.clickableAmounts[22].gt(0) && player.g.clickableAmounts[23].gt(0) && player.g.clickableAmounts[24].gt(0)
                                return a || b
                        },
                        cost(){
                                return player.g.clickableAmounts[32].plus(3).pow(3).div(4).times(layers.g.clickables.getRebirthCostIncrease()).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(layers.g.clickables.getChargeComsumption())
                                let c = player.g.clickableAmounts[32].lt(layers.g.clickables.getCompletionsReq())
                                return a && b && c
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 32

                                while (b < 1000){
                                        b ++ 
                                        if (b > 990) console.log(b)
                                        if (!this.canClick()) break 
                                        let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                        let cc = layers.g.clickables.getChargeComsumption()
                                        let cost = this.cost()

                                        let times = getTimesRequired(chance)
                                        // the random chance factor
                                        let maxCharges = data.charges.div(cc).floor()
                                        // max num at current charges
                                        let maxGames = data.points.div(cost).floor()
                                        //max num at current games

                                        let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                        //max num overall
                                        
                                        remaining = remaining.minus(target) //how many bulks left
                                        if (!hasMilestone("g", 18)) {
                                                data.points = data.points.sub(cost.times(target)).max(0)
                                        } // remove games
                                        data.charges = data.charges.minus(cc.times(target))
                                        //remove charges

                                        if (target != times) break
                                        //didnt do it enough times
                                        
                                        //if did do enough, add one
                                        data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                }
                        },
                },
                33: {
                        title(){
                                return "<h3 style='color: #903000'>Diablo III</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(this.cost()) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[33].times(100).div(layers.g.clickables.getCompletionsReq())) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[33]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = layers.g.clickables.getPrimaryRebirths() > 0
                                let a = player.g.clickableAmounts[21].gt(0) && player.g.clickableAmounts[22].gt(0) && player.g.clickableAmounts[23].gt(0) && player.g.clickableAmounts[24].gt(0)
                                return a || b
                        },
                        cost(){
                                return player.g.clickableAmounts[33].plus(3).pow(3).div(4).times(layers.g.clickables.getRebirthCostIncrease()).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(layers.g.clickables.getChargeComsumption())
                                let c = player.g.clickableAmounts[33].lt(layers.g.clickables.getCompletionsReq())
                                return a && b && c
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 33

                                while (b < 1000){
                                        b ++ 
                                        if (b > 990) console.log(b)
                                        if (!this.canClick()) break 
                                        let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                        let cc = layers.g.clickables.getChargeComsumption()
                                        let cost = this.cost()

                                        let times = getTimesRequired(chance)
                                        // the random chance factor
                                        let maxCharges = data.charges.div(cc).floor()
                                        // max num at current charges
                                        let maxGames = data.points.div(cost).floor()
                                        //max num at current games

                                        let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                        //max num overall
                                        
                                        remaining = remaining.minus(target) //how many bulks left
                                        if (!hasMilestone("g", 18)) {
                                                data.points = data.points.sub(cost.times(target)).max(0)
                                        } // remove games
                                        data.charges = data.charges.minus(cc.times(target))
                                        //remove charges

                                        if (target != times) break
                                        //didnt do it enough times
                                        
                                        //if did do enough, add one
                                        data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                }
                        },
                },
                34: {
                        title(){
                                return "<h3 style='color: #903000'>Terraria</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(this.cost()) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[34].times(100).div(layers.g.clickables.getCompletionsReq())) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[34]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = layers.g.clickables.getPrimaryRebirths() > 0
                                let a = player.g.clickableAmounts[21].gt(0) && player.g.clickableAmounts[22].gt(0) && player.g.clickableAmounts[23].gt(0) && player.g.clickableAmounts[24].gt(0)
                                return a || b
                        },
                        cost(){
                                return player.g.clickableAmounts[34].plus(3).pow(3).div(4).times(layers.g.clickables.getRebirthCostIncrease()).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(layers.g.clickables.getChargeComsumption())
                                let c = player.g.clickableAmounts[34].lt(layers.g.clickables.getCompletionsReq())
                                return a && b && c
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 34

                                while (b < 1000){
                                        b ++ 
                                        if (b > 990) console.log(b)
                                        if (!this.canClick()) break 
                                        let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                        let cc = layers.g.clickables.getChargeComsumption()
                                        let cost = this.cost()

                                        let times = getTimesRequired(chance)
                                        // the random chance factor
                                        let maxCharges = data.charges.div(cc).floor()
                                        // max num at current charges
                                        let maxGames = data.points.div(cost).floor()
                                        //max num at current games

                                        let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                        //max num overall
                                        
                                        remaining = remaining.minus(target) //how many bulks left
                                        if (!hasMilestone("g", 18)) {
                                                data.points = data.points.sub(cost.times(target)).max(0)
                                        } // remove games
                                        data.charges = data.charges.minus(cc.times(target))
                                        //remove charges

                                        if (target != times) break
                                        //didnt do it enough times
                                        
                                        //if did do enough, add one
                                        data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                }
                        },
                },
                41: {
                        title(){
                                return "<h3 style='color: #903000'>Roblox</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(this.cost()) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[41].times(100).div(layers.g.clickables.getCompletionsReq())) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[41]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = layers.g.clickables.getPrimaryRebirths() > 0
                                let a = player.g.clickableAmounts[31].gt(6) && player.g.clickableAmounts[32].gt(6) && player.g.clickableAmounts[33].gt(6) && player.g.clickableAmounts[34].gt(6)
                                return a || b
                        },
                        cost(){
                                return player.g.clickableAmounts[41].plus(5).pow(6).div(4).times(layers.g.clickables.getRebirthCostIncrease()).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(layers.g.clickables.getChargeComsumption())
                                let c = player.g.clickableAmounts[41].lt(layers.g.clickables.getCompletionsReq())
                                return a && b && c
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 41

                                while (b < 1000){
                                        b ++ 
                                        if (b > 990) console.log(b)
                                        if (!this.canClick()) break 
                                        let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                        let cc = layers.g.clickables.getChargeComsumption()
                                        let cost = this.cost()

                                        let times = getTimesRequired(chance)
                                        // the random chance factor
                                        let maxCharges = data.charges.div(cc).floor()
                                        // max num at current charges
                                        let maxGames = data.points.div(cost).floor()
                                        //max num at current games

                                        let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                        //max num overall
                                        
                                        remaining = remaining.minus(target) //how many bulks left
                                        if (!hasMilestone("g", 18)) {
                                                data.points = data.points.sub(cost.times(target)).max(0)
                                        } // remove games
                                        data.charges = data.charges.minus(cc.times(target))
                                        //remove charges

                                        if (target != times) break
                                        //didnt do it enough times
                                        
                                        //if did do enough, add one
                                        data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                }
                        },
                },
                42: {
                        title(){
                                return "<h3 style='color: #903000'>Autochess</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(this.cost()) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[42].times(100).div(layers.g.clickables.getCompletionsReq())) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[42]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = layers.g.clickables.getPrimaryRebirths() > 0
                                let a = player.g.clickableAmounts[31].gt(6) && player.g.clickableAmounts[32].gt(6) && player.g.clickableAmounts[33].gt(6) && player.g.clickableAmounts[34].gt(6)
                                return a || b
                        },
                        cost(){
                                return player.g.clickableAmounts[42].plus(5).pow(6).div(4).times(layers.g.clickables.getRebirthCostIncrease()).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(layers.g.clickables.getChargeComsumption())
                                let c = player.g.clickableAmounts[42].lt(layers.g.clickables.getCompletionsReq())
                                return a && b && c
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 42

                                while (b < 1000){
                                        b ++ 
                                        if (b > 990) console.log(b)
                                        if (!this.canClick()) break 
                                        let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                        let cc = layers.g.clickables.getChargeComsumption()
                                        let cost = this.cost()

                                        let times = getTimesRequired(chance)
                                        // the random chance factor
                                        let maxCharges = data.charges.div(cc).floor()
                                        // max num at current charges
                                        let maxGames = data.points.div(cost).floor()
                                        //max num at current games

                                        let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                        //max num overall
                                        
                                        remaining = remaining.minus(target) //how many bulks left
                                        if (!hasMilestone("g", 18)) {
                                                data.points = data.points.sub(cost.times(target)).max(0)
                                        } // remove games
                                        data.charges = data.charges.minus(cc.times(target))
                                        //remove charges

                                        if (target != times) break
                                        //didnt do it enough times
                                        
                                        //if did do enough, add one
                                        data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                }
                        },
                },
                43: {
                        title(){
                                return "<h3 style='color: #903000'>Pong</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(this.cost()) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[43].times(100).div(layers.g.clickables.getCompletionsReq())) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[43]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = layers.g.clickables.getPrimaryRebirths() > 0
                                let a = player.g.clickableAmounts[31].gt(6) && player.g.clickableAmounts[32].gt(6) && player.g.clickableAmounts[33].gt(6) && player.g.clickableAmounts[34].gt(6)
                                return a || b
                        },
                        cost(){
                                return player.g.clickableAmounts[43].plus(5).pow(6).div(4).times(layers.g.clickables.getRebirthCostIncrease()).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(layers.g.clickables.getChargeComsumption())
                                let c = player.g.clickableAmounts[43].lt(layers.g.clickables.getCompletionsReq())
                                return a && b && c
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 43

                                while (b < 1000){
                                        b ++ 
                                        if (b > 990) console.log(b)
                                        if (!this.canClick()) break 
                                        let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                        let cc = layers.g.clickables.getChargeComsumption()
                                        let cost = this.cost()

                                        let times = getTimesRequired(chance)
                                        // the random chance factor
                                        let maxCharges = data.charges.div(cc).floor()
                                        // max num at current charges
                                        let maxGames = data.points.div(cost).floor()
                                        //max num at current games

                                        let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                        //max num overall
                                        
                                        remaining = remaining.minus(target) //how many bulks left
                                        if (!hasMilestone("g", 18)) {
                                                data.points = data.points.sub(cost.times(target)).max(0)
                                        } // remove games
                                        data.charges = data.charges.minus(cc.times(target))
                                        //remove charges

                                        if (target != times) break
                                        //didnt do it enough times
                                        
                                        //if did do enough, add one
                                        data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                }
                        },
                },
                44: {
                        title(){
                                return "<h3 style='color: #903000'>Dota 2</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(this.cost()) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[44].times(100).div(layers.g.clickables.getCompletionsReq())) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[44]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = layers.g.clickables.getPrimaryRebirths() > 0
                                let a = player.g.clickableAmounts[31].gt(6) && player.g.clickableAmounts[32].gt(6) && player.g.clickableAmounts[33].gt(6) && player.g.clickableAmounts[34].gt(6)
                                return a || b
                        },
                        cost(){
                                return player.g.clickableAmounts[44].plus(5).pow(6).div(4).times(layers.g.clickables.getRebirthCostIncrease()).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(layers.g.clickables.getChargeComsumption())
                                let c = player.g.clickableAmounts[44].lt(layers.g.clickables.getCompletionsReq())
                                return a && b && c
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 44

                                while (b < 1000){
                                        b ++ 
                                        if (b > 990) console.log(b)
                                        if (!this.canClick()) break 
                                        let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                        let cc = layers.g.clickables.getChargeComsumption()
                                        let cost = this.cost()

                                        let times = getTimesRequired(chance)
                                        // the random chance factor
                                        let maxCharges = data.charges.div(cc).floor()
                                        // max num at current charges
                                        let maxGames = data.points.div(cost).floor()
                                        //max num at current games

                                        let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                        //max num overall
                                        
                                        remaining = remaining.minus(target) //how many bulks left
                                        if (!hasMilestone("g", 18)) {
                                                data.points = data.points.sub(cost.times(target)).max(0)
                                        } // remove games
                                        data.charges = data.charges.minus(cc.times(target))
                                        //remove charges

                                        if (target != times) break
                                        //didnt do it enough times
                                        
                                        //if did do enough, add one
                                        data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                }
                        },
                },
                51: {
                        title(){
                                return "<h3 style='color: #903000'>Snake</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(this.cost()) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[51].times(100).div(layers.g.clickables.getCompletionsReq())) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[51], .1).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                return hasAchievement("ach", 133)
                        },
                        cost(){
                                return player.g.clickableAmounts[51].times(4).plus(9).pow(7).times(layers.g.clickables.getRebirthCostIncrease()).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(layers.g.clickables.getChargeComsumption())
                                let c = player.g.clickableAmounts[51].lt(layers.g.clickables.getCompletionsReq())
                                return a && b && c
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 51

                                while (b < 1000){
                                        b ++ 
                                        if (b > 990) console.log(b)
                                        if (!this.canClick()) break 
                                        let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                        let cc = layers.g.clickables.getChargeComsumption()
                                        let cost = this.cost()

                                        let times = getTimesRequired(chance)
                                        // the random chance factor
                                        let maxCharges = data.charges.div(cc).floor()
                                        // max num at current charges
                                        let maxGames = data.points.div(cost).floor()
                                        //max num at current games

                                        let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                        //max num overall
                                        
                                        remaining = remaining.minus(target) //how many bulks left
                                        if (!hasMilestone("g", 18)) {
                                                data.points = data.points.sub(cost.times(target)).max(0)
                                        } // remove games
                                        data.charges = data.charges.minus(cc.times(target))
                                        //remove charges

                                        if (target != times) break
                                        //didnt do it enough times
                                        
                                        //if did do enough, add one
                                        data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                }
                        },
                },
                52: {
                        title(){
                                return "<h3 style='color: #903000'>name1</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(this.cost()) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[52].times(100).div(layers.g.clickables.getCompletionsReq())) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[52], .1).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                return hasAchievement("ach", 133)
                        },
                        cost(){
                                return player.g.clickableAmounts[52].times(4).plus(9).pow(7).times(layers.g.clickables.getRebirthCostIncrease()).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(layers.g.clickables.getChargeComsumption())
                                let c = player.g.clickableAmounts[52].lt(layers.g.clickables.getCompletionsReq())
                                return a && b && c
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 52

                                while (b < 1000){
                                        b ++ 
                                        if (b > 990) console.log(b)
                                        if (!this.canClick()) break 
                                        let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                        let cc = layers.g.clickables.getChargeComsumption()
                                        let cost = this.cost()

                                        let times = getTimesRequired(chance)
                                        // the random chance factor
                                        let maxCharges = data.charges.div(cc).floor()
                                        // max num at current charges
                                        let maxGames = data.points.div(cost).floor()
                                        //max num at current games

                                        let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                        //max num overall
                                        
                                        remaining = remaining.minus(target) //how many bulks left
                                        if (!hasMilestone("g", 18)) {
                                                data.points = data.points.sub(cost.times(target)).max(0)
                                        } // remove games
                                        data.charges = data.charges.minus(cc.times(target))
                                        //remove charges

                                        if (target != times) break
                                        //didnt do it enough times
                                        
                                        //if did do enough, add one
                                        data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                }
                        },
                },
                53: {
                        title(){
                                return "<h3 style='color: #903000'>name1</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(this.cost()) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[53].times(100).div(layers.g.clickables.getCompletionsReq())) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[53], .1).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                return hasAchievement("ach", 133)
                        },
                        cost(){
                                return player.g.clickableAmounts[53].times(4).plus(9).pow(7).times(layers.g.clickables.getRebirthCostIncrease()).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(layers.g.clickables.getChargeComsumption())
                                let c = player.g.clickableAmounts[53].lt(layers.g.clickables.getCompletionsReq())
                                return a && b && c
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 53

                                while (b < 1000){
                                        b ++ 
                                        if (b > 990) console.log(b)
                                        if (!this.canClick()) break 
                                        let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                        let cc = layers.g.clickables.getChargeComsumption()
                                        let cost = this.cost()

                                        let times = getTimesRequired(chance)
                                        // the random chance factor
                                        let maxCharges = data.charges.div(cc).floor()
                                        // max num at current charges
                                        let maxGames = data.points.div(cost).floor()
                                        //max num at current games

                                        let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                        //max num overall
                                        
                                        remaining = remaining.minus(target) //how many bulks left
                                        if (!hasMilestone("g", 18)) {
                                                data.points = data.points.sub(cost.times(target)).max(0)
                                        } // remove games
                                        data.charges = data.charges.minus(cc.times(target))
                                        //remove charges

                                        if (target != times) break
                                        //didnt do it enough times
                                        
                                        //if did do enough, add one
                                        data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                }
                        },
                },
                54: {
                        title(){
                                return "<h3 style='color: #903000'>name1</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(this.cost()) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[54].times(100).div(layers.g.clickables.getCompletionsReq())) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[54], .1).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                return hasAchievement("ach", 133)
                        },
                        cost(){
                                return player.g.clickableAmounts[54].times(4).plus(9).pow(7).times(layers.g.clickables.getRebirthCostIncrease()).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(layers.g.clickables.getChargeComsumption())
                                let c = player.g.clickableAmounts[54].lt(layers.g.clickables.getCompletionsReq())
                                return a && b && c
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 54

                                while (b < 1000){
                                        b ++ 
                                        if (b > 990) console.log(b)
                                        if (!this.canClick()) break 
                                        let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                        let cc = layers.g.clickables.getChargeComsumption()
                                        let cost = this.cost()

                                        let times = getTimesRequired(chance)
                                        // the random chance factor
                                        let maxCharges = data.charges.div(cc).floor()
                                        // max num at current charges
                                        let maxGames = data.points.div(cost).floor()
                                        //max num at current games

                                        let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                        //max num overall
                                        
                                        remaining = remaining.minus(target) //how many bulks left
                                        if (!hasMilestone("g", 18)) {
                                                data.points = data.points.sub(cost.times(target)).max(0)
                                        } // remove games
                                        data.charges = data.charges.minus(cc.times(target))
                                        //remove charges

                                        if (target != times) break
                                        //didnt do it enough times
                                        
                                        //if did do enough, add one
                                        data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                }
                        },
                },
                15: {
                        title(){
                                return "<h3 style='color: #903000'>Rebirth I</h3>"
                        },
                        display(){
                                let a = "<h3 style='color: #D070C0'>Requires</h3>: 16 Games at 100%<br>"
                                let b = "<h3 style='color: #00CC66'>Times</h3>: " + formatWhole(player.g.rebirths[1])
                                return a + b
                        },
                        unlocked(){
                                return hasMilestone("g", 15)
                        },
                        canClick(){
                                let gdata = player.g
                                rb = layers.g.clickables.getPrimaryRebirths()
                                let a = gdata.partialTally.gte(Decimal.times(160, (rb + 1) * (rb + 2) / 2))
                                let b = gdata.charges.gte(layers.g.clickables.getChargeComsumption())
                                return a && b
                        },
                        onClick(force = false){
                                let data = player.g
                                for (let i = 0; i < layers.g.clickables.getAttemptAmount(force).toNumber(); i++){
                                        if (!this.canClick()) return 
                                        data.charges = data.charges.minus(layers.g.clickables.getChargeComsumption())
                                        data.rebirths[1] += 1
                                        this.resetPrior()
                                }
                        },
                        resetPrior(){
                                /*
                                This to reset:
                                1. All progress in games
                                2. Charges
                                */
                                let data = player.g
                                let data1 = data.clickableAmounts
                                let l = [21, 22, 23, 24,
                                         31, 32, 33, 34,
                                         41, 42, 43, 44,
                                         51, 52, 53, 54,]
                                for (j in l){
                                        i = l[j]
                                        data1[i] = new Decimal(0)
                                }
                                data.charges = new Decimal(0)
                        },
                },
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Girl",
                        description: "Each upgrade adds 1 to effective rebiths",
                        cost: new Decimal("1e26697"),
                        unlocked(){
                                return hasUpgrade("f", 45) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 11)
                12: {
                        title: "Golf",
                        description: "Max charges ^1.3",
                        cost: new Decimal("1e26697"),
                        unlocked(){
                                return hasUpgrade("g", 11) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 12)
                13: {
                        title: "Google",
                        description: "Per upgrade double base <b>G</b> gain",
                        cost: new Decimal("1e26697"),
                        unlocked(){
                                return hasUpgrade("g", 12) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 13)
                14: {
                        title: "Growth",
                        description: "Keep all Medal upgrades, milestones, and tokens",
                        cost: new Decimal("1e29511"),
                        unlocked(){
                                return hasUpgrade("g", 13) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 14)
                15: {
                        title: "Gas",
                        description: "Unlock a row of <b>D</b> upgrades",
                        cost: new Decimal("2e30086"),
                        unlocked(){
                                return hasUpgrade("g", 14) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 15)
                21: {
                        title: "Glass",
                        description: "Unlock a row of <b>E</b> upgrades",
                        cost: new Decimal("1e32090"),
                        unlocked(){
                                return hasUpgrade("d", 55) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 21)
                22: {
                        title: "Ground",
                        description: "Unlock another row of <b>E</b> upgrades",
                        cost: new Decimal("1e45604"),
                        unlocked(){
                                return hasUpgrade("e", 35) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 22)
                23: {
                        title: "Guides",
                        description: "Unlock another row of <b>E</b> upgrades",
                        cost: new Decimal("1e49960"),
                        unlocked(){
                                return hasUpgrade("e", 45) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 23)

                /*  
                grand

                */
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasMilestone("g", 9) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {return shiftDown ? "Your best Games is " + format(player.g.best) : ""}],
                                ["display-text",
                                        function() {
                                                if (hasUnlockedPast("g")) return ""
                                                return "You have done " + formatWhole(player.g.times) + " Game resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (hasMilestone("g", 9)) return "You are gaining " + format(tmp.g.getResetGain) + " Games per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.g.time)) + ")" 
                                        },
                                        //{"font-size": "20px"}
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return false || hasUnlockedPast("h")
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                "milestones",
                        ],
                        unlocked(){
                                return player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                "Games": {
                        content: [
                                ["display-text",
                                        function() {
                                                let a = "You have " + format(player.g.points) + " games, "
                                                let b = format(player.goalsii.points) + " medals, "
                                                let c = formatWhole(player.ach.points) + " goals, and "
                                                let d = format(player.f.points) + " features."
                                                let e = ""
                                                if (!shiftDown) e = "<br>Press shift to see success chances."
                                                else if (hasMilestone("g", 12)) e = "<br>You have shift down to bulk up to " + formatWhole(layers.g.clickables.getAttemptAmount()) + "."
                                                return a + b + c + d + e
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                let cpm = layers.g.clickables.getChargesPerMinute()
                                                let a = "You have " + formatWhole(player.g.charges) + "/" + formatWhole(player.g.chargesMax)
                                                let b = ""
                                                if (cpm < 1e5) b = " charges and are gaining " + format(cpm) + " per minute"
                                                else b = " charges and are gaining " + format(cpm / 60) + " per second"
                                                let c = ""
                                                if (cpm > 0 && cpm < 1e5) {
                                                        c = " (next in " + format(Math.max(60/cpm -player.g.chargesTime, 0)) + "s)"
                                                }
                                                return a + b + c +"."
                                        }
                                ],
                                "clickables",
                        ],
                        unlocked(){
                                return hasMilestone("g", 8) || hasUnlockedPast("g")
                        },
                },
                "Details": {
                        content: [
                                ["display-text",
                                        function() {
                                                let a = `<h2 style = 'color: #CC0033'>Explanation</h2><h2>:</h2><br><br>
                                                There are twenty games which progressively unlock. <br>
                                                Clicking a game will consume a charge.<br>
                                                For the first row, you no matter what will gain a level, <br>
                                                but for subsequent rows you have a non-zero chance of failing and gaining nothing.<br>
                                                This fail rate is purely based on how much progress you have made so far.<br><br>
                                                The first row of games each generate one charge per minute.<br>
                                                You can gain buffs by partially deving games,<br>
                                                and larger buffs for completing games. <br><br>
                                                <h2 style = 'color: #CC0033'>Rewards</h2><h2>:</h2><br>
                                                You have fully completed ` 
                                                let ecd = layers.g.clickables.getEffectiveCompletedDevs()
                                                let ecdportion = ecd.eq(player.g.completedTally) ? "" : "+" + format(ecd.minus(player.g.completedTally))
                                                let b = formatWhole(player.g.completedTally) + ecdportion + " games so:"
                                                let b2 = ""
                                                let data2 = layers.g.clickables.getAllCompletedEffects()
                                                for (i in data2){
                                                        let j = data2[i]
                                                        if (!j[2]) continue
                                                        b2 += "<br>• " + j[1] + format(j[0]) + " to " + i 
                                                }

                                                let pcd = layers.g.clickables.getEffectivePartialDevs()
                                                let pcdportion = pcd.eq(player.g.partialTally) ? "" : "+" + format(pcd.minus(player.g.partialTally))
                                                let c = "<br><br> You have successfully deved " + formatWhole(player.g.partialTally) + pcdportion + " games so:"
                                                let c2 = ""
                                                let data1 = layers.g.clickables.getAllPartialEffects()
                                                for (i in data1){
                                                        let j = data1[i]
                                                        if (!j[2]) continue
                                                        c2 += "<br>• " + j[1] + format(j[0]) + " to " + i 
                                                }

                                                let rb = layers.g.clickables.getPrimaryRebirths()
                                                if (rb == 0) return a + b + b2 + c + c2

                                                let erb = layers.g.clickables.getEffectiveRebirths()
                                                let erbportion = erb.eq(rb) ? "" : "+" + format(erb.minus(rb))
                                                let d = "<br><br> You have rebirthed " + formatWhole(rb) + erbportion + " times so:"
                                                let d2 = ""
                                                let data3 = layers.g.clickables.getRebirthEffects()
                                                for (i in data3){
                                                        let j = data3[i]
                                                        if (!j[2]) continue
                                                        d2 += "<br>• " + j[1] + format(j[0]) + " to " + i 
                                                }
                                                return a + b + b2 + c + c2 + d + d2
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                let rb = layers.g.clickables.getPrimaryRebirths()
                                                if (rb == 0 && player.g.completedTally < 15) return ""
                                                let a = `<br><h2 style = 'color: #CC0033'>Rebirth</h2><h2>:</h2><br>
                                                You can rebirth when you have fully deved 16 games.<br>
                                                Upon rebirthing you lose game progress.<br>
                                                Rebirthing makes attempting to dev harder and causes it to consume more charges. <br><br>
                                                You have rebirthed ` + formatWhole(rb) + " times."
                                                let b = "<br>Each attempts costs " + formatWhole(layers.g.clickables.getChargeComsumption()) + " charges."
                                                return a + b + "<br><br><br>"
                                        }
                                ],
                        ],
                        unlocked(){
                                return hasMilestone("g", 8) || hasUnlockedPast("g")
                        },
                },
        },
        doReset(layer){
                if (layer == "g") player.g.time = 0
                if (!getsReset("g", layer)) return
                player.g.time = 0
                player.g.times = 0

                if (!false) {
                        //upgrades
                        let keep = []
                        player.g.upgrades = filter(player.g.upgrades, keep)
                }

                //resources
                player.g.points = new Decimal(0)
                player.g.total = new Decimal(0)
                player.g.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        break
                        player.g.buyables[resetBuyables[j]] = new Decimal(0)
                }
        },
})


/*
Games: (a feature of game prestige lyr)

16 games, (names tbd) each is a clickable
You have charges, max 10, starting with 3, gain z/minute where z is the number of 1st row upgs bought
- 1st row upgs are clickables that cost: 
        10*2^x games, 
        1e8*10^x^2 medals, 
        requires 82+3x goals,
        1e1900 (ish) * 1e100^x * 1e50**(x*x) features
You can click on a game with attempts to dev some part of that game (10%? intervals)
- There is a chance you fail, something like 1-(1-x)^2
Clicking costs a charge and games, costing more games the more progress you have

Each click adds one to "games deved" and successful clicks adds to "completed devs"
Fully completing a game gives rewards, the first of which is getting more charges/time interval

Things that give rewards:
Games deved
Completed devs
Completed games


*/






