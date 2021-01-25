function getPointGen() {
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
        if (hasUpgrade("h", 15))  gain = gain.times(Decimal.pow(tmp.h.effect, 1000))

        gain = gain.pow(getPointGenExp())

        if (inChallenge("f", 22)) gain = doDilation(gain, .9)

	return gain
}

function getPointGenExp(){
        let exp = new Decimal(1)
        if (inChallenge("b", 22)) exp = exp.div(2)
        exp = exp.times(Decimal.pow(.9, getChallengeDepth(2)))
        exp = exp.times(CURRENT_BUYABLE_EFFECTS["g31"])
        if (hasUpgrade("l", 15)) exp = exp.times(Decimal.pow(2, player.k.lock.repeatables[54]))
        exp = exp.times(CURRENT_BUYABLE_EFFECTS["i33"])
        if (hasUpgrade("k", 43)) exp = exp.times(Decimal.pow(1.15, player.k.lock.repeatables[54]))
        if (hasUpgrade("k", 51)) exp = exp.times(Decimal.pow(player.k.lock.repeatables[82].div(100).plus(1), tmp.k.clickables.totalKeys))
        return exp
}

//check if below can be removed
function canBuyMax(layer, id) {
	return false
}

// CHALLENGES
function getChallengeFactor(comps){
        let b1 = new Decimal(comps).pow(1.5).plus(1)
        if (b1.gt(10)) b1 = b1.div(10).pow10()
        if (b1.gt(1e10)) b1 = b1.tetrate(1.01) 
        if (b1.gt(1e16)) b1 = b1.tetrate(1.01) 
        if (b1.gt(1e200)) b1 = b1.tetrate(1.0001)
        if (b1.gt(1e250)) b1 = b1.tetrate(1.0011)
        if (b1.gt("1ee3")) b1 = b1.tetrate(1.0001)
        if (b1.gt("1e5e3")) b1 = b1.tetrate(1.0002)
        return b1
}

function totalChallengeComps(layer){
        let a = challengeCompletions(layer, 11) || 0
        let b = challengeCompletions(layer, 12) || 0
        let c = challengeCompletions(layer, 21) || 0
        let d = challengeCompletions(layer, 22) || 0
        return a + b + c + d
}

function mergeSort(l, comp = function(a,b){return a<=b}){
        let k = l.length
        if (k == 1) return l
        let d = Math.floor(k/2)
        let a = mergeSort(l.slice(0,d)) 
        let b = mergeSort(l.slice(d))
        let apt = 0
        let bpt = 0
        let j = []
        while (true){
                if (comp(a[apt], b[bpt])) {
                        j.push(a[apt])
                        apt ++
                } else {
                        j.push(b[bpt])
                        bpt ++
                }
                if (apt == d){
                        return j.concat(b.slice(bpt))
                }
                if (bpt == k-d){
                        return j.concat(a.slice(apt))
                }
        }
}

// upgrade names: https://github.com/first20hours/google-10000-english/blob/master/google-10000-english.txt

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
                return getGeneralizedPrestigeGain("a")
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
                let x = getGeneralizedInitialPostMult("a")

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

                let exp = new Decimal(.5)
                exp = exp.plus(CURRENT_BUYABLE_EFFECTS["f32"])

                let ret = amt.plus(1).pow(exp)

                if (!player.j.puzzle.upgrades.includes(64)) ret = softcap(ret, "a_eff")

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("a")
        },
        update(diff){
                player.a.best = player.a.best.max(player.a.points)
                if (hasUpgrade("a", 23)) {
                        player.a.points = player.a.points.plus(tmp.a.getResetGain.times(diff))
                        player.a.total = player.a.total.plus(tmp.a.getResetGain.times(diff))
                        player.a.autotimes += diff
                        if (player.a.autotimes > 3) player.a.autotimes = 3
                        if (player.a.autotimes > 1) {
                                player.a.autotimes += -1
                                player.a.times ++
                        }
                }
                if (hasUpgrade("b", 14) || hasMilestone("goalsii", 1)) {
                        handleGeneralizedBuyableAutobuy(diff, "a")
                } else {
                        player.a.abtime = 0
                }
                player.a.time += diff
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
                {key: "]", description: "]: Buy max of all upgrades", 
                        onPress(){
                                let l =  ["a", "b", "c", "d", "e", "goalsii", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"]
                                let trylist = [11, 12, 13, 14, 15, 
                                        21, 22, 23, 24, 25,
                                        31, 32, 33, 34, 35,
                                        41, 42, 43, 44, 45,
                                        51, 52, 53, 54, 55,]
                                for (j in l){
                                        i = l[j]
                                        if (layers[i] == undefined) continue
                                        for (k in trylist) {
                                                if (hasUpgrade(i, trylist[k])) continue
                                                if (layers[i].upgrades[trylist[k]] == undefined) continue
                                                
                                                buyUpgrade(i, trylist[k])
                                        }
                                }
                        }
                },
                {key: "a", description: "A: Reset for Amoeba", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+A", description: "Shift+A: Go to Amoebas", onPress(){
                                showTab("a")
                        }
                },
                {key: ",", description: ",: Move one tab to the left", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                player.subtabs[l].mainTabs = getNextLeftTab(l)
                        }
                },
                {key: ".", description: ".: Move one tab to the right", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                player.subtabs[l].mainTabs = getNextRightTab(l)
                        }
                },
                {key: "shift+<", description: "Shift+,: Move all the way to the left", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                k = getUnlockedSubtabs(l)
                                player.subtabs[l].mainTabs = k[0]
                        }
                },
                {key: "shift+>", description: "Shift+.: Move all the way to the right", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                k = getUnlockedSubtabs(l)
                                player.subtabs[l].mainTabs = k[k.length-1]
                        }
                },
                {key: "Control+S", description: "Control+S: Save", 
                        onPress(){
                                save()
                        }
                },
        ],
        layerShown(){return true},
        prestigeButtonText(){
                if (hasUpgrade("a", 23)) return ""
                return getGeneralizedPrestigeButtonText("a")
        },
        canReset(){
                return player.a.time >= 2 && !hasUpgrade("a", 23) && tmp.a.getResetGain.gt(0)
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
                        effectDisplay(){
                                if (player.tab != "a") return ""
                                if (player.subtabs.a.mainTabs != "Upgrades") return ""
                                return format(tmp.a.upgrades[11].effect)
                        },
                        unlocked(){
                                return player.a.best.gt(0) || hasUnlockedPast("a")
                        }, //hasUpgrade("a", 11)
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
                        effectDisplay(){
                                if (player.tab != "a") return ""
                                if (player.subtabs.a.mainTabs != "Upgrades") return ""
                                return format(tmp.a.upgrades[12].effect)
                        },
                        unlocked(){
                                return hasUpgrade("a", 11) || hasUnlockedPast("a")
                        }, //hasUpgrade("a", 12)
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
                        effectDisplay(){
                                if (player.tab != "a") return ""
                                if (player.subtabs.a.mainTabs != "Upgrades") return ""
                                return format(tmp.a.upgrades[13].effect)
                        },
                        unlocked(){
                                return hasUpgrade("a", 12) || hasUnlockedPast("a")
                        }, //hasUpgrade("a", 13)
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
                        effectDisplay(){
                                if (player.tab != "a") return ""
                                if (player.subtabs.a.mainTabs != "Upgrades") return ""
                                return format(tmp.a.upgrades[14].effect)
                        },
                        unlocked(){
                                return hasUpgrade("a", 13) || hasUnlockedPast("a")
                        }, //hasUpgrade("a", 14)
                },
                15: {
                        title: "As",
                        description: "Unlock the first Amoeba buyable",
                        cost: new Decimal(1000),
                        unlocked(){
                                return hasUpgrade("a", 14) || hasUnlockedPast("a")
                        }, //hasUpgrade("a", 15)
                },
                21: {
                        title: "An",
                        description: "Each Amoeba upgrade adds .5 to the <b>And</b> exponent",
                        cost: new Decimal(2500),
                        unlocked(){
                                return getBuyableAmount("a", 11).gte(3) || hasUnlockedPast("a")
                        }, //hasUpgrade("a", 21)
                },
                22: {
                        title: "About",
                        description: "Unlock the second Amoeba buyable",
                        cost: new Decimal(1e4),
                        unlocked(){
                                return getBuyableAmount("a", 11).gte(5) || hasUnlockedPast("a")
                        }, //hasUpgrade("a", 22)
                },
                23: {
                        title: "Also",
                        description: "Double Amoeba gain and remove the ability to prestige but gain 100% of Amoebas on prestige per second",
                        cost: new Decimal(3e4),
                        unlocked(){
                                return getBuyableAmount("a", 12).gte(1) || hasUnlockedPast("a")
                        }, //hasUpgrade("a", 23)
                },
                24: {
                        title: "Am",
                        description: "<b>Any</b> gives free levels to <b>All</b>",
                        cost: new Decimal(15e4),
                        unlocked(){
                                return getBuyableAmount("a", 12).gte(3) || hasUnlockedPast("a")
                        }, //hasUpgrade("a", 24)
                },
                25: {
                        title: "Add",
                        description: "Each Amoeba upgrade adds .02 to the <b>A</b> base",
                        cost: new Decimal(5e5),
                        unlocked(){
                                return getBuyableAmount("a", 11).gte(10) || hasUnlockedPast("a")
                        }, //hasUpgrade("a", 25)
                },
                31: {
                        title: "Available",
                        description: "Unlock a third Amoeba buyable",
                        cost: new Decimal(1e7),
                        unlocked(){
                                return hasUpgrade("b", 13) || hasUnlockedPast("b")
                        }, //hasUpgrade("a", 31)
                },
                32: {
                        title: "Address",
                        description: "Cube base Amoeba gain",
                        cost: new Decimal(1e26),
                        unlocked(){
                                return hasUpgrade("b", 14) || hasUnlockedPast("b")
                        }, //hasUpgrade("a", 32)
                },
                33: {
                        title: "Area",
                        description: "Remove the first Amoeba effect softcap",
                        cost: new Decimal(1e40),
                        unlocked(){
                                return hasUpgrade("a", 32) || hasUnlockedPast("b")
                        }, //hasUpgrade("a", 33)
                },
                34: {
                        title: "Action",
                        description: "Each <b>After</b> gives a free level to <b>All</b> and adds .01 to the base",
                        cost: new Decimal(1e50),
                        unlocked(){
                                return hasUpgrade("a", 33) || hasUnlockedPast("b")
                        }, //hasUpgrade("a", 34)
                },
                35: {
                        title: "American",
                        description: "<b>Business</b> can buy 10, cube <b>At</b>, and Amoeba buyables cost nothing",
                        cost: new Decimal(1e54),
                        unlocked(){
                                return hasUpgrade("a", 34) || hasUnlockedPast("b")
                        }, //hasUpgrade("a", 35)
                },
                41: {
                        title: "Art",
                        description: "Get a free <b>Access</b> level",
                        cost: new Decimal(1e86),
                        unlocked(){
                                return hasUpgrade("b", 21) || hasUnlockedPast("b")
                        }, //hasUpgrade("a", 41)
                }, 
                42: {
                        title: "Another",
                        description: "<b>Account</b> gives free <b>Access</b> levels",
                        cost: new Decimal(5e194),
                        unlocked(){
                                return hasUpgrade("b", 25) || hasUnlockedPast("b")
                        }, //hasUpgrade("a", 42)
                },
                43: {
                        title: "Article",
                        description: "Per <b>Account</b> add .05 to the <b>Any</b> base",
                        cost: new Decimal(1e284),
                        unlocked(){
                                return hasUpgrade("a", 42) || hasUnlockedPast("b")
                        }, //hasUpgrade("a", 43)
                },
                44: {
                        title: "Author",
                        description: "Square <b>And</b> exponent",
                        cost: new Decimal("5e524"),
                        unlocked(){
                                return hasUpgrade("a", 43) || hasUnlockedPast("b")
                        }, //hasUpgrade("a", 44)
                },
                45: {
                        title: "Around",
                        description: "Each <b>Account</b> adds .01 to its base and double <b>B</b> gain",
                        cost: new Decimal("1e568"),
                        unlocked(){
                                return hasUpgrade("a", 44) || hasUnlockedPast("b")
                        }, //hasUpgrade("a", 45)
                },
                51: {
                        title: "Air",
                        description: "Each <b>Access</b> adds .01 to the <b>Any</b> base",
                        cost: new Decimal("5e1228"),
                        unlocked(){
                                return hasUpgrade("c", 11) || hasUnlockedPast("c")
                        }, //hasUpgrade("a", 51)
                },
                52: {
                        title: "Accessories",
                        description: "<b>Account</b> adds levels to <b>After</b>",
                        cost: new Decimal("1e1654"),
                        unlocked(){
                                return hasUpgrade("a", 51) || hasUnlockedPast("c")
                        }, //hasUpgrade("a", 52)
                },
                53: {
                        title: "Application",
                        description: "Unlock a seventh Amoeba buyable and raise <b>A</b> to the number of Amoeba upgrades",
                        cost: new Decimal("1e1797"),
                        unlocked(){
                                return hasUpgrade("a", 52) || hasUnlockedPast("c")
                        }, //hasUpgrade("a", 53)
                },
                54: {
                        title: "Again",
                        description: "<b>Advanced</b> gives free levels to <b>Account</b>",
                        cost: new Decimal("1e1948"),
                        unlocked(){
                                return hasUpgrade("a", 53) || hasUnlockedPast("c")
                        }, //hasUpgrade("a", 54)
                },
                55: {
                        title: "Act",
                        description: "Unlock a second Bacteria buyable and remove the second Amoeba effect softcap",
                        cost: new Decimal("1e4256"),
                        unlocked(){
                                return hasUpgrade("a", 53) || hasUnlockedPast("c")
                        }, //hasUpgrade("a", 55)
                },
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: getGeneralizedBuyableData("a", 11, function(){
                        return hasUpgrade("a", 15) || hasUnlockedPast("a")
                        }),
                12: getGeneralizedBuyableData("a", 12, function(){
                        return hasUpgrade("a", 22) || hasUnlockedPast("a")
                        }),
                13: getGeneralizedBuyableData("a", 13, function(){
                        return hasUpgrade("a", 31) || hasUnlockedPast("b")
                        }),
                21: getGeneralizedBuyableData("a", 21, function(){
                        return hasUpgrade("b", 21) || hasUnlockedPast("b")
                        }),
                22: getGeneralizedBuyableData("a", 22, function(){
                        return hasUpgrade("b", 24) || hasUnlockedPast("b")
                        }),
                23: getGeneralizedBuyableData("a", 23, function(){
                        return hasUpgrade("c", 12) || hasUnlockedPast("c")
                        }),
                31: getGeneralizedBuyableData("a", 31, function(){
                        return hasUpgrade("a", 53) || hasUnlockedPast("c")
                        }),
                32: getGeneralizedBuyableData("a", 32, function(){
                        return hasUpgrade("b", 43) || hasUnlockedPast("c")
                        }),
                33: getGeneralizedBuyableData("a", 33, function(){
                        return hasUpgrade("b", 51) || hasUnlockedPast("d")
                        }),
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("a", 23) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "a") return ""
                                                if (player.subtabs.a.mainTabs != "Upgrades") return ""
                                                if (!showCurrency(player.a.points)) return ""
                                                return shiftDown ? "Your best Amoebas is " + format(player.a.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "a") return ""
                                                if (hasUnlockedPast("a")) return ""
                                                if (player.subtabs.a.mainTabs != "Upgrades") return ""
                                                return "You have done " + formatWhole(player.a.times) + " Amoeba resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "a") return ""
                                                if (player.subtabs.a.mainTabs != "Upgrades") return ""
                                                if (!showCurrency(player.a.points)) return ""
                                                if (hasUpgrade("a", 23)) return "You are gaining " + format(tmp.a.getResetGain) + " Amoebas per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.a.time)) + ")" 
                                        },
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
                                                if (player.tab != "a") return ""
                                                if (player.subtabs.a.mainTabs != "Buyables") return ""
                                                if (!showCurrency(player.a.points)) return ""
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
        name: "Bacteria",
        symbol: "B",
        position: 0,
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
        requires: new Decimal(0),
        resource: "Bacterias",
        baseResource: "Amoebas",
        baseAmount() {return player.a.points.floor()},
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("b")
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
                let x = getGeneralizedInitialPostMult("b")

                x = x.times(tmp.a.buyables[22].effect)
                x = x.times(tmp.b.buyables[12].effect)
                x = x.times(tmp.goalsii.effect)
                if (hasUpgrade("a", 45)) x = x.times(2)

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("b")) return new Decimal(1)

                let amt = player.b.points

                let ret = amt.times(3).plus(1).sqrt()

                if (!player.j.puzzle.upgrades.includes(64)) ret = softcap(ret, "b_eff")

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("b")
        },
        update(diff){
                player.b.best = player.b.best.max(player.b.points)
                if (hasUpgrade("b", 22)) {
                        player.b.points = player.b.points.plus(tmp.b.getResetGain.times(diff))
                        player.b.total = player.b.total.plus(tmp.b.getResetGain.times(diff))
                        player.b.autotimes += diff
                        if (player.b.autotimes > 3) player.b.autotimes = 3
                        if (player.b.autotimes > 1) {
                                player.b.autotimes += -1
                                player.b.times ++
                        }
                }
                if (hasUpgrade("b", 32) || hasMilestone("goalsii", 1)) {
                        handleGeneralizedBuyableAutobuy(diff, "b")
                } else {
                        player.b.abtime = 0
                }
                player.b.time += diff
        },
        row: 1,
        hotkeys: [
                {key: "b", description: "B: Reset for Bacteria", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+B", description: "Shift+B: Go to Bacteria", onPress(){
                                showTab("b")
                        }
                },
        ],
        layerShown(){return player.a.best.gt(1e6) || player.b.best.gt(0) || hasUnlockedPast("b")},
        prestigeButtonText(){
                if (hasUpgrade("b", 22)) return ""
                return getGeneralizedPrestigeButtonText("b")
        },
        canReset(){
                return player.b.time >= 5 && !hasUpgrade("b", 22) && tmp.b.getResetGain.gt(0)
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
                        effectDescription(){
                                if (player.tab != "b") return ""
                                if (player.subtabs.b.mainTabs != "Upgrades") return ""
                                return format(tmp.b.upgrades[11].effect)
                        },
                        unlocked(){
                                return player.b.best.gte(1) || hasUnlockedPast("b")
                        }, //hasUpgrade("b", 11)
                },
                12: {
                        title: "Be",
                        description: "Each Bacteria upgrade adds .1 to the <b>Any</b> gain base",
                        cost: new Decimal(3),
                        unlocked(){
                                return hasUpgrade("b", 11) || hasUnlockedPast("b")
                        }, //hasUpgrade("b", 12)
                },
                13: {
                        title: "But",
                        description: "Keep the first two rows of Amoeba upgrades and unlock more",
                        cost: new Decimal(15),
                        unlocked(){
                                return hasUpgrade("b", 12) || hasUnlockedPast("b")
                        }, //hasUpgrade("b", 13)
                },
                14: {
                        title: "Business",
                        description: "Keep the third and fourth rows of Amoeba upgrades and buy each Amoeba buyable once per second",
                        cost: new Decimal(500),
                        unlocked(){
                                return hasUpgrade("b", 13) || hasUnlockedPast("b")
                        }, //hasUpgrade("b", 14)
                },
                15: {
                        title: "Been",
                        description: "<b>After</b> gives free levels to <b>Any</b>",
                        cost: new Decimal(3000),
                        unlocked(){
                                return hasUpgrade("b", 14) || hasUnlockedPast("b")
                        }, //hasUpgrade("b", 15)
                },
                21: {
                        title: "Back",
                        description: "<b>Business</b> can buy twice as much per upgrade in this row and unlock a fourth Amoeba buyable",
                        cost: new Decimal(15000),
                        unlocked(){
                                return hasUpgrade("a", 35) || hasUnlockedPast("b")
                        }, //hasUpgrade("b", 21)
                },
                22: {
                        title: "Buy",
                        description: "Remove the ability to prestige but gain 100% of Bacteria on prestige per second",
                        cost: new Decimal(3e4),
                        unlocked(){
                                return hasUpgrade("a", 41) || hasUnlockedPast("b")
                        }, //hasUpgrade("b", 22)
                },
                23: {
                        title: "Best",
                        description: "<b>Access</b> gives free <b>Any</b> levels",
                        cost: new Decimal(5e5),
                        unlocked(){
                                return hasUpgrade("b", 22) || hasUnlockedPast("b")
                        }, //hasUpgrade("b", 23)
                },
                24: {
                        title: "Books",
                        description: "Unlock the fifth Amoeba buyable and each Amoeba upgrade gives a free <b>Any</b>",
                        cost: new Decimal(7e5),
                        unlocked(){
                                return hasUpgrade("b", 23) || hasUnlockedPast("b")
                        }, //hasUpgrade("b", 24)
                },
                25: {
                        title: "Book",
                        description: "Access gives free After levels",
                        cost: new Decimal(2e6),
                        unlocked(){
                                return hasUpgrade("b", 24) || hasUnlockedPast("b")
                        }, //hasUpgrade("b", 25)
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
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: getGeneralizedBuyableData("b", 11, function(){
                        return hasUpgrade("b", 31) || hasUnlockedPast("c")
                        }),
                12: getGeneralizedBuyableData("b", 12, function(){
                        return hasUpgrade("a", 55) || hasUnlockedPast("c")
                        }),
                13: getGeneralizedBuyableData("b", 13, function(){
                        return hasUpgrade("b", 53) || hasUnlockedPast("d")
                        }),
                21: getGeneralizedBuyableData("b", 21, function(){
                        return hasUpgrade("b", 53) || hasUnlockedPast("d")
                        }),
                22: getGeneralizedBuyableData("b", 22, function(){
                        return hasUpgrade("b", 55) || hasUnlockedPast("d")
                        }),
                23: getGeneralizedBuyableData("b", 23, function(){
                        return hasUpgrade("b", 55) || hasUnlockedPast("d")
                        }),
                31: getGeneralizedBuyableData("b", 31, function(){
                        return hasUpgrade("d", 24) || hasUnlockedPast("d")
                        }),
                32: getGeneralizedBuyableData("b", 32, function(){
                        return hasUpgrade("c", 44) || hasUnlockedPast("d")
                        }),
                33: getGeneralizedBuyableData("b", 33, function(){
                        return hasUpgrade("c", 51) || hasUnlockedPast("e")
                        }),
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
                                                if (player.tab != "b") return ""
                                                if (player.subtabs.b.mainTabs != "Upgrades") return ""
                                                if (!showCurrency(player.b.points)) return ""
                                                let a = hasUnlockedPast("b") ? "" : "You have done " + formatWhole(player.b.times) + " Bacteria resets<br>"
                                                if (hasUpgrade("b", 22)) return a + "You are gaining " + format(tmp.b.getResetGain) + " Bacteria per second"
                                                return a + "There is a five second cooldown for prestiging (" + format(Math.max(0, 5-player.b.time)) + ")" 
                                        },
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
                                                if (player.tab != "b") return ""
                                                if (player.subtabs.b.mainTabs != "Buyables") return ""
                                                return "Each buyable gives free levels to all previous layers corresponding buyable"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "b") return ""
                                                if (player.subtabs.b.mainTabs != "Buyables") return ""
                                                if (!shiftDown || !hasUpgrade("b", 22)) return ""
                                                if (!showCurrency(player.b.points)) return ""
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
                                                if (player.tab != "b") return ""
                                                if (player.subtabs.b.mainTabs != "Challenges") return ""
                                                return "Challenge completions are not reset unless said so, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "b") return ""
                                                if (player.subtabs.b.mainTabs != "Challenges") return ""
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
        name: "Circles",
        symbol: "C",
        position: 0,
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
        requires: new Decimal(0),
        resource: "Circles",
        baseResource: "Bacterias",
        baseAmount() {return player.b.points.floor()},
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("c")
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
                let x = getGeneralizedInitialPostMult("c")

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

                if (!player.j.puzzle.upgrades.includes(64)) ret = softcap(ret, "c_eff")

                ret = ret.times(tmp.c.buyables[12].effect)

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("c")
        },
        update(diff){
                let data = player.c

                data.best = data.best.max(data.points)
                if (hasUpgrade("c", 22)) {
                        data.points = player.c.points.plus(tmp.c.getResetGain.times(diff))
                        data.total = player.c.total.plus(tmp.c.getResetGain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (hasUpgrade("e", 11) || hasMilestone("goalsii", 1)) {
                        handleGeneralizedBuyableAutobuy(diff, "c")
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 2,
        hotkeys: [
                {key: "c", description: "C: Reset for Circles", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+C", description: "Shift+C: Go to Circles", onPress(){
                                showTab("c")
                        }
                },
        ],
        layerShown(){return player.b.best.gt(1e10) || player.c.best.gt(0) || hasUnlockedPast("c")},
        prestigeButtonText(){
                if (hasUpgrade("c", 22)) return ""
                return getGeneralizedPrestigeButtonText("c")
        },
        canReset(){
                return player.c.time >= 5 && !hasUpgrade("c", 22) && tmp.c.getResetGain.gt(0)
        },
        upgrades: {
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
                        description: "Gain a free <b>Omnipotent I</b> level per upgrade in this row",
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
                        description: "<b>Canada</b> gives free levels to <b>Omnipotent II</b> and <b>Compare</b> and unlock a <b>C</b> challenge",
                        cost: new Decimal("1e826733"),
                        unlocked(){ 
                                return hasUpgrade("d", 35) || hasUnlockedPast("e")
                        }, //hasUpgrade("c", 55)
                },
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: getGeneralizedBuyableData("c", 11, function(){
                        return hasUpgrade("d", 22) || hasUnlockedPast("d")
                        }),
                12: getGeneralizedBuyableData("c", 12, function(){
                        return hasUpgrade("c", 45) || hasUnlockedPast("d")
                        }),
                13: getGeneralizedBuyableData("c", 13, function(){
                        return hasUpgrade("d", 31) || hasUnlockedPast("e")
                        }),
                21: getGeneralizedBuyableData("c", 21, function(){
                        return hasUpgrade("d", 32) || hasUnlockedPast("e")
                        }),
                22: getGeneralizedBuyableData("c", 22, function(){
                        return hasUpgrade("d", 33) || hasUnlockedPast("e")
                        }),
                23: getGeneralizedBuyableData("c", 23, function(){
                        return hasUpgrade("d", 34) || hasUnlockedPast("e")
                        }),
                31: getGeneralizedBuyableData("c", 31, function(){
                        return hasUpgrade("e", 13) || hasUnlockedPast("e")
                        }),
                32: getGeneralizedBuyableData("c", 32, function(){
                        return hasMilestone("goalsii", 8) || player.g.best.gt(0) || hasUnlockedPast("g") 
                        }),
                33: getGeneralizedBuyableData("c", 33, function(){
                        return hasMilestone("goalsii", 15) || player.g.best.gt(0) || hasUnlockedPast("g") 
                        }),
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
                                        function() {
                                                if (player.tab != "c") return ""
                                                if (player.subtabs.c.mainTabs != "Upgrades") return ""
                                                if (!showCurrency(player.c.points)) return ""
                                                return shiftDown ? "Your best Circles is " + format(player.c.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "c") return ""
                                                if (hasUnlockedPast("c")) return ""
                                                if (player.subtabs.c.mainTabs != "Upgrades") return ""
                                                return "You have done " + formatWhole(player.c.times) + " Circle resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "c") return ""
                                                if (player.subtabs.c.mainTabs != "Upgrades") return ""
                                                if (!showCurrency(player.c.points)) return ""
                                                if (hasUpgrade("c", 22)) return "You are gaining " + format(tmp.c.getResetGain) + " Circles per second"
                                                return "There is a five second cooldown for prestiging (" + format(Math.max(0, 5-player.c.time)) + ")" 
                                        },
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
                                                if (player.tab != "c") return ""
                                                if (player.subtabs.c.mainTabs != "Buyables") return ""
                                                return "Each buyable gives free levels to all previous layers corresponding buyable"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "c") return ""
                                                if (!shiftDown || !hasUpgrade("c", 22)) return ""
                                                if (player.subtabs.c.mainTabs != "Buyables") return ""
                                                if (!showCurrency(player.c.points)) return ""
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
                                                if (player.tab != "c") return ""
                                                if (player.subtabs.c.mainTabs != "Challenges") return ""
                                                return "Challenge completions are not reset unless said so, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "c") return ""
                                                if (player.subtabs.c.mainTabs != "Challenges") return ""
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
        name: "Doodles",
        symbol: "D",
        position: 0,
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
        requires: new Decimal(0),
        resource: "Doodles",
        baseResource: "Circles",
        baseAmount() {return player.c.points.floor()},
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("d")
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
                let x = getGeneralizedInitialPostMult("d")

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
                return getGeneralizedEffectDisplay("d")
        },
        update(diff){
                let data = player.d
                
                data.best = data.best.max(data.points)
                if (hasUpgrade("d", 22)) {
                        data.points = data.points.plus(tmp.d.getResetGain.times(diff))
                        data.total = data.total.plus(tmp.d.getResetGain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (hasUpgrade("e", 14) || hasMilestone("goalsii", 1)) {
                        handleGeneralizedBuyableAutobuy(diff, "d")
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 3,
        hotkeys: [
                {key: "d", description: "D: Reset for Doodles", onPress(){if (canReset(this.layer)) doReset(this.layer)}},                      
                {key: "shift+D", description: "Shift+D: Go to Doodles", onPress(){
                                showTab("d")
                        }
                },
        ],
        layerShown(){return player.c.best.gt(5e10) || player.d.best.gt(0) || hasUnlockedPast("d")},
        prestigeButtonText(){
                if (hasUpgrade("d", 22)) return ""
                return getGeneralizedPrestigeButtonText("d")
        },
        canReset(){
                return player.d.time >= 5 && !hasUpgrade("d", 22) && tmp.d.getResetGain.gt(0)
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
                        cost: new Decimal("1e305999"),
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
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: getGeneralizedBuyableData("d", 11, function(){
                        return hasUpgrade("e", 13) || hasUnlockedPast("e")
                        }),
                12: getGeneralizedBuyableData("d", 12, function(){
                        return hasUpgrade("e", 13) || hasUnlockedPast("e")
                        }),
                13: getGeneralizedBuyableData("d", 13, function(){
                        return hasUpgrade("e", 13) || hasUnlockedPast("e")
                        }),
                21: getGeneralizedBuyableData("d", 21, function(){
                        return hasUpgrade("e", 14) || hasUnlockedPast("e")
                        }),
                22: getGeneralizedBuyableData("d", 22, function(){
                        return hasUpgrade("e", 15) || hasUnlockedPast("e")
                        }),
                23: getGeneralizedBuyableData("d", 23, function(){
                        return hasMilestone("goalsii", 21) || player.g.best.gt(0) || hasUnlockedPast("g")
                        }),
                31: getGeneralizedBuyableData("d", 31, function(){
                        return hasMilestone("goalsii", 24) || player.g.best.gt(0) || hasUnlockedPast("g")
                        }),
                32: getGeneralizedBuyableData("d", 32, function(){
                        return hasMilestone("g", 4) || hasUnlockedPast("g")
                        }),
                33: getGeneralizedBuyableData("d", 33, function(){
                        return hasUpgrade("d", 51) || hasUnlockedPast("g")
                        }),
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("d", 22) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "d") return ""
                                                if (player.subtabs.d.mainTabs != "Upgrades") return ""
                                                if (!showCurrency(player.d.points)) return ""
                                                return shiftDown ? "Your best Doodles is " + format(player.d.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "d") return ""
                                                if (hasUnlockedPast("d")) return ""
                                                if (player.subtabs.d.mainTabs != "Upgrades") return ""
                                                return "You have done " + formatWhole(player.d.times) + " Doodle resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "d") return ""
                                                if (player.subtabs.d.mainTabs != "Upgrades") return ""
                                                if (!showCurrency(player.d.points)) return ""
                                                if (hasUpgrade("d", 22)) return "You are gaining " + format(tmp.d.getResetGain) + " Doodles per second"
                                                return "There is a five second cooldown for prestiging (" + format(Math.max(0, 5-player.d.time)) + ")" 
                                        },
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
                                                if (player.tab != "d") return ""
                                                if (player.subtabs.d.mainTabs != "Buyables") return ""
                                                return "Each buyable gives free levels to all previous layers corresponding buyable"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "d") return ""
                                                if (player.subtabs.d.mainTabs != "Buyables") return ""
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
                                                if (player.tab != "d") return ""
                                                if (player.subtabs.d.mainTabs != "Challenges") return ""
                                                return "Challenge completions are not reset unless said so, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "d") return ""
                                                if (player.subtabs.d.mainTabs != "Challenges") return ""
                                                return "You have completed " + formatWhole(totalChallengeComps("d")) + " Doodle Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return false
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
        name: "Eggs",
        symbol: "E",
        position: 0,
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
        requires: new Decimal(0),
        resource: "Eggs",
        baseResource: "Doodles",
        baseAmount() {return player.d.points.floor()},
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("e")
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
                let x = getGeneralizedInitialPostMult("e")

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
                let exp = new Decimal(2)
                exp = exp.plus(CURRENT_BUYABLE_EFFECTS["f33"])
                exp = exp.times(CURRENT_BUYABLE_EFFECTS["h33"])

                let ret = amt.times(24).plus(1).pow(exp)

                if (!hasMilestone("k", 3)) ret = softcap(ret, "e_eff")

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("e")
        },
        update(diff){
                let data = player.e

                data.best = data.best.max(data.points)
                if (hasUpgrade("e", 22)) {
                        data.points = data.points.plus(tmp.e.getResetGain.times(diff))
                        data.total = data.total.plus(tmp.e.getResetGain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (hasMilestone("goalsii", 20)) {
                        handleGeneralizedBuyableAutobuy(diff, "e")
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 4,
        hotkeys: [
                {key: "e", description: "E: Reset for Eggs", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+E", description: "Shift+E: Go to Eggs", onPress(){
                                showTab("e")
                        }
                },
        ],
        layerShown(){return player.d.best.gt(5e10) || player.e.best.gt(0) || hasUnlockedPast("e")},
        prestigeButtonText(){
                if (hasUpgrade("e", 22)) return ""
                return getGeneralizedPrestigeButtonText("e")
        },
        canReset(){
                return player.e.time >= 5 && !hasUpgrade("e", 22) && tmp.e.getResetGain.gt(0)
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
                        description: "Square the successfully deved boosted to Max Charges",
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
                52: {
                        title: "Error",
                        description: "Raise charge gain ^1.1",
                        cost: new Decimal("1e53691"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 51) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 52)
                },
                53: {
                        title: "Engineering",
                        description: "Raise charge gain ^1.1",
                        cost: new Decimal("1e54074"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 52) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 53)
                },
                54: {
                        title: "Enough",
                        description: "ln(Charges) multiplies base <b>G</b> gain",
                        cost: new Decimal("1e54456"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 53) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 54)
                },
                55: {
                        title: "Effects",
                        description: "Each <b>G</b> upgrade multiplies base medal gain by 12 and adds 34 to the exponent",
                        cost: new Decimal("1e54456"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 54) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 55)
                },
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: getGeneralizedBuyableData("e", 11, function(){
                        return hasMilestone("goalsii", 19) || hasUnlockedPast("g") || player.g.best.gt(0) 
                        }),
                12: getGeneralizedBuyableData("e", 12, function(){
                        return hasMilestone("goalsii", 22) || hasUnlockedPast("g") || player.g.best.gt(0) 
                        }),
                13: getGeneralizedBuyableData("e", 13, function(){
                        return hasMilestone("goalsii", 24) || hasUnlockedPast("g") || player.g.best.gt(0) 
                        }),
                21: getGeneralizedBuyableData("e", 21, function(){
                        return hasUpgrade("goalsii", 21) || hasUnlockedPast("g") || player.g.best.gt(0) 
                        }),
                22: getGeneralizedBuyableData("e", 22, function(){
                        return hasUpgrade("goalsii", 22) || hasUnlockedPast("g") || player.g.best.gt(0) 
                        }),
                23: getGeneralizedBuyableData("e", 23, function(){
                        return hasUpgrade("goalsii", 23) || hasUnlockedPast("g") || player.g.best.gt(0) 
                        }),
                31: getGeneralizedBuyableData("e", 31, function(){
                        return hasUpgrade("goalsii", 24) || hasUnlockedPast("g")
                        }),
                32: getGeneralizedBuyableData("e", 32, function(){
                        return hasUpgrade("goalsii", 25) || hasUnlockedPast("g")
                        }),
                33: getGeneralizedBuyableData("e", 33, function(){
                        return hasUpgrade("e", 51) || hasUnlockedPast("g")
                        }),
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("e", 22) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "e") return ""
                                                if (player.subtabs.e.mainTabs != "Upgrades") return ""
                                                return shiftDown ? "Your best Eggs is " + format(player.e.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "e") return ""
                                                if (hasUnlockedPast("e")) return ""
                                                if (player.subtabs.e.mainTabs != "Upgrades") return ""
                                                return "You have done " + formatWhole(player.e.times) + " Egg resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "e") return ""
                                                if (player.subtabs.e.mainTabs != "Upgrades") return ""
                                                if (hasUpgrade("e", 22)) return "You are gaining " + format(tmp.e.getResetGain) + " Eggs per second"
                                                return "There is a five second cooldown for prestiging (" + format(Math.max(0, 5-player.e.time)) + ")" 
                                        },
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
                                                if (player.tab != "e") return ""
                                                if (!hasUpgrade("e", 22)) return ""
                                                if (!shiftDown) return ""
                                                if (player.subtabs.e.mainTabs != "Buyables") return ""
                                                return "You are gaining " + format(tmp.e.getResetGain) + " Eggs per second"
                                        },
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
                                                if (player.tab != "e") return ""
                                                if (player.subtabs.e.mainTabs != "Challenges") return ""
                                                return "Challenge completions are not reset unless said so, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "e") return ""
                                                if (player.subtabs.e.mainTabs != "Challenges") return ""
                                                return "You have completed " + formatWhole(totalChallengeComps("e")) + " Egg Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return false
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
        name: "Features",
        symbol: "F",
        position: 0,
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
        requires: new Decimal(0),
        resource: "Features",
        baseResource: "Eggs",
        baseAmount() {return player.e.points.floor()},
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("f")
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
                x = x.plus(CURRENT_GAMES_EFFECTS["rebirth"]["F gain exponent"][0])
                if (hasUpgrade("f", 25)) x = x.plus(player.f.upgrades.length ** 2)
                if (hasUpgrade("h", 11)) x = x.plus(78 * player.h.upgrades.length)
                x = x.plus(CURRENT_BUYABLE_EFFECTS["f12"])
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1/3)
                x = x.times(getGoalChallengeReward("13"))
                if (hasMilestone("goalsii", 14)) x = x.times(player.goalsii.points.plus(10).log10())
                x = x.times(player.e.best.max(10).log10().pow(getGoalChallengeReward("24")))
                x = x.times(CURRENT_GAMES_EFFECTS["rebirth"]["Base F gain"][0])
                if (hasUpgrade("h", 11)) x = x.times(Decimal.pow(90, player.h.upgrades.length))
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("f")

                x = x.times(tmp.goalsii.effect)
                x = x.times(getBuyableEffect("c", 33))
                x = x.times(upgradeEffect("goalsii", 15))
                if (hasUpgrade("goalsii", 24) && getChallengeDepth(4) > 0) {
                        x = x.times(Decimal.pow(1.25, player.goalsii.upgrades.length ** 2))
                }
                x = x.times(CURRENT_GAMES_EFFECTS["partial"]["Features"][0])
                x = x.times(CURRENT_GAMES_EFFECTS["complete"]["Features"][0])

                x = x.times(CURRENT_BUYABLE_EFFECTS["f11"])

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("f")) return new Decimal(1)

                let amt = player.f.points

                let exp = new Decimal(tmp.f.challenges[12].rewardEffect)
                exp = exp.plus(CURRENT_BUYABLE_EFFECTS["f22"])

                let ret = amt.times(4).plus(1).pow(exp)


                if (ret.gt(10)) ret = ret.pow(2).div(10)
                if (ret.gt(1000)) ret = ret.pow(2).div(1000)

                ret = softcap(ret, "f_eff")

                if (inChallenge("f", 21)) ret = doDilation(ret, .9)

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("f")
        },
        update(diff){
                let data = player.f

                data.best = data.best.max(data.points)
                if (player.goalsii.currentChallenge == "44"){
                        data.bestc44 = data.bestc44.max(data.points)
                }
                if (hasMilestone("goalsii", 9)) {
                        data.points = data.points.plus(tmp.f.getResetGain.times(diff))
                        data.total = data.total.plus(tmp.f.getResetGain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (hasUpgrade("h", 14) ) {
                        handleGeneralizedBuyableAutobuy(diff, "f")
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 5,
        hotkeys: [
                {key: "f", description: "F: Reset for Features", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+F", description: "Shift+F: Go to Features", onPress(){
                                showTab("f")
                        }
                },
        ],
        layerShown(){return player.e.best.gt(5e13) || player.f.best.gt(0) || hasUnlockedPast("f")},
        prestigeButtonText(){
                if (hasMilestone("goalsii", 9)) return ""
                return getGeneralizedPrestigeButtonText("f")
        },
        canReset(){
                return player.f.time >= 2 && !hasMilestone("goalsii", 9) && tmp.f.getResetGain.gt(0)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "For",
                        description: "Keep this upgrade and make <b>G</b> gain based on best <b>F</b>",
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
                        description: "Always act as if you are in medal challenge 00",
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
                51: {
                        title: "Fax",
                        description: "<b>February</b> gives free <b>Four</b> levels",
                        cost: new Decimal("1e1147300"),
                        unlocked(){ 
                                return hasUpgrade("f", 45) || hasUnlockedPast("h")
                        }, // hasUpgrade("f", 51)
                },
                52: {
                        title: "Format",
                        description: "<b>Future</b> gives free <b>Four</b> levels and unlock an <b>F</b> buyable",
                        cost: new Decimal("1e2134765"),
                        unlocked(){ 
                                return hasUpgrade("g", 34) || hasUnlockedPast("h")
                        }, // hasUpgrade("f", 52)
                },
                53: {
                        title: "Fun",
                        description: "Raise the rebirth to Games effect ^50",
                        cost: new Decimal("1e7082300"),
                        unlocked(){ 
                                return hasUpgrade("h", 23) || hasUnlockedPast("h")
                        }, // hasUpgrade("f", 53)
                },
                54: {
                        title: "Five",
                        description: "Per <b>F</b> challenge act as if you have .5% less rebirths",
                        cost: new Decimal("1e41236e3"),
                        unlocked(){ 
                                return hasUpgrade("g", 45) || hasUnlockedPast("h")
                        }, // hasUpgrade("f", 54)
                },
                55: {
                        title: "France",
                        description: "Raise rebirth base Game gain effect ^1.5 and act as if you have 20% less rebirths",
                        cost: new Decimal("1e63758400"),
                        unlocked(){ 
                                return hasUpgrade("f", 54) || hasUnlockedPast("h")
                        }, // hasUpgrade("f", 55)
                },
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: getGeneralizedBuyableData("f", 11, function(){
                        return hasUpgrade("goalsii", 34) || hasUnlockedPast("h")
                        }),
                12: getGeneralizedBuyableData("f", 12, function(){
                        return hasUpgrade("h", 15) || hasUnlockedPast("h")
                        }),
                13: getGeneralizedBuyableData("f", 13, function(){
                        return hasUpgrade("h", 21) || hasUnlockedPast("h")
                        }),
                21: getGeneralizedBuyableData("f", 21, function(){
                        return hasUpgrade("f", 52) || hasUnlockedPast("h")
                        }),
                22: getGeneralizedBuyableData("f", 22, function(){
                        return hasUpgrade("i", 11) || hasUnlockedPast("i")
                        }),
                23: getGeneralizedBuyableData("f", 23, function(){
                        return hasUpgrade("goalsii", 44) || hasUnlockedPast("i")
                        }),
                31: getGeneralizedBuyableData("f", 31, function(){
                        return hasUpgrade("goalsii", 45) || hasUnlockedPast("i")
                        }),
                32: getGeneralizedBuyableData("f", 32, function(){
                        return hasUpgrade("h", 33) || hasUnlockedPast("i")
                        }),
                33: getGeneralizedBuyableData("f", 33, function(){
                        return hasUpgrade("h", 34) || hasUnlockedPast("i")
                        }),
        },
        challenges: {
                rows: 2,
                cols: 2,
                11: {
                        name: "Files",
                        challengeDescription: "All previous layer buyables have no effect",
                        rewardDescription: "Give free <b>February</b> levels",
                        rewardEffect(){
                                let c = challengeCompletions("f", 11)
                                let ret = Math.pow(c, 3) + c * 31
                                return Math.floor(ret)
                        },
                        goal(){
                                let init = new Decimal("1e114270e3")
                                let factor = getChallengeFactor(challengeCompletions("f", 11))
                                if (factor.eq(1)) factor = new Decimal(0)
                                return init.times(Decimal.pow("1e3975e3", factor))
                        },
                        unlocked(){
                                return hasUpgrade("h", 15) || hasUnlockedPast("h")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let ret = 20
                                if (hasUpgrade("g", 55)) ret += 5
                                if (hasUpgrade("h", 34)) ret += player.i.upgrades.length
                                if (player.j.puzzle.upgrades.includes(51)) ret += 5
                                if (hasUpgrade("j", 24)) ret ++

                                return ret
                        },
                },
                12: {
                        name: "Film",
                        challengeDescription: "<b>Files</b> and dilate all previous prestige gain ^.9",
                        rewardDescription: "Raise the <b>F</b> effect to a power",
                        rewardEffect(){
                                let c = challengeCompletions("f", 12)
                                let exp = new Decimal(.5)
                                exp = exp.plus(CURRENT_BUYABLE_EFFECTS["g32"])

                                let ret = Decimal.pow(c + 1, exp)
                                return ret
                        },
                        goal(){
                                let init = new Decimal("1e20876e3")
                                let factor = getChallengeFactor(challengeCompletions("f", 12))
                                if (factor.eq(1)) factor = new Decimal(0)
                                return init.times(Decimal.pow("1e4012e3", factor))
                        },
                        unlocked(){
                                return hasUpgrade("g", 33) || hasUnlockedPast("h")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let ret = 20
                                if (hasUpgrade("g", 55)) ret += 5
                                if (hasUpgrade("h", 34)) ret += player.i.upgrades.length
                                if (player.j.puzzle.upgrades.includes(51)) ret += 5
                                if (hasUpgrade("j", 24)) ret ++

                                return ret
                        },
                        countsAs: [11],
                },
                21: {
                        name: "Further",
                        challengeDescription: "<b>Film</b> and dilate <b>F</b> effect ^.9",
                        rewardDescription: "Raise the <b>G</b> effect to a power",
                        rewardEffect(){
                                let c = challengeCompletions("f", 21)
                                let ret = Math.pow(c + 1, .25)
                                return ret
                        },
                        goal(){
                                let init = new Decimal("1e18560e3")
                                let factor = getChallengeFactor(challengeCompletions("f", 21))
                                if (factor.eq(1)) factor = new Decimal(0)
                                return init.times(Decimal.pow("1e1602e3", factor))
                        },
                        unlocked(){
                                return hasUpgrade("g", 35) || hasUnlockedPast("h")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let ret = 20
                                if (hasUpgrade("g", 55)) ret += 5
                                if (hasUpgrade("h", 34)) ret += player.i.upgrades.length
                                if (player.j.puzzle.upgrades.includes(51)) ret += 5
                                if (hasUpgrade("j", 24)) ret ++

                                return ret
                        },
                        countsAs: [11, 12],
                },
                22: {
                        name: "Federal",
                        challengeDescription: "<b>Further</b> and dilate point gain ^.9",
                        rewardDescription: "Boost base <b>G</b> gain",
                        rewardEffect(){
                                let c = challengeCompletions("f", 22)
                                let base = new Decimal(2)
                                base = base.plus(CURRENT_BUYABLE_EFFECTS["g21"])
                                let ret = Decimal.pow(base, c)
                                return ret
                        },
                        goal(){
                                let c = challengeCompletions("f", 22)
                                let init = new Decimal("1e160154e3")
                                let factor = getChallengeFactor(c)
                                if (factor.eq(1)) factor = new Decimal(0)
                                if (c == 2) factor = new Decimal(3.788)
                                return init.times(Decimal.pow("1e3820e3", factor))
                        },
                        unlocked(){
                                return hasUpgrade("i", 12) || hasUnlockedPast("i")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let ret = 20
                                if (hasUpgrade("g", 55)) ret += 5
                                if (hasUpgrade("h", 34)) ret += player.i.upgrades.length
                                if (player.j.puzzle.upgrades.includes(51)) ret += 5
                                if (hasUpgrade("j", 24)) ret ++

                                return ret
                        },
                        countsAs: [11, 12, 21],
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasMilestone("goalsii", 9) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "f") return ""
                                                if (player.subtabs.f.mainTabs != "Upgrades") return ""
                                                return shiftDown ? "Your best Features is " + format(player.f.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "f") return ""
                                                if (hasUnlockedPast("f")) return ""
                                                if (player.subtabs.f.mainTabs != "Upgrades") return ""
                                                return "You have done " + formatWhole(player.f.times) + " Feature resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "f") return ""
                                                if (player.subtabs.f.mainTabs != "Upgrades") return ""
                                                if (hasMilestone("goalsii", 9)) return "You are gaining " + format(tmp.f.getResetGain) + " Features per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.f.time)) + ")" 
                                        },
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
                                return hasUpgrade("goalsii", 34) || hasUnlockedPast("h")
                        },
                },
                "Challenges": {
                        content: [
                                ["display-text",
                                        function() {
                                                if (player.tab != "f") return ""
                                                if (player.subtabs.f.mainTabs != "Challenges") return ""
                                                return "Challenge completions are not reset unless said so, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                               if (player.tab != "f") return ""
                                               if (player.subtabs.f.mainTabs != "Challenges") return ""
                                                return "You have completed " + formatWhole(totalChallengeComps("f")) + " Feature Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return hasUpgrade("h", 15) || hasUnlockedPast("h")
                        },
                },
        },
        doReset(layer){
                if (layer == "f") player.f.time = 0
                if (!getsReset("f", layer)) return
                player.f.time = 0
                player.f.times = 0

                if (!hasMilestone("h", 7) && !hasMilestone("i", 5) && !hasMilestone("k", 1)) {
                        //upgrades
                        let keep = []
                        if (hasUpgrade("f", 11)) keep.push(11)
                        player.f.upgrades = filter(player.f.upgrades, keep)
                }

                //resources
                player.f.points = new Decimal(0)
                player.f.total = new Decimal(0)
                player.f.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.f.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})

addLayer("ach", {
        name: "Goals",
        symbol: "⭑", 
        position: 1,
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
                hiddenRows: 0,
                clickedYeet: 0,
        }},
        color: "#FFC746",
        branches: ["goalsii"],
        requires: new Decimal(0),
        resource: "Goals",
        baseResource: "points",
        baseAmount() {return new Decimal(0)},
        type: "custom",
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
        row: "side",
        hotkeys: [],
        layerShown(){return true},
        prestigeButtonText(){
                return ""
        },
        canReset(){
                return false
        },
        achievements: getFirstNAchData(Object.keys(PROGRESSION_MILESTONES).length),
        clickables: {
                rows: 1,
                cols: 3,
                11: {
                        title(){
                                if (player.tab != "ach") return ""
                                if (player.subtabs.ach.mainTabs != "Achievements") return ""
                                return "<h3 style='color: #0033FF'>Hide the top row</h3>"
                        },
                        display(){
                                return ""
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return player.ach.hiddenRows < Object.keys(PROGRESSION_MILESTONES).length/7
                        },
                        onClick(){
                                if (!this.canClick()) return 
                                player.ach.hiddenRows ++
                        },
                },
                12: {
                        title(){
                                if (player.tab != "ach") return ""
                                if (player.subtabs.ach.mainTabs != "Achievements") return ""
                                return "<h3 style='color: #0033FF'>Show a row</h3>"
                        },
                        display(){
                                return ""
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return player.ach.hiddenRows > 0
                        },
                        onClick(){
                                if (!this.canClick()) return 
                                player.ach.hiddenRows --
                        },
                },
                13: {
                        title(){
                                if (player.tab != "ach") return ""
                                if (player.subtabs.ach.mainTabs != "Achievements") return ""
                                return "<h3 style='color: #0033FF'>Click</h3>"
                        },
                        display(){
                                return formatWhole(player.ach.clickedYeet) + (player.ach.clickedYeet == 69 ? " nice" : "")
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return true
                        },
                        onClick(){
                                player.ach.clickedYeet ++ 
                        },
                },
        },
        milestones: {
                1: {
                        requirementDescription(){
                                if (player.tab != "ach") return ""
                                if (player.subtabs.ach.mainTabs != "Milestones") return ""
                                return "<b>Life</b><br>Requires: " + formatWhole(tmp.ach.milestones[1].req) + " Goals"
                        }, 
                        effectDescription: "You permanently keep all <b>A</b> upgrades",
                        done(){
                                return player.ach.points.gte(tmp.ach.milestones[1].req)
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
                                if (player.tab != "ach") return ""
                                if (player.subtabs.ach.mainTabs != "Milestones") return ""
                                return "<b>The Universe</b><br>Requires: " + formatWhole(tmp.ach.milestones[2].req) + " Goals"
                        }, 
                        effectDescription: "You permanently keep all <b>B</b> upgrades",
                        done(){
                                return player.ach.points.gte(tmp.ach.milestones[2].req)
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
                                if (player.tab != "ach") return ""
                                if (player.subtabs.ach.mainTabs != "Milestones") return ""
                                return "<b>And Everything</b><br>Requires: " + formatWhole(tmp.ach.milestones[3].req) + " Goals"
                        }, 
                        effectDescription: "You permanently keep all <b>C</b> upgrades",
                        done(){
                                return player.ach.points.gte(tmp.ach.milestones[3].req)
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
                                if (player.tab != "ach") return ""
                                if (player.subtabs.ach.mainTabs != "Milestones") return ""
                                return "<b>Tell me and I forget</b><br>Requires: " + formatWhole(tmp.ach.milestones[4].req) + " Goals"
                        }, 
                        effectDescription: "All autobuyers buy 100x more",
                        done(){
                                return player.ach.points.gte(tmp.ach.milestones[4].req)
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
                                if (player.tab != "ach") return ""
                                if (player.subtabs.ach.mainTabs != "Milestones") return ""
                                return "<b>Teach me and I remember</b><br>Requires: " + formatWhole(tmp.ach.milestones[5].req) + " Goals"
                        }, 
                        effectDescription: "You permanently keep all <b>D</b> upgrades",
                        done(){
                                return player.ach.points.gte(tmp.ach.milestones[5].req)
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
                                if (player.tab != "ach") return ""
                                if (player.subtabs.ach.mainTabs != "Milestones") return ""
                                return "<b>Involve me and I learn</b><br>Requires: " + formatWhole(tmp.ach.milestones[6].req) + " Goals (needs Eighty or in Challenge 4)"
                        }, 
                        effectDescription: "You permanently keep all <b>E</b> upgrades and add 1.5 to the <b>F</b> gain exponent",
                        done(){
                                return player.ach.points.gte(tmp.ach.milestones[6].req) && (getChallengeDepth(4) > 0 || hasAchievement("ach", 123))
                        },
                        req(){
                                let a = 69
                                return new Decimal(a).floor()
                        },
                        unlocked(){
                                return true
                        },
                },
        },
        tabFormat: {
                "Achievements": {
                        content: [
                                "main-display-goals",
                                "clickables",
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
                if (hasMilestone("i", 1)) return 

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
        position: 2,
        startData() { return {} },
        color: "#CC66CC",
        branches: [],
        requires: new Decimal(0),
        resource: "Medals",
        baseResource: "points",
        baseAmount() {return new Decimal(0)},
        type: "custom",
        getResetGain() {
                return new Decimal(0)
        },
        row: "side",
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

addLayer("ghostTWO", {
        position: 0,
        startData() { return {} },
        color: "#CC66CC",
        branches: [],
        requires: new Decimal(0),
        resource: "Medals",
        baseResource: "points",
        baseAmount() {return new Decimal(0)},
        type: "custom",
        getResetGain() {
                return new Decimal(0)
        },
        row: "side",
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
        name: "Goals II",
        symbol: "✦",
        position: 3,
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
        requires: new Decimal(0),
        resource: "Medals",
        baseResource: "points",
        baseAmount() {return new Decimal(0)},
        type: "custom",
        getResetGain() {
                let a 
                if (player.f.best.eq(0)) a = new Decimal(0)
                else a = new Decimal(1)

                let b = player.f.best.max(1).log10().div(9.5).plus(1)

                if (getChallengeDepth(3) > 0) b = b.minus(2).max(0)

                a = a.times(b)

                if (a.lt(1)) return new Decimal(0)

                let pre = tmp.goalsii.getGainMultPre
                let exp = tmp.goalsii.getGainExp
                let pst = tmp.goalsii.getGainMultPost

                let ret = a.times(pre).pow(exp).times(pst)

                if (ret.gt(1e4) && !hasMilestone("g", 10)) ret = ret.div(1e4).sqrt().times(1e4)

                return ret.floor()
        },
        getGainExp(){
                let x = new Decimal(1)
                if (hasMilestone("goalsii", 13)) x = x.plus(1)
                if (hasUpgrade("f", 42)) x = x.plus(player.f.upgrades.length)
                if (hasUpgrade("e", 55)) x = x.plus(player.g.upgrades.length * 34)
                x = x.plus(CURRENT_BUYABLE_EFFECTS["f23"])
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                if (hasUpgrade("f", 45)) x = x.times(player.g.points.max(10).log10())
                if (hasUpgrade("e", 55)) x = x.times(player.g.upgrades.length * 12)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)
                x = x.times(getGoalChallengeReward("31"))
                x = x.times(getGoalChallengeReward("41"))
                if (hasMilestone("g", 1)) x = x.times(2)
                if (hasMilestone("g", 3)) x = x.times(Decimal.pow(1.5, player.g.milestones.length))
                if (hasUpgrade("goalsii", 24)) x = x.times(Decimal.pow(1.1, player.goalsii.upgrades.length))
                x = x.times(CURRENT_BUYABLE_EFFECTS["e32"])
                x = x.times(CURRENT_GAMES_EFFECTS["partial"]["Medals"][0])
                x = x.times(CURRENT_GAMES_EFFECTS["rebirth"]["Medals"][0])
                if (hasMilestone("g", 14)) {
                        x = x.times(Decimal.pow(2, player.g.milestones.length))
                }
                if (hasUpgrade("goalsii", 34)) x = x.times(10)
                return x
        },
        effect(){
                if (inChallenge("h", 12)) return new Decimal(1)

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
                return getGeneralizedEffectDisplay("goalsii")
        },
        update(diff){
                let data = player.goalsii
                let gain = tmp.goalsii.getResetGain

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
                        if (data.abtime > 1) {
                                data.abtime += -1
                        }
                } else {
                        data.abtime = 0
                }
                data.time += diff
                data.abupgstime += diff

                if (data.abupgstime > 10) data.abupgstime = 10
                if (data.abupgstime < 1) return
                data.abupgstime += -1

                let l =  ["a", "b", "c", "d", "e"]
                let l2 = ["A", "B", "C", "D", "E"]
                let trylist = [11, 12, 13, 14, 15, 
                               21, 22, 23, 24, 25,
                               31, 32, 33, 34, 35,
                               41, 42, 43, 44, 45,
                               51, 52, 53, 54, 55,]
                for (j in l){
                        i = l[j]
                        let can = data["autobuy" + l2[j]] && hasMilestone("goalsii", String(Number(j) + 2))
                        if (!can) continue
                        for (k in trylist) {
                                if (hasUpgrade(i, trylist[k])) continue
                                if (layers[i].upgrades[trylist[k]] == undefined) continue
                                
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
        row: "side",
        hotkeys: [
                {key: "[", description: "[: Reset for Medals", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+{", description: "Shift+[: Go to Medals", onPress(){
                                showTab("goalsii")
                        }
                },
        ],
        layerShown(){return player.goalsii.times > 0 || player.f.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")},
        prestigeButtonText(){
                if (player.tab != "goalsii") return ""
                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                let b = ""
                if (player.goalsii.times > 0) b = "This will keep you in the same challenge <br>"

                let gain = tmp.goalsii.getResetGain

                let a = "Reset for " + formatWhole(gain) + " " + this.resource

                let mid = ""
                if (!hasMilestone("goalsii", 12)) mid += " " + player.goalsii.currentChallenge

                a += "<br> and " + formatWhole(this.getTokenToMedalGain(gain)) + mid + " tokens"

                return b + a
        },
        canReset(){
                return player.f.best.gt(0) && tmp.goalsii.getResetGain.gt(0)
        },
        clickables: {
                rows: 5,
                cols: 5,
                11: {
                        title(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["00"].gt(0)) return "<h3 style='color: #13ACDF'>00</h3>"
                                return "<h3 style='color: #C03000'>00</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["00"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("00"), 4) + " to<br>"
                                let c = "all prior prestige gain exponents"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["01"].gt(0)) return "<h3 style='color: #13ACDF'>01</h3>"
                                return "<h3 style='color: #C03000'>01</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["01"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("01").times(100), 4) + "<br>"
                                let c = "/100 to <b>Country</b> and <b>Omnipotent I</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["02"].gt(0)) return "<h3 style='color: #13ACDF'>02</h3>"
                                return "<h3 style='color: #C03000'>02</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["02"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("02"), 4) + " to<br>"
                                let c = "Doodle effect exponent"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["03"].gt(0)) return "<h3 style='color: #13ACDF'>03</h3>"
                                return "<h3 style='color: #C03000'>03</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["03"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("03"), 4) + " to<br>"
                                let c = "<b>Delivery</b> and <b>December</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["04"].gt(0)) return "<h3 style='color: #13ACDF'>04</h3>"
                                return "<h3 style='color: #C03000'>04</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["04"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("04"), 4) + "<br>"
                                let c = "to <b>Experience</b> and <b>Card</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["10"].gt(0)) return "<h3 style='color: #13ACDF'>10</h3>"
                                return "<h3 style='color: #C03000'>10</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["10"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("10")) + "<br>"
                                let c = "Free <b>Director</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["11"].gt(0)) return "<h3 style='color: #13ACDF'>11</h3>"
                                return "<h3 style='color: #C03000'>11</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["11"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("11")) + "<br>"
                                let c = "Free <b>Omnipotent II</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["12"].gt(0)) return "<h3 style='color: #13ACDF'>12</h3>"
                                return "<h3 style='color: #C03000'>12</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["12"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("12")) + "<br>"
                                let c = "Free <b>Category</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["13"].gt(0)) return "<h3 style='color: #13ACDF'>13</h3>"
                                return "<h3 style='color: #C03000'>13</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["13"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: *" + format(getGoalChallengeReward("13"), 4) + " <br>to "
                                let c = "base <b>F</b> gain"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["14"].gt(0)) return "<h3 style='color: #13ACDF'>14</h3>"
                                return "<h3 style='color: #C03000'>14</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["14"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("14")) + "<br>"
                                let c = "free <b>Experience</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["20"].gt(0)) return "<h3 style='color: #13ACDF'>20</h3>"
                                return "<h3 style='color: #C03000'>20</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["20"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("20"), 4) + "<br>"
                                let c = "to <b>Department</b><br>base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["21"].gt(0)) return "<h3 style='color: #13ACDF'>21</h3>"
                                return "<h3 style='color: #C03000'>21</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["21"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: x" + format(getGoalChallengeReward("21")) + "<br>"
                                let c = "<b>Egg</b> gain and <b>Account</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["22"].gt(0)) return "<h3 style='color: #13ACDF'>22</h3>"
                                return "<h3 style='color: #C03000'>22</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["22"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("22")) + "<br>"
                                let c = "free <b>Drive</b><br>levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["23"].gt(0)) return "<h3 style='color: #13ACDF'>23</h3>"
                                return "<h3 style='color: #C03000'>23</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["23"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("23"), 4) + " to<br>"
                                let c = "<b>E</b> gain exp"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["24"].gt(0)) return "<h3 style='color: #13ACDF'>24</h3>"
                                return "<h3 style='color: #C03000'>24</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["24"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: log(eggs)^" + format(getGoalChallengeReward("24"), 4) + "<br>"
                                let c = "boosts base <b>F</b> gain"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["30"].gt(0)) return "<h3 style='color: #13ACDF'>30</h3>"
                                return "<h3 style='color: #C03000'>30</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["30"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("30"), 4) + " to<br>"
                                let c = "<b>F</b> gain exp"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["31"].gt(0)) return "<h3 style='color: #13ACDF'>31</h3>"
                                return "<h3 style='color: #C03000'>31</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["31"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: *" + format(getGoalChallengeReward("31"), 4) + " to<br>"
                                let c = "medal and base <b>E</b> gain"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["32"].gt(0)) return "<h3 style='color: #13ACDF'>32</h3>"
                                return "<h3 style='color: #C03000'>32</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["32"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("32"), 4) + " to<br>"
                                let c = "<b>Director</b> base per <b>Director</b>"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["33"].gt(0)) return "<h3 style='color: #13ACDF'>33</h3>"
                                return "<h3 style='color: #C03000'>33</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["33"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("33"), 2) + " to<br>"
                                let c = "<b>E</b> gain exp"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["34"].gt(0)) return "<h3 style='color: #13ACDF'>34</h3>"
                                return "<h3 style='color: #C03000'>34</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["34"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: /" + format(getGoalChallengeReward("34")) + "<br>"
                                let c = "<b>East</b> cost and <b>Due</b> linear scaling"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["40"].gt(0)) return "<h3 style='color: #13ACDF'>40</h3>"
                                return "<h3 style='color: #C03000'>40</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["40"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("40")) + "<br>"
                                let c = "free <b>Example</b> and <b>Database</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["41"].gt(0)) return "<h3 style='color: #13ACDF'>41</h3>"
                                return "<h3 style='color: #C03000'>41</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["41"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: *" + format(getGoalChallengeReward("41")) + " to<br>"
                                let c = "medal gain and <b>Department</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["42"].gt(0)) return "<h3 style='color: #13ACDF'>42</h3>"
                                return "<h3 style='color: #C03000'>42</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["42"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("42"), 4) + " to<br>"
                                let c = "<b>Omnipotent III</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["43"].gt(0)) return "<h3 style='color: #13ACDF'>43</h3>"
                                return "<h3 style='color: #C03000'>43</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["43"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("43")) + "<br>"
                                let c = "free <b>Easy</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                if (player.goalsii.tokens.best["44"].gt(0)) return "<h3 style='color: #13ACDF'>44</h3>"
                                return "<h3 style='color: #C03000'>44</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["44"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("44")) + "<br>"
                                let c = "free <b>Enter</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Milestones") return ""
                                let a = "log10(10+medals) boosts base <b>F</b> gain, currently: "
                                return a + format(player.goalsii.points.max(10).log10(), 4)
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
                                if (player.tab != "goalsii") return ""
                                if (player.subtabs.goalsii.mainTabs != "Milestones") return ""
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
                31: {
                        title: "Kempe",
                        description: "The 16 games that give progress bulk complete automatically so long as you have the games",
                        cost: new Decimal("1e4098"),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasUpgrade("h", 13) || hasUnlockedPast("h")
                        }, // hasUpgrade("goalsii", 31)
                },
                32: {
                        title: "Laplace",
                        description: "Each upgrade multiplies base <b>G</b> gain by 1.1 and double <b>Gold</b> speed",
                        cost: new Decimal("1e4099"),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 31) || hasUnlockedPast("h")
                        }, // hasUpgrade("goalsii", 32)
                },
                33: {
                        title: "Mandelbrot",
                        description: "Each upgrade raises charge gain ^1.1 and double <b>Gold</b> speed",
                        cost: new Decimal("1e4125"),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 32) || hasUnlockedPast("h")
                        }, // hasUpgrade("goalsii", 33)
                },
                34: {
                        title: "Noether",
                        description: "Unlock an <b>F</b> buyable, double <b>Gold</b> speed, and gain 10x medals",
                        cost: new Decimal("1e4128"),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 33) || hasUnlockedPast("h")
                        }, // hasUpgrade("goalsii", 34)
                },
                35: {
                        title: "Oppenheim",
                        description: "<b>Four</b> gives free <b>Omnipotent V</b> levels",
                        cost: new Decimal("1e4129"),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 34) || hasUnlockedPast("h")
                        }, // hasUpgrade("goalsii", 35)
                },
                41: {
                        title: "Poisson",
                        description: "Per upgrade add 1 to the <b>H</b> gain exponent",
                        cost: new Decimal("5e186621"),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasUpgrade("g", 54) || hasUnlockedPast("i")
                        }, // hasUpgrade("goalsii", 41)
                },
                42: {
                        title: "Russell",
                        description: "Per upgrade act as if you have 2% less rebirths",
                        cost: new Decimal("1e186645"),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 41) || hasUnlockedPast("i")
                        }, // hasUpgrade("goalsii", 42)
                },
                43: {
                        title: "Schrier",
                        description: "Unlock Rebirth III",
                        cost: new Decimal("1e14159e3"),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 42) || hasUnlockedPast("i")
                        }, // hasUpgrade("goalsii", 43)
                },
                44: {
                        title: "Turing",
                        description: "<b>Goal</b> gives free <b>Guidelines</b> levels and unlock an <b>F</b> buyable",
                        cost: new Decimal("1e23266e3"),
                        unlocked(){ 
                                return hasUpgrade("goalsii", 43) || hasUnlockedPast("i")
                        }, // hasUpgrade("goalsii", 44)
                },
                45: {
                        title: "Ufimtsev",
                        description: "Automatically bulk buy Rebirth II and unlock an <b>F</b> buyable",
                        cost: new Decimal("1e28689e3"),
                        unlocked(){ 
                                return hasUpgrade("goalsii", 44) || hasUnlockedPast("i")
                        }, // hasUpgrade("goalsii", 45)
                },
        },
        tabFormat: {
                "Challenges": {
                        content: [
                                "main-display",
                                ["display-text", "This resets all prior Goals and all layers before and including F and their challenges"],
                                ["display-text", "Click a button below to enter a challenge", function (){ return !player.goalsii.best.gt(0) ? {'display': 'none'} : {}}],
                                ["display-text", function() {
                                        if (player.tab != "goalsii") return ""
                                        if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
                                        
                                        let a = "You are currently in challenge <h3 style = 'color: #CC00FF'>" + player.goalsii.currentChallenge + "</h3>"
                                        let b = ". Check details to see what challenge effects you current have!"
                                        return a + (getChallengeDepth(1) == 0 ? "" : b)
                                }],
                                ["display-text", function() {
                                        if (player.tab != "goalsii") return ""
                                        if (player.subtabs.goalsii.mainTabs != "Challenges") return ""
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
                                        if (player.tab != "goalsii") return ""
                                        if (player.subtabs.goalsii.mainTabs != "Details") return ""
                                        return "You are currently in challenge <h3 style = 'color: #CC00FF'>" + player.goalsii.currentChallenge + "</h3>"
                                }],
                                ["display-text", function() {
                                        if (player.tab != "goalsii") return ""
                                        if (player.subtabs.goalsii.mainTabs != "Details") return ""
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
                                        if (player.tab != "goalsii") return ""
                                        if (player.subtabs.goalsii.mainTabs != "Details") return ""
                                        let a = `<br><br>
                                        <h2 style = 'color: #CC0033'>Explanation</h2><h2>:</h2> <br><br>

                                        Each challenge has a reward, and upon claiming said reward<br>
                                        all prior unlocked main layers are totally reset, and goals are also reset<br>
                                        <br>
                                        There are 5 challenges, and the first is nothing<br>
                                        <br>
                                        Challenge AB means you are in Challenge A twice and Challenge B once<br>
                                        For example Challenge 03 means you are in challenge 0 twice and challenge 3 once<br>
                                        and Challenge 22 means you are in challenge 2 twice and challenge 2 once,<br>
                                        which means you are in challenge 2 three times in total<br>
                                        <br>
                                        Each completion gives tokens<br>
                                        The following only applies to layers unlocked before Goals II<br>
                                        C0: Nothing<br>
                                        C1: Raise all prestige gains ^.985 + C0<br>
                                        C2: Raise point, Egg, and Feature gain ^.9 + C1<br>
                                        C3: First column buyables do not give effects in the first n layers<br> and raise <b>Egg</b> gain ^.8 + 2xC2<br>
                                        C4: No buyables give free levels to buyables in the first n layers<br> and raise <b>Feature</b> gain ^.9 + 3xC3<br>
                                        <br>
                                        You can only enter challenges if you can medal reset or if you aren't in challenge 00<br>
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
                                return player.goalsii.best.gt(0) || tmp.g.layerShown
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                "milestones",
                        ],
                        unlocked(){
                                return player.goalsii.times > 1 || tmp.g.layerShown
                        },
                },
                "Upgrades": {
                        content: [
                                "main-display",
                                ["display-text", function(){
                                                if (player.tab != "goalsii") return ""
                                                if (player.subtabs.goalsii.mainTabs != "Upgrades") return ""
                                                return "Upgrades require a certain number of tokens, but do not cost tokens"
                                        },
                                ],
                                "upgrades",
                        ],
                        unlocked(){
                                return hasMilestone("goalsii", 24) || tmp.g.layerShown
                        },
                },
        },
        doReset(layer){
                if (["a","b","c","d","e","f","ach","goalsii"].includes(layer)) return
                if (hasMilestone("i", 1)) return

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

                let k = ["a", "b", "c", "d", "e"]
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
        name: "Games",
        symbol: "G",
        position: 0,
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
        requires: new Decimal(0),
        resource: "Games",
        baseResource: "Features",
        baseAmount() {
                if (hasUpgrade("f", 11)) return player.f.best
                return player.f.bestc44.floor()
        },
        type: "custom",
        getResetGain() {
                if (tmp.g.baseAmount.lt(1e19)) return new Decimal(0)
                return getGeneralizedPrestigeGain("g")
        },
        getBaseDiv(){
                let x = new Decimal(1e9)
                return x
        },
        getGainExp(){
                let x = new Decimal(1.5)
                if (hasMilestone("g", 10)) x = x.plus(player.g.partialTally.min(5e7).times(.01))
                x = x.plus(CURRENT_GAMES_EFFECTS["partial"]["G Gain exponent"][0])
                if (hasUpgrade("f", 24)) x = x.plus(player.f.upgrades.length ** 2)
                if (hasUpgrade("g", 25)) x = x.plus(6 * player.g.upgrades.length)
                x = x.plus(CURRENT_BUYABLE_EFFECTS["g11"])
                x = x.plus(CURRENT_BUYABLE_EFFECTS["h11"])
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1/10)
                if (hasMilestone("g", 15)) x = x.times(2)
                x = x.times(CURRENT_GAMES_EFFECTS["partial"]["Base G Gain"][0])
                x = x.times(CURRENT_GAMES_EFFECTS["rebirth"]["Base G Gain"][0])
                x = x.times(CURRENT_GAMES_EFFECTS["complete"]["Base G Gain"][0])
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
                if (hasUpgrade("e", 54)) x = x.times(player.g.charges.max(3).ln())
                if (hasUpgrade("g", 25)) x = x.times(Decimal.pow(5, player.g.upgrades.length))
                if (hasUpgrade("h", 12)) x = x.times(Decimal.pow(2, player.h.upgrades.length))
                if (hasUpgrade("goalsii", 32)) x = x.times(Decimal.pow(1.1, player.goalsii.upgrades.length))
                if (hasUpgrade("g", 33)) x = x.times(Decimal.pow(2, totalChallengeComps("f")))
                if (hasMilestone("i", 3)) x = x.times(Decimal.pow(2, player.i.milestones.length))
                x = x.times(tmp.f.challenges[22].rewardEffect)
                x = x.times(CURRENT_BUYABLE_EFFECTS["g12"])
                x = x.times(CURRENT_BUYABLE_EFFECTS["h31"])
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("g")

                x = x.times(CURRENT_GAMES_EFFECTS["partial"]["Games"][0])
                x = x.times(CURRENT_GAMES_EFFECTS["complete"]["Games"][0])
                x = x.times(CURRENT_GAMES_EFFECTS["rebirth"]["Games"][0])
                if (hasMilestone("g", 13)) x = x.times(Decimal.sqrt(Decimal.max(player.g.charges, 1)))

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("g")) return new Decimal(1)

                let amt = player.g.best

                let exp = new Decimal(3)
                if (hasMilestone("g", 14)) exp = exp.times(2)
                if (hasUpgrade("d", 54)) exp = exp.plus(.1)
                exp = exp.times(tmp.f.challenges[21].rewardEffect)

                let ret = amt.times(4).plus(1).pow(exp)

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("g")
        },
        getMaxCharges(){
                let ret = new Decimal(10)
                if (hasMilestone("g", 11)) ret = ret.plus(90)
                ret = ret.plus(CURRENT_GAMES_EFFECTS["partial"]["Max Charges"][0])
                if (hasMilestone("g", 18)) ret = ret.times(3)
                if (hasMilestone("g", 21)) ret = ret.times(6)
                if (hasMilestone("g", 23)){
                        ret = ret.times(Decimal.pow(2, tmp.g.clickables.getPrimaryRebirths))
                }
                if (hasUpgrade("g", 12)) ret = ret.pow(1.3)
                if (hasMilestone("h", 3)) ret = ret.pow(Decimal.pow(1.1, player.h.milestones.length))
                return ret.floor()
        },
        update(diff){
                let data = player.g

                data.best = data.best.max(data.points)
                if (hasMilestone("g", 9)) {
                        let gain = tmp.g.getResetGain
                        data.points = data.points.plus(gain.times(diff))
                        data.total = data.total.plus(gain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (hasUpgrade("g", 51)) {
                        handleGeneralizedBuyableAutobuy(diff, "g")
                } else {
                        data.abtime = 0
                }
                let cpm = tmp.g.clickables.getChargesPerMinute
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

                let rb = player.g.rebirths[1]

                data.completedTally = Decimal.times(16, rb)
                
                data.partialTally = Decimal.times(160, rb * (rb+1) / 2)
                for (i in data.clickableAmounts){
                        if (["11","12","13","14"].includes(i)) continue
                        j = data.clickableAmounts[i]
                        if (j.eq(tmp.g.clickables.getCompletionsReq)) {
                                data.completedTally = data.completedTally.plus(1)
                        }
                        data.partialTally = data.partialTally.plus(j)
                }

                data.chargesMax = tmp.g.getMaxCharges

                if (hasMilestone("g", 19) && data.autodev){
                        let diffmult = 1
                        if (hasUpgrade("goalsii", 32)) diffmult *= 2
                        if (hasUpgrade("goalsii", 33)) diffmult *= 2
                        if (hasUpgrade("goalsii", 34)) diffmult *= 2
                        data.autotime += diff * diffmult
                        if (data.autotime > 10) data.autotime = 10
                        if (data.autotime > 1){
                                data.autotime += -1
                                let l = [21, 22, 23, 24,
                                         31, 32, 33, 34,
                                         41, 42, 43, 44,
                                         51, 52, 53, 54,]

                                if (hasUpgrade("f", 34)) l.push(11,12,13,14)

                                for (j in l){
                                        layers.g.clickables[l[j]].onClick(true)
                                }
                                if (hasUpgrade("f", 33)) layers.g.clickables[15].onClick()
                                if (hasUpgrade("g", 51)) layers.g.clickables[25].onClick()
                                if (hasUpgrade("h", 32)) layers.g.clickables[35].onClick()
                                if (player.j.puzzle.upgrades.includes(42)) layers.g.clickables[45].onClick()
                        }
                } else {
                        data.autotime = 0
                }

                if (hasMilestone("i", 8) && player.g.rebirths[1] < 2e5) {
                        cmr = tmp.g.clickables.getCurrentMaxRebirths
                        let diff = cmr - player.g.rebirths[1]
                        player.g.rebirths[1] = cmr 
                        if (diff > 0){
                                for (i in data.clickableAmounts){
                                        if (["11","12","13","14"].includes(i)) continue
                                        data.clickableAmounts[i] = new Decimal(0)
                                }
                        }
                }

                if (hasUpgrade("goalsii", 45)) {
                        let diff = Math.floor(player.g.rebirths[1]/10) - player.g.rebirths[2]
                        player.g.rebirths[2] += Math.max(diff, 0)
                        if (diff > 0){
                                for (i in data.clickableAmounts){
                                        if (["11","12","13","14"].includes(i)) continue
                                        data.clickableAmounts[i] = new Decimal(0)
                                }
                        }
                }

                if (hasUpgrade("h", 52)) {
                        let diff = Math.floor(player.g.rebirths[2]/10) - player.g.rebirths[3]
                        player.g.rebirths[3] += Math.max(diff, 0)
                        if (diff > 0){
                                for (i in data.clickableAmounts){
                                        if (["11","12","13","14"].includes(i)) continue
                                        data.clickableAmounts[i] = new Decimal(0)
                                }
                        }
                }

                if (false) {
                        let diff = Math.floor(player.g.rebirths[3]/10) - player.g.rebirths[4]
                        player.g.rebirths[4] += Math.max(diff, 0)
                        if (diff > 0){
                                for (i in data.clickableAmounts){
                                        if (["11","12","13","14"].includes(i)) continue
                                        data.clickableAmounts[i] = new Decimal(0)
                                }
                        }
                }

                data.time += diff
        },
        row: 6,
        hotkeys: [
                {key: "g", description: "G: Reset for Games", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+G", description: "Shift+G: Go to Games", onPress(){
                                showTab("g")
                        }
                },
                {key: "0", description: "0: Attempt to dev all games once", onPress(){
                                let data = layers.g.clickables
                                let b = [11, 12, 13, 14,
                                        21, 22, 23, 24,
                                        31, 32, 33, 34,
                                        41, 42, 43, 44,
                                        51, 52, 53, 54,]
                                for (i = 0; i < 20; i++){
                                        let data2 = data[b[i]]
                                        if (data2.canClick()) data2.onClick()
                                }
                        }
                },
        ],
        layerShown(){return player.goalsii.tokens.best["44"].gt(0) || player.g.best.gt(0) || hasUnlockedPast("g")},
        prestigeButtonText(){
                if (hasMilestone("g", 9)) return ""
                return getGeneralizedPrestigeButtonText("g")
        },
        canReset(){
                return player.g.time >= 2 && !hasMilestone("g", 9) && tmp.g.getResetGain.gt(0)
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
                                return hasMilestone("g", 1) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 2)
                3: {
                        requirementDescription: "<b>Good</b><br>Requires: 3 Games", 
                        effectDescription: "Each <b>G</b> milestone multiplies medal gain by 1.5",
                        done(){
                                return player.g.points.gte(3)
                        },
                        unlocked(){
                                return hasMilestone("g", 2) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 3)
                4: {
                        requirementDescription: "<b>Group</b><br>Requires: 4 Games", 
                        effectDescription: "Unlock a Medal upgrade and unlock a <b>D</b> buyable",
                        done(){
                                return player.g.points.gte(4)
                        },
                        unlocked(){
                                return hasMilestone("g", 3) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 4)
                5: {
                        requirementDescription: "<b>General</b><br>Requires: 5 Games", 
                        effectDescription: "Each <b>G</b> reset allows you to keep one Medal upgrade",
                        done(){
                                return player.g.points.gte(5)
                        },
                        unlocked(){
                                return hasMilestone("g", 4) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 5)
                6: {
                        requirementDescription: "<b>Great</b><br>Requires: 6 Games", 
                        effectDescription: "Unlock a Medal upgrade",
                        done(){
                                return player.g.points.gte(6)
                        },
                        unlocked(){
                                return hasMilestone("g", 5) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 6)
                7: {
                        requirementDescription: "<b>Government</b><br>Requires: 10 Games", 
                        effectDescription: "Start with one of each token",
                        done(){
                                return player.g.points.gte(10)
                        },
                        unlocked(){
                                return hasMilestone("g", 6) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 7)
                8: {
                        requirementDescription: "<b>Guide</b><br>Requires: 13 Games", 
                        effectDescription: "Game resetting no longer forces you into challenge 00, keep tokens, and unlock Games",
                        done(){
                                return player.g.points.gte(13)
                        },
                        unlocked(){
                                return hasMilestone("g", 7) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 8)
                9: {
                        requirementDescription: "<b>Gallery</b><br>Requires: 40% Completion on Portal", 
                        effectDescription: "Remove the ability to prestige but gain 100% of Games on prestige per second",
                        done(){
                                return player.g.clickableAmounts[31].gte(4) || player.g.rebirths[1] > 0
                        },
                        unlocked(){
                                return hasMilestone("g", 8) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 9)
                10: {
                        requirementDescription: "<b>Going</b><br>Requires: 72 Successful devs", 
                        effectDescription: "Remove the medal gain softcap and each successful dev adds .01 to the <b>G</b> gain exponent (up to 5e7)",
                        done(){
                                return player.g.partialTally.gte(72)
                        },
                        unlocked(){
                                return hasMilestone("g", 9) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 10)
                11: {
                        requirementDescription: "<b>Got</b><br>Requires: 77 Successful devs", 
                        effectDescription: "Your maximum charges is 100 and raise charge gain per minute ^1.2",
                        done(){
                                return player.g.partialTally.gte(77)
                        },
                        unlocked(){
                                return hasMilestone("g", 10) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 11)
                12: {
                        requirementDescription: "<b>Give</b><br>Requires: 2 Completed games", 
                        effectDescription: "Raise charge gain per minute ^1.2 and hold shift to attempt buy 10 clickables",
                        done(){
                                return player.g.completedTally.gte(2)
                        },
                        unlocked(){
                                return hasMilestone("g", 11) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 12)
                13: {
                        requirementDescription: "<b>Girls</b><br>Requires: 8 Completed games", 
                        effectDescription: "Raise charge gain per minute ^1.2 and sqrt(Charges) multiplies <b>G</b> gain",
                        done(){
                                return player.g.completedTally.gte(8)
                        },
                        unlocked(){
                                return hasMilestone("g", 12) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 13)
                14: {
                        requirementDescription: "<b>Gift</b><br>Requires: 136 Successful devs", 
                        effectDescription: "Square <b>G</b> effect and double medal gain per milestone",
                        done(){
                                return player.g.partialTally.gte(136)
                        },
                        unlocked(){
                                return hasMilestone("g", 13) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 14)
                15: {
                        requirementDescription: "<b>Groups</b><br>Requires: 138 Successful devs", 
                        effectDescription: "Unlock Game Rebirth and double base <b>G</b> gain",
                        done(){
                                return player.g.partialTally.gte(138)
                        },
                        unlocked(){
                                return hasMilestone("g", 14) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 15)
                16: {
                        requirementDescription: "<b>Given</b><br>Requires: 300 Successful devs", 
                        effectDescription: "Raise charge gain ^1.1",
                        done(){
                                return player.g.partialTally.gte(300)
                        },
                        unlocked(){
                                return hasMilestone("g", 15) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 16)
                17: {
                        requirementDescription: "<b>Garden</b><br>Requires: 400 Successful devs", 
                        effectDescription: "Raise charge gain ^1.1 and shift can bulk 10x more",
                        done(){
                                return player.g.partialTally.gte(400)
                        },
                        unlocked(){
                                return hasMilestone("g", 16) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 17)
                18: {
                        requirementDescription: "<b>Green</b><br>Requires: 470 Successful devs", 
                        effectDescription: "Raise charge gain ^1.1, triple maximum charges, and attempting to dev a game no longer costs games",
                        done(){
                                return player.g.partialTally.gte(470)
                        },
                        unlocked(){
                                return hasMilestone("g", 17) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 18)
                19: {
                        requirementDescription: "<b>Gold</b><br>Requires: 950 Successful devs", 
                        effectDescription: "Raise charge gain ^1.1 and be able to automatically attempt to bulk dev each game once per second",
                        done(){
                                return player.g.partialTally.gte(950)
                        },
                        unlocked(){
                                return hasMilestone("g", 18) || hasUnlockedPast("g")
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
                                return hasMilestone("g", 19) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 20)
                21: {
                        requirementDescription: "<b>Getting</b><br>Requires: 4470 Successful devs", 
                        effectDescription: "Raise charge gain ^1.2 and 6x max charges",
                        done(){
                                return player.g.partialTally.gte(4470)
                        },
                        unlocked(){
                                return hasMilestone("g", 20) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 21)
                22: {
                        requirementDescription: "<b>Global</b><br>Requires: 7 Rebirth I", 
                        effectDescription: "Raise charge gain ^1.1 and the first four games do not cost charges",
                        done(){
                                return player.g.rebirths[1] >= 7
                        },
                        unlocked(){
                                return hasMilestone("g", 21) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 22)
                23: {
                        requirementDescription: "<b>Germany</b><br>Requires: 8 Rebirth I", 
                        effectDescription: "Raise charge gain ^1.1, deving costs 10x less charges, and each Rebirth doubles max charges",
                        done(){
                                return player.g.rebirths[1] >= 8
                        },
                        unlocked(){
                                return hasMilestone("g", 22) || hasUnlockedPast("g")
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
                        if (hasUpgrade("e", 52))   exp *= 1.1
                        if (hasUpgrade("e", 53))   exp *= 1.1
                        if (hasMilestone("h", 1))  exp *= 1.1 
                        if (hasUpgrade("goalsii", 33)) {
                                                   exp *= Math.pow(1.1, player.goalsii.upgrades.length)
                        }
                        if (player.j.puzzle.upgrades.includes(31)) {
                                                   exp *= 50
                        }
                        return exp
                },
                getChargesPerMinute(){
                        let data = player.g.clickableAmounts
                        let a = data[11].plus(data[12])
                        let b = data[13].plus(data[14])
                        let base = a.plus(b)
                        if (hasMilestone("i", 4)) base = base.plus(100)
                        if (hasMilestone("h", 1)) base = base.plus(2)
                        if (hasMilestone("h", 5)) base = base.plus(player.h.milestones.length)
                        if (hasMilestone("h", 6)) base = base.plus(player.h.milestones.length ** 2)
                        if (hasMilestone("h", 3)) base = base.times(1.2)
                        
                        let exp = tmp.g.clickables.getChargesPerMinuteExp
                        let mult = new Decimal(1)
                        if (hasMilestone("h", 2)) mult = mult.times(2)
                        
                        let ret = Decimal.pow(base, exp).times(mult)

                        return ret
                },
                getGlobalChanceFactor(){
                        let ret = 1
                        if (hasMilestone("h", 1)) ret *= 2
                        if (hasMilestone("h", 7)) ret *= 5
                        return ret
                },
                succChance(x, change = 1, maxone = true){
                        let div = tmp.g.clickables.getCompletionsReq
                        let ret = Decimal.minus(1, x.div(div)).pow(2).times(change).times(tmp.g.clickables.getGlobalChanceFactor)               
                        if (maxone) ret = ret.min(1)
                        return ret.max(0)
                },
                getEffectivePartialDevs(){
                        return CURRENT_GAMES_VALUES["partial"]
                },
                getAllPartialEffects(){
                        return CURRENT_GAMES_EFFECTS["partial"]
                },
                getEffectiveCompletedDevs(){
                        return CURRENT_GAMES_VALUES["complete"]
                },
                getAllCompletedEffects(){
                        return CURRENT_GAMES_EFFECTS["complete"]
                },
                getEffectiveRebirths(){
                        return CURRENT_GAMES_VALUES["rebirth"]
                },
                getRebirthEffects(){
                        return CURRENT_GAMES_EFFECTS["rebirth"]
                },
                getAttemptAmount(force = false){
                        let ret = new Decimal(1)
                        if (!shiftDown && !force) return ret
                        if (hasMilestone("g", 12)) ret = ret.times(10)
                        if (hasMilestone("g", 17)) ret = ret.times(10)
                        if (hasMilestone("g", 20)) ret = ret.times(4)
                        ret = ret.times(CURRENT_GAMES_EFFECTS["rebirth"]["Manual Bulk"][0])
                        if (hasMilestone("h", 2)) ret = ret.times(10)
                        return ret 
                },
                getPrimaryRebirths(actamt = false){ 
                        let data = player.g.rebirths
                        if (actamt) return data[1]
                        return data[1] + 10 * data[2] + 100 * data[3] + 1e3 * data[4] + 1e4 * data[5] 
                },
                getRebirthExp2(a){
                        let r = a || player.g.rebirths[1]
                        if (typeof r == "object") r = r.toNumber()
                        let exp2 = 1.45
                        if (r >= 8) exp2 += .005 * Math.min(r - 8, 10)
                        if (r >= 13) exp2 += .014 * Math.min(r - 13, 5) ** 2
                        if (r >= 21) exp2 += .01 * (r - 21)
                        return exp2
                },
                getRebirthActingScaler(){
                        let r = 1
                        if (hasUpgrade("h", 23)) r *= Math.pow(.99, player.g.upgrades.length)
                        if (hasUpgrade("g", 44)) r *= Math.pow(.98, player.h.upgrades.length)
                        if (hasUpgrade("f", 54)) r *= Math.pow(.995, totalChallengeComps("f"))
                        if (hasUpgrade("i", 12)) r *= Math.pow(.97, player.i.upgrades.length)
                        if (hasUpgrade("f", 55)) r *= .8
                        if (hasUpgrade("g", 54)) r *= .9
                        if (hasUpgrade("goalsii", 42)) r *= Math.pow(.98, player.goalsii.upgrades.length)
                        if (hasUpgrade("h", 33)) r *= Math.pow(.998, totalChallengeComps("f"))
                        if (hasMilestone("j", 3)) r *= Math.pow(.96, player.j.milestones.length)
                        if (player.j.puzzle.upgrades.includes(32)) r *= Math.pow(.95, player.j.puzzle.upgrades.length)
                        return r
                },
                getRebirthCostIncrease(){
                        let r = player.g.rebirths[1]
                        r *= tmp.g.clickables.getRebirthActingScaler
                        let exp2 = this.getRebirthExp2(r)
                        let exp = Decimal.pow(r, exp2)
                        return Decimal.pow(1e18, exp)
                },
                getCurrentMaxRebirths(){
                        let g = player.g.points
                        if (g.lte(0)) return 0
                        
                        let a = 1
                        let r = tmp.g.clickables.getRebirthActingScaler
                        g = g.log10().div(18)

                        let up = true
                        while (up) {
                                if (g.gte(Decimal.pow(a * r, this.getRebirthExp2(a * r)))) a *= 2
                                else up = false 
                                if (a > 5e5) break 
                        }
                        a = a / 2
                        let count = a
                        while (a > 1) {
                                a = a/2
                                let b = (a + count) * r
                                if (g.gte(Decimal.pow(b, this.getRebirthExp2(b)))) count += a
                        }
                        return Math.min(2e5, count + 1)
                },
                getCompletionsReq(){
                        let ret = 10 + 10 * player.g.rebirths[1]
                        return ret
                },
                getChargeComsumption(){
                        let rb = player.g.rebirths[1]
                        let ret = Decimal.pow(10, Decimal.pow(rb, .8))
                        if (hasMilestone("g", 23)) ret = ret.div(10)
                        return ret.floor()
                }, 
                11: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Tetris</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Cost</h3>: " + formatWhole(tmp.g.clickables[11].cost) + " Games<br>"
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
                                let data = player.g
                                
                                let maxGames = data.points.gte(10) ? data.points.div(10).log(2).plus(1).floor() : data.clickableAmounts[11]
                                let maxCharges = data.charges
                                let attempts = layers.g.clickables.getAttemptAmount(force)
                                
                                let target = maxGames.sub(data.clickableAmounts[11]).max(0).min(maxCharges).min(attempts)

                                player.g.clickableAmounts[11] = player.g.clickableAmounts[11].plus(target)
                                if (target.gt(0) && !hasUpgrade("g", 21)) player.g.points = player.g.points.minus(this.cost().div(2)).max(0)
                                if (!hasMilestone("g", 22)) player.g.charges = player.g.charges.minus(target).max(0)
                        },
                },
                12: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Pac-man</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Cost</h3>: " + format(tmp.g.clickables[12].cost) + " Medals<br>"
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
                                return player.goalsii.points.gte(tmp.g.clickables[12].cost) && (player.g.charges.gte(1) || hasMilestone("g", 22))
                        },
                        onClick(force = false){
                                let data = player.g
                                
                                let maxMedals = player.goalsii.points.gte(1e8) ? player.goalsii.points.div(1e8).log(10).root(2).plus(1).floor() : data.clickableAmounts[12]
                                let maxCharges = data.charges
                                let attempts = layers.g.clickables.getAttemptAmount(force)
                                
                                let target = maxMedals.sub(data.clickableAmounts[12]).max(0).min(maxCharges).min(attempts)

                                if (target.eq(0)) return 

                                player.g.clickableAmounts[12] = player.g.clickableAmounts[12].plus(target)
                                let nc = Decimal.pow(10, player.g.clickableAmounts[12].minus(1).pow(2)).times(1e8)
                                if (target.gt(0)) player.goalsii.points = player.goalsii.points.minus(nc).max(0)
                                if (!hasMilestone("g", 22)) player.g.charges = player.g.charges.minus(target).max(0)
                        },
                },
                13: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Asteroids</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Requires</h3>: " + formatWhole(tmp.g.clickables[13].cost) + " Goals<br>"
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
                                return player.ach.points.gte(tmp.g.clickables[13].cost) && (player.g.charges.gte(1) || hasMilestone("g", 22))
                        },
                        onClick(force = false){
                                let data = player.g
                                let pts = player.ach.points
                                
                                let maxMedals = pts.gte(82) ? pts.minus(82).plus(1).div(3).pow(2).ceil() : data.clickableAmounts[13]
                                let maxCharges = data.charges
                                let attempts = layers.g.clickables.getAttemptAmount(force)
                                
                                let target = maxMedals.sub(data.clickableAmounts[13]).max(0).min(maxCharges).min(attempts)

                                player.g.clickableAmounts[13] = player.g.clickableAmounts[13].plus(target)
                                if (!hasMilestone("g", 22)) player.g.charges = player.g.charges.minus(target).max(0)
                        },
                },
                14: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Half life</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + format(tmp.g.clickables[14].cost) + " Features<br>"
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
                                return player.f.points.gte(tmp.g.clickables[14].cost) && (player.g.charges.gte(1) || hasMilestone("g", 22))
                        },
                        onClick(force = false){
                                let maximum = layers.g.clickables.getAttemptAmount(force)
                                if (!hasMilestone("g", 22)) maximum = maximum.min(player.g.charges)
                                let g = player.f.points
                                if (g.lt("1e1900")) return    
                                
                                let target = g.div("1e1900").log10().div(10).root(1.5).floor().plus(1)

                                let diff = target.minus(player.g.clickableAmounts[14])
                                
                                if (diff.lte(0)) return
                                
                                diff = diff.min(maximum)

                                player.g.charges = player.g.charges.minus(diff).max(0)
                                let postcost = Decimal.pow(1e10, player.g.clickableAmounts[14].minus(1).pow(1.5)).times("1e1900")
                                player.f.points = player.f.points.minus(postcost).max(0)
                                player.g.clickableAmounts[14] = player.g.clickableAmounts[14].plus(diff)
                        },
                },
                21: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Quake</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[21].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[21].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[21]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let a = player.g.clickableAmounts[11].gt(0) && player.g.clickableAmounts[12].gt(0) && player.g.clickableAmounts[13].gt(0) && player.g.clickableAmounts[14].gt(0)
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[21].plus(3).pow(2).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[21].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 21

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
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
                                                data.charges = data.charges.minus(cc.times(target)).max(0)
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                22: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Minecraft</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[22].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[22].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[22]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let a = player.g.clickableAmounts[11].gt(0) && player.g.clickableAmounts[12].gt(0) && player.g.clickableAmounts[13].gt(0) && player.g.clickableAmounts[14].gt(0)
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                return a || b || hasUnlockedPast("g")                    },
                        cost(){
                                return player.g.clickableAmounts[22].plus(3).pow(2).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[22].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 22

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
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
                                                data.charges = data.charges.minus(cc.times(target)).max(0)
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                23: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>GTA V</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[23].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[23].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[23]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let a = player.g.clickableAmounts[11].gt(0) && player.g.clickableAmounts[12].gt(0) && player.g.clickableAmounts[13].gt(0) && player.g.clickableAmounts[14].gt(0)
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                return a || b || hasUnlockedPast("g") 
                        },
                        cost(){
                                return player.g.clickableAmounts[23].plus(3).pow(2).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[23].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 23

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
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
                                                data.charges = data.charges.minus(cc.times(target)).max(0)
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                24: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>FIFA</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[24].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[24].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[24]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let a = player.g.clickableAmounts[11].gt(0) && player.g.clickableAmounts[12].gt(0) && player.g.clickableAmounts[13].gt(0) && player.g.clickableAmounts[14].gt(0)
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[24].plus(3).pow(2).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[24].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 24

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
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
                                                data.charges = data.charges.minus(cc.times(target)).max(0)
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                31: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Portal</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[31].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[31].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[31]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                let a = player.g.clickableAmounts[21].gt(0) && player.g.clickableAmounts[22].gt(0) && player.g.clickableAmounts[23].gt(0) && player.g.clickableAmounts[24].gt(0)
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[31].plus(3).pow(3).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[31].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 31

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
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
                                                data.charges = data.charges.minus(cc.times(target)).max(0)
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                32: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Pokemon</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[32].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[32].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[32]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                let a = player.g.clickableAmounts[21].gt(0) && player.g.clickableAmounts[22].gt(0) && player.g.clickableAmounts[23].gt(0) && player.g.clickableAmounts[24].gt(0)
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[32].plus(3).pow(3).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[32].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 32

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
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
                                                data.charges = data.charges.minus(cc.times(target)).max(0)
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                33: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Diablo</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[33].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[33].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[33]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                let a = player.g.clickableAmounts[21].gt(0) && player.g.clickableAmounts[22].gt(0) && player.g.clickableAmounts[23].gt(0) && player.g.clickableAmounts[24].gt(0)
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[33].plus(3).pow(3).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[33].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 33

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
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
                                                data.charges = data.charges.minus(cc.times(target)).max(0)
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                34: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Terraria</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[34].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[34].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[34]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                let a = player.g.clickableAmounts[21].gt(0) && player.g.clickableAmounts[22].gt(0) && player.g.clickableAmounts[23].gt(0) && player.g.clickableAmounts[24].gt(0)
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[34].plus(3).pow(3).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[34].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 34

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
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
                                                data.charges = data.charges.minus(cc.times(target)).max(0)
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                41: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Roblox</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[41].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[41].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[41]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                let a = player.g.clickableAmounts[31].gt(6) && player.g.clickableAmounts[32].gt(6) && player.g.clickableAmounts[33].gt(6) && player.g.clickableAmounts[34].gt(6)
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[41].plus(5).pow(6).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[41].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 41

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
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
                                                data.charges = data.charges.minus(cc.times(target)).max(0)
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                42: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Autochess</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[42].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[42].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[42]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                let a = player.g.clickableAmounts[31].gt(6) && player.g.clickableAmounts[32].gt(6) && player.g.clickableAmounts[33].gt(6) && player.g.clickableAmounts[34].gt(6)
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[42].plus(5).pow(6).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[42].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 42

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
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
                                                data.charges = data.charges.minus(cc.times(target)).max(0)
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                43: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Pong</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[43].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[43].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[43]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                let a = player.g.clickableAmounts[31].gt(6) && player.g.clickableAmounts[32].gt(6) && player.g.clickableAmounts[33].gt(6) && player.g.clickableAmounts[34].gt(6)
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[43].plus(5).pow(6).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[43].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 43

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
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
                                                data.charges = data.charges.minus(cc.times(target)).max(0)
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                44: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Dota 2</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[44].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[44].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[44]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                let a = player.g.clickableAmounts[31].gt(6) && player.g.clickableAmounts[32].gt(6) && player.g.clickableAmounts[33].gt(6) && player.g.clickableAmounts[34].gt(6)
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[44].plus(5).pow(6).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[44].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 44

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
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
                                                data.charges = data.charges.minus(cc.times(target)).max(0)
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                51: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Snake</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[51].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[51].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[51], .1).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                return hasAchievement("ach", 133) || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[51].times(4).plus(9).pow(7).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[51].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 51

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
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
                                                data.charges = data.charges.minus(cc.times(target)).max(0)
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                52: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>WoW</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[52].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[52].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[52], .1).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                return hasAchievement("ach", 133) || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[52].times(4).plus(9).pow(7).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[52].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 52

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
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
                                                data.charges = data.charges.minus(cc.times(target)).max(0)
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                53: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>TFT</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[53].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[53].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[53], .1).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                return hasAchievement("ach", 133) || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[53].times(4).plus(9).pow(7).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[53].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 53

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
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
                                                data.charges = data.charges.minus(cc.times(target)).max(0)
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                54: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Valorant</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[54].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[54].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[54], .1).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                return hasAchievement("ach", 133) || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[54].times(4).plus(9).pow(7).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[54].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 54

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
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
                                                data.charges = data.charges.minus(cc.times(target)).max(0)
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                15: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Rebirth I</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Requires</h3>: 16 Games at 100%<br>"
                                let b = "<h3 style='color: #00CC66'>Times</h3>: " + formatWhole(player.g.rebirths[1])
                                return a + b
                        },
                        unlocked(){
                                return hasMilestone("g", 15) || hasUnlockedPast("g")
                        },
                        canClick(){
                                let gdata = player.g
                                rb = player.g.rebirths[1]
                                if (rb >= 2e5) return false
                                let a = gdata.partialTally.gte(Decimal.times(160, (rb + 1) * (rb + 2) / 2))
                                let b = gdata.charges.gte(layers.g.clickables.getChargeComsumption())
                                return a && b && tmp.g.clickables.getChargesPerMinute.gt(0) && tmp.g.clickables[15].unlocked
                        },
                        onClick(force = false){
                                let data = player.g
                                
                                if (!this.canClick()) return 
                                data.charges = data.charges.minus(layers.g.clickables.getChargeComsumption()).max(0)
                                data.rebirths[1] += 1
                                this.resetPrior()
                        },
                        resetPrior(){
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
                                data.charges = new Decimal(3)
                        },
                },
                25: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Rebirth II</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Requires</h3>:" + formatWhole(tmp.g.clickables[25].cost) + " Rebirth I<br>"
                                let b = "<h3 style='color: #00CC66'>Times</h3>: " + formatWhole(player.g.rebirths[2])
                                return a + b
                        },
                        unlocked(){
                                return hasUpgrade("g", 32) || hasUnlockedPast("h")
                        },
                        cost(){
                                return 10 + 10 * player.g.rebirths[2]
                        },
                        canClick(){
                                let gdata = player.g
                                let a = new Decimal(gdata.rebirths[1]).gte(this.cost())
                                let b = gdata.charges.gte(layers.g.clickables.getChargeComsumption())
                                return a && b && tmp.g.clickables.getChargesPerMinute.gt(0) && tmp.g.clickables[25].unlocked
                        },
                        onClick(force = false){
                                let data = player.g
                                if (!this.canClick()) return 
                                data.charges = data.charges.minus(layers.g.clickables.getChargeComsumption()).max(0)
                                data.rebirths[2] += 1
                                this.resetPrior()
                        },
                        resetPrior(){
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
                                data.charges = new Decimal(3)
                                if (!hasMilestone("i", 2)) data.rebirths[1] = layers.g.getStartingRebirth(1)
                        },
                },
                35: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Rebirth III</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Requires</h3>:" + formatWhole(tmp.g.clickables[35].cost) + " Rebirth II<br>"
                                let b = "<h3 style='color: #00CC66'>Times</h3>: " + formatWhole(player.g.rebirths[3])
                                return a + b
                        },
                        unlocked(){
                                return hasUpgrade("goalsii", 43) || hasUnlockedPast("i")
                        },
                        cost(){
                                return 10 + 10 * player.g.rebirths[3]
                        },
                        canClick(){
                                let gdata = player.g
                                let a = new Decimal(gdata.rebirths[2]).gte(this.cost())
                                let b = gdata.charges.gte(layers.g.clickables.getChargeComsumption())
                                return a && b && tmp.g.clickables.getChargesPerMinute.gt(0) && tmp.g.clickables[35].unlocked
                        },
                        onClick(force = false){
                                let data = player.g
                                if (!this.canClick()) return 
                                data.charges = data.charges.minus(layers.g.clickables.getChargeComsumption()).max(0)
                                data.rebirths[3] += 1
                                this.resetPrior()
                        },
                        resetPrior(){
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
                                data.charges = new Decimal(3)
                                if (!(player.j.puzzle.upgrades.includes(34) || player.j.puzzle.reset2.done)) data.rebirths[2] = layers.g.getStartingRebirth(2)
                                if (!hasMilestone("i", 2)) data.rebirths[1] = layers.g.getStartingRebirth(1)
                        },
                },
                45: {
                        title(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                return "<h3 style='color: #903000'>Rebirth IV</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                if (player.subtabs.g.mainTabs != "Games") return ""
                                let a = "<h3 style='color: #D070C0'>Requires</h3>:" + formatWhole(tmp.g.clickables[45].cost) + " Rebirth III<br>"
                                let b = "<h3 style='color: #00CC66'>Times</h3>: " + formatWhole(player.g.rebirths[4])
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(41) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        cost(){
                                return 10 + 10 * player.g.rebirths[4]
                        },
                        canClick(){
                                let gdata = player.g
                                let a = new Decimal(gdata.rebirths[3]).gte(this.cost())
                                let b = gdata.charges.gte(layers.g.clickables.getChargeComsumption())
                                return a && b && tmp.g.clickables.getChargesPerMinute.gt(0) && tmp.g.clickables[45].unlocked
                        },
                        onClick(force = false){
                                let data = player.g
                                if (!this.canClick()) return 
                                data.charges = data.charges.minus(layers.g.clickables.getChargeComsumption()).max(0)
                                data.rebirths[4] += 1
                                this.resetPrior()
                        },
                        resetPrior(){
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
                                data.charges = new Decimal(3)
                                if (!(player.j.puzzle.upgrades.includes(42) || player.j.puzzle.reset2.done)) data.rebirths[3] = layers.g.getStartingRebirth(3)
                                if (!(player.j.puzzle.upgrades.includes(34) || player.j.puzzle.reset2.done)) data.rebirths[2] = layers.g.getStartingRebirth(2)
                                if (!hasMilestone("i", 2)) data.rebirths[1] = layers.g.getStartingRebirth(1)
                        },
                },
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Girl",
                        description: "Each upgrade adds 1 to effective rebirths",
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
                        description: "Unlock a row of <b>E</b> upgrades and <b>Tetris</b> no longer costs games",
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
                24: {
                        title: "Grand",
                        description: "Square the successfully deved boost to Max Charges",
                        cost: new Decimal("1e64436"),
                        unlocked(){
                                return hasUpgrade("e", 55) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 24)
                25: {
                        title: "Greater",
                        description: "Per <b>G</b> upgrade multiply base <b>G</b> gain by 5 and add 6 to the <b>G</b> gain exponent",
                        cost: new Decimal("1e65250"),
                        unlocked(){
                                return hasUpgrade("g", 24) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 25)
                31: {
                        title: "Guest",
                        description: "<b>Future</b> gives free <b>February</b> levels and each <b>Files</b> completion gives a free <b>Future</b> level",
                        cost: new Decimal("1e123123"),
                        unlocked(){
                                return hasUpgrade("h", 22) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 31)
                32: {
                        title: "Graphics",
                        description: "Unlock <b>Rebirth II</b>",
                        cost: new Decimal("1e131820"),
                        unlocked(){
                                return hasUpgrade("g", 31) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 32)
                33: {
                        title: "Grade",
                        description: "Unlock a second <b>F</b> challenge and each <b>F</b> challenge completion multiplies base <b>G</b> gain by 2",
                        cost: new Decimal("1e142444"),
                        unlocked(){
                                return hasUpgrade("g", 32) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 33)
                34: {
                        title: "German",
                        description: "Each <b>Film</b> gives an effective rebirth",
                        cost: new Decimal("1e165350"),
                        unlocked(){
                                return hasUpgrade("g", 33) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 34)
                35: {
                        title: "Goods",
                        description: "Upgrades multiply <b>Future</b> base and add .1 to <b>February</b> base and unlock a new <b>F</b> challenge",
                        cost: new Decimal("1e172721"),
                        unlocked(){
                                return hasUpgrade("g", 34) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 35)
                41: {
                        title: "Gets",
                        description: "<b>Friends</b> gives free <b>Future</b> levels and raise completed games to Features boost ^500",
                        cost: new Decimal("1e333777"),
                        unlocked(){
                                return hasUpgrade("f", 53) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 41)
                42: {
                        title: "Georgia",
                        description: "<b>Friends</b> gives free <b>February</b> levels and raise completed games to Games boost ^50",
                        cost: new Decimal("1e360300"),
                        unlocked(){
                                return hasUpgrade("g", 41) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 42)
                43: {
                        title: "Grant",
                        description: "Each rebirth I adds .01 to <b>Friends</b> base and gives a free <b>Friends</b> level",
                        cost: new Decimal("1e418100"),
                        unlocked(){
                                return hasUpgrade("g", 42) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 43)
                44: {
                        title: "Goes",
                        description: "Per <b>H</b> upgrade act as if you have 2% less rebirths",
                        cost: new Decimal("1e474400"),
                        unlocked(){
                                return hasUpgrade("g", 43) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 44)
                45: {
                        title: "Galleries",
                        description: "Start with (9 * Rebirth II) Rebirth I upon reset",
                        cost: new Decimal("1e781400"),
                        unlocked(){
                                return hasUpgrade("g", 44) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 45)
                51: {
                        title: "Guy",
                        description: "Automatically buy <b>G</b> buyables and <b>Rebirth II</b>",
                        cost: new Decimal("1e3525e3"),
                        unlocked(){
                                return hasUpgrade("i", 11) || hasUnlockedPast("i")
                        },
                }, // hasUpgrade("g", 51)
                52: {
                        title: "Gear",
                        description: "Each <b>I</b> upgrade adds .001 to the <b>Guidelines</b> base",
                        cost: new Decimal("1e5157e3"),
                        unlocked(){
                                return hasUpgrade("i", 12) || hasUnlockedPast("i")
                        },
                }, // hasUpgrade("g", 52)
                53: {
                        title: "Giving",
                        description: "<b>Guidelines</b> gives free <b>Gives</b> levels and <b>Front</b> gives free <b>Friends</b> levels",
                        cost: new Decimal("1e7072e3"),
                        unlocked(){
                                return hasUpgrade("g", 52) || hasUnlockedPast("i")
                        },
                }, // hasUpgrade("g", 53)
                54: {
                        title: "Graduate",
                        description: "Act as if you have 10% less rebirths and unlock a row of medal upgrades",
                        cost: new Decimal("1e11048e3"),
                        unlocked(){
                                return hasUpgrade("i", 13) || hasUnlockedPast("i")
                        },
                }, // hasUpgrade("g", 54)
                55: {
                        title: "Generally",
                        description: "You can complete 5 more of each <b>F</b> challenge",
                        cost: new Decimal("1e222807e3"),
                        unlocked(){
                                return hasUpgrade("g", 54) || hasUnlockedPast("i")
                        },
                }, // hasUpgrade("g", 55)
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: getGeneralizedBuyableData("g", 11, function(){
                        return hasUpgrade("i", 11) || hasUnlockedPast("i")
                        }),
                12: getGeneralizedBuyableData("g", 12, function(){
                        return hasUpgrade("i", 12) || hasUnlockedPast("i")
                        }),
                13: getGeneralizedBuyableData("g", 13, function(){
                        return hasUpgrade("i", 13) || hasUnlockedPast("i")
                        }),
                21: getGeneralizedBuyableData("g", 21, function(){
                        return hasUpgrade("i", 14) || hasUnlockedPast("i")
                        }),
                22: getGeneralizedBuyableData("g", 22, function(){
                        return hasUpgrade("i", 15) || hasUnlockedPast("i")
                        }),
                23: getGeneralizedBuyableData("g", 23, function(){
                        return hasUpgrade("h", 35) || hasUnlockedPast("i")
                        }),
                31: getGeneralizedBuyableData("g", 31, function(){
                        return hasUpgrade("i", 23) || hasUnlockedPast("i")
                        }),
                32: getGeneralizedBuyableData("g", 32, function(){
                        return hasUpgrade("h", 44) || hasUnlockedPast("i")
                        }),
                33: getGeneralizedBuyableData("g", 33, function(){
                        return player.j.puzzle.upgrades.includes(32) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }),
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasMilestone("g", 9) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "g") return ""
                                                return shiftDown ? "Your best Games is " + format(player.g.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "g") return ""
                                                if (hasUnlockedPast("g")) return ""
                                                return "You have done " + formatWhole(player.g.times) + " Game resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "g") return ""
                                                if (hasMilestone("g", 9)) return "You are gaining " + format(tmp.g.getResetGain) + " Games per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.g.time)) + ")" 
                                        },
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
                                return hasUpgrade("i", 11) || hasUnlockedPast("i")
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
                                                if (player.tab != "g") return ""
                                                let a = "You have " + format(player.g.points) + " games, "
                                                let b = format(player.goalsii.points) + " medals, "
                                                let c = formatWhole(player.ach.points) + " goals, and "
                                                let d = format(player.f.points) + " features."
                                                if (hasUpgrade("goalsii", 31)) return a + b + c + d
                                                let e = ""
                                                let sd = tmp.g.clickables.getAttemptAmount
                                                if (!shiftDown) e = "<br>Press shift to see success chances."
                                                else if (sd.gt(1)) e = "<br>You have shift down to bulk up to " + formatWhole(sd) + "."
                                                return a + b + c + d + e
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "g") return ""
                                                let cpm = tmp.g.clickables.getChargesPerMinute
                                                let a = "You have " + formatWhole(player.g.charges) + "/" + formatWhole(player.g.chargesMax)
                                                let b = ""
                                                if (cpm < 1e5) b = " charges and are gaining " + format(cpm) + " per minute"
                                                else b = " charges and are gaining " + format(cpm.div(60)) + " per second"
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
                                                if (player.tab != "g") return ""
                                                let a = `<h2 style = 'color: #CC0033'>Explanation</h2><h2>:</h2><br>
                                                There are twenty games which progressively unlock. <br>
                                                Clicking a game will consume a charge.<br>
                                                For the first row, you no matter what will gain a level, <br>
                                                but for subsequent rows you have a non-zero chance of failing and gaining nothing.<br>
                                                This fail rate is purely based on how much progress you have made so far.<br><br>
                                                The first row of games each generate one charge per minute.<br>
                                                You can gain buffs by partially deving games,<br>
                                                and larger buffs for completing games. <br><br>
                                                <h2 style = 'color: #CC0033'>Rewards</h2><h2>:</h2><br>
                                                ` 
                                                let ecd = CURRENT_GAMES_VALUES["complete"]
                                                let ecdportion = ecd.eq(player.g.completedTally) ? "" : "+" + format(ecd.minus(player.g.completedTally))
                                                let pcd = CURRENT_GAMES_VALUES["partial"]
                                                let pcdportion = pcd.eq(player.g.partialTally) ? "" : "+" + format(pcd.minus(player.g.partialTally))
                                                let b = "You have successfully deved " + formatWhole(player.g.partialTally) + pcdportion + " games so:"
                                                let b2 = ""
                                                let data2 = CURRENT_GAMES_EFFECTS["complete"]
                                                for (i in data2){
                                                        let j = data2[i]
                                                        if (!j[2]) continue
                                                        b2 += "<br>• " + j[1] + format(j[0]) + " to " + i 
                                                }

                                                
                                                let c = "<br><br> You have fully completed " + formatWhole(player.g.completedTally) + ecdportion + " games so:"
                                                let c2 = ""
                                                let data1 = CURRENT_GAMES_EFFECTS["partial"]
                                                for (i in data1){
                                                        let j = data1[i]
                                                        if (!j[2]) continue
                                                        c2 += "<br>• " + j[1] + format(j[0]) + " to " + i 
                                                }

                                                let rb = tmp.g.clickables.getPrimaryRebirths
                                                let erb = CURRENT_GAMES_VALUES["rebirth"]
                                                if (erb.eq(0)) return a + b + c2 + c + b2
                                                
                                                let erbportion = erb.eq(rb) ? "" : "+" + format(erb.minus(rb))
                                                let d = "<br><br> You have rebirthed " + formatWhole(rb) + erbportion + " times so:"
                                                let d2 = ""
                                                let data3 = CURRENT_GAMES_EFFECTS["rebirth"]
                                                for (i in data3){
                                                        let j = data3[i]
                                                        if (!j[2]) continue
                                                        d2 += "<br>• " + j[1] + format(j[0]) + " to " + i 
                                                }
                                                return a + b + c2 + c + b2 + d + d2 
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "g") return ""
                                                let rb = tmp.g.clickables.getPrimaryRebirths
                                                if (rb == 0 && player.g.completedTally < 15) return ""
                                                let a = `<br><h2 style = 'color: #CC0033'>Rebirth</h2><h2>:</h2><br>
                                                You can rebirth when you have fully deved 16 games.<br>
                                                Upon rebirthing you lose game progress.<br>
                                                Rebirthing makes attempting to dev harder and causes it to consume more charges. <br><br>
                                                You have rebirthed ` + formatWhole(rb) + " times."
                                                let b = "<br>Each attempts costs " + formatWhole(tmp.g.clickables.getChargeComsumption) + " charges."
                                                if (!hasUnlockedPast("h") && !hasUpgrade("g", 32)) return a + b + "<br><br><br>"
                                                let c = `<br><br>
                                                <h2 style = 'color: #CC0033'>Rebirth II</h2><h2>:</h2><br>
                                                Rebirth II and all further rebirths count as 10 of the previous rebirths <br>
                                                in terms of rewards. This is used for calculating completed devs and for use in upgrades. <br>
                                                However, they do not cause any nerfs, for example to Game cost. <br>
                                                Doing the <i>k</i>-th Rebirth II reset requires having 10 + 10 * k Rebirth I<br>
                                                and likewise for further Rebirths. <br>
                                                Doing a rebirth resets everything the previous rebirth does<br>
                                                and resets the previous rebirth amount to what it is by default.
                                                `
                                                return a + b + c + "<br><br><br><br>"
                                        }
                                ],
                        ],
                        unlocked(){
                                return hasMilestone("g", 8) || hasUnlockedPast("g")
                        },
                },
        },
        getStartingRebirth(i){
                let ret = 0
                if (i == 1){
                        if (hasMilestone("h", 8)) ret = 40
                        if (hasUpgrade("h", 12)) ret = 50
                        if (hasUpgrade("g", 45)) ret = Math.max(ret, 9 * player.g.rebirths[2])
                }
                
                return ret
        },
        doReset(layer){
                if (layer == "g") player.g.time = 0
                if (!getsReset("g", layer)) return
                player.g.time = 0
                player.g.times = 0

                if (!hasMilestone("h", 8) && !hasMilestone("i", 6) && !hasMilestone("k", 1)) {
                        //upgrades
                        let keep = []
                        if (hasMilestone("h", 1)) keep.push(14)
                        player.g.upgrades = filter(player.g.upgrades, keep)
                }

                if (!hasMilestone("i", 6)) {
                        //milestones
                        let keep2 = []
                        let j = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "14", "15", "13", "16", "17", "18", "19", "20", "21", "22", "23"]
                        for (i = 0; i < player.h.times; i ++){
                                if (i > 22) break
                                if (hasMilestone("h", 4)) keep2.push(j[i])
                        }
                        if (hasMilestone("i", 4)) keep2.push("9")
                        player.g.milestones = filter(player.g.milestones, keep2)
                }

                //resources
                player.g.points = new Decimal(0)
                player.g.total = new Decimal(0)
                player.g.best = new Decimal(0)
                player.g.charges = new Decimal(3)
                player.g.chargesMax = new Decimal(10)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.g.buyables[resetBuyables[j]] = new Decimal(0)
                }

                let resetGames = [11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44,51,52,53,54]
                for (let j = 0; j < resetBuyables.length; j++){
                        i = resetGames[j]
                        player.g.clickableAmounts[i] = new Decimal(0)
                }
                let resetRebirths = [1, 2, 3, 4, 5]
                for (let j = resetRebirths.length - 1; j >= 0; j--){
                        player.g.rebirths[resetRebirths[j]] = this.getStartingRebirth(j + 1)
                }
        },
})

addLayer("h", {
        name: "Hearts",
        symbol: "H",
        position: 0, 
        startData() { 
                return {
                        unlocked: true,
                        points: new Decimal(0),
                        best: new Decimal(0),
                        total: new Decimal(0),
                        abtime: 0,
                        time: 0,
                        times: 0,
                        autotimes: 0,
                }
        },
        color: "#FF3399",
        branches: ["g"],
        requires: new Decimal(0),
        resource: "Hearts",
        baseResource: "Games",
        baseAmount() {
                return player.g.best
        },
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("h")
        },
        getBaseDiv(){
                let x = new Decimal("1e93358")
                return x
        },
        getGainExp(){
                let x = new Decimal(4)
                if (hasUpgrade("h", 25)) x = x.plus(player.h.upgrades.length * .2)
                if (hasUpgrade("i", 13)) x = x.plus(player.i.upgrades.length * 10)
                if (hasUpgrade("goalsii", 41)) x = x.plus(player.goalsii.upgrades.length)
                x = x.plus(CURRENT_BUYABLE_EFFECTS["h22"])
                return x
        },
        getGainMultPre(){
                let x = Decimal.pow(10, -4)
                if (hasUpgrade("h", 32)) x = x.times(Decimal.pow(2, player.g.rebirths[3]))
                if (hasUpgrade("h", 35)) x = x.times(Decimal.max(1, totalChallengeComps("f")))
                if (hasUpgrade("i", 23)) x = x.times(Decimal.pow(10, player.i.upgrades.length))
                x = x.times(tmp.j.clickables[45].effect)
                x = x.times(CURRENT_BUYABLE_EFFECTS["i13"])
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("h")

                x = x.times(CURRENT_BUYABLE_EFFECTS["h13"])

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("h")) return new Decimal(1)

                let amt = player.h.best

                let exp = player.h.best.sqrt().times(3).min(10)
                if (hasUpgrade("h", 21)) exp = exp.times(player.h.upgrades.length)

                let ret = amt.times(10).plus(1).pow(exp)

                ret = ret.times(amt.max(1).pow(CURRENT_BUYABLE_EFFECTS["i32"]))

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("h")
        },
        update(diff){
                let data = player.h

                data.best = data.best.max(data.points)
                if (hasUpgrade("h", 22)) {
                        let gain = tmp.h.getResetGain
                        data.points = data.points.plus(gain.times(diff))
                        data.total = data.total.plus(gain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (player.j.puzzle.upgrades.includes(33) || player.j.puzzle.reset2.done) {
                        handleGeneralizedBuyableAutobuy(diff, "h")
                } else {
                        data.abtime = 0
                }

                data.time += diff
        },
        row: 7,
        hotkeys: [
                {key: "h", description: "H: Reset for Hearts", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+H", description: "Shift+H: Go to Hearts", onPress(){
                                showTab("h")
                        }
                },
                {key: "1", description: "1: Rebirth I", onPress(){
                                let data = layers.g.clickables[15]
                                if (data.canClick()) data.onClick()
                        }
                },
                {key: "2", description: "2: Rebirth II", onPress(){
                                let data = layers.g.clickables[25]
                                if (data.canClick()) data.onClick()
                        }
                },
        ],
        layerShown(){return player.g.best.max(10).log10().gte(103345) || player.h.best.gt(0) || hasUnlockedPast("h")},
        prestigeButtonText(){
                if (hasUpgrade("h", 22)) return ""
                return getGeneralizedPrestigeButtonText("h")
        },
        canReset(){
                return player.h.time >= 2 && !hasUpgrade("h", 22) && tmp.h.getResetGain.gt(0)
        },
        milestones: {
                1: {
                        requirementDescription: "<b>Have</b><br>Requires: 1 Hearts", 
                        effectDescription: "Double the chance to succeed, raise charges gain ^1.1, keep <b>Growth</b>, and gain 2 charges per minute",
                        done(){
                                return player.h.points.gte(1)
                        },
                        unlocked(){
                                return true
                        }, // hasMilestone("h", 1)
                },
                2: {
                        requirementDescription: "<b>Home</b><br>Requires: 2 Hearts", 
                        effectDescription: "Double charge gain and holding shift allows 10x more game attempts",
                        done(){
                                return player.h.points.gte(2)
                        },
                        unlocked(){
                                return hasMilestone("h", 1) || hasUnlockedPast("h")
                        }, // hasMilestone("h", 2)
                },
                3: {
                        requirementDescription: "<b>Has</b><br>Requires: 3 Hearts", 
                        effectDescription: "Each milestone raises max charges ^1.1 and multiply base charge gain by 1.2",
                        done(){
                                return player.h.points.gte(3)
                        },
                        unlocked(){
                                return hasMilestone("h", 2) || hasUnlockedPast("h")
                        }, // hasMilestone("h", 3)
                },
                4: {
                        requirementDescription: "<b>He</b><br>Requires: 4 Hearts", 
                        effectDescription: "Keep one <b>G</b> milestone per <b>H</b> reset",
                        done(){
                                return player.h.points.gte(4)
                        },
                        unlocked(){
                                return hasMilestone("h", 3) || hasUnlockedPast("h")
                        }, // hasMilestone("h", 4)
                },
                5: {
                        requirementDescription: "<b>His</b><br>Requires: 6 Hearts", 
                        effectDescription: "Each milestone adds 1 to base charge gain and half an effective Rebirth level",
                        done(){
                                return player.h.points.gte(6)
                        },
                        unlocked(){
                                return hasMilestone("h", 4) || hasUnlockedPast("h")
                        }, // hasMilestone("h", 5)
                },
                6: {
                        requirementDescription: "<b>Here</b><br>Requires: 9 Hearts", 
                        effectDescription: "Per milestone squared get an effective fully deved level and add 1 to base charge gain",
                        done(){
                                return player.h.points.gte(9)
                        },
                        unlocked(){
                                return hasMilestone("h", 5) || hasUnlockedPast("h")
                        }, // hasMilestone("h", 6)
                },
                7: {
                        requirementDescription: "<b>Help</b><br>Requires: 13 Hearts", 
                        effectDescription: "Keep <b>F</b> upgrades and 5x the chance to succeed",
                        done(){
                                return player.h.points.gte(13)
                        },
                        unlocked(){
                                return hasMilestone("h", 6) || hasUnlockedPast("h")
                        }, // hasMilestone("h", 7)
                },
                8: {
                        requirementDescription: "<b>How</b><br>Requires: 19 Hearts", 
                        effectDescription: "Start with 40 Rebirths and keep <b>G</b> upgrades",
                        done(){
                                return player.h.points.gte(19)
                        },
                        unlocked(){
                                return hasMilestone("h", 7) || hasUnlockedPast("h")
                        }, // hasMilestone("h", 8)
                },
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Had",
                        description: "Each upgrade adds 78 to <b>F</b> gain exponent and multiplies base <b>F</b> gain by 90",
                        cost: new Decimal(25),
                        unlocked(){
                                return hasMilestone("h", 8) || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 11)
                12: {
                        title: "Health",
                        description: "Start with 50 Rebirths and double base <b>G</b> gain per upgrade",
                        cost: new Decimal(10),
                        unlocked(){
                                return hasUpgrade("h", 11) || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 12)
                13: {
                        title: "Her",
                        description: "Unlock a new row of Medal upgrades",
                        cost: new Decimal(10),
                        unlocked(){
                                return hasUpgrade("h", 12) || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 13)
                14: {
                        title: "High",
                        description: "Per upgrade per medal upgrade get two free effecitve completed devs and unlock an <b>F</b> buyable autobuyer",
                        cost: new Decimal(150),
                        unlocked(){
                                return hasUpgrade("goalsii", 35) || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 14)
                15: {
                        title: "Hotel",
                        description: "Unlock an <b>F</b> buyable and an <b>F</b> challenge and <b>H</b> effect is ^1001 to points",
                        cost: new Decimal(300),
                        unlocked(){
                                return hasUpgrade("h", 14) || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 15)
                21: {
                        title: "House",
                        description: "Raise the <b>H</b> effect to the number of upgrades and unlock an <b>F</b> buyable",
                        cost: new Decimal(300),
                        unlocked(){
                                return hasAchievement("ach", "153") || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 21)
                22: {
                        title: "Him",
                        description: "Remove the ability to <b>H</b> reset but gain 100% of Hearts on prestige per second",
                        cost: new Decimal(2000),
                        unlocked(){
                                return hasAchievement("ach", "153") || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 22)
                23: {
                        title: "History",
                        description: "Act as if you have 1% less rebirths per Game upgrade (for Game costs)",
                        cost: new Decimal(2e6),
                        unlocked(){
                                return hasUpgrade("g", 35) || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 23)
                24: {
                        title: "Hours",
                        description: "Raise successful devs boost to Games to the number of <b>H</b> upgrades",
                        cost: new Decimal(2e11),
                        unlocked(){
                                return hasUpgrade("f", 55) || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 24)
                25: {
                        title: "However",
                        description: "Each upgrade adds .2 to the <b>H</b> gain exponent",
                        cost: new Decimal(1e12),
                        unlocked(){
                                return hasUpgrade("h", 24) || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 25)
                31: {
                        title: "Human",
                        description: "Each upgrade adds .1 to the <b>I</b> gain exponent",
                        cost: new Decimal("1e687"),
                        unlocked(){
                                return hasUpgrade("g", 55) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 31)
                32: {
                        title: "Hot",
                        description: "Automatically <b>Rebirth III</b> and each <b>Rebirth III</b> doubles base <b>H</b> gain",
                        cost: new Decimal("1e835"),
                        unlocked(){
                                return (hasUpgrade("h", 31) && totalChallengeComps("f") >= 85) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 32)
                33: {
                        title: "Hard",
                        description: "Per <b>F</b> challenge completion act as if you have .2% less rebirths and unlock an <b>F</b> buyable",
                        cost: new Decimal("1e1850"),
                        unlocked(){
                                return hasUpgrade("i", 22) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 33)
                34: {
                        title: "Hand",
                        description: "Per <b>I</b> upgrade increase <b>F</b> challenge completion limit by 1 and unlock an <b>F</b> buyable",
                        cost: new Decimal("1e2075"),
                        unlocked(){
                                return hasUpgrade("h", 33) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 34)
                35: {
                        title: "Head",
                        description: "<b>F</b> challenges completed multiplies base <b>H</b> gain and unlock a <b>G</b> buyable",
                        cost: new Decimal("1e2200"),
                        unlocked(){
                                return hasUpgrade("h", 34) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 35)
                41: {
                        title: "Having",
                        description: "<b>Growing</b> and <b>Guarantee</b> give free <b>Goal</b> and <b>Generation</b> levels",
                        cost: new Decimal("1e2410"),
                        unlocked(){
                                return hasUpgrade("h", 35) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 41)
                42: {
                        title: "Hosting",
                        description: "<b>Growing</b> gives free <b>Guarantee</b> levels and per upgrade add .001 to the <b>Growing</b> base",
                        cost: new Decimal("1e2540"),
                        unlocked(){
                                return hasUpgrade("h", 41) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 42)
                43: {
                        title: "Heart",
                        description: "Each <b>I</b> upgrade adds .001 to the <b>Generated</b> base and adds .2 to the <b>I</b> gain exponent",
                        cost: new Decimal("1e5475"),
                        unlocked(){
                                return totalChallengeComps("f") >= 111 || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 43)
                44: {
                        title: "Half",
                        description: "Each upgrade adds .01 to the <b>Omnipotent VI</b> base and unlock a <b>G</b> buyable",
                        cost: new Decimal("1e6666"),
                        unlocked(){
                                return hasUpgrade("i", 24) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 44)
                45: {
                        title: "Hardware",
                        description: "<b>Rebirth II</b> and <b>Guys</b> give free <b>Generated</b> buyables",
                        cost: new Decimal("1e6789"),
                        unlocked(){
                                return hasUpgrade("h", 44) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 45)
                51: {
                        title: "Homepage",
                        description: "Raise <b>Hope</b> effect to the square root of the number of <b>I</b> upgrades and <b>Hope</b> give free <b>Held</b> buyables",
                        cost: new Decimal("1e1204e3"),
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(33) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("h", 51)
                52: {
                        title: "Homes",
                        description: "Best knowledge multiplies <b>J</b> gain and automatically bulk <b>Rebirth III</b>",
                        cost: new Decimal("1e417e6"),
                        unlocked(){
                                return player.j.puzzle.repeatables[14].gte(10) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("h", 52)
                53: {
                        title: "Hill",
                        description: "Unlock a <b>H</b> challenge and best experience multiplies base <b>I</b> gain",
                        cost: new Decimal("1e530e6"),
                        unlocked(){
                                return hasUpgrade("i", 41) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("h", 53)
                54: {
                        title: "Hall",
                        description: "<b>Happy</b> gives free <b>Huge</b> and <b>Hour</b> levels",
                        cost: new Decimal("1e1258e6"),
                        unlocked(){
                                return hasUpgrade("i", 42) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("h", 54)
                55: {
                        title: "Hospital",
                        description: "<b>Happy</b> effects <b>Guys</b> at a logarithimic rate",
                        cost: new Decimal("1e4414e6"),
                        unlocked(){
                                return hasUpgrade("h", 54) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("h", 55)
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: getGeneralizedBuyableData("h", 11, function(){
                        return player.j.puzzle.upgrades.includes(31) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }),
                12: getGeneralizedBuyableData("h", 12, function(){
                        return player.j.puzzle.upgrades.includes(32) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }),
                13: getGeneralizedBuyableData("h", 13, function(){
                        return player.j.puzzle.upgrades.includes(33) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }),
                21: getGeneralizedBuyableData("h", 21, function(){
                        return player.j.puzzle.upgrades.includes(34) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }),
                22: getGeneralizedBuyableData("h", 22, function(){
                        return player.j.puzzle.upgrades.includes(44) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }),
                23: getGeneralizedBuyableData("h", 23, function(){
                        return hasMilestone("j", 6) || hasUnlockedPast("j")
                        }),
                31: getGeneralizedBuyableData("h", 31, function(){
                        return hasUpgrade("j", 12) || hasUnlockedPast("j")
                        }),
                32: getGeneralizedBuyableData("h", 32, function(){
                        return hasMilestone("j", 7) || hasUnlockedPast("j")
                        }),
                33: getGeneralizedBuyableData("h", 33, function(){
                        return hasMilestone("k", 3) || hasUnlockedPast("k")
                        }),
        },
        challenges: {
                rows: 2,
                cols: 2,
                totalSub(){
                        let c = 0
                        c += tmp.k.clickables[63].effect.toNumber()
                        c += tmp.j.clickables[73].effect.toNumber()
                        if (hasUpgrade("k", 45)) c += .05 * player.l.upgrades.length
                        c += CURRENT_BUYABLE_EFFECTS["j22"].toNumber()
                        c += tmp.m.upgrades[13].effect.toNumber()
                        return c
                },
                11: {
                        name: "Hi",
                        challengeDescription: "All previous layer buyables have no effect",
                        rewardDescription: "Give free <b>Huge</b> levels",
                        rewardEffect(){
                                let c = challengeCompletions("h", 11)
                                let ret = c * c * c * 5 + c * c * 45 + c * 50
                                return Math.floor(ret)
                        },
                        goal(){
                                let init = new Decimal("1e3800e18")
                                let c = challengeCompletions("h", 11)
                                if (c > 200) c = c**2 / 200
                                c = Math.max(0, c - tmp.h.challenges.totalSub)
                                let factor = getChallengeFactor(c)
                                if (factor.eq(1)) factor = new Decimal(0)
                                return init.times(Decimal.pow("1e11e18", factor))
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(52) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let ret = 20
                                if (hasUpgrade("j", 33)) ret += player.j.upgrades.length
                                if (hasUpgrade("k", 21)) ret += 5
                                if (hasMilestone("k", 10)) ret += player.k.milestones.length
                                if (hasMilestone("l", 11)) ret += player.l.milestones.length
                                if (hasUpgrade("k", 53)) ret += Math.floor(totalChallengeComps("k")/3)
                                if (hasUpgrade("k", 55)) ret += 75
                                if (hasUpgrade("l", 33)) ret += 2 * player.l.upgrades.length

                                return ret
                        },
                },
                12: {
                        name: "Hold",
                        challengeDescription: "<b>Hi</b> and Medal effect is nullified",
                        rewardDescription: "Raise <b>I</b> effect to a power",
                        rewardEffect(){
                                let c = challengeCompletions("h", 12)
                                let base = 10
                                if (hasUpgrade("j", 23)) base += player.j.upgrades.length
                                return Decimal.pow(base, Math.sqrt(c))
                        },
                        goal(){
                                let init = new Decimal("1e9525e18")
                                let c = challengeCompletions("h", 12)
                                if (c > 200) c = c**2 / 200
                                c = Math.max(0, c - tmp.h.challenges.totalSub)
                                let factor = getChallengeFactor(c)
                                if (factor.eq(1)) factor = new Decimal(0)
                                return init.times(Decimal.pow("1e1624e18", factor))
                        },
                        unlocked(){
                                return hasUpgrade("h", 53) || hasUnlockedPast("j")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let ret = 20
                                if (hasUpgrade("j", 33)) ret += player.j.upgrades.length
                                if (hasUpgrade("k", 21)) ret += 5
                                if (hasMilestone("k", 10)) ret += player.k.milestones.length
                                if (hasMilestone("l", 11)) ret += player.l.milestones.length
                                if (hasUpgrade("k", 53)) ret += Math.floor(totalChallengeComps("k")/3)
                                if (hasUpgrade("k", 55)) ret += 75
                                if (hasUpgrade("l", 33)) ret += 2 * player.l.upgrades.length

                                return ret
                        },
                        countsAs: [11],
                },
                21: {
                        name: "Housing",
                        challengeDescription: "<b>Hold</b> and <b>Egg</b> effect is nullified",
                        rewardDescription: "Multiply base <b>J</b> and knowledge gain",
                        rewardEffect(){
                                let c = challengeCompletions("h", 21)
                                let base = new Decimal(2)
                                if (hasUpgrade("j", 33)) base = base.plus(.1 * player.j.upgrades.length)
                                base = base.plus(tmp.j.clickables[74].effect)
                                return Decimal.pow(base, c)
                        },
                        goal(){
                                let init = new Decimal("1e2362e21")
                                let c = challengeCompletions("h", 21)
                                if (c > 200) c = c**2 / 200
                                c = Math.max(0, c - tmp.h.challenges.totalSub)
                                let factor = getChallengeFactor(c)
                                if (factor.eq(1)) factor = new Decimal(0)
                                return init.times(Decimal.pow("1e587e21", factor))
                        },
                        unlocked(){
                                return hasMilestone("k", 4) || hasUnlockedPast("k")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let ret = 20
                                if (hasUpgrade("j", 33)) ret += player.j.upgrades.length
                                if (hasUpgrade("k", 21)) ret += 5
                                if (hasMilestone("k", 10)) ret += player.k.milestones.length
                                if (hasMilestone("l", 11)) ret += player.l.milestones.length
                                if (hasUpgrade("k", 53)) ret += Math.floor(totalChallengeComps("k")/3)
                                if (hasUpgrade("k", 55)) ret += 75
                                if (hasUpgrade("l", 33)) ret += 2 * player.l.upgrades.length

                                return ret
                        },
                        countsAs: [11, 12],
                },
                22: {
                        name: "Hit",
                        challengeDescription: "<b>Housing</b> and <b>Heart</b> effect is nullified",
                        rewardDescription: "Add to Larger Puzzle and <b>Japan</b> base",
                        rewardEffect(){
                                let c = challengeCompletions("h", 22)
                                let exp = 1.5
                                let init = Decimal.pow(c, exp)
                                if (init.gt(10) && !hasUpgrade("j", 43)) init = init.log10().times(10)
                                return init.times(.02)
                        },
                        goal(){
                                let init = new Decimal("1e1099e28")
                                let c = challengeCompletions("h", 22)
                                if (c > 200) c = c**2 / 200
                                c = Math.max(0, c - tmp.h.challenges.totalSub)
                                if (c > 3 && !player.j.puzzle.upgrades.includes(64)) c = c * c / 3
                                let factor = getChallengeFactor(c)
                                if (factor.eq(1)) factor = new Decimal(0)
                                return init.times(Decimal.pow("1e191e28", factor))
                        },
                        unlocked(){
                                return hasUpgrade("j", 41) || hasUnlockedPast("k")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let ret = 20
                                if (hasUpgrade("j", 33)) ret += player.j.upgrades.length
                                if (hasUpgrade("k", 21)) ret += 5
                                if (hasMilestone("k", 10)) ret += player.k.milestones.length
                                if (hasMilestone("l", 11)) ret += player.l.milestones.length
                                if (hasUpgrade("k", 53)) ret += Math.floor(totalChallengeComps("k")/3)
                                if (hasUpgrade("k", 55)) ret += 75
                                if (hasUpgrade("l", 33)) ret += 2 * player.l.upgrades.length

                                return ret
                        },
                        countsAs: [11, 12, 21],
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("h", 22) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "h") return ""
                                                return shiftDown ? "Your best Hearts is " + format(player.h.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "h") return ""
                                                if (hasUnlockedPast("h")) return ""
                                                return "You have done " + formatWhole(player.h.times) + " Heart resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "h") return ""
                                                if (hasUpgrade("h", 22)) return "You are gaining " + format(tmp.h.getResetGain) + " Hearts per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.h.time)) + ")" 
                                        },
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
                                return player.j.puzzle.upgrades.includes(31) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                "milestones",
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Challenges": {
                        content: [
                                ["display-text",
                                        function() {
                                                if (player.tab != "h") return ""
                                                return "Challenge completions are not reset unless said so, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "h") return ""
                                                return "You have completed " + formatWhole(totalChallengeComps("h")) + " Heart Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(52) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                },
                
        },
        doReset(layer){
                let data = player.h
                if (layer == "h") data.time = 0
                if (!getsReset("h", layer)) return
                data.time = 0
                data.times = 0

                if (!hasMilestone("i", 7)) {
                        //upgrades
                        let keep = []
                        data.upgrades = filter(data.upgrades, keep)
                }
                if (!false) {
                        //milestones
                        let keep2 = []
                        if (hasMilestone("i", 1)) keep2.push("1")
                        data.milestones = filter(data.milestones, keep2)
                }

                //resources
                data.points = new Decimal(0)
                data.total = new Decimal(0)
                data.best = new Decimal(0)
                player.goalsii.points = new Decimal(0)
                player.goalsii.total = new Decimal(0)
                player.goalsii.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        data.buyables[resetBuyables[j]] = new Decimal(0)
                }
        },
})

addLayer("i", {
        name: "Ideas",
        symbol: "I",
        position: 0,
        startData() { 
                return {
                        unlocked: true,
                        points: new Decimal(0),
                        best: new Decimal(0),
                        total: new Decimal(0),
                        abtime: 0,
                        time: 0,
                        times: 0,
                        autotimes: 0,
                        autodevtime: 0,
                }
        },
        color: "#FFFF33",
        branches: ["h"],
        requires: new Decimal(0),
        resource: "Ideas",
        baseResource: "Hearts",
        baseAmount() {
                return player.h.best
        },
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("i")
        },
        getBaseDiv(){
                let x = new Decimal("1e10")
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasMilestone("i", 7)) x = x.plus(1)
                if (hasUpgrade("h", 31)) x = x.plus(player.h.upgrades.length * .1)
                if (hasUpgrade("h", 43)) x = x.plus(player.i.upgrades.length * .2)
                if (hasMilestone("j", 4)) x = x.plus(123.456 * player.j.milestones.length)
                if (hasMilestone("k", 8)) x = x.plus(tmp.h.challenges[11].rewardEffect)
                x = x.plus(tmp.k.clickables[21].effect)
                return x
        },
        getGainMultPre(){
                let x = Decimal.pow(7, -1)
                if (hasUpgrade("i", 14)) x = x.times(Decimal.pow(1.1, player.i.upgrades.length))
                if (hasUpgrade("i", 25)) x = x.times(Math.max(1, totalChallengeComps("f")))
                if (hasMilestone("j", 2)) x = x.times(Decimal.pow(2, player.j.milestones.length))
                if (hasUpgrade("h", 53)) x = x.times(player.j.puzzle.bestExp.max(1))
                if (hasUpgrade("i", 43)) x = x.times(Decimal.pow(player.i.upgrades.length, player.i.upgrades.length).max(1))
                if (hasUpgrade("i", 44)) x = x.times(Decimal.pow(totalChallengeComps("f"), totalChallengeComps("f")).max(1))
                if (hasUpgrade("j", 14)) x = x.times(Decimal.pow(player.j.puzzle.bestExp.max(1), player.j.upgrades.length))
                x = x.times(CURRENT_BUYABLE_EFFECTS["i22"])
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("i")

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("i")) return new Decimal(1)

                let amt = player.i.best

                let exp = player.i.best.pow(.4).times(2).min(30)
                if (hasUpgrade("i", 24)) exp = exp.times(tmp.f.challenges[21].rewardEffect)
                exp = exp.times(tmp.h.challenges[12].rewardEffect)
                
                let exp2 = new Decimal(0)
                exp2 = exp2.plus(CURRENT_BUYABLE_EFFECTS["h23"]) 

                let ret = amt.times(2).pow(2).plus(1).pow(exp)

                let ret2 = amt.pow(exp2).max(1)

                return ret.times(ret2)
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("i")
        },
        update(diff){
                let data = player.i

                data.best = data.best.max(data.points)
                if (hasUpgrade("i", 22)) {
                        let gain = tmp.i.getResetGain
                        data.points = data.points.plus(gain.times(diff))
                        data.total = data.total.plus(gain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (hasUpgrade("j", 42)) {
                        handleGeneralizedBuyableAutobuy(diff, "i")
                } else {
                        data.abtime = 0
                }

                data.time += diff
                data.autodevtime += diff
                
                if (data.autodevtime < 1) return
                data.autodevtime += -1
                if (data.autodevtime > 10) data.autodevtime = 10

                let l =  ["f", "g", "h"]
                let l2 = ["F", "G", "H"]
                let trylist = [11, 12, 13, 14, 15, 
                               21, 22, 23, 24, 25,
                               31, 32, 33, 34, 35,
                               41, 42, 43, 44, 45,
                               51, 52, 53, 54, 55,]
                for (j in l){
                        i = l[j] 
                        let can = data["autobuy" + l2[j]] && hasMilestone("i", String(Number(j) + 3))
                        if (!can) continue
                        for (k in trylist) {
                                if (hasUpgrade(i, trylist[k])) continue
                                if (layers[i].upgrades[trylist[k]] == undefined) continue
                                
                                buyUpgrade(i, trylist[k])
                        }
                }
        },
        row: 8,
        hotkeys: [
                {key: "i", description: "I: Reset for Ideas", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+I", description: "Shift+I: Go to Ideas", onPress(){
                                showTab("i")
                        }
                },
                {key: "3", description: "3: Rebirth III", onPress(){
                                let data = layers.g.clickables[35]
                                if (data.canClick()) data.onClick()
                        }
                },
        ],
        layerShown(){return player.h.best.gt(5e16) || player.i.best.gt(0) || hasUnlockedPast("i")},
        prestigeButtonText(){
                if (hasUpgrade("i", 22)) return ""
                return getGeneralizedPrestigeButtonText("i")
        },
        canReset(){
                return player.i.time >= 2 && !hasUpgrade("i", 22) && tmp.i.getResetGain.gt(0)
        },
        milestones: {
                1: {
                        requirementDescription: "<b>In</b><br>Requires: 1 Idea", 
                        effectDescription: "Side layers do not get reset and keep <b>Have</b>",
                        done(){
                                return player.i.points.gte(1)
                        },
                        unlocked(){
                                return true
                        }, // hasMilestone("i", 1)
                },
                2: {
                        requirementDescription: "<b>Is</b><br>Requires: 2 Ideas", 
                        effectDescription: "Doing a Rebirth II does not reset your Rebirth Is",
                        done(){
                                return player.i.points.gte(2)
                        },
                        unlocked(){
                                return hasMilestone("i", 1) || hasUnlockedPast("i")
                        }, // hasMilestone("i", 2)
                },
                3: {
                        requirementDescription: "<b>I</b><br>Requires: 3 Ideas", 
                        effectDescription: "Each <b>I</b> milestone doubles base <b>G</b> gain and autobuy <b>F</b> upgrades",
                        done(){
                                return player.i.points.gte(3)
                        },
                        unlocked(){
                                return hasMilestone("i", 2) || hasUnlockedPast("i")
                        }, // hasMilestone("i", 3)
                        toggles: [["i", "autobuyF"]]
                },
                4: {
                        requirementDescription: "<b>It</b><br>Requires: 5 Ideas", 
                        effectDescription: "Keep <b>Gallery</b> and autobuy <b>G</b> upgrades and add 100 to base charge gain",
                        done(){
                                return player.i.points.gte(5)
                        },
                        unlocked(){
                                return hasMilestone("i", 3) || hasUnlockedPast("i")
                        }, // hasMilestone("i", 4)
                        toggles: [["i", "autobuyG"]],
                },
                5: {
                        requirementDescription: "<b>If</b><br>Requires: 7 Ideas", 
                        effectDescription: "Keep <b>F</b> upgrades and autobuy <b>H</b> upgrades",
                        done(){
                                return player.i.points.gte(7)
                        },
                        unlocked(){
                                return hasMilestone("i", 4) || hasUnlockedPast("i")
                        }, // hasMilestone("i", 5)
                        toggles: [["i", "autobuyH"]],
                },
                6: {
                        requirementDescription: "<b>Information</b><br>Requires: 11 Ideas", 
                        effectDescription: "Keep <b>G</b> upgrades and <b>G</b> milestones",
                        done(){
                                return player.i.points.gte(11)
                        },
                        unlocked(){
                                return hasMilestone("i", 5) || hasUnlockedPast("i")
                        }, // hasMilestone("i", 6)
                },
                7: {
                        requirementDescription: "<b>Its</b><br>Requires: 15 Ideas", 
                        effectDescription: "Keep <b>H</b> upgrades and add one to the <b>H</b> gain exponent",
                        done(){
                                return player.i.points.gte(15)
                        },
                        unlocked(){
                                return hasMilestone("i", 6) || hasUnlockedPast("i")
                        }, // hasMilestone("i", 7)
                },
                8: {
                        requirementDescription: "<b>Into</b><br>Requires: 2e6 Ideas", 
                        effectDescription: "Automatically bulk buy Rebirth I",
                        done(){
                                return player.i.points.gte(2e6)
                        },
                        unlocked(){
                                return hasMilestone("i", 7) || hasUnlockedPast("i")
                        }, // hasMilestone("i", 8)
                },
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Info",
                        description: "Unlock an <b>F</b> buyable and each upgrade in this row unlocks a <b>G</b> buyable",
                        cost: new Decimal(3e6),
                        unlocked(){
                                return hasMilestone("i", 8) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 11)
                12: {
                        title: "Items",
                        description: "Unlock an <b>F</b> challenge and per upgrade act as if you have 3% less rebirths",
                        cost: new Decimal(3e6),
                        unlocked(){
                                return hasUpgrade("g", 51) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 12)
                13: {
                        title: "Item",
                        description: "Each upgrade adds 10 to the <b>H</b> gain exponent and <b>F</b> and <b>G</b> buyables cost nothing",
                        cost: new Decimal(3e6),
                        unlocked(){
                                return hasUpgrade("g", 52) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 13)
                14: {
                        title: "International",
                        description: "Per upgrade raise <b>A</b> gain ^1.1 and multiply base <b>I</b> gain by 1.1",
                        cost: new Decimal(1e10),
                        unlocked(){
                                return hasUpgrade("h", 32) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 14)
                15: {
                        title: "Internet",
                        description: "Per upgrade add .01 to <b>Gives</b> base and <b>Generation</b> gives free <b>Goal</b> levels",
                        cost: new Decimal(3e10),
                        unlocked(){
                                return hasUpgrade("i", 14) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 15)
                21: {
                        title: "Index",
                        description: "<b>Guarantee</b> and <b>Generation</b> give free <b>Guidelines</b> levels",
                        cost: new Decimal(3e11),
                        unlocked(){
                                return hasUpgrade("i", 15) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 21)
                22: {
                        title: "Including",
                        description: "Remove the ability to prestige but gain 100% of <b>I</b> upon prestige per second",
                        cost: new Decimal(1e12),
                        unlocked(){
                                return hasUpgrade("i", 21) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 22)
                23: {
                        title: "Image",
                        description: "Unlock a <b>G</b> buyable and each upgrade multiplies base <b>H</b> gain by 10",
                        cost: new Decimal(2e15),
                        unlocked(){
                                return hasUpgrade("h", 42) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 23)
                24: {
                        title: "Insurance",
                        description: "<b>Further</b> effects <b>I</b> effect and <b>Generated</b> gives free <b>Growing</b> levels",
                        cost: new Decimal(2e16),
                        unlocked(){
                                return hasUpgrade("i", 23) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 24)
                25: {
                        title: "Include",
                        description: "<b>F</b> challenge completions multiply base <b>I</b> gain and <b>Guys</b> gives free <b>Growing</b> levels",
                        cost: new Decimal(1e25),
                        unlocked(){
                                return hasUpgrade("h", 45) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 25)
                31: {
                        title: "Industry",
                        description: "Multiply knowledge gain by the number of <b>I</b> upgrades",
                        cost: new Decimal("1e8642"),
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(41) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 31)
                32: {
                        title: "Issues",
                        description: "Upon placing all corners and edges while building the edge automatically start buidling the center",
                        cost: new Decimal("1e40e3"),
                        unlocked(){
                                return player.j.puzzle.repeatables[14].gte(3) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 32)
                33: {
                        title: "Important",
                        description: "Remove the ability to prestige for Jigsaws but gain 100% of Jigsaws upon prestige per second",
                        cost: new Decimal("1e41e3"),
                        unlocked(){
                                return player.j.puzzle.repeatables[14].gte(5) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 33)
                34: {
                        title: "Issue",
                        description: "If you do not have the requirements for the current puzzle mode then automatically start filtering",
                        cost: new Decimal("1e43210"),
                        unlocked(){
                                return player.j.puzzle.repeatables[14].gte(6) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 34)
                35: {
                        title: "Interest",
                        description: "Levels of Japan multiply <b>Huge</b> base and base <b>J</b> gain",
                        cost: new Decimal("1e54321"),
                        unlocked(){
                                return player.j.puzzle.repeatables[14].gte(8) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 35)
                41: {
                        title: "Images",
                        description: "Make the puzzle reset cooldown 20 seconds and log10([best knowledge]) adds to <b>Generated</b> base",
                        cost: new Decimal("1e100000"),
                        unlocked(){
                                return player.j.puzzle.repeatables[14].gte(11) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 41)
                42: {
                        title: "Includes",
                        description: "Per upgrade add .01 to the <b>Hour</b> base",
                        cost: new Decimal("1e118000"),
                        unlocked(){
                                return player.j.puzzle.repeatables[14].gte(12) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 42)
                43: {
                        title: "Island",
                        description: "Per upgrade multiply base <b>I</b> gain by the number of upgrades",
                        cost: new Decimal("1e120000"),
                        unlocked(){
                                return hasUpgrade("h", 55) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 43)
                44: {
                        title: "Individual",
                        description: "Per <b>F</b> challenge completion multiply base <b>I</b> gain by the number of <b>F</b> challenge completions",
                        cost: new Decimal("1e140000"),
                        unlocked(){
                                return hasUpgrade("i", 43) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 44)
                45: {
                        title: "Included",
                        description: "Square <b>Huge</b> base and unlock <b>J</b> upgrades",
                        cost: new Decimal("1e477000"),
                        unlocked(){
                                return hasUpgrade("i", 44) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 45)
                51: {
                        title: "India",
                        description: "You start at 90% of your best puzzles finished this <b>K</b> and get resources as if you did them",
                        cost: new Decimal("1e1234567"),
                        unlocked(){
                                return hasMilestone("k", 4) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("i", 51)
                52: {
                        title: "Income",
                        description: "Keep success chance levels and unlock a <b>K</b> milestone",
                        cost: new Decimal("1e1444444"),
                        unlocked(){
                                return hasUpgrade("i", 51) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("i", 52)
                53: {
                        title: "Institute",
                        description: "Once per second get Attempt Speed levels as if you bought max but it doesn't cost Knowledge",
                        cost: new Decimal("1e5500e3"),
                        unlocked(){
                                return hasUpgrade("i", 52) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("i", 53)
                54: {
                        title: "Inside",
                        description: "Once per second get attempt to Reset<sup>2</sup> and per <b>J</b> upgrade multiply base <b>J</b> gain by bulk amount",
                        cost: new Decimal("1e6000e3"),
                        unlocked(){
                                return hasUpgrade("i", 53) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("i", 54)
                55: {
                        title: "Islands",
                        description: "Each Reset<sup>2</sup> doubles base <b>K</b> gain and multiplies Knowledge gain by 10",
                        cost: new Decimal("1e7777e3"),
                        unlocked(){
                                return hasUpgrade("i", 54) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("i", 55)
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: getGeneralizedBuyableData("i", 11, function(){
                        return hasUpgrade("j", 41) || hasUnlockedPast("k")
                        }),
                12: getGeneralizedBuyableData("i", 12, function(){
                        return hasUpgrade("j", 42) || hasUnlockedPast("k")
                        }),
                13: getGeneralizedBuyableData("i", 13, function(){
                        return hasUpgrade("j", 43) || hasUnlockedPast("k")
                        }),
                21: getGeneralizedBuyableData("i", 21, function(){
                        return hasUpgrade("j", 44) || hasUnlockedPast("k")
                        }),
                22: getGeneralizedBuyableData("i", 22, function(){
                        return hasUpgrade("j", 45) || hasUnlockedPast("k")
                        }),
                23: getGeneralizedBuyableData("i", 23, function(){
                        return hasMilestone("l", 7) || hasUnlockedPast("l")
                        }),
                31: getGeneralizedBuyableData("i", 31, function(){
                        return hasUpgrade("l", 11) || hasUnlockedPast("l")
                        }),
                32: getGeneralizedBuyableData("i", 32, function(){
                        return hasUpgrade("l", 22) || hasUnlockedPast("l")
                        }),
                33: getGeneralizedBuyableData("i", 33, function(){
                        return hasUpgrade("l", 24) || hasUnlockedPast("l")
                        }),
        },
        tabFormat: {
                "Upgrades": {
                        content: [
                                "main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("i", 22) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "i") return ""
                                                return shiftDown ? "Your best Ideas is " + format(player.i.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "i") return ""
                                                if (hasUnlockedPast("i")) return ""
                                                return "You have done " + formatWhole(player.i.times) + " Idea resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "i") return ""
                                                if (hasUpgrade("i", 22)) return "You are gaining " + format(tmp.i.getResetGain) + " Ideas per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.i.time)) + ")" 
                                        },
                                        //{"font-size": "20px"}
                                ],
                                "blank", 
                                ["upgrades", [1,5]]
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("j", 41) || hasUnlockedPast("k")
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                "milestones",
                        ],
                        unlocked(){
                                return true
                        },
                },
        },
        doReset(layer){
                let data = player.i
                if (layer == "i") data.time = 0
                if (!getsReset("i", layer)) return
                data.time = 0
                data.times = 0

                if (!hasMilestone("j", 3)) {
                        //upgrades
                        let keep = []
                        data.upgrades = filter(data.upgrades, keep)
                }
                
                if (!hasMilestone("k", 2)) {
                        //milestones
                        let keep2 = []
                        for (i = 0; i < player.j.times; i++) {
                                if (i >= 8) break
                                if (!hasMilestone("j", 1)) break
                                keep2.push(["1", "2", "3", "4", "5", "6", "7", "8"][i])
                        }
                        data.milestones = filter(data.milestones, keep2)
                }


                //resources
                data.points = new Decimal(0)
                data.total = new Decimal(0)
                data.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        data.buyables[resetBuyables[j]] = new Decimal(0)
                }
        },
})

addLayer("j", {
        name: "Jigsaws",
        symbol: "J",
        position: 0,
        startData() { 
                return {
                        unlocked: true,
                        points: new Decimal(0),
                        best: new Decimal(0),
                        total: new Decimal(0),
                        abtime: 0,
                        time: 0,
                        times: 0,
                        autotimes: 0,
                        autodevtime: 0,
                        autopuzzlereset: false,
                        puzzle: {
                                exp: new Decimal(0),
                                bestExp: new Decimal(0),
                                bankedExp: new Decimal(0),
                                knowledge: new Decimal(0),
                                bestKnowledge: new Decimal(0),
                                mode: 4,
                                currentX: 10,
                                currentY: 10,
                                upgrades: [],
                                autotime: new Decimal(0),
                                time: 0,
                                finished: 0,
                                bartype: 2,
                                bestCompletedK: 0,
                                bestCompletedAllTime: 0,
                                repeatables: {
                                        11: new Decimal(0),
                                        12: new Decimal(0),
                                        13: new Decimal(0),
                                        14: new Decimal(0),
                                        35: new Decimal(0),
                                        45: new Decimal(0),
                                        55: new Decimal(0),
                                        65: new Decimal(0),
                                        71: new Decimal(0),
                                        72: new Decimal(0),
                                        73: new Decimal(0),
                                        74: new Decimal(0),
                                        75: new Decimal(0),
                                },
                                found: {
                                        edges: 0,
                                        corners: 0,
                                        centers: 0,
                                },
                                placed: {
                                        edges: 0,
                                        corners: 0,
                                        centers: 0,
                                },
                                reset2: {
                                        times: 0,
                                        done: false,
                                }
                        },
                }
        },
        color: "#66CCFF",
        branches: ["i"],
        requires: new Decimal(0), 
        resource: "Jigsaws", 
        baseResource: "Ideas", 
        baseAmount() {
                return player.i.best
        }, 
        type: "custom", 
        getResetGain() {
                return getGeneralizedPrestigeGain("j")
        },
        getBaseDiv(){
                let x = new Decimal("3e30")
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasUpgrade("j", 25)) {
                        let a = player.j.puzzle.reset2.times 
                        if (hasUpgrade("j", 31)) a = Decimal.times(a,a)
                        x = x.plus(a)
                }
                if (player.j.puzzle.upgrades.includes(61)) x = x.plus(player.j.puzzle.repeatables[35])
                return x
        },
        getGainMultPre(){
                let x = Decimal.pow(11, -1)
                if (hasUpgrade("i", 35)) x = x.times(player.j.puzzle.repeatables[35].max(1))
                if (hasMilestone("j", 6)) x = x.times(tmp.j.clickables[35].effect)
                x = x.times(tmp.j.clickables[55].effect)
                if (hasMilestone("k", 2)) x = x.times(Decimal.pow(3, player.k.milestones.length))
                x = x.times(tmp.h.challenges[21].rewardEffect)
                if (hasUpgrade("i", 54)) x = x.times(Decimal.pow(tmp.j.clickables.getBulkAmount, player.j.upgrades.length))
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("j")

                if (hasUpgrade("h", 52)) x = x.times(player.j.puzzle.bestKnowledge.max(1))
                if (hasUpgrade("j", 11)) x = x.times(Decimal.pow(player.j.puzzle.repeatables[13].max(1), player.j.upgrades.length))
                if (hasUpgrade("j", 13)) x = x.times(player.j.puzzle.repeatables[12].max(10).log10())

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("j")) return new Decimal(1)

                let amt = player.j.best

                let exp = player.j.best.pow(.35).times(4).min(500)
                if (player.j.puzzle.upgrades.includes(43)) exp = exp.times(player.j.puzzle.upgrades.length)

                let ret = amt.times(3).plus(1).pow(exp)

                ret = ret.times(amt.max(1).pow(CURRENT_BUYABLE_EFFECTS["j12"]))

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("j")
        },
        update(diff){
                let data = player.j

                data.best = data.best.max(data.points)
                if (hasUpgrade("i", 33)) {
                        let gain = tmp.j.getResetGain
                        data.points = data.points.plus(gain.times(diff))
                        data.total = data.total.plus(gain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (hasUpgrade("l", 22)) {
                        handleGeneralizedBuyableAutobuy(diff, "j")
                } else {
                        data.abtime = 0
                }

                data.time += diff
                let autoDevFactor = 1
                if (player.j.puzzle.upgrades.includes(62)) autoDevFactor *= 4
                data.autodevtime += diff * autoDevFactor

                if (!hasUnlockedPast("i")) return 

                //puzzle
                let data2 = data.puzzle
                let tot1 = (data2.currentX - 2) * (data2.currentY - 2)
                let tot2 = (data2.currentX - 2 + data2.currentY - 2) * 2
                let tot3 = 4
                data2.bestKnowledge = data2.bestKnowledge.max(data2.knowledge)
                data2.bestExp = data2.bestExp.max(data2.exp)
                data2.bestCompletedK = Math.max(data2.bestCompletedK, data2.finished)
                data2.bestCompletedAllTime = Math.max(data2.bestCompletedAllTime, data2.finished)
                data2.time += diff
                data2.autotime = data2.autotime.plus(tmp.j.clickables.getAttemptSpeed.times(diff))
                let multiplier = tmp.j.clickables.getBulkAmount

                let finishedPEdges = tot2 == data2.placed.edges
                let finishedPCorners = tot3 == data2.placed.corners
                let finishedPCenters = tot1 == data2.placed.centers
                let finishedFEdges = tot2 == data2.found.edges
                let finishedFCorners = tot3 == data2.found.corners
                let finishedFCenters = tot1 == data2.found.centers

                let a = data2.autotime.floor().times(multiplier)
                if (data2.mode == 1) layers.j.clickables.doSearch(a)
                if (data2.mode == 2) {
                        if (finishedFCorners && finishedFEdges) {
                                layers.j.clickables.doEdges(a)
                        } else if (hasUpgrade("i", 34) || player.j.puzzle.reset2.done) {
                                data2.mode = 1
                        }
                }
                if (data2.mode == 3) {
                        if (finishedFCenters && finishedPEdges) {
                                layers.j.clickables.doCenters(a)
                        } else if (hasUpgrade("i", 34) || player.j.puzzle.reset2.done) {
                                data2.mode = 1
                        }
                }
                if (data2.mode == 4) {
                        if (hasUpgrade("i", 34) || player.j.puzzle.reset2.done) {
                                if (finishedPEdges && finishedPCorners && finishedPCenters) {}
                                else {
                                        data2.mode = 1
                                }

                        }
                        if (data2.autotime > 1) layers.j.clickables.attemptFinish()
                }

                finishedPEdges = tot2 == data2.placed.edges
                finishedPCorners = tot3 == data2.placed.corners
                finishedFEdges = tot2 == data2.found.edges
                finishedFCorners = tot3 == data2.found.corners
                finishedFCenters = tot1 == data2.found.centers

                if (!(finishedFEdges && finishedFCorners && finishedFCenters)){
                        data2.placed.centers = 0
                        data2.placed.corners = 0
                        data2.placed.edges = 0
                } //not found all pieces
                if (!finishedPCorners){
                        data2.placed.centers = 0
                        data2.placed.edges = 0
                } //not placed all corners
                if (!finishedPEdges) {
                        data2.placed.centers = 0
                } //not placed all centers
                

                //do stuff for other settings
                if (data2.autotime.lt(1e20)) data2.autotime = data2.autotime.sub(data2.autotime.floor())
                else data2.autotime = new Decimal(0)
                
                if (data.autodevtime < 1) return
                data.autodevtime += -1
                if (data.autopuzzlereset && hasMilestone("j", 5)) {
                        layers.j.clickables[25].onClick()
                }
                if (hasMilestone("k", 6)) {
                        layers.j.clickables[11].onClick(forcemulti = true, nocost = true)
                }
                if (hasUpgrade("i", 53)) {
                        layers.j.clickables[12].onClick(forcemulti = true, nocost = true)
                }
                if (hasUpgrade("i", 54)) {
                        layers.j.clickables[65].onClick()
                }
                if (hasUpgrade("j", 32)) {
                        layers.j.clickables[13].onClick(nocost = true)
                }
                if (hasMilestone("k", 9)) {
                        layers.j.clickables[14].onClick(nocost = true)
                }
                if (hasUpgrade("j", 44)){
                        layers.j.clickables[35].onClick()
                        layers.j.clickables[45].onClick()
                        layers.j.clickables[55].onClick()
                }
                if (hasMilestone("l", 11)){
                        layers.j.clickables[71].onClick()
                        layers.j.clickables[72].onClick()
                        layers.j.clickables[73].onClick()
                        layers.j.clickables[74].onClick()
                }
                if (data.autodevtime > 10) data.autodevtime = 10
        },
        row: 9, 
        hotkeys: [
                {key: "j", description: "J: Reset for Jigsaws", onPress(){
                                if (!shiftDown) {
                                        if (canReset(this.layer)) doReset(this.layer)
                                } else {
                                        showTab("j")
                                }
                        }
                },
                {key: "shift+J", description: "Shift+J: Go to Jigsaws", onPress(){
                                showTab("j")
                        }
                },
                {key: "4", description: "4: Rebirth IV", onPress(){
                                let data = layers.g.clickables[45]
                                if (data.canClick()) data.onClick()
                        }
                },
                {key: "6", description: "6: Select Filter", onPress(){
                                layers.j.clickables[21].onClick()
                        }
                },
                {key: "7", description: "7: Select Edges", onPress(){
                                layers.j.clickables[22].onClick()
                        }
                },
                {key: "8", description: "8: Select Center", onPress(){
                                layers.j.clickables[23].onClick()
                        }
                },
                {key: "9", description: "9: Select Finish", onPress(){
                                layers.j.clickables[24].onClick()
                        }
                },
                {key: "shift+)", description: "Shift+0: Puzzle Reset", onPress(){
                                layers.j.clickables[25].onClick()
                        }
                },
        ],
        layerShown(){return hasUpgrade("i", 25) || player.j.best.gt(0) || hasUnlockedPast("j")},
        prestigeButtonText(){
                if (hasUpgrade("i", 33)) return ""
                return getGeneralizedPrestigeButtonText("j")
        },
        canReset(){
                return player.j.time >= 2 && !hasUpgrade("i", 33) && tmp.j.getResetGain.gt(0)
        },
        milestones: {
                1: {
                        requirementDescription: "<b>Just</b><br>Requires: 1 Jigsaw", 
                        effectDescription: "Per <b>J</b> reset keep one <b>I</b> milestone",
                        done(){
                                return player.j.points.gte(1)
                        },
                        unlocked(){
                                return true || hasUnlockedPast("j")
                        }, // hasMilestone("j", 1)
                },
                2: {
                        requirementDescription: "<b>January</b><br>Requires: 5 Jigsaws", 
                        effectDescription: "Per <b>J</b> milestone double base <b>I</b> gain",
                        done(){
                                return player.j.points.gte(5)
                        },
                        unlocked(){
                                return hasMilestone("j", 1) || hasUnlockedPast("j")
                        }, // hasMilestone("j", 2)
                },
                3: {
                        requirementDescription: "<b>Jobs</b><br>Requires: 625 Jigsaws", 
                        effectDescription: "Keep <b>I</b> upgrades and per <b>J</b> milestone act as if you have 4% less rebirths",
                        done(){
                                return player.j.points.gte(625)
                        },
                        unlocked(){
                                return hasMilestone("j", 2) || hasUnlockedPast("j")
                        }, // hasMilestone("j", 3)
                },
                4: {
                        requirementDescription: "<b>Job</b><br>Requires: 1,953,125 Jigsaws", 
                        effectDescription: "Per <b>J</b> milestone add 123.456 to <b>I</b> gain exponent",
                        done(){
                                return player.j.points.gte(1953125)
                        },
                        unlocked(){
                                return hasMilestone("j", 3) || hasUnlockedPast("j")
                        }, // hasMilestone("j", 4)
                },
                5: {
                        requirementDescription: "<b>Jones</b><br>Requires: 152,587,890,625 Jigsaws", 
                        effectDescription: "Unlock the ability to automatically reset puzzles if possible",
                        done(){
                                return player.j.points.gte(5 ** 16)
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(51) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }, // hasMilestone("j", 5)
                        toggles: [["j", "autopuzzlereset"]]
                },
                6: {
                        requirementDescription: "<b>Jim</b><br>Requires: 2.98e17 Jigsaws", 
                        effectDescription: "Unlock a <b>H</b> buyable and <b>Japan</b> multiplies base <b>J</b> gain",
                        done(){
                                return player.j.points.max(1).log(5).gte(25)
                        },
                        unlocked(){
                                return hasMilestone("j", 5) || hasUnlockedPast("j")
                        }, // hasMilestone("j", 6)
                },
                7: {
                        requirementDescription: "<b>Judge</b><br>Requires: 1.46e25 Jigsaws", 
                        effectDescription: "Unlock a <b>H</b> buyable and <b>Hair</b> gives free <b>Happy</b> levels",
                        done(){
                                return player.j.points.max(1).log(5).gte(36)
                        },
                        unlocked(){
                                return hasUpgrade("j", 13) || hasUnlockedPast("j")
                        }, // hasMilestone("j", 7)
                },
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Joint",
                        description: "Per upgrade multiply <b>J</b> gain by your Bulk Amount levels and you can puzzle reset 3% faster for every upgrade",
                        cost: new Decimal(2e20),
                        unlocked(){
                                return hasUpgrade("h", 45) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 11)
                12: {
                        title: "Joe",
                        description: "Unlock a <b>H</b> buyable and raise the jigsaw speed multiplier to the square root of the number of upgrades",
                        cost: new Decimal(1e22),
                        unlocked(){
                                return hasUpgrade("j", 11) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 12)
                13: {
                        title: "Jackson",
                        description: "You can bulk attempt speed while holding shift, log10(attempt speed levels) multiplies <b>J</b> gain, and unlock a milestone",
                        cost: new Decimal(5e23),
                        unlocked(){
                                return hasUpgrade("j", 12) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 13)
                14: {
                        title: "Joseph",
                        description: "Multiply knowledge gain by the number of upgrades and each upgrade multiplies base <b>I</b> gain by best exp",
                        cost: new Decimal(1e26),
                        unlocked(){
                                return hasUpgrade("j", 13) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 14)
                15: {
                        title: "Jeff",
                        description: "log(best knowledge) multiplies knowledge gain and <b>Horse</b> gives free <b>Hair</b> levels",
                        cost: new Decimal(5e28),
                        unlocked(){
                                return hasUpgrade("j", 14) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 15)
                21: {
                        title: "Jordan",
                        description: "<b>Junior</b> effects <b>Held</b> and <b>Horse</b> gives free <b>Happy</b> levels",
                        cost: new Decimal(2e30),
                        unlocked(){
                                return hasUpgrade("j", 15) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 21)
                22: {
                        title: "Jean",
                        description: "Raise <b>Hope</b> base to the number of puzzle upgrades and add one to <b>Junior</b> base",
                        cost: new Decimal(5e33),
                        unlocked(){
                                return (hasUpgrade("j", 21) && player.j.puzzle.repeatables[14].gte(20)) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 22)
                23: {
                        title: "Journals",
                        description: "Each upgrade adds one to <b>Hold</b> effect base (it is initially 10)",
                        cost: new Decimal(1e38),
                        unlocked(){
                                return (hasUpgrade("j", 22) && player.j.puzzle.reset2.done) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 23)
                24: {
                        title: "Jennifer",
                        description: "<b>Japan</b> effects <b>Junior</b> base and you can complete one more of each <b>F</b> challenge",
                        cost: new Decimal(1e40),
                        unlocked(){
                                return hasUpgrade("j", 23) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 24)
                25: {
                        title: "Jose",
                        description: "Gain 5x attempt speed and knowledge gain and each <b>Reset<sup>2</sup></b> adds 1 to the <b>J</b> gain exponent",
                        cost: new Decimal(1e46),
                        unlocked(){
                                return hasUpgrade("j", 24) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 25)
                31: {
                        title: "Jane",
                        description: "Raise <b>Jose</b> effect to the number of <b>Reset<sup>2</sup></b>'s and halve reset cooldown",
                        cost: new Decimal("1e1750"),
                        unlocked(){
                                return hasMilestone("k", 7) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 31)
                32: {
                        title: "Journey",
                        description: "Add one to the <b>K</b> gain exponent and if you can buy a level of Bulk Amount you do so for free once per second",
                        cost: new Decimal("1e5432"),
                        unlocked(){
                                return hasUpgrade("j", 31) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 32)
                33: {
                        title: "Jewellery",
                        description: "Each upgrade adds .1 to the <b>Housing</b> base and you can complete one more <b>H</b> challenge",
                        cost: new Decimal("1e9876"),
                        unlocked(){
                                return hasUpgrade("j", 32) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 33)
                34: {
                        title: "Jay",
                        description: "Buff <b>India</b> to all but 5 and add .1 to the <b>Japan</b> base",
                        cost: new Decimal("1e24680"),
                        unlocked(){
                                return hasUpgrade("j", 33) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 34)
                35: {
                        title: "Jacket",
                        description: "Each <b>K</b> milestone adds .1 to the <b>K</b> gain exponent and .01 to the <b>Japan</b> base",
                        cost: new Decimal("1e27272"),
                        unlocked(){
                                return hasUpgrade("j", 34) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 35)
                41: {
                        title: "Jet",
                        description: "Per upgrade in this row unlock an <b>I</b> buyable and unlock the final <b>H</b> challenge",
                        cost: new Decimal("1e357e3"),
                        unlocked(){
                                return hasUpgrade("k", 22) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 41)
                42: {
                        title: "Joy",
                        description: "Automatically buy <b>I</b> buyables, each upgrade doubles base <b>K</b> gain, and you buy 10x Bulk Amount levels",
                        cost: new Decimal("1e458e3"),
                        unlocked(){
                                return hasUpgrade("j", 41) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 42)
                43: {
                        title: "Jon",
                        description: "Remove <b>Hit</b> effect softcap and <b>Housing</b> effects <b>K</b> gain",
                        cost: new Decimal("1e701e3"),
                        unlocked(){
                                return hasUpgrade("j", 42) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 43)
                44: {
                        title: "Judgment",
                        description: "Autobuy <b>Japan</b>, <b>Jack</b>, and <b>Junior</b> once per second and add one to <b>K</b> gain exponent",
                        cost: new Decimal("1e897e3"),
                        unlocked(){
                                return hasUpgrade("j", 43) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 44)
                45: {
                        title: "Jokes",
                        description: "<b>Industrial</b> gives free <b>Inn</b> and <b>Ideas</b> levels and <b>Inn</b> gives free <b>Ideas</b> and <b>Investment</b> levels",
                        cost: new Decimal("1e912e3"),
                        unlocked(){
                                return hasUpgrade("j", 44) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 45)
                51: {
                        title: "Jimmy",
                        description: "Per <b>H</b> challenge past 150 add .01 to the <b>L</b> gain exponent and <b>Jack</b><sup>.01</sup> effects Knowledge",
                        cost: new Decimal("1e4438e6"),
                        unlocked(){
                                return hasUpgrade("k", 32) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("j", 51)
                52: {
                        title: "Jurisdiction",
                        description: "Per <b>L</b> upgrade multiply base <b>L</b> gain by 1.25 and the <b>H</b> buyable limit is 2.5x",
                        cost: new Decimal("1e8851e6"),
                        unlocked(){
                                return hasUpgrade("j", 51) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("j", 52)
                53: {
                        title: "Jam",
                        description: "<b>Iron Mines</b> produce <b>Osmium Mines</b> at a logarithmic rate and you can reset 5x as often",
                        cost: new Decimal("1e9946e6"),
                        unlocked(){
                                return hasUpgrade("j", 52) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("j", 53)
                54: {
                        title: "Judicial",
                        description: "Per upgrade add .04 to the <b>Hour</b> base and <b>L</b> gain exponent",
                        cost: new Decimal("1e10288e6"),
                        unlocked(){
                                return hasUpgrade("j", 53) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("j", 54)
                55: {
                        title: "Jeans",
                        description: "Raise <b>Copper Lock</b> effect to 2*sqrt(<b>L</b> upgrades)",
                        cost: new Decimal("1e10875e6"),
                        unlocked(){
                                return hasUpgrade("j", 54) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("j", 55)
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: getGeneralizedBuyableData("j", 11, function(){
                        return hasUpgrade("l", 21) || hasUnlockedPast("l")
                        }),
                12: getGeneralizedBuyableData("j", 12, function(){
                        return hasUpgrade("l", 22) || hasUnlockedPast("l")
                        }),
                13: getGeneralizedBuyableData("j", 13, function(){
                        return hasUpgrade("l", 23) || hasUnlockedPast("l")
                        }),
                21: getGeneralizedBuyableData("j", 21, function(){
                        return hasUpgrade("l", 24) || hasUnlockedPast("l")
                        }),
                22: getGeneralizedBuyableData("j", 22, function(){
                        return hasUpgrade("k", 45) || hasUnlockedPast("l")
                        }),
                23: getGeneralizedBuyableData("j", 23, function(){
                        return hasUpgrade("l", 25) || hasUnlockedPast("l")
                        }),
                31: getGeneralizedBuyableData("j", 31, function(){
                        return hasUpgrade("l", 32) || hasUnlockedPast("m")
                        }),
                32: getGeneralizedBuyableData("j", 32, function(){
                        return hasUpgrade("l", 32) || hasUnlockedPast("m")
                        }),
                33: getGeneralizedBuyableData("j", 33, function(){
                        return hasUpgrade("l", 32) || hasUnlockedPast("m")
                        }),
        },
        clickables: {
                rows: 7,
                cols: 5, 
                jigsawEffect(){
                        let base = player.j.points.plus(1e9).log10()

                        let exp = new Decimal(.5)
                        if (hasUpgrade("j", 12)) exp = exp.times(Math.sqrt(player.j.upgrades.length))
                        let ret = base.pow(exp)
                        return ret
                },
                nameOfModeV(){
                        let m = player.j.puzzle.mode
                        if (m == 1) return "filter pieces"
                        if (m == 2) return "build the edge"
                        if (m == 3) return "build the center"
                        return "finish the puzzle"
                },
                getAttemptSpeed(){
                        let ret = tmp.j.clickables.jigsawEffect
                        ret = ret.times(tmp.j.clickables[12].effect)
                        if (hasUpgrade("j", 25)) {
                                let e = hasUpgrade("j", 31) ? player.j.puzzle.reset2.times : 1
                                ret = ret.times(Decimal.pow(5, e))
                        }
                        return ret
                },
                getBaseAttemptChance(){
                        let exp = Decimal.plus(player.j.puzzle.finished, 1)
                        if (exp.gt(2500)) exp = exp.pow(1.5).div(50)
                        if (exp.gt(40e3)) exp = exp.pow(2).div(40e3)
                        if (exp.gt(7e5)) exp = exp.pow(3).div(49e10)
                        if (exp.gt(1e6)) exp = exp.div(1e6).times(6).pow10()
                        return Decimal.pow(.5, exp)
                },
                getAttemptChance(){
                        let ret = tmp.j.clickables.getBaseAttemptChance
                        ret = ret.times(tmp.j.clickables[11].effect)
                        ret = ret.times(tmp.j.clickables[35].effect)
                        return ret
                },
                getBulkAmount(){
                        let ret = new Decimal(1)
                        ret = ret.times(tmp.j.clickables[13].effect)
                        if (player.j.puzzle.reset2.done) ret = ret.times(2)
                        if (hasMilestone("k", 1)) ret = ret.times(2)
                        return Math.round(ret.toNumber())
                },
                doSearch(times = new Decimal(1)){
                        let data = player.j.puzzle
                        let tot1 = (data.currentX - 2) * (data.currentY - 2)
                        let tot2 = (data.currentX - 2 + data.currentY - 2) * 2
                        let tot3 = 4
                        let b = 0
                        for (i = 0; times.gt(i) ; i ++){
                                let rem1 = tot1 - data.found.centers
                                let rem2 = tot2 - data.found.edges
                                let rem3 = tot3 - data.found.corners
                                let remtot = rem1 + rem2 + rem3 
                                if (remtot == 0) {
                                        b = i + 1
                                        break
                                }
                                if (i == 0 && times.gt(remtot)) {
                                        b = remtot
                                        data.found.centers = tot1
                                        data.found.edges = tot2
                                        data.found.corners = tot3
                                        break
                                }
                                let r = Math.random()
                                if (r < rem1/remtot) data.found.centers ++
                                else if (r < (rem1 + rem2)/remtot) data.found.edges ++
                                else if (r < (rem1 + rem2 + rem3)/remtot) data.found.corners ++
                        }
                        if (!(player.j.puzzle.upgrades.includes(44) || player.j.puzzle.reset2.done)) return
                        if (tot1 != data.found.centers) return
                        if (tot2 != data.found.edges) return
                        if (tot3 != data.found.corners) return
                        data.mode = 2
                        if (times.eq(b)) return
                        this.doEdges(times.sub(b))
                },
                doEdges(times = new Decimal(1)){
                        let data = player.j.puzzle
                        let b = new Decimal(0)
                        let c = 0
                        while (c < 5){
                                c ++ 
                                if (data.placed.corners < 4) {
                                        let left = 4 - data.placed.corners 
                                        b = b.plus(getTimesRequiredDecimal(tmp.j.clickables.getAttemptChance.div(left)))
                                        if (b.gt(times)) return 
                                        data.placed.corners ++ 
                                } else break
                        }

                        let left = (data.currentX - 2 + data.currentY - 2) * 2 - data.placed.edges
                        let total = (data.currentX - 2 + data.currentY - 2) * 2
                        let x = getNumFinished(tmp.j.clickables.getAttemptChance.times(10), left, times.sub(b), total)
                        data.placed.edges = total - x[0]

                        if (x[1].eq(0)) return 
                        if (!(hasUpgrade("i", 32) || player.j.puzzle.reset2.done)) return
                        data.mode = 3
                        if (x[1].lt(1)) return
                        this.doCenters(x[1].sub(1))
                },
                doCenters(times = new Decimal(1)){
                        let data = player.j.puzzle
                        let b = 0
                        let c = 0
                        
                        let left = (data.currentX - 2) * (data.currentY - 2) - data.placed.centers
                        let total = (data.currentX - 2) * (data.currentY - 2)
                        let x = getNumFinished(tmp.j.clickables.getAttemptChance.times(50), left, times, total)
                        data.placed.centers = total - x[0]
                        
                        if (x[1] == 0) return 
                        if (!(player.j.puzzle.upgrades.includes(53) || player.j.puzzle.reset2.done)) return
                        data.mode = 4
                        if (x[1].gt(0)) this.attemptFinish()
                },
                attemptFinish(){
                        let data = player.j.puzzle
                        let tot1 = (data.currentX - 2) * (data.currentY - 2)
                        let tot2 = (data.currentX - 2 + data.currentY - 2) * 2
                        let tot3 = 4
                        if (tot1 != data.placed.centers) return false
                        if (tot2 != data.placed.edges) return false
                        if (tot3 != data.placed.corners) return false
                        data.finished ++
                        data.exp = data.exp.plus(1)
                        data.bankedExp = data.bankedExp.plus(tmp.j.clickables.getBankedExpGainUF.times(data.finished).floor())
                        data.knowledge = data.knowledge.plus(tmp.j.clickables.getKnowledgeGainUF.floor())
                        data.placed = {
                                edges: 0,
                                corners: 0,
                                centers: 0,
                        }
                        data.found = {
                                edges: 0,
                                corners: 0,
                                centers: 0,
                        }
                        if (player.j.puzzle.upgrades.includes(43) || player.j.puzzle.reset2.done) data.mode = 1
                        return true
                },
                getKnowledgeGainUF(){
                        let ret = new Decimal(1)
                        ret = ret.times(tmp.j.clickables[14].effect)
                        if (hasUpgrade("i", 31)) ret = ret.times(player.i.upgrades.length)
                        if (hasUpgrade("j", 14)) ret = ret.times(player.j.upgrades.length)
                        if (hasUpgrade("j", 15)) ret = ret.times(player.j.puzzle.bestKnowledge.max(3).ln())
                        ret = ret.times(Decimal.pow(3, player.j.puzzle.reset2.times))
                        if (hasUpgrade("j", 25)) {
                                let e = hasUpgrade("j", 31) ? player.j.puzzle.reset2.times : 1
                                ret = ret.times(Decimal.pow(5, e))
                        }
                        if (hasMilestone("k", 3)) ret = ret.times(player.ach.best.max(1))
                        ret = ret.times(tmp.h.challenges[21].rewardEffect)
                        if (hasUpgrade("i", 55)) ret = ret.times(Decimal.pow(10, player.j.puzzle.reset2.times))
                        if (hasUpgrade("k", 11)) ret = ret.times(tmp.j.clickables[35].effect)
                        if (hasUpgrade("k", 12)) ret = ret.times(Decimal.pow(10, player.k.upgrades.length))
                        if (hasUpgrade("k", 13)) ret = ret.times(player.j.puzzle.bestExp.max(1).pow(.1))
                        if (hasUpgrade("k", 21) && hasMilestone("k", 7)) ret = ret.times(Decimal.pow(2, totalChallengeComps("h")))
                        ret = ret.times(tmp.k.clickables[12].effect)
                        ret = ret.times(tmp.k.clickables[35].effect)
                        if (hasMilestone("k", 12)) ret = ret.times(Decimal.pow(1.1, tmp.k.clickables.totalMines))
                        ret = ret.times(tmp.k.clickables[24].effect)
                        if (hasUpgrade("k", 23)) ret = ret.times(Decimal.pow(100, player.k.lock.repeatables[45]))
                        if (hasUpgrade("j", 51)) ret = ret.times(tmp.j.clickables[45].effect.pow(.01))
                        if (hasUpgrade("k", 33)) ret = ret.times(player.j.puzzle.exp.max(1).pow(.5))
                        ret = ret.times(Decimal.pow(tmp.k.clickables[62].effect, tmp.k.clickables.totalKeys))
                        ret = ret.times(CURRENT_BUYABLE_EFFECTS["j31"])

                        if (ret.max(10).log10().gt(36e8)) ret = ret.log10().sqrt().times(6e4).pow10()
                        return ret
                },
                getBankedExpGainUF(){
                        let ret = new Decimal(1)
                        ret = ret.times(tmp.j.clickables[14].effect)
                        if (player.j.puzzle.upgrades.includes(54)) ret = ret.times(Decimal.pow(2, player.j.upgrades.length))
                        ret = ret.times(Decimal.pow(3, player.j.puzzle.reset2.times))
                        if (hasMilestone("k", 2)) ret = ret.times(player.ach.best.max(1))
                        if (hasMilestone("k", 7)) ret = ret.times(Decimal.pow(2, totalChallengeComps("h")))
                        if (hasUpgrade("k", 11)) ret = ret.times(tmp.j.clickables[35].effect)
                        if (hasUpgrade("k", 13)) ret = ret.times(player.j.puzzle.bestKnowledge.max(1).pow(.1))
                        if (hasUpgrade("k", 22)) ret = ret.times(Decimal.pow(tmp.j.clickables[35].effect, player.k.upgrades.length))
                        ret = ret.times(tmp.k.clickables[13].effect)
                        return ret
                },
                getResetCD(){
                        let ret = 60
                        if (hasUpgrade("i", 41)) ret = Math.min(ret, 20)
                        if (hasUpgrade("j", 11)) ret *= Math.pow(.97, player.j.upgrades.length)
                        if (hasUpgrade("j", 31)) ret *= .5
                        if (hasUpgrade("j", 53)) ret *= .2
                        return ret
                },
                getCurrentMaxSize(){
                        let ret = 20
                        ret += 5 * player.j.puzzle.reset2.times
                        return ret
                },
                11: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<h3 style='color: #FF3333'>Success Chance</h3>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                if (shiftDown && !hasMilestone("k", 6)) {
                                        end = ""
                                        if (tmp.j.clickables[11].effeciency.lt(tmp.j.clickables[12].effeciency)) {
                                                if (tmp.j.clickables[11].effeciency.lt(tmp.j.clickables[13].effeciency)) {
                                                        end = "<br><h2 style='color: #CCFF66'>Best!</h2>"
                                                }
                                        }
                                        return "Effeciency:<br>" + format(tmp.j.clickables[11].effeciency) + end
                                }
                                let a = "<h3 style='color: #993300'>Cost</h3>: " + formatWhole(tmp.j.clickables[11].cost) + " Knowledge<br>"
                                let b = "<h3 style='color: #339900'>Current</h3>: " + formatWhole(player.j.puzzle.repeatables[11]) + " levels<br>"
                                let c = "<h3 style='color: #9933CC'>Effect</h3>: *" + format(tmp.j.clickables[11].effect, 4) + " success chance<br>"
                                if (hasMilestone("k", 6)) return c
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        cost(){
                                if (player.j.puzzle.repeatables[11].lt(1e10)) return new Decimal(Math.floor(Math.sqrt(player.j.puzzle.repeatables[11].toNumber() + 1)))
                                return Decimal.pow(player.j.puzzle.repeatables[11].plus(1), .5).floor()                                                                            
                        },
                        canClick(){
                                return player.j.puzzle.knowledge.gte(tmp.j.clickables[11].cost)
                        },
                        effect(delta = 0){
                                let lvl = player.j.puzzle.repeatables[11].plus(delta)
                                let ret = Decimal.pow(lvl.plus(1), lvl.plus(1).log10().div(3))
                                if (ret.gt(1e4)) ret = ret.sqrt().times(100)
                                if (ret.gt(1e5)) ret = ret.log10().plus(5).pow(5)
                                return ret
                        },
                        totalSoFar(){
                                return this.totalTarget(player.j.puzzle.repeatables[11])
                        },
                        totalTarget(target = new Decimal(0)){
                                let sf = target.round()
                                let norm = sf.plus(1).sqrt().floor().minus(1)
                                let normCost = norm.times(norm.plus(1)).times(norm.times(4).plus(5)).div(6)
                                let extra = sf.minus(norm.plus(1).pow(2)).plus(1).times(norm.plus(1))
                                return normCost.plus(extra).max(0)
                        },
                        costTo(target = new Decimal(0)) {
                                let sf = tmp.j.clickables[11].totalSoFar
                                let tr = layers.j.clickables[11].totalTarget(target)
                                return tr.minus(sf).max(0)
                        },
                        getMaxCostTo(){
                                let z = player.j.puzzle.repeatables[11]
                                let a = .5
                                let run = true
                                let amt = player.j.puzzle.knowledge
                                let amt2 = player.j.puzzle.knowledge.plus(tmp.j.clickables[11].totalSoFar)
                                if (amt2.lt(1e40)) {
                                        while (run){
                                                a *= 2
                                                if (amt.lt(this.costTo(z.plus(a)))) run = false
                                        }
                                        a /= 2
                                        let sum = a
                                        if (sum < 1) return 0
                                        let c = 0
                                        while (a >= 1 && c < 100){
                                                c ++
                                                a /= 2
                                                if (amt.gte(this.costTo(z.plus(sum).plus(a)))) sum += a
                                        }
                                        return sum
                                } else {
                                        let ncInverse = amt2.times(3/2).cbrt() 
                                        //gives us norm
                                        return ncInverse.pow(2).sub(z).max(0)
                                }
                        },
                        effeciency(){
                                let c = tmp.j.clickables[11].cost
                                let e = this.effect(1).div(tmp.j.clickables[11].effect)
                                return e.ln().pow(-1).times(c)
                        },
                        onClick(forcemulti = false, nocost = false){
                                let data = player.j.puzzle

                                let additional = new Decimal(tmp.j.clickables[11].getMaxCostTo)
                                if (!player.j.puzzle.upgrades.includes(51) && !player.j.puzzle.reset2.done) additional = additional.min(1)
                                if (!shiftDown && !forcemulti) additional = additional.min(1)
                                if (!nocost) data.knowledge = data.knowledge.minus(this.costTo(data.repeatables[11].plus(additional))).max(0)
                                data.repeatables[11] = data.repeatables[11].plus(additional)
                        },
                },
                12: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<h3 style='color: #FF3333'>Attempt Speed</h3>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                if (shiftDown && !hasUpgrade("i", 53)) {
                                        end = ""
                                        if (tmp.j.clickables[12].effeciency.lt(tmp.j.clickables[11].effeciency)) {
                                                if (tmp.j.clickables[12].effeciency.lt(tmp.j.clickables[13].effeciency)) {
                                                        end = "<br><h2 style='color: #CCFF66'>Best!</h2>"
                                                }
                                        }
                                        return "Effeciency:<br>" + format(tmp.j.clickables[12].effeciency) + end
                                }
                                let ktf = tmp.j.clickables[12].cost.lt(100) ? " Knowledge" : ""
                                let a = "<h3 style='color: #993300'>Cost</h3>: " + formatWhole(tmp.j.clickables[12].cost) + ktf + "<br>"
                                let b = "<h3 style='color: #339900'>Current</h3>: " + formatWhole(player.j.puzzle.repeatables[12]) + " levels<br>"
                                let c = "<h3 style='color: #9933CC'>Effect</h3>: *" + format(tmp.j.clickables[12].effect) + " Attempt Speed<br>"
                                if (hasUpgrade("i", 53)) return c
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        cost(){
                                return player.j.puzzle.repeatables[12].plus(1)
                        },
                        canClick(){
                                return player.j.puzzle.knowledge.gte(tmp.j.clickables[12].cost)
                        },
                        effect(delta = 0){
                                let lvl = player.j.puzzle.repeatables[12].plus(delta)
                                let exp = new Decimal(2)
                                if (player.j.puzzle.upgrades.includes(34)) exp = exp.times(2)
                                let ret = lvl.plus(10).log10().pow(exp)
                                if (ret.gt(100)) ret = ret.sqrt().times(10)
                                return ret
                        },
                        totalSoFar(){
                                let sf = player.j.puzzle.repeatables[12]
                                return sf.times(sf.plus(1)).div(2)
                        },
                        totalTarget(target = new Decimal(0)){
                                return target.times(target.plus(1)).div(2)
                        },
                        costTo(target = new Decimal(0)) {
                                let sf = tmp.j.clickables[12].totalSoFar
                                let tr = layers.j.clickables[12].totalTarget(target)
                                return tr.minus(sf).max(0)
                        },
                        getMaxCostTo(){
                                let z = player.j.puzzle.repeatables[12]
                                let a = .5
                                let run = true
                                let amt = player.j.puzzle.knowledge.plus(tmp.j.clickables[12].totalSoFar)
                                let x = amt.times(8).plus(1).sqrt().minus(1).div(2).floor()
                                return x.minus(z).max(0)
                        },
                        effeciency(){
                                let c = tmp.j.clickables[12].cost
                                let e = this.effect(1).div(tmp.j.clickables[12].effect)
                                return e.ln().pow(-1).times(c)
                        },
                        onClick(forcemulti = false, nocost = false){
                                let data = player.j.puzzle

                                let additional = new Decimal(tmp.j.clickables[12].getMaxCostTo)
                                if (!hasUpgrade("j", 13) && !player.j.puzzle.reset2.done) additional = additional.min(1)
                                if (!shiftDown && !forcemulti) additional = additional.min(1)
                                if (!nocost) data.knowledge = data.knowledge.minus(this.costTo(data.repeatables[12].plus(additional))).max(0)
                                data.repeatables[12] = data.repeatables[12].plus(additional)
                        },
                },
                13: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<h3 style='color: #FF3333'>Bulk Amount</h3>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                if (shiftDown && (!hasUpgrade("i", 53) || !hasMilestone("k", 6))) {
                                        end = ""
                                        if (tmp.j.clickables[13].effeciency.lt(tmp.j.clickables[12].effeciency)) {
                                                if (tmp.j.clickables[13].effeciency.lt(tmp.j.clickables[11].effeciency)) {
                                                        end = "<br><h2 style='color: #CCFF66'>Best!</h2>"
                                                }
                                        }
                                        return "Effeciency:<br>" + format(tmp.j.clickables[13].effeciency) + end
                                }
                                let a = "<h3 style='color: #993300'>Cost</h3>: " + formatWhole(tmp.j.clickables[13].cost) + " Knowledge<br>"
                                let b = "<h3 style='color: #339900'>Current</h3>: " + formatWhole(player.j.puzzle.repeatables[13]) + " levels<br>"
                                if (player.j.puzzle.repeatables[13].gt(50)) b = ""
                                let c = "<h3 style='color: #9933CC'>Effect</h3>: *" + format(tmp.j.clickables[13].effect) + " to Bulk amount<br>"
                                return a + b + c
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(34) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        cost(){
                                return Decimal.pow(1.5, player.j.puzzle.repeatables[13]).times(10).floor()
                        },
                        canClick(){
                                return player.j.puzzle.knowledge.gte(tmp.j.clickables[13].cost)
                        },
                        getMaxAmt(){
                                let a = player.j.puzzle.knowledge
                                if (a.lt(10)) return new Decimal(0)
                                return a.div(10).log(1.5).floor().plus(1)
                        },      
                        effect(delta = 0){
                                let ret = player.j.puzzle.repeatables[13].plus(delta).plus(1)
                                if (hasMilestone("k", 1)) ret = ret.pow(2)
                                return ret
                        },
                        effeciency(){
                                let c = tmp.j.clickables[13].cost
                                let e = this.effect(1).div(tmp.j.clickables[13].effect)
                                return e.ln().pow(-1).times(c)
                        },
                        onClick(nocost = false, times = 1){
                                let data = player.j.puzzle
                                if (hasUpgrade("j", 42)) times *= 10
                                if (player.j.puzzle.upgrades.includes(63)) times *= 10
                                if (hasUpgrade("k", 24)) times *= 10
                                if (hasMilestone("l", 11)) times *= 1000
                                if (hasUpgrade("k", 52)) times *= 1000

                                let max = tmp.j.clickables[13].getMaxAmt
                                let diff = max.sub(data.repeatables[13]).min(times)
                                if (diff.eq(0)) return
                                if (!nocost) data.knowledge = data.knowledge.minus(this.cost()).max(0)
                                data.repeatables[13] = data.repeatables[13].plus(diff)
                                
                        },
                },
                14: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<h3 style='color: #FF3333'>Larger Puzzle</h3>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "<h3 style='color: #993300'>Cost</h3>: " + formatWhole(tmp.j.clickables[14].cost) + " Knowledge<br>"
                                let x = tmp.j.clickables.getCurrentMaxSize
                                if (Math.min(player.j.puzzle.currentX, player.j.puzzle.currentY) == x) a = "<h3 style='color: #993300'>MAXED!</h3><br>"
                                let c = "<h3 style='color: #9933CC'>Effect</h3>: *" + format(tmp.j.clickables[14].effect)
                                let extra = " Knowledge and Banked Exp gain<br>"
                                return a + c + (tmp.j.clickables[14].effect.gt(1e100) ? "" : extra)
                        },
                        unlocked(){
                                return true
                        },
                        cost(){
                                let a = Decimal.pow(4, player.j.puzzle.repeatables[14].pow(.8)).times(40)
                                let b = Decimal.pow(2.25, player.j.puzzle.repeatables[14])
                                let c = Decimal.pow(1.0046, player.j.puzzle.repeatables[14].pow(2))

                                return a.max(b).max(c).floor()
                        },
                        getMaxPossible(){
                                let data = player.j.puzzle
                                let rss = data.knowledge
                                let a = rss.gte(40) ? rss.div(40).log(4).root(.8).plus(1).floor() : new Decimal(0)
                                let b = rss.max(1).log(2.25).plus(1).floor()
                                let c = rss.max(1).log(1.0046).sqrt().plus(1).floor()
                                return a.min(b).min(c)
                        },
                        canClick(){
                                let x = tmp.j.clickables.getCurrentMaxSize
                                return player.j.puzzle.knowledge.gte(this.cost()) && (player.j.puzzle.currentX < x || player.j.puzzle.currentY < x)
                        },
                        base(){
                                let base = new Decimal(1.8)
                                if (hasUpgrade("k", 15)) base = base.plus(.02 * player.k.upgrades.length)
                                base = base.plus(tmp.h.challenges[22].rewardEffect)
                                return base
                        },
                        effect(){
                                let exp = player.j.puzzle.repeatables[14]
                                if (exp.gt(4) && !hasUpgrade("k", 14)) exp = exp.sqrt().times(2)
                                let base = tmp.j.clickables[14].base
                                return Decimal.pow(base, exp)
                        },
                        onClick(nocost = false){
                                let data = player.j.puzzle
                                let cost = this.cost()
                                let mp = tmp.j.clickables[14].getMaxPossible
                                let amt = data.repeatables[14]
                                let times = 1

                                if (hasMilestone("k", 14)) times *= 10
                                if (hasUpgrade("m", 12)) times *= 10
                                if (hasUpgrade("k", 52)) times *= 1000

                                let diff = mp.sub(amt).min(times)

                                if (amt.gte(mp)) return
                                if (!nocost) data.knowledge = data.knowledge.minus(cost).max(0)
                                data.repeatables[14] = data.repeatables[14].plus(diff)
                                if (diff.eq(1)) {
                                        let x = tmp.j.clickables.getCurrentMaxSize
                                        if (data.currentY == x) {
                                                data.currentX ++
                                        } else if (data.currentX == x) {
                                                data.currentY ++
                                        } else if (Math.random() < .5) {
                                                data.currentY ++
                                        } else data.currentX ++
                                } else {
                                        let x = layers.j.clickables.getCurrentMaxSize()
                                        let remaining = diff

                                        for (i = 0; remaining.gt(0); i++){
                                                if (i >= 10) break
                                                if (data.currentY % 5 == 0) {
                                                        if (data.currentX % 5 == 0) break
                                                        data.currentX ++
                                                } else if (data.currentX % 5 == 0) {
                                                        data.currentY ++
                                                } else if (Math.random() < .5) {
                                                        data.currentY ++
                                                } else data.currentX ++
                                                remaining = remaining.sub(1)
                                        } //get both to multiples of five

                                        let a = data.repeatables[14].plus(1).div(10).floor().sub(1).toNumber()
                                        data.reset2.times = Math.max(data.reset2.times, a)
                                        
                                        let mult5steps = remaining.div(10).floor().toNumber()
                                        remaining = remaining.sub(10 * mult5steps)
                                        data.currentX += 5 * mult5steps
                                        data.currentY += 5 * mult5steps
                                        //deal with mults of five
                                        
                                        x = layers.j.clickables.getCurrentMaxSize()
                                        for (i = 0; remaining.gt(i); i++){
                                                if (data.currentY == x) {
                                                        data.currentX ++
                                                } else if (data.currentX == x) {
                                                        data.currentY ++
                                                } else if (Math.random() < .5) {
                                                        data.currentY ++
                                                } else data.currentX ++
                                        }
                                }
                                data.placed = {
                                        edges: 0,
                                        corners: 0,
                                        centers: 0,
                                }
                                data.found = {
                                        edges: 0,
                                        corners: 0,
                                        centers: 0,
                                }
                        },
                },
                15: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<h3 style='color: #FF3333'>Progress Bar</h3>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let z = player.j.puzzle.bartype
                                if (z == 1) return "Current mode:<br>Only placing"
                                if (z == 0) return "Current mode:<br>Finding and placing"
                                if (z == 2) return "Current mode:<br>Semi-linear (smart)"
                                return "broke yeet"
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return true
                        },
                        onClick(){
                                player.j.puzzle.bartype ++ 
                                if (player.j.puzzle.bartype >= 3) player.j.puzzle.bartype -= 3
                        },
                },
                21: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                if (player.j.puzzle.mode == 1) return "<h3 style='color: #FFFFFF'>Filter</h3><br>(6)"
                                return "<h3 style='color: #FF3333'>Filter</h3><br>(6)"
                        },
                        display(){
                                return ""
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return true
                        },
                        onClick(){
                                player.j.puzzle.mode = 1
                        },
                },
                22: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                if (player.j.puzzle.mode == 2) return "<h3 style='color: #FFFFFF'>Edges</h3><br>(7)"
                                return "<h3 style='color: #FF3333'>Edges</h3><br>(7)"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let data = player.j.puzzle
                                let x = (data.currentX - 2 + data.currentY - 2) * 2
                                if (data.found.corners < 4) return "Requires: 4 corners found"
                                if (data.found.edges < x) return "Requires: " + formatWhole(x) + " edges found"
                                if (tmp.j.clickables.getAttemptChance.lt(Decimal.pow(10, -1000))) return ""
                                if (data.placed.corners < 4) {
                                        let left = 4 - data.placed.corners 
                                        return "Chance " + formatChances(tmp.j.clickables.getAttemptChance.div(left).min(1).times(100)) + "%"
                                }
                                if (data.placed.edges < x) {
                                        let left = x - data.placed.edges
                                        return "Chance " + formatChances(tmp.j.clickables.getAttemptChance.div(left).min(.1).times(1000)) + "%"
                                }
                                return ""
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return true
                        },
                        onClick(){
                                player.j.puzzle.mode = 2
                        },
                },
                23: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                if (player.j.puzzle.mode == 3) return "<h3 style='color: #FFFFFF'>Center</h3><br>(8)"
                                return "<h3 style='color: #FF3333'>Center</h3><br>(8)"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let data = player.j.puzzle
                                let a = data.currentX * 2 + data.currentY * 2 - 8
                                let b = (data.currentX - 2) * (data.currentY - 2)
                                if (data.placed.edges < a) return "Requires: " + formatWhole(a) + " edges placed"
                                if (data.found.centers < b) return "Requires: " + formatWhole(b) + " centers found"
                                if (data.placed.centers < b) {
                                        let left = b - data.placed.centers
                                        return "Chance " + formatChances(tmp.j.clickables.getAttemptChance.div(left).min(.02).times(5000)) + "%"
                                }
                                return ""
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return true
                        },
                        onClick(){
                                player.j.puzzle.mode = 3
                        },
                },
                24: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                if (player.j.puzzle.mode == 4) return "<h3 style='color: #FFFFFF'>Finish</h3><br>(9)"
                                return "<h3 style='color: #FF3333'>Finish</h3><br>(9)"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let data = player.j.puzzle
                                let tot1 = (data.currentX - 2) * (data.currentY - 2)
                                let tot2 = (data.currentX - 2 + data.currentY - 2) * 2
                                let tot3 = 4
                                if (tot1 != data.placed.centers) return "Requires: All pieces placed"
                                if (tot2 != data.placed.edges) return "Requires: All pieces placed"
                                if (tot3 != data.placed.corners) return "Requires: All pieces placed"
                                return ""
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return true
                        },
                        onClick(){
                                player.j.puzzle.mode = 4
                        },
                },
                25: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<h3 style='color: #FF3333'>Reset</h3><br>(Shift+0)"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "Reset puzzle progress to get Banked Experience (" + format(Math.max(0, tmp.j.clickables.getResetCD - player.j.puzzle.time)) + "s)" 
                        },
                        unlocked(){
                                return player.j.puzzle.bestExp.gt(2) || player.j.puzzle.reset2.done || player.j.puzzle.bankedExp.gt(2) || hasUnlockedPast("j")
                        },
                        canClick(){
                                if (hasMilestone("l", 7)) return player.j.puzzle.time >= tmp.j.clickables.getResetCD
                                return player.j.puzzle.bankedExp.gt(0) && player.j.puzzle.time >= tmp.j.clickables.getResetCD
                        },
                        onClick(){
                                if (!this.canClick()) return
                                let data = player.j.puzzle
                                data.exp = data.exp.plus(data.bankedExp)
                                data.bankedExp = new Decimal(0)
                                data.placed = {
                                        edges: 0,
                                        corners: 0,
                                        centers: 0,
                                }
                                data.found = {
                                        edges: 0,
                                        corners: 0,
                                        centers: 0,
                                }
                                data.finished = 0
                                data.time = 0
                                if (player.j.puzzle.upgrades.includes(43) || player.j.puzzle.reset2.done) data.mode = 1
                                if (!hasUpgrade("i", 51)) return

                                let target = Math.floor(data.bestCompletedK * .9)
                                if (hasUpgrade("j", 34)) target = Math.max(target, data.bestCompletedK - 5)
                                if (hasMilestone("k", 9)) target = Math.max(target, data.bestCompletedK - 1)
                                data.finished = target
                                let c2 = function(x){return x * (x + 1) / 2}

                                data.bankedExp = data.bankedExp.plus(tmp.j.clickables.getBankedExpGainUF.times(c2(target)).floor())
                                data.knowledge = data.knowledge.plus(tmp.j.clickables.getKnowledgeGainUF.times(target).floor())
                        },
                },
                31: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Join</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Per upgrade in this row unlock an <b>H</b> buyable and raise charge gain ^50"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[31].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.bestExp.gt(2) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[31].cost) && !player.j.puzzle.upgrades.includes(31)
                        },
                        cost(){
                                return new Decimal(10)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(31) ? "#77bf5f" : tmp.j.clickables[31].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[31].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[31].cost).max(0)
                                data.upgrades.push(31)
                        },
                },
                32: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>June</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Unlock the final <b>G</b> buyable and per puzzle upgrade act as if you have 5% less rebirths"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[32].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(31) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[32].cost) && !player.j.puzzle.upgrades.includes(32)
                        },
                        cost(){
                                return new Decimal(20)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(32) ? "#77bf5f" : tmp.j.clickables[32].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[32].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[32].cost).max(0)
                                data.upgrades.push(32)
                        },
                },
                33: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>July</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Automatically buy <b>H</b> buyables and <b>Held</b> gives free <b>Holiday</b> and <b>Omnipotent VII</b> levels"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[33].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(32) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[33].cost) && !player.j.puzzle.upgrades.includes(33)
                        },
                        cost(){
                                return new Decimal(40)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(33) ? "#77bf5f" : tmp.j.clickables[33].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[33].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[33].cost).max(0)
                                data.upgrades.push(33)
                        },
                },
                34: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Journal</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Unlock Bulk Amount, square Attempt speed, and Rebirth II is no longer reset by later rebirths"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[34].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(33) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[34].cost) && !player.j.puzzle.upgrades.includes(34)
                        },
                        cost(){
                                return new Decimal(80)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(34) ? "#77bf5f" : tmp.j.clickables[34].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[34].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[34].cost).max(0)
                                data.upgrades.push(34)
                        },
                },
                35: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Japan</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Multiply success chance by " + format(tmp.j.clickables[35].base, 4)
                                let c = "<br>Currently: *" + format(tmp.j.clickables[35].effect)
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[35].cost) + " Exp"
                                return a + c + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(34) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[35].cost)
                        },
                        cost(){
                                return Decimal.pow(1.5, player.j.puzzle.repeatables[35].pow(2)).ceil()
                        },
                        getMaxPossible(){
                                let amt = player.j.puzzle.exp
                                if (amt.lt(1)) return new Decimal(0)
                                return amt.log(1.5).sqrt().plus(1).floor()
                        },
                        base(){
                                if (inChallenge("k", 12)) return new Decimal(1)
                                let ret = new Decimal(1.2)
                                if (hasUpgrade("j", 34)) ret = ret.plus(.1)
                                if (hasUpgrade("j", 35)) ret = ret.plus(.01 * player.k.milestones.length)
                                if (hasUpgrade("k", 12)) ret = ret.plus(.01 * player.k.upgrades.length)
                                ret = ret.plus(tmp.h.challenges[22].rewardEffect)
                                if (player.j.puzzle.upgrades.includes(61)) ret = ret.plus(player.j.puzzle.repeatables[35].times(.005))
                                ret = ret.plus(tmp.k.clickables[14].effect)
                                ret = ret.plus(tmp.k.clickables[41].effect)
                                if (hasUpgrade("k", 31)) ret = ret.times(tmp.h.challenges[22].rewardEffect.max(1))
                                if (hasUpgrade("k", 34)) ret = ret.times(tmp.h.challenges[22].rewardEffect.max(1))
                                return ret
                        },
                        effect(){
                                return Decimal.pow(tmp.j.clickables[35].base, player.j.puzzle.repeatables[35])
                        },
                        style(){
                                return {
                                        "background-color": tmp.j.clickables[35].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!this.canClick()) return
                                let data = player.j.puzzle
                                let mp = tmp.j.clickables[35].getMaxPossible
                                let diff = mp.sub(data.repeatables[35])

                                let times = 1
                                if (hasUpgrade("l", 23)) times *= 10
                                if (hasUpgrade("k", 52)) times *= 1000

                                diff = diff.min(times)
                                if (diff.lte(0)) return 
                                data.exp = data.exp.minus(tmp.j.clickables[35].cost).max(0)
                                data.repeatables[35] = data.repeatables[35].plus(diff)
                        },
                },
                41: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Jewelry</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "<b>Hour</b> gives free <b>Hope</b> levels and unlock rebirth IV"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[41].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.bestKnowledge.gte(30) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[41].cost) && !player.j.puzzle.upgrades.includes(41)
                        },
                        cost(){
                                return new Decimal(160)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(41) ? "#77bf5f" : tmp.j.clickables[41].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[41].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[41].cost).max(0)
                                data.upgrades.push(41)
                        },
                },
                42: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Joined</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "<b>Rebirth IV</b> doesn't reset <b>Rebirth III</b>, autobuy <b>Rebirth IV</b>, and <b>Rebirth IV</b> gives free <b>Hour</b> levels"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[42].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(41) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[42].cost) && !player.j.puzzle.upgrades.includes(42)
                        },
                        cost(){
                                return new Decimal(320)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(42) ? "#77bf5f" : tmp.j.clickables[42].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[42].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[42].cost).max(0)
                                data.upgrades.push(42)
                        },
                },
                43: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Japanese</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Raise <b>J</b> effect to the number of puzzle upgrades and upon finish or reset automatically start filtering"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[43].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(42) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[43].cost) && !player.j.puzzle.upgrades.includes(43)
                        },
                        cost(){
                                return new Decimal(640)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(43) ? "#77bf5f" : tmp.j.clickables[43].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[43].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[43].cost).max(0)
                                data.upgrades.push(43)
                        },
                },
                44: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Jersey</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Upon finding all pieces while Filtering automatically go to edges and unlock an <b>H</b> buyable"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[44].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(43) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[44].cost) && !player.j.puzzle.upgrades.includes(44)
                        },
                        cost(){
                                return new Decimal(1280)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(44) ? "#77bf5f" : tmp.j.clickables[44].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[44].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[44].cost).max(0)
                                data.upgrades.push(44)
                        },
                },
                45: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Jack</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Multiply base <b>H</b> gain by 1e1000"
                                let c = "<br>Currently: *" + format(tmp.j.clickables[45].effect)
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[45].cost) + " Exp"
                                return a + c + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(44) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[45].cost)
                        },
                        cost(){
                                return Decimal.pow(2, player.j.puzzle.repeatables[45].pow(2))
                        },
                        getMaxPossible(){
                                let amt = player.j.puzzle.exp
                                if (amt.lt(1)) return new Decimal(0)
                                return amt.log(2).sqrt().plus(1).floor()
                        },
                        effect(){
                                return Decimal.pow("1e1000", player.j.puzzle.repeatables[45])
                        },
                        style(){
                                return {
                                        "background-color": tmp.j.clickables[45].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!this.canClick()) return
                                let data = player.j.puzzle
                                let mp = tmp.j.clickables[45].getMaxPossible
                                let diff = mp.sub(data.repeatables[45])

                                let times = 1
                                if (hasUpgrade("l", 23)) times *= 10
                                if (hasUpgrade("k", 52)) times *= 1000

                                diff = diff.min(times)
                                if (diff.lte(0)) return 
                                data.exp = data.exp.minus(tmp.j.clickables[45].cost).max(0)
                                data.repeatables[45] = data.repeatables[45].plus(diff)
                        },
                },
                51: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Justice</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "You can hold shift to max buy Success Chance, you can complete 5 more <b>F</b> challenges, and unlock another milestone"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[51].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return hasUpgrade("i", 34) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[51].cost) && !player.j.puzzle.upgrades.includes(51)
                        },
                        cost(){
                                return new Decimal(2560)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(51) ? "#77bf5f" : tmp.j.clickables[51].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[51].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[51].cost).max(0)
                                data.upgrades.push(51)
                        },
                },
                52: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Jump</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "<b>Huge</b> gives free <b>Hour</b> and <b>Hope</b> levels and unlock a <b>H</b> challenge"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[52].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(51) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[52].cost) && !player.j.puzzle.upgrades.includes(52)
                        },
                        cost(){
                                return new Decimal(5120)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(52) ? "#77bf5f" : tmp.j.clickables[52].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[52].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[52].cost).max(0)
                                data.upgrades.push(52)
                        },
                },
                53: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Johnson</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "<b>Hour</b> gives free <b>Held</b> levels and upon placing all pieces go to Finish"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[53].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(52) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[53].cost) && !player.j.puzzle.upgrades.includes(53)
                        },
                        cost(){
                                return new Decimal(10240)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(53) ? "#77bf5f" : tmp.j.clickables[53].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[53].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[53].cost).max(0)
                                data.upgrades.push(53)
                        },
                },
                54: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Jazz</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Each <b>J</b> upgrade doubles banked exp gain"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[54].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return hasUpgrade("j", 14) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[54].cost) && !player.j.puzzle.upgrades.includes(54)
                        },
                        cost(){
                                return new Decimal(1e6)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(54) ? "#77bf5f" : tmp.j.clickables[54].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[54].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[54].cost).max(0)
                                data.upgrades.push(54)
                        },
                },
                55: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Junior</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Multiply base <b>J</b> gain by " + format(tmp.j.clickables[55].base)
                                let c = "<br>Currently: *" + format(tmp.j.clickables[55].effect)
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[55].cost) + " Exp"
                                return a + c + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(54) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[55].cost)
                        },
                        cost(){
                                return Decimal.pow(3, player.j.puzzle.repeatables[55].pow(2)).times(3e6)
                        },
                        getMaxPossible(){
                                let amt = player.j.puzzle.exp
                                if (amt.lt(3e6)) return new Decimal(0)
                                return amt.div(3e6).log(3).sqrt().plus(1).floor()
                        },
                        base(){
                                let base = new Decimal(2)
                                if (hasUpgrade("j", 22)) base = base.plus(1)
                                if (hasUpgrade("j", 24)) base = base.times(tmp.j.clickables[35].effect)
                                return base
                        },
                        effect(){
                                let base = tmp.j.clickables[55].base
                                return Decimal.pow(base, player.j.puzzle.repeatables[55])
                        },
                        style(){
                                return {
                                        "background-color": tmp.j.clickables[55].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!this.canClick()) return
                                let data = player.j.puzzle
                                let mp = tmp.j.clickables[55].getMaxPossible
                                let diff = mp.sub(data.repeatables[55])

                                let times = 1
                                if (hasUpgrade("l", 23)) times *= 10
                                if (hasUpgrade("k", 52)) times *= 1000

                                diff = diff.min(times)
                                if (diff.lte(0)) return 
                                data.exp = data.exp.minus(tmp.j.clickables[55].cost).max(0)
                                data.repeatables[55] = data.repeatables[55].plus(diff)
                        },
                },
                65: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Reset<sup>2</sup></b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Requires: Maxed Larger Puzzle"
                                let c = "<br>You have done: " + formatWhole(player.j.puzzle.reset2.times)
                                return a + c
                        },
                        unlocked(){
                                return player.j.puzzle.reset2.done || (player.j.puzzle.repeatables[14].gte(20) && player.ach.best.gte(149)) || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.repeatables[14].gte(20 + 10 * player.j.puzzle.reset2.times)
                        },
                        style(){
                                return {
                                        "background-color": tmp.j.clickables[65].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!this.canClick()) return
                                let data = player.j.puzzle
                                data.reset2.times ++
                                data.reset2.done = true
                                if (hasMilestone("k", 4)) return 
                                data.exp = new Decimal(0)
                                data.bankedExp = new Decimal(0)
                                data.knowledge = new Decimal(0)
                                data.repeatables[11] = new Decimal(0)
                                data.repeatables[12] = new Decimal(0)
                                data.repeatables[13] = new Decimal(0)
                                data.repeatables[14] = new Decimal(0)
                                data.repeatables[35] = new Decimal(0)
                                data.repeatables[45] = new Decimal(0)
                                data.repeatables[55] = new Decimal(0)
                                data.upgrades = []
                                data.placed = {
                                        corners: 0,
                                        edges: 0,
                                        centers: 0,
                                }
                                data.found = {
                                        corners: 0,
                                        edges: 0,
                                        centers: 0,
                                }
                                data.currentX = 10
                                data.currentY = 10
                                data.finished = 0
                                data.mode = 1
                        },
                },
                61: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Jonathan</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Each <b>Japan</b> adds .005 to the <b>Japan</b> base and adds one to the <b>J</b> gain exponent and unlock <b>Lock</b>"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[61].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return hasUpgrade("j", 45) || hasUnlockedPast("k")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[61].cost) && !player.j.puzzle.upgrades.includes(61)
                        },
                        cost(){
                                return new Decimal("2e385")
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(61) ? "#77bf5f" : tmp.j.clickables[61].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[61].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[61].cost).max(0)
                                data.upgrades.push(61)
                        },
                },
                62: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Jessica</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Square Silver Lock effect, each lock doubles <b>K</b> gain, and Puzzle autobuyers trigger 4x as often"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[62].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.k.lock.repeatables[13].gt(0) || hasUnlockedPast("k")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[62].cost) && !player.j.puzzle.upgrades.includes(62)
                        },
                        cost(){
                                return new Decimal("5e420")
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(62) ? "#77bf5f" : tmp.j.clickables[62].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[62].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[62].cost).max(0)
                                data.upgrades.push(62)
                        },
                },
                63: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Jerry</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Jack levels multiply first row metal gain and you can buy 10x more Bulk Amount at once"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[63].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.k.lock.repeatables[14].gt(2) || hasUnlockedPast("k")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[63].cost) && !player.j.puzzle.upgrades.includes(63)
                        },
                        cost(){
                                return new Decimal("1e456")
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(63) ? "#77bf5f" : tmp.j.clickables[63].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[63].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[63].cost).max(0)
                                data.upgrades.push(63)
                        },
                },
                64: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Johnny</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Make <b>Hit</b> goal scaling much weaker and remove the <b>A</b>, <b>B</b> and, <b>C</b> effect softcaps"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[64].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.k.lock.repeatables[14].gt(7) || hasUnlockedPast("k")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[64].cost) && !player.j.puzzle.upgrades.includes(64)
                        },
                        cost(){
                                return new Decimal("1e686")
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(64) ? "#77bf5f" : tmp.j.clickables[64].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[64].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[64].cost).max(0)
                                data.upgrades.push(64)
                        },
                },
                71: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Judges</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Multiply mine production by " + format(tmp.j.clickables[71].base)
                                let c = "<br>Currently: *" + format(tmp.j.clickables[71].effect)
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[71].cost) + " Knowledge"
                                return a + c + b
                        },
                        unlocked(){
                                return player.k.lock.repeatables[62].gt(0) || hasUnlockedPast("l")
                        },
                        cost(){
                                return Decimal.pow(10, 110600).times(Decimal.pow(10, 100).pow(player.j.puzzle.repeatables[71].pow(2)))
                        },
                        getMaxPossible(){
                                let amt = player.j.puzzle.knowledge.div(Decimal.pow(10, 110600))
                                if (amt.lt(1)) return new Decimal(0)
                                return amt.log(Decimal.pow(10, 100)).sqrt().floor().plus(1)
                        },
                        canClick(){
                                return player.j.puzzle.knowledge.gte(tmp.j.clickables[71].cost)
                        },
                        base(){
                                let ret = Decimal.pow(10, 10)
                                return ret
                        },
                        effect(){
                                return Decimal.pow(tmp.j.clickables[71].base, player.j.puzzle.repeatables[71])
                        },
                        style(){
                                return {
                                        "background-color": tmp.j.clickables[71].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!this.canClick()) return
                                let data = player.j.puzzle

                                let mp = tmp.j.clickables[71].getMaxPossible
                                let diff = mp.sub(data.repeatables[71])

                                let times = 1
                                if (hasUpgrade("k", 52)) times *= 1000

                                diff = diff.min(times)
                                if (diff.lte(0)) return 
                                data.exp = data.exp.minus(tmp.j.clickables[71].cost).max(0)
                                data.repeatables[71] = data.repeatables[71].plus(diff)
                        },
                },
                72: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Juvenile</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Add " + format(tmp.j.clickables[72].base) + " to the <b>K</b> effect exponent"
                                let c = "<br>Currently: +" + format(tmp.j.clickables[72].effect)
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[72].cost) + " Knowledge"
                                return a + c + b
                        },
                        unlocked(){
                                return player.k.lock.repeatables[64].gt(0) || hasUnlockedPast("l")
                        },
                        cost(){
                                return Decimal.pow(10, 144700).times(Decimal.pow(10, 200).pow(player.j.puzzle.repeatables[72].pow(2)))
                        },
                        getMaxPossible(){
                                let amt = player.j.puzzle.knowledge.div(Decimal.pow(10, 144700))
                                if (amt.lt(1)) return new Decimal(0)
                                return amt.log(Decimal.pow(10, 200)).sqrt().floor().plus(1)
                        },
                        canClick(){
                                return player.j.puzzle.knowledge.gte(tmp.j.clickables[72].cost)
                        },
                        base(){
                                let ret = Decimal.pow(10, 7)
                                return ret
                        },
                        effect(){
                                return Decimal.times(tmp.j.clickables[72].base, player.j.puzzle.repeatables[72])
                        },
                        style(){
                                return {
                                        "background-color": tmp.j.clickables[72].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!this.canClick()) return
                                let data = player.j.puzzle

                                let mp = tmp.j.clickables[72].getMaxPossible
                                let diff = mp.sub(data.repeatables[72])

                                let times = 1
                                if (hasUpgrade("k", 52)) times *= 1000

                                diff = diff.min(times)
                                if (diff.lte(0)) return 
                                data.exp = data.exp.minus(tmp.j.clickables[72].cost).max(0)
                                data.repeatables[72] = data.repeatables[72].plus(diff)
                        },
                },
                73: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Joining</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Act as if you have less <b>H</b> challenge completions"
                                let c = "<br>Currently: -" + format(tmp.j.clickables[73].effect)
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[73].cost) + " Knowledge"
                                return a + c + b
                        },
                        unlocked(){
                                return player.k.lock.repeatables[64].gt(4) || hasUnlockedPast("l")
                        },
                        cost(){
                                return Decimal.pow(10, 170e3).times(Decimal.pow(10, 300).pow(player.j.puzzle.repeatables[73].pow(2)))
                        },
                        getMaxPossible(){
                                let amt = player.j.puzzle.knowledge.div(Decimal.pow(10, 170e3))
                                if (amt.lt(1)) return new Decimal(0)
                                return amt.log(Decimal.pow(10, 300)).sqrt().floor().plus(1)
                        },
                        canClick(){
                                return player.j.puzzle.knowledge.gte(tmp.j.clickables[73].cost)
                        },
                        effect(){
                                let amt = player.j.puzzle.repeatables[73]
                                let ret = amt.div(5).plus(1).ln()
                                if (player.j.puzzle.upgrades.includes(75)) ret = ret.times(2)
                                return ret
                        },
                        style(){
                                return {
                                        "background-color": tmp.j.clickables[73].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!this.canClick()) return
                                let data = player.j.puzzle

                                let mp = tmp.j.clickables[73].getMaxPossible
                                let diff = mp.sub(data.repeatables[73])

                                let times = 1
                                if (hasUpgrade("k", 52)) times *= 1000

                                diff = diff.min(times)
                                if (diff.lte(0)) return 
                                data.exp = data.exp.minus(tmp.j.clickables[73].cost).max(0)
                                data.repeatables[73] = data.repeatables[73].plus(diff)
                        },
                },
                74: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Jury</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Add to <b>Housing</b> and <b>Aluminum Lock</b> bases"
                                let c = "<br>Currently: +" + format(tmp.j.clickables[74].effect)
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[74].cost) + " Knowledge"
                                return a + c + b
                        },
                        unlocked(){
                                return player.k.lock.repeatables[62].gt(13) || hasUnlockedPast("l")
                        },
                        cost(){
                                return Decimal.pow(10, 203600).times(Decimal.pow(10, 400).pow(player.j.puzzle.repeatables[74].pow(2)))
                        },
                        getMaxPossible(){
                                let amt = player.j.puzzle.knowledge.div(Decimal.pow(10, 203600))
                                if (amt.lt(1)) return new Decimal(0)
                                return amt.log(Decimal.pow(10, 400)).sqrt().floor().plus(1)
                        },
                        canClick(){
                                return player.j.puzzle.knowledge.gte(tmp.j.clickables[74].cost)
                        },
                        effect(){
                                let amt = player.j.puzzle.repeatables[74]
                                let ret = amt.div(10).plus(1).ln().times(50)
                                return ret
                        },
                        style(){
                                return {
                                        "background-color": tmp.j.clickables[74].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!this.canClick()) return
                                let data = player.j.puzzle

                                let mp = tmp.j.clickables[74].getMaxPossible
                                let diff = mp.sub(data.repeatables[74])

                                let times = 1
                                if (hasUpgrade("k", 52)) times *= 1000

                                diff = diff.min(times)
                                if (diff.lte(0)) return 
                                data.exp = data.exp.minus(tmp.j.clickables[74].cost).max(0)
                                data.repeatables[74] = data.repeatables[74].plus(diff)
                        },
                },
                75: {
                        title(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                return "<b style='color: #003333'>Justin</b>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let a = "Double <b>Joining</b>, unlock a <b>K</b> challenge, and keep all puzzle content upon reset"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[75].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.k.lock.repeatables[73].gt(11) || hasUnlockedPast("k")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[75].cost) && !player.j.puzzle.upgrades.includes(75)
                        },
                        cost(){
                                return new Decimal("1e923333")
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(75) ? "#77bf5f" : tmp.j.clickables[75].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[75].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[75].cost).max(0)
                                data.upgrades.push(75)
                        },
                },
        },
        shouldNotify(){
                for (id in tmp.j.clickables){
                        id = Number(id)
                        if (typeof id != "number") continue
                        if (isNaN(id)) continue
                        if ([11,12,13,21,22,23,24,15].includes(id)) continue
                        if (hasMilestone("j", 5) && id == 25) continue 
                        if (hasUpgrade("i", 54) && id == 65) continue
                        if (hasMilestone("k", 9) && id == 14) continue
                        if (hasUpgrade("j", 44) && [35,45,55].includes(id)) continue
                        if (hasMilestone("l", 11) && [71, 72, 73,74].includes(id)) continue
                        if (tmp.j.clickables[id].canClick && !player.j.upgrades.includes(id) && tmp.j.clickables[id].unlocked){
                                return true
                        }
                }
                return false
        },
        bars: {
                progressionBar: {
                        direction: RIGHT,
                        width: 650,
                        height: 40,
                        progress(){
                                if (player.tab != "j") return 0
                                if (player.subtabs.j.mainTabs != "Puzzle") return 0
                                let data = player.j.puzzle
                                let z = data.bartype
                                if (z == 1){
                                        return (data.placed.centers + data.placed.edges + data.placed.corners) / (data.currentX * data.currentY)
                                }
                                if (z == 0) {
                                        let alltot = 2 * data.currentX * data.currentY
                                        let sf = data.placed.centers + data.placed.edges + data.placed.corners + data.found.centers + data.found.edges + data.found.corners
                                        return sf / alltot
                                }
                                if (z == 2){
                                        let por = [4, 2 * (data.currentX + data.currentY) - 8, (data.currentX - 2) * (data.currentY - 2)]
                                        let val = [data.placed.corners, data.placed.edges, data.placed.centers]
                                        let c2 = function(x){
                                                return x * (x + 1) /2
                                        }
                                        let todo = [c2(por[0]), c2(por[1]), c2(por[2])]
                                        let done = [c2(por[0]) - c2(por[0] - val[0]),
                                                        c2(por[1]) - c2(por[1] - val[1]),
                                                        c2(por[2]) - c2(por[2] - val[2])]
                                        let w1 = done[0]
                                        //total number alr done
                                        let w2 = done[1] / 10
                                        let w3 = done[2] / 50
                                        let tot = c2(por[0]) + c2(por[1]) / 10 + c2(por[2]) / 50
                                        //total number needed to be done
                                        let togo = tot - (w1 + w2 + w3)
                                        let factor = Decimal.div(1, tmp.j.clickables.getBulkAmount).div(tmp.j.clickables.getAttemptChance).div(tmp.j.clickables.getAttemptSpeed)
                                        let timePLACE = factor.times(togo) //time needed to place the rest
                                        let timePLACETOTAL = factor.times(tot)

                                        let remtofind = (data.currentX * data.currentY - data.found.edges - data.found.corners - data.found.centers)
                                        let a = Decimal.div(1, tmp.j.clickables.getBulkAmount).div(tmp.j.clickables.getAttemptSpeed)
                                        let timeFIND = a.times(remtofind)
                                        let timeFINDTOTAL = a.times(data.currentX * data.currentY)

                                        return 1 - (timePLACE.plus(timeFIND)).div(timePLACETOTAL.plus(timeFINDTOTAL)).toNumber()
                                }
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                let data = player.j.puzzle
                                let por = [4, 2 * (data.currentX + data.currentY) - 8, (data.currentX - 2) * (data.currentY - 2)]
                                let val = [data.placed.corners, data.placed.edges, data.placed.centers]
                                let c2 = function(x){
                                        return x * (x + 1) /2
                                }
                                let todo = [c2(por[0]), c2(por[1]), c2(por[2])]
                                let done = [c2(por[0]) - c2(por[0] - val[0]),
                                                c2(por[1]) - c2(por[1] - val[1]),
                                                c2(por[2]) - c2(por[2] - val[2])]
                                let w1 = done[0]
                                //total number alr done
                                let w2 = done[1] / 10
                                let w3 = done[2] / 50
                                let tot = c2(por[0]) + c2(por[1]) / 10 + c2(por[2]) / 50
                                //total number needed to be done
                                let togo = tot - (w1 + w2 + w3)
                                let factor = Decimal.div(1, tmp.j.clickables.getBulkAmount).div(tmp.j.clickables.getAttemptChance).div(tmp.j.clickables.getAttemptSpeed)
                                let timePLACE = factor.times(togo)
                                
                                let remtofind = (data.currentX * data.currentY - data.found.edges - data.found.corners - data.found.centers)
                                let timeFIND = Decimal.div(remtofind, tmp.j.clickables.getBulkAmount).div(tmp.j.clickables.getAttemptSpeed)

                                let timeTICK = (1 - data.autotime) / tmp.j.clickables.getAttemptSpeed.toNumber()
                                if (timePLACE != 0) timePLACE = timePLACE.plus(timeTICK)
                                
                                let timebit = shiftDown && timeFIND.gt(.001) ? format(timePLACE) + "+" + format(timeFIND) : format(timePLACE.plus(timeFIND))
                                return "Percent complete with this puzzle (est time " + timebit + "s)"
                        },
                        fillStyle(){
                                return {
                                        "background": "#66CCFF"
                                }
                        },
                        textStyle(){
                                return {
                                        "color": "#990033"
                                }
                        },
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("i", 33) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "j") return ""
                                                if (player.subtabs.j.mainTabs != "Upgrades") return ""
                                                return shiftDown ? "Your best Jigsaws is " + format(player.j.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "j") return ""
                                                if (player.subtabs.j.mainTabs != "Upgrades") return ""
                                                if (hasUnlockedPast("j")) return ""
                                                return "You have done " + formatWhole(player.j.times) + " Jigsaw resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "j") return ""
                                                if (player.subtabs.j.mainTabs != "Upgrades") return ""
                                                if (hasUpgrade("i", 33)) return "You are gaining " + format(tmp.j.getResetGain) + " Jigsaws per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.j.time)) + ")" 
                                        },
                                ],
                                "blank", 
                                ["upgrades", [1,5]]],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("l", 21) || hasUnlockedPast("l")
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                "milestones",
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Puzzle": {
                        content: [
                                ["display-text", function(){
                                        if (player.tab != "j") return ""
                                        if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                        let data = player.j.puzzle
                                        let a = ""
                                        if (shiftDown && (!hasUpgrade("i", 53) || !hasMilestone("k", 6))) {
                                                a = "You are holding shift down to bulk buy and see effeciencies (hint: smaller is better)<br>"
                                        } else a = "You have " + formatWhole(player.j.points) + " jigsaws, causing a " + format(tmp.j.clickables.jigsawEffect, 4) + " speed multiplier<br>"
                                        let b = ""
                                        if (data.exp.max(1).log10().gt(1e6)) b = b = "You have " + formatWhole(data.exp) + " experience, " + formatWhole(data.knowledge) + " knowledge<br>"
                                        else b = "You have " + formatWhole(data.exp) + " experience, " + formatWhole(data.bankedExp) + " banked experience, " + formatWhole(data.knowledge) + " knowledge<br>"
                                        let c = ""
                                        if (!shiftDown) c = "You are currently working on a <h3>" + data.currentX + "</h3>x<h3>" + data.currentY + "</h3> puzzle (" + formatWhole(data.finished) + " completed)<br>"
                                        else c = "Your bulk amount is " + formatWhole(tmp.j.clickables.getBulkAmount) + "<br>"
                                        return a + b + c
                                }],
                                ["clickables", [1,2]],
                                ["display-text", function(){
                                        if (player.tab != "j") return ""
                                        if (player.subtabs.j.mainTabs != "Puzzle") return ""
                                        let data = player.j.puzzle
                                        let data2 = data.found
                                        let data3 = data.placed
                                        let a = "You have found " + formatWhole(data2.corners) + " corners, " + formatWhole(data2.edges) + " edges and, " + formatWhole(data2.centers) + " centers.<br>"
                                        let b = "You have placed " + formatWhole(data3.corners) + " corners, " + formatWhole(data3.edges) + " edges and, " + formatWhole(data3.centers) + " centers.<br>"
                                        let c = ""
                                        if (tmp.j.clickables.getAttemptSpeed.lt(10)) {
                                                let x = formatWhole(Math.floor(Math.min(data.autotime, 1) * 100))
                                                if (x.length == 1) x = "0" + x
                                                c = "You are currently attempting to " + tmp.j.clickables.nameOfModeV + " every " + format(tmp.j.clickables.getAttemptSpeed.pow(-1)) + " seconds (" + x + "%).<br>"
                                        } else {
                                                c = "You are currently attempting to " + tmp.j.clickables.nameOfModeV + " " + format(tmp.j.clickables.getAttemptSpeed) + " times per second.<br>"
                                        }
                                        return a + b + c
                                }],
                                ["bar", "progressionBar"],
                                ["clickables", [3,7]],
                        ],
                        unlocked(){
                                return hasMilestone("j", 4) || hasUnlockedPast("j")
                        },
                },
                "Details": {
                        content: [
                                "main-display",
                                ["display-text", function(){
                                        if (player.tab != "j") return ""
                                        if (player.subtabs.j.mainTabs != "Details") return ""
                                        let a = `<h2 style='color:#FF3366'>Puzzle mechanic:</h2><br>
                                        You have a 10x10 puzzle (initially)<br>You can buy the following upgrades [more unlocked later], <br>
                                        1. success chance, [50% base]<br>2. attempt speed, [1s base]<br><br>
                                        There are edge, corner, and center pieces<br>There are 4 settings you can be in<br>
                                        1. Filter<br>1a. It filters for pieces putting them into catagories<br>
                                        2. Build edges [gives 10x chances if on edges]<br>
                                        3. Build center [gives 50x chances]<br>3a. Puts parts together<br>4. Finish puzzle<br>
                                        <br><br>Note that you both need to be on the correct piece (randomly chosen)<br>
                                        and succeed to place the piece<br>In other words, you have <br>
                                        <b style='color:#883333'> [which piece factor]/[remaining piece of type]*[base chance] </b><br>chance to succeed<br>
                                        This [base chance] is halved per completed puzzle and boosted by various upgrades<br><br>
                                        You get things for finishing a puzzle:<br>Exp: 1<br>
                                        Banked Exp: [puzzles beaten so far] + 1<br>Knowledge: 1<br>Note gain is [base]*[multipliers], floored<br><br> 
                                        Exp is spent on upgrades that boost the rest of the game<br>
                                        Knowledge is spent on the upgrades mentioned at the top<br><br>`
                                        if (player.j.puzzle.bestExp.eq(0)) return a + "<br><br><br>"
                                        let b = `<h2 style='color:#FF3366'>Reset:</h2><br>
                                        Finishing at least one puzzle allows you to Reset (requires 2 initially)<br>
                                        Restarting makes you start at the first puzzle again and gives you your banked exp<br>
                                        It also resets your progress in the current puzzle, but is vital for progression<br>
                                        Resetting has initially a 60 second cooldown, but this can be reduced later on<br><br>
                                        `
                                        if (player.j.puzzle.repeatables[14].lt(20) && !player.j.puzzle.reset2.done) return a + b + "<br><br><br>"
                                        let c = `<h2 style='color:#FF3366'>Reset<sup>2</sup>:</h2><br>
                                        You unlock reset<sup>2</sup> by having 149 achievements and maxing out Larger Puzzle<br>
                                        You can reset<sup>2</sup> by maxing larger puzzle upgrades.<br>
                                        Each reset allows you to make larger puzzles (by 5 in each dimension)<br>
                                        Additionally, doing your first reset<sup>2</sup> allows you lets you keep all automation unlocked previously<br>
                                        Furthermore, each reset<sup>2</sup> triples banked exp and knowledge gain<br>
                                        The first reset<sup>2</sup> permanently doubles bulk amount<br>
                                        However, doing a reset<sup>2</sup> resets all puzzle content except best exp and best knowledge<br>
                                        Unlike resetting, there is no cooldown [atm]<br><br>`
                                        return a + b + c + "<br><br><br>"
                                }
                                ]
                        ],
                        unlocked(){
                                return true
                        },
                }
        },
        doReset(layer){
                let data = player.j
                if (layer == "j") data.time = 0
                if (!getsReset("j", layer)) return
                data.time = 0
                data.times = 0

                if (!hasMilestone("l", 4)) {
                        //upgrades
                        let keep = []
                        data.upgrades = filter(data.upgrades, keep)
                }
                
                if (!hasMilestone("k", 2)) {
                        //milestones
                        let keep2 = []
                        data.milestones = filter(data.milestones, keep2)
                }

                //resources
                data.points = new Decimal(0)
                data.total = new Decimal(0)
                data.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        data.buyables[resetBuyables[j]] = new Decimal(0)
                }

                let data2 = data.puzzle

                let r = 0
                if (hasMilestone("l", 7)) r = Math.floor(data2.bestCompletedAllTime * .98)
                data2.bestCompletedK = r

                if (data2.upgrades.includes(75)) return 

                data2.finished = r
                data2.exp = new Decimal(0)
                data2.bankedExp = new Decimal(0)
                data2.knowledge = new Decimal(0)
                data2.bestKnowledge = new Decimal(0)
                data2.bestExp = new Decimal(0)
                if (!hasUpgrade("i", 52)) data2.repeatables[11] = new Decimal(0)
                data2.repeatables[12] = new Decimal(0)
                if (!hasMilestone("k", 6)) data2.repeatables[13] = new Decimal(0)
                data2.repeatables[14] = new Decimal(0)
                data2.repeatables[35] = new Decimal(0)
                data2.repeatables[45] = new Decimal(0)
                data2.repeatables[55] = new Decimal(0)
                data2.repeatables[71] = new Decimal(0)
                data2.repeatables[72] = new Decimal(0)
                data2.repeatables[73] = new Decimal(0)
                data2.repeatables[74] = new Decimal(0)
                if (!hasMilestone("l", 2)) data2.upgrades = []
                data2.placed = {
                        corners: 0,
                        edges: 0,
                        centers: 0,
                }
                data2.found = {
                        corners: 0,
                        edges: 0,
                        centers: 0,
                }
                data2.currentX = 10
                data2.currentY = 10
                data2.mode = 1
                if (!hasMilestone("l", 5)) data2.reset2.times = 0
                data2.time = 0
        },
})

addLayer("k", {
        name: "Keys",
        symbol: "K",
        position: 0,
        startData() { 
                return {
                        unlocked: true,
                        points: new Decimal(0),
                        best: new Decimal(0),
                        total: new Decimal(0),
                        abtime: 0,
                        time: 0,
                        times: 0,
                        autotimes: 0,
                        autodevtime: 0,
                        lock: {
                                mines: { //extra
                                        11: new Decimal(0),
                                        12: new Decimal(0),
                                        13: new Decimal(0),
                                        14: new Decimal(0),
                                        15: new Decimal(0),
                                        21: new Decimal(0),
                                        22: new Decimal(0),
                                        23: new Decimal(0),
                                        24: new Decimal(0),
                                        25: new Decimal(0),
                                },
                                resources: { //extra
                                        11: new Decimal(0),
                                        12: new Decimal(0),
                                        13: new Decimal(0),
                                        14: new Decimal(0),
                                        15: new Decimal(0),
                                        21: new Decimal(0),
                                        22: new Decimal(0),
                                        23: new Decimal(0),
                                        24: new Decimal(0),
                                        25: new Decimal(0),
                                },
                                repeatables: {
                                        11: new Decimal(0),
                                        12: new Decimal(0),
                                        13: new Decimal(0),
                                        14: new Decimal(0),
                                        15: new Decimal(0),
                                        21: new Decimal(0),
                                        22: new Decimal(0),
                                        23: new Decimal(0),
                                        24: new Decimal(0),
                                        25: new Decimal(0),
                                        31: new Decimal(0),
                                        32: new Decimal(0),
                                        33: new Decimal(0),
                                        34: new Decimal(0),
                                        35: new Decimal(0),
                                        41: new Decimal(0),
                                        42: new Decimal(0),
                                        43: new Decimal(0),
                                        44: new Decimal(0),
                                        45: new Decimal(0),
                                        51: new Decimal(0),
                                        52: new Decimal(0),
                                        53: new Decimal(0),
                                        54: new Decimal(0),
                                        55: new Decimal(0),
                                        61: new Decimal(0),
                                        62: new Decimal(0),
                                        63: new Decimal(0),
                                        64: new Decimal(0),
                                        65: new Decimal(0),
                                        71: new Decimal(0),
                                        72: new Decimal(0),
                                        73: new Decimal(0),
                                        74: new Decimal(0),
                                        75: new Decimal(0),
                                        81: new Decimal(0),
                                        82: new Decimal(0),
                                        83: new Decimal(0),
                                        84: new Decimal(0),
                                        85: new Decimal(0),
                                },
                                autotime: 0,
                        },
                } //no comma here
        },
        color: "#3333CC",
        branches: ["j"],
        requires: new Decimal(0),
        resource: "Keys",
        baseResource: "Jigsaws",
        baseAmount() {
                return player.j.best
        },
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("k")
        },
        getBaseDiv(){
                let x = new Decimal("1e55")
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasUpgrade("j", 32)) x = x.plus(1)
                if (hasUpgrade("j", 35)) x = x.plus(.1 * player.k.milestones.length)
                if (hasUpgrade("k", 22)) x = x.plus(.08 * player.k.upgrades.length)
                if (hasUpgrade("j", 44)) x = x.plus(1)
                x = x.plus(tmp.k.clickables[43].effect.times(tmp.k.clickables.totalLocks))
                x = x.plus(tmp.k.clickables[25].effect)
                if (hasUpgrade("k", 25)) x = x.plus(player.k.lock.repeatables[25])
                if (hasMilestone("l", 2)) x = x.plus(.1 * player.l.milestones.length)
                if (hasMilestone("l", 8)) x = x.plus(.2 * player.l.milestones.length)
                if (hasUpgrade("k", 44)) x = x.plus(tmp.k.clickables[54].effect)
                return x
        },
        getGainMultPre(){
                let x = Decimal.pow(19, -1)
                if (hasUpgrade("i", 55)) x = x.times(Decimal.pow(2, player.j.puzzle.reset2.times))
                if (hasUpgrade("j", 42)) x = x.times(Decimal.pow(2, player.j.upgrades.length))
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("k")

                if (hasMilestone("k", 5)) x = x.times(Decimal.pow(2, player.k.milestones.length))
                if (hasUpgrade("k", 11)) x = x.times(tmp.j.clickables[35].effect)
                if (hasUpgrade("j", 43)) x = x.times(tmp.h.challenges[21].rewardEffect)
                x = x.times(tmp.k.clickables[11].effect)
                x = x.times(Decimal.pow(tmp.k.clickables[32].effect, tmp.k.clickables.totalMines))
                if (player.j.puzzle.upgrades.includes(62)) x = x.times(Decimal.pow(2, tmp.k.clickables.totalLocks))
                x = x.times(tmp.k.clickables[35].effect)
                if (hasUpgrade("k", 23)) x = x.times(Decimal.pow(100, player.k.lock.repeatables[45]))

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("k")) return new Decimal(1)

                let amt = player.k.best

                let exp = player.k.best.pow(.2).times(3).min(98)
                
                let exp2 = new Decimal(2)
                exp2 = exp.plus(tmp.j.clickables[72].effect)

                let ret = amt.times(3).plus(1).pow(exp)

                let ret2 = amt.pow(exp2).max(1)

                return ret.times(ret2)
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("k")
        },
        update(diff){
                let data = player.k

                data.best = data.best.max(data.points)
                if (hasMilestone("k", 5)) {
                        let gain = tmp.k.getResetGain
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
                        handleGeneralizedBuyableAutobuy(diff, "k")
                } else {
                        data.abtime = 0
                }

                data.time += diff
                let devtimefactor = 1
                if (hasMilestone("l", 9)) devtimefactor *= 3
                if (hasUpgrade("m", 11)) devtimefactor *= 3
                if (hasUpgrade("k", 51)) devtimefactor *= 3
                data.autodevtime += diff * devtimefactor

                data2 = data.lock
                data3 = data2.mines
                data4 = data2.resources

                let minesOrder = [11,12,13,14,15,21,22,23,24,25]
                for (let i = 0; i < minesOrder.length - 1; i++){
                        id1 = minesOrder[i]
                        id2 = minesOrder[i + 1]
                        let a = tmp.k.clickables[id2].mineProductionPerSecond.times(diff)
                        let b = tmp.k.clickables[id1].metalProductionPerSecond.times(diff)
                        data3[id1] = data3[id1].plus(a)
                        data4[id1] = data4[id1].plus(b)
                }
                let last = minesOrder[minesOrder.length - 1]
                let lastMetalProd = tmp.k.clickables[last].metalProductionPerSecond.times(diff)
                data4[last] = data4[last].plus(lastMetalProd)
                let firstMineProd = tmp.k.clickables[11].mineProductionPerSecond.times(diff)
                data3[25] = data3[25].plus(firstMineProd)
                
                if (data.autodevtime < 1) return
                data.autodevtime += -1
                if (data.autodevtime > 10) data.autodevtime = 10
                if (player.l.autobuyMines && hasMilestone("l", 3)){
                        let list = [11,12,13,14,15,21,22,23,24,25]
                        for (i = 0; i < 10; i++){
                                let x = tmp.k.clickables[list[i]].canClick
                                if (!x) continue
                                layers.k.clickables[list[i]].onClick()
                        }
                }
                if (player.l.autobuyLocks12 && hasMilestone("l", 5)){
                        let list = [31,32,33,34,35,41,42,43,44,45]
                        if (hasUpgrade("k", 43)) {
                                list = list.concat([51,52,53,54,55])
                        }
                        if (hasMilestone("m", 2)) {
                                list = list.concat([61,62,63,64,65])
                                list = list.concat([71,72,73,74,75])
                                list = list.concat([81])
                        }
                        for (i = 0; i < list.length; i++){
                                let x = tmp.k.clickables[list[i]].canClick
                                if (!x) continue
                                layers.k.clickables[list[i]].onClick()
                        }
                }
        },
        row: 10, 
        hotkeys: [
                {key: "k", description: "K: Reset for Keys", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+K", description: "Shift+K: Go to Keys", onPress(){
                                showTab("k")
                        }
                },
                {key: "5", description: "5: Rebirth V [not yet]", onPress(){
                                return
                                let data = layers.g.clickables[55]
                                if (data.canClick()) data.onClick()
                        }
                },
        ],
        layerShown(){return player.j.best.gt(1e67) || player.k.best.gt(0) || hasUnlockedPast("k")},
        prestigeButtonText(){
                if (hasMilestone("k", 5)) return ""
                return getGeneralizedPrestigeButtonText("k")
        },
        canReset(){
                return player.k.time >= 2 && !hasMilestone("k", 5) && tmp.k.getResetGain.gt(0)
        },
        milestones: {
                1: {
                        requirementDescription: "<b>Know</b><br>Requires: 1 Key", 
                        effectDescription: "Keep <b>F</b> and <b>G</b> upgrades, double bulk amount, and square Bulk Amount",
                        done(){
                                return player.k.points.gte(1)
                        },
                        unlocked(){
                                return true || hasUnlockedPast("k")
                        }, // hasMilestone("k", 1)
                },
                2: {
                        requirementDescription: "<b>Key</b><br>Requires: 2 Keys",
                        effectDescription: "Keep <b>I</b> and <b>J</b> milestones, triple base <b>J</b> gain per milestone, and achievements multiply banked exp gain",
                        done(){
                                return player.k.points.gte(2)
                        },
                        unlocked(){
                                return hasMilestone("k", 1) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 2)
                },
                3: {
                        requirementDescription: "<b>Keep</b><br>Requires: 4 Keys",
                        effectDescription: "Achievements multiply knowledge gain, unlock a <b>H</b> buyable, and remove <b>E</b> effect softcap",
                        done(){
                                return player.k.points.gte(4)
                        },
                        unlocked(){
                                return hasMilestone("k", 2) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 3)
                },
                4: {
                        requirementDescription: "<b>Kids</b><br>Requires: 16 Keys",
                        effectDescription: "Reset<sup>2</sup> resets nothing and unlock a <b>H</b> challenge",
                        done(){
                                return player.k.points.gte(16)
                        },
                        unlocked(){
                                return hasMilestone("k", 3) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 4)
                },
                5: {
                        requirementDescription: "<b>Knowledge</b><br>Requires: 256 Keys",
                        effectDescription: "Remove the ability to prestige but gain 100% of Keys upon prestige per second, and each milestone doubles <b>K</b> gain",
                        done(){
                                return player.k.points.gte(256)
                        },
                        unlocked(){
                                return hasUpgrade("i", 52) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 5)
                },
                6: {
                        requirementDescription: "<b>Known</b><br>Requires: 65,536 Keys",
                        effectDescription: "Keep Bulk Amount levels upon reset and once per second get Success Chance levels as if you bought max, but it doesn't cost Knowledge",
                        done(){
                                return player.k.points.gte(65536)
                        },
                        unlocked(){
                                return hasMilestone("k", 5) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 6)
                },
                7: {
                        requirementDescription: "<b>Kingdom</b><br>Requires: 4,294,967,296 Keys",
                        effectDescription: "Each <b>H</b> challenge completion doubles banked exp gain",
                        done(){
                                return player.k.points.gte(4294967296)
                        },
                        unlocked(){
                                return hasMilestone("k", 6) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 7)
                },
                8: {
                        requirementDescription: "<b>King</b><br>Requires: 1.84e19 Keys",
                        effectDescription: "Square <b>Huge</b> and <b>Hi</b> effects <b>I</b> gain exponent",
                        done(){
                                return player.k.points.max(1).log(2).gte(64)
                        },
                        unlocked(){
                                return hasMilestone("k", 7) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 8)
                },
                9: {
                        requirementDescription: "<b>Kit</b><br>Requires: 3.40e38 Keys",
                        effectDescription: "Buff India to all but one and attempt to buy Larger Puzzle without cost once per second",
                        done(){
                                return player.k.points.max(1).log(2).gte(128)
                        },
                        unlocked(){
                                return hasMilestone("k", 8) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 9)
                },
                10: {
                        requirementDescription: "<b>Korea</b><br>Requires: 1.16e77 Keys",
                        effectDescription: "Per milestone you can complete one more <b>H</b> challenge",
                        done(){
                                return player.k.points.max(1).log(2).gte(256)
                        },
                        unlocked(){
                                return hasUpgrade("k", 22) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 10)
                },
                11: {
                        requirementDescription: "<b>Kelly</b><br>Requires: 1.34e154 Keys",
                        effectDescription: "Per milestone you get ten <b>Inn</b> levels",
                        done(){
                                return player.k.points.max(1).log(2).gte(512)
                        },
                        unlocked(){
                                return hasUpgrade("j", 45) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 11)
                },
                12: {
                        requirementDescription: "<b>Kept</b><br>Requires: 1.80e308 Keys",
                        effectDescription: "Each mine multiplies knowledge gain by 1.1",
                        done(){
                                return player.k.points.max(1).log(2).gte(1024)
                        },
                        unlocked(){
                                return player.k.lock.resources[21].gt(0) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 12)
                },
                13: {
                        requirementDescription: "<b>Kentucky</b><br>Requires: 3.23e616 Keys",
                        effectDescription: "Tungsten multiplies <b>Idea</b> base",
                        done(){
                                return player.k.points.max(1).log(2).gte(2048)
                        },
                        unlocked(){
                                return hasMilestone("k", 12) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 13)
                },
                14: {
                        requirementDescription: "<b>Keeping</b><br>Requires: 1.04e1,233 Keys",
                        effectDescription: "You can buy 10 levels of <b>Larger Puzzle</b> at a time and square <b>Coal Lock</b> base",
                        done(){
                                return player.k.points.max(1).log(2).gte(4096)
                        },
                        unlocked(){
                                return hasMilestone("k", 13) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 14)
                },
                15: {
                        requirementDescription: "<b>Kits</b><br>Requires: 1.09e2,466 Keys",
                        effectDescription: "Remove the ability to prestige for Lemons, but gain 100% of Lemons on reset per second",
                        done(){
                                return player.k.points.max(1).log(2).gte(Decimal.pow(2,13))
                        },
                        unlocked(){
                                return hasMilestone("k", 14) || hasUnlockedPast("l")
                        }, // hasMilestone("k", 15)
                },
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Kind",
                        description: "<b>Japan</b> multiplies knowledge, <b>K</b> and banked exp gain",
                        cost: new Decimal(1e32),
                        unlocked(){
                                return hasUpgrade("j", 35) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("k", 11)
                12: {
                        title: "Kitchen",
                        description: "Each upgrade gives 10x Knowledge gain and adds .01 to the <b>Japan</b> base",
                        cost: new Decimal(2e36),
                        unlocked(){
                                return hasUpgrade("k", 11) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("k", 12)
                13: {
                        title: "Keywords",
                        description: "Best knowledge<sup>.1</sup> multiplies banked exp gain and best exp<sup>.1</sup> multiplies knowledge gain",
                        cost: new Decimal(2e40),
                        unlocked(){
                                return hasUpgrade("k", 12) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("k", 13)
                14: {
                        title: "Kansas",
                        description: "Remove the softcap on the Larger Puzzle effect",
                        cost: new Decimal(1e42),
                        unlocked(){
                                return hasUpgrade("k", 13) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("k", 14)
                15: {
                        title: "Keyword",
                        description: "Per upgrade add .02 to the Larger Puzzle effect base",
                        cost: new Decimal(1e59),
                        unlocked(){
                                return hasUpgrade("k", 14) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("k", 15)
                21: {
                        title: "Kinds",
                        description: "<b>Kingdom</b> effects knowledge and you can complete 5 more of each <b>H</b> challenge",
                        cost: new Decimal(2e60),
                        unlocked(){
                                return hasUpgrade("k", 15) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("k", 21)
                22: {
                        title: "Knew",
                        description: "Per upgrade add .08 to the <b>K</b> gain exponent and <b>Japan</b> multiplies experience gain",
                        cost: new Decimal(1e66),
                        unlocked(){
                                return hasUpgrade("k", 21) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("k", 22)
                23: {
                        title: "Kill",
                        description: "Each <b>Osmium Lock</b> gives 100x <b>K</b> and Knowledge",
                        cost: new Decimal("1e1216"),
                        unlocked(){
                                return player.k.lock.repeatables[45].gt(0) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("k", 23)
                24: {
                        title: "Knows",
                        description: "Each upgrade multiplies mine gain by 10 and you can buy 10x Bulk Amount",
                        cost: new Decimal("1e1382"),
                        unlocked(){
                                return hasUpgrade("k", 23) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("k", 24)
                25: {
                        title: "Kevin",
                        description: "Each <b>Osmium Mine</b> adds 1 to the <b>K</b> gain exponent and multiply Osmium gain by the number of reset<sup>2</sup>",
                        cost: new Decimal("1e1674"),
                        unlocked(){
                                return hasUpgrade("k", 24) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("k", 25)
                31: {
                        title: "Keys",
                        description: "<b>Hit</b> multiplicatively effects <b>Japan</b> base and unlock another Lock",
                        cost: new Decimal("1e13700"),
                        unlocked(){
                                return hasUpgrade("j", 14) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("k", 31)
                32: {
                        title: "Killed",
                        description: "Each <b>Osmium Lock</b> allows you to buy twice as many buyables from <b>H</b> and before",
                        cost: new Decimal("1e17900"),
                        unlocked(){
                                return hasUpgrade("k", 31) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("k", 32)
                33: {
                        title: "Kid",
                        description: "The square root of your exp multiplies knowledge gain and unlock another lock",
                        cost: new Decimal("1e29300"),
                        unlocked(){
                                return hasUpgrade("j", 55) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("k", 33)
                34: {
                        title: "Kernel",
                        description: "<b>Hit</b> multiplcatively effects <b>Japan</b> base and <b>Gold Lock</b> base",
                        cost: new Decimal("1e43000"),
                        unlocked(){
                                return hasUpgrade("k", 33) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("k", 34)
                35: {
                        title: "Keyboard",
                        description: "Raise <b>Iron Lock</b> base to the number of <b>L</b> upgrades and triple <b>Titanium Lock</b> effect",
                        cost: new Decimal("1e53500"),
                        unlocked(){
                                return hasUpgrade("k", 34) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("k", 35)
                41: {
                        title: "Kim",
                        description: "Per <b>H</b> challenge completion past 170 get 4x <b>L</b> gain and per completion past 178 get an effective lock",
                        cost: new Decimal("1e238500"),
                        unlocked(){
                                return hasUpgrade("l", 24) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("k", 41)
                42: {
                        title: "Ken",
                        description: "<bdi style='font-size:80%'><b>Juice</b> gives free <b>Jamaica</b> and <b>Jacksonville</b> levels and each <b>H</b> challenge completion gives a free <b>Omnipotent IX</b> level</bdi>",
                        cost: new Decimal("1e248500"),
                        unlocked(){
                                return hasUpgrade("k", 41) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("k", 42)
                43: {
                        title: "Korean",
                        description: "Autobuy the last row of locks, each <b>Master Lock</b> raises point gain ^1.15, and unlock <b>Keys</b>",
                        cost: new Decimal("1e280000"),
                        unlocked(){
                                return hasUpgrade("k", 42) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("k", 43)
                44: {
                        title: "Kings",
                        description: "You can bulk mines and locks 10x and </b>Master Lock</b> effects <b>K</b> gain exponent",
                        cost: new Decimal("1e1360e3"),
                        unlocked(){
                                return player.k.lock.repeatables[71].gt(2) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("k", 44)
                45: {
                        title: "Kent",
                        description: "<bdi style='font-size:80%'>Double <b>Osmium Lock</b> and <b>Gold Key</b> effects, -.05 effective <b>H</b> challenge completions per <b>L</b> upgrade, and unlock a <b>J</b> buyable</bdi>",
                        cost: new Decimal("1e1822e3"),
                        unlocked(){
                                return player.k.lock.repeatables[73].gt(1) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("k", 45)
                51: {
                        title: "Knowing",
                        description: "Each Key raises point gain to 1 + [Diamond Keys] / 100 and triple lock autobuyer speed",
                        cost: new Decimal("1e337e6"),
                        unlocked(){
                                return hasUpgrade("m", 15) || hasUnlockedPast("m")
                        }
                }, // hasUpgrade("k", 51)
                52: {
                        title: "Keith",
                        description: "<b>K</b> challenges after 5 are halved and unlock another <b>K</b> challenge and you buy 1000x Puzzle and Key content",
                        cost: new Decimal("1e495.5e6"),
                        unlocked(){
                                return hasUpgrade("k", 51) || hasUnlockedPast("m")
                        }
                }, // hasUpgrade("k", 52)
                53: {
                        title: "Kate",
                        description: "<b>Tungsten Key</b> base effects <b>M</b> gain and you can complete 1 more <b>H</b> challenge per 3 <b>K</b> challenges",
                        cost: new Decimal("1e876e6"),
                        unlocked(){
                                return hasUpgrade("k", 52) || hasUnlockedPast("m")
                        }
                }, // hasUpgrade("k", 53)
                54: {
                        title: "Karen",
                        description: "Raise <b>Aluminum Key</b> base effect to the number of <b>K</b> challenge completions and add 1 to the <b>M</b> gain exp",
                        cost: new Decimal("1e1053e6"),
                        unlocked(){
                                return hasUpgrade("k", 53) || hasUnlockedPast("m")
                        }
                }, // hasUpgrade("k", 54)
                55: {
                        title: "Kick",
                        description: "You can complete 75 more <b>H</b> challenges and unlock the final <b>K</b> challenge",
                        cost: new Decimal("1e120e9"),
                        unlocked(){
                                return hasUpgrade("k", 54) || hasUnlockedPast("m")
                        }
                }, // hasUpgrade("k", 55)
                
                /*
                Knight
                Kennedy
                */
        },
        clickables: {
                rows: 8,
                cols: 5,
                totalMines(){
                        let sum = [11,12,13,14,15,21,22,23,24,25]
                        let a = new Decimal(0)
                        for (i = 0; i < 10; i++){
                                a = a.plus(player.k.lock.repeatables[sum[i]])
                        }
                        return a
                },
                totalLocks(){
                        let sum = [31,32,33,34,35,41,42,43,44,45,51,52,53,54,55]
                        let a = new Decimal(0)
                        for (i = 0; i < 15; i++){
                                a = a.plus(player.k.lock.repeatables[sum[i]])
                        }
                        return a  
                },
                totalKeys(){
                        let sum = [61,62,63,64,65,71,72,73,74,75,81,82,83,84,85]
                        let a = new Decimal(0)
                        for (i = 0; i < 15; i++){
                                a = a.plus(player.k.lock.repeatables[sum[i]])
                        }
                        return a  
                },
                getGlobalMetalGainMult(){
                        let ret = new Decimal(1)
                        ret = ret.times(tmp.k.clickables[22].effect)
                        ret = ret.times(Decimal.pow(player.k.points.max(Math.E).ln(), tmp.k.clickables[42].effect))
                        if (hasMilestone("l", 3)) ret = ret.times(Decimal.pow(4, player.l.milestones.length))
                        if (hasUpgrade("l", 12)) ret = ret.times(tmp.h.challenges[21].rewardEffect)
                        return ret
                },
                getGlobalMineGainMult(){
                        let ret = new Decimal(1)
                        ret = ret.times(tmp.k.clickables[15].effect)
                        ret = ret.times(tmp.k.clickables[23].effect)
                        ret = ret.times(Decimal.pow(player.k.points.plus(3).ln(), tmp.k.clickables[45].effect))
                        if (hasUpgrade("k", 24)) ret = ret.times(Decimal.pow(10, player.k.upgrades.length))
                        if (hasMilestone("l", 10)) {
                                let h = totalChallengeComps("h")
                                if (h > 100) ret = ret.times(Decimal.pow(h / 100, h))
                        }
                        ret = ret.times(Decimal.pow(tmp.k.clickables[61].effect, tmp.k.clickables.totalLocks))
                        ret = ret.times(tmp.j.clickables[71].effect)
                        ret = ret.times(Decimal.pow(tmp.k.clickables[71].effect, tmp.k.clickables.totalKeys))
                        ret = ret.times(Decimal.pow(tmp.k.clickables[74].effect, totalChallengeComps("h")))
                        ret = ret.times(Decimal.pow(tmp.k.clickables[81].effect, tmp.k.clickables.totalMines))
                        return ret
                },
                getBonusLocks(id){
                        let ret = new Decimal(0)
                        if (id < 53) ret = ret.plus(tmp.k.clickables[53].effect)
                        if (id < 55) ret = ret.plus(tmp.k.clickables[55].effect)
                        if (hasUpgrade("k", 41)) ret = ret.plus(Math.max(totalChallengeComps("h") - 178, 0))
                        ret = ret.plus(tmp.k.clickables[65].effect)
                        ret = ret.plus(tmp.k.clickables[75].effect.times(totalChallengeComps("h")))
                        return ret
                },
                getBonusKeys(id){
                        let ret = new Decimal(0)
                        if (id < 72) ret = ret.plus(tmp.k.clickables[72].effect)
                        if (id < 80) ret = ret.plus(tmp.k.challenges[11].rewardEffect)
                        if (hasUpgrade("m", 14) && id == 81) ret = ret.plus(tmp.k.challenges[11].rewardEffect)
                        if (hasMilestone("m", 3) && id == 72) ret = ret.plus(1) 
                        if (hasMilestone("m", 4) && id == 72) ret = ret.plus(player.m.milestones.length)
                        if (id < 82) ret = ret.plus(tmp.k.clickables[82].effect)
                        if (hasUpgrade("m", 11) && id == 75) ret = ret.plus(player.m.upgrades.length)
                        if (hasUpgrade("m", 15) && id == 64) ret = ret.plus(totalChallengeComps("k"))
                        if (id == 82) ret = ret.plus(tmp.k.challenges[21].rewardEffect)
                        if (hasUpgrade("l", 31) && id == 82) ret = ret.plus(tmp.k.challenges[11].rewardEffect)
                        return ret
                },
                11: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(0) + "'>Iron<br>Mine</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[11])
                                let a 
                                let b 
                                let c 
                                let id = 11
                                if (shiftDown) {
                                        let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Keys</b>" : ""
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 70%'>Metal Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPer, 4) + "<br>"
                                } else {
                                        a = "<h3 style='color: #AC4600'>Mines</h3>: " + formatWhole(player.k.lock.repeatables[id]) + "+" + formatWhole(player.k.lock.mines[id]) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 80%'>Metal Production/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPerSecond, 4) + "<br>"
                                }
                                return a + c
                        },
                        unlocked(){
                                return true
                        },
                        metalProductionPer(){
                                let ret = new Decimal(1)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[31].effect, player.k.lock.repeatables[11].sqrt()))
                                ret = ret.times(Decimal.pow(player.k.lock.resources[11].plus(Math.E).ln(), tmp.k.clickables[33].effect))
                                ret = ret.times(Decimal.pow(tmp.k.clickables[34].effect, player.k.lock.repeatables[31]))
                                if (player.j.puzzle.upgrades.includes(63)) ret = ret.times(player.j.puzzle.repeatables[45].max(1))
                                ret = ret.times(tmp.k.clickables.getGlobalMetalGainMult)
                                return ret
                        },
                        metalProductionPerSecond(){
                                return tmp.k.clickables[11].metalProductionPer.times(tmp.k.clickables[11].total)
                        },
                        mineProductionPer(){
                                let ret = new Decimal(.1)
                                ret = ret.times(tmp.k.clickables.getGlobalMineGainMult)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[44].effect, player.k.lock.repeatables[11]))
                                return ret
                        },
                        total(){
                                let data = player.k.lock
                                return data.mines[11].plus(data.repeatables[11])
                        },
                        bases(){
                                return [new Decimal("1e171"), new Decimal(10)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[11].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[11].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[11].bases
                                let amt = player.k.points
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.resources[11]
                                let ret = amt.plus(1).sqrt()
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[11].effect 
                                return "*" + format(eff) + " Keys"
                        },
                        mineProductionPerSecond(){
                                if (!hasUpgrade("j", 53)) return new Decimal(0)
                                let ret = tmp.k.clickables[11].mineProductionPer.times(tmp.k.clickables[11].total)
                                if (ret.lt(10)) return new Decimal(0)
                                let exp = new Decimal(10)
                                exp = exp.plus(tmp.k.clickables[54].effect)
                                let exp2 = tmp.k.clickables[64].effect
                                let newRet = ret.log10().pow(exp)
                                newRet = newRet.times(Decimal.pow(ret, exp2))
                                return newRet
                        },
                        canClick(){
                                return player.k.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 11
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                12: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(0.4) + "'>Silver<br>Mine</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[12])
                                let a 
                                let b 
                                let c 
                                let id = 12
                                if (shiftDown) {
                                        let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Keys</b>" : ""
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 70%'>Mine Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPer, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 70%'>Metal Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPer, 4) + "<br>"
                                } else {
                                        a = "<h3 style='color: #AC4600'>Mines</h3>: " + formatWhole(player.k.lock.repeatables[id]) + "+" + formatWhole(player.k.lock.mines[id]) + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 80%'>Mine Production/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPerSecond, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 80%'>Metal Production/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPerSecond, 4) + "<br>"
                                }
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        metalProductionPer(){
                                let ret = new Decimal(1)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[31].effect, player.k.lock.repeatables[12].sqrt()))
                                ret = ret.times(Decimal.pow(player.k.lock.resources[12].plus(Math.E).ln(), tmp.k.clickables[33].effect))
                                ret = ret.times(Decimal.pow(tmp.k.clickables[34].effect, player.k.lock.repeatables[32]))
                                if (player.j.puzzle.upgrades.includes(63)) ret = ret.times(player.j.puzzle.repeatables[45].max(1))
                                ret = ret.times(tmp.k.clickables.getGlobalMetalGainMult)
                                return ret
                        },
                        metalProductionPerSecond(){
                                return tmp.k.clickables[12].metalProductionPer.times(tmp.k.clickables[12].total)
                        },
                        mineProductionPer(){
                                let ret = new Decimal(.1)
                                ret = ret.times(tmp.k.clickables.getGlobalMineGainMult)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[44].effect, player.k.lock.repeatables[12]))
                                return ret
                        },
                        total(){
                                let data = player.k.lock
                                return data.mines[12].plus(data.repeatables[12])
                        },
                        bases(){
                                return [new Decimal("1e172"), new Decimal(100)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[12].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[12].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[12].bases
                                let amt = player.k.points
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.resources[12]
                                let ret = amt.plus(10).log10().pow(5)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[12].effect 
                                return "*" + format(eff) + " Knowledge"
                        },
                        mineProductionPerSecond(){
                                return tmp.k.clickables[12].mineProductionPer.times(tmp.k.clickables[12].total)
                        },
                        canClick(){
                                return player.k.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 12
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                13: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(0.8) + "'>Gold<br>Mine</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[13])
                                let a 
                                let b 
                                let c 
                                let id = 13
                                if (shiftDown) {
                                        let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Keys</b>" : ""
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 70%'>Mine Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPer, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 70%'>Metal Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPer, 4) + "<br>"
                                } else {
                                        a = "<h3 style='color: #AC4600'>Mines</h3>: " + formatWhole(player.k.lock.repeatables[id]) + "+" + formatWhole(player.k.lock.mines[id]) + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 80%'>Mine Production/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPerSecond, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 80%'>Metal Production/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPerSecond, 4) + "<br>"
                                }
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        metalProductionPer(){
                                let ret = new Decimal(1)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[31].effect, player.k.lock.repeatables[13].sqrt()))
                                ret = ret.times(Decimal.pow(player.k.lock.resources[13].plus(Math.E).ln(), tmp.k.clickables[33].effect))
                                ret = ret.times(Decimal.pow(tmp.k.clickables[34].effect, player.k.lock.repeatables[33]))
                                if (player.j.puzzle.upgrades.includes(63)) ret = ret.times(player.j.puzzle.repeatables[45].max(1))
                                ret = ret.times(tmp.k.clickables.getGlobalMetalGainMult)
                                return ret
                        },
                        metalProductionPerSecond(){
                                return tmp.k.clickables[13].metalProductionPer.times(tmp.k.clickables[13].total)
                        },
                        mineProductionPer(){
                                let ret = new Decimal(.1)
                                ret = ret.times(tmp.k.clickables.getGlobalMineGainMult)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[44].effect, player.k.lock.repeatables[13]))
                                return ret
                        },
                        total(){
                                let data = player.k.lock
                                return data.mines[13].plus(data.repeatables[13])
                        },
                        bases(){
                                return [new Decimal("1e176"), new Decimal(200)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[13].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[13].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[13].bases
                                let amt = player.k.points
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.resources[13]
                                let log = amt.plus(10).log10()
                                let ret = Decimal.pow(log, log)
                                if (ret.gt(Decimal.pow(10, 4e6))) ret = ret.sqrt().times(Decimal.pow(10, 2e6))
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[13].effect 
                                return "*" + format(eff) + " Banked Exp gain"
                        },
                        mineProductionPerSecond(){
                                return tmp.k.clickables[13].mineProductionPer.times(tmp.k.clickables[13].total)
                        },
                        canClick(){
                                return player.k.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 13
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                14: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(1.2) + "'>Coal<br>Mine</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[14])
                                let a 
                                let b 
                                let c 
                                let id = 14
                                if (shiftDown) {
                                        let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Keys</b>" : ""
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 70%'>Mine Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPer, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 70%'>Metal Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPer, 4) + "<br>"
                                } else {
                                        a = "<h3 style='color: #AC4600'>Mines</h3>: " + formatWhole(player.k.lock.repeatables[id]) + "+" + formatWhole(player.k.lock.mines[id]) + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 80%'>Mine Production/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPerSecond, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 80%'>Metal Production/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPerSecond, 4) + "<br>"
                                }
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        metalProductionPer(){
                                let ret = new Decimal(1)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[31].effect, player.k.lock.repeatables[14].sqrt()))
                                ret = ret.times(Decimal.pow(player.k.lock.resources[14].plus(Math.E).ln(), tmp.k.clickables[33].effect))
                                ret = ret.times(Decimal.pow(tmp.k.clickables[34].effect, player.k.lock.repeatables[34]))
                                if (player.j.puzzle.upgrades.includes(63)) ret = ret.times(player.j.puzzle.repeatables[45].max(1))
                                ret = ret.times(tmp.k.clickables.getGlobalMetalGainMult)
                                return ret
                        },
                        metalProductionPerSecond(){
                                return tmp.k.clickables[14].metalProductionPer.times(tmp.k.clickables[14].total)
                        },
                        mineProductionPer(){
                                let ret = new Decimal(.1)
                                ret = ret.times(tmp.k.clickables.getGlobalMineGainMult)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[44].effect, player.k.lock.repeatables[14]))
                                return ret
                        },
                        total(){
                                let data = player.k.lock
                                return data.mines[14].plus(data.repeatables[14])
                        },
                        bases(){
                                return [new Decimal("1e202"), new Decimal("1e3")]
                        },
                        cost(){
                                let bases = tmp.k.clickables[14].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[14].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[14].bases
                                let amt = player.k.points
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.resources[14]
                                let ret = amt.div(100).plus(1).log10().div(20)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[14].effect 
                                return "+" + format(eff, 4) + " <b>Japan</b> base"
                        },
                        mineProductionPerSecond(){
                                return tmp.k.clickables[14].mineProductionPer.times(tmp.k.clickables[14].total)
                        },
                        canClick(){
                                return player.k.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 14
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                15: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(1.6) + "'>Copper<br>Mine</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[15])
                                let a 
                                let b 
                                let c 
                                let id = 15
                                if (shiftDown) {
                                        let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Keys</b>" : ""
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 70%'>Mine Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPer, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 70%'>Metal Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPer, 4) + "<br>"
                                } else {
                                        a = "<h3 style='color: #AC4600'>Mines</h3>: " + formatWhole(player.k.lock.repeatables[id]) + "+" + formatWhole(player.k.lock.mines[id]) + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 80%'>Mine Production/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPerSecond, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 80%'>Metal Production/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPerSecond, 4) + "<br>"
                                }
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        metalProductionPer(){
                                let ret = new Decimal(1)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[31].effect, player.k.lock.repeatables[15].sqrt()))
                                ret = ret.times(Decimal.pow(player.k.lock.resources[15].plus(Math.E).ln(), tmp.k.clickables[33].effect))
                                ret = ret.times(Decimal.pow(tmp.k.clickables[34].effect, player.k.lock.repeatables[35]))
                                if (player.j.puzzle.upgrades.includes(63)) ret = ret.times(player.j.puzzle.repeatables[45].max(1))
                                ret = ret.times(tmp.k.clickables.getGlobalMetalGainMult)
                                return ret
                        },
                        metalProductionPerSecond(){
                                return tmp.k.clickables[15].metalProductionPer.times(tmp.k.clickables[15].total)
                        },
                        mineProductionPer(){
                                let ret = new Decimal(.1)
                                ret = ret.times(tmp.k.clickables.getGlobalMineGainMult)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[44].effect, player.k.lock.repeatables[15]))
                                return ret
                        },
                        total(){
                                let data = player.k.lock
                                return data.mines[15].plus(data.repeatables[15])
                        },
                        bases(){
                                return [new Decimal("1e239"), new Decimal("1e5")]
                        },
                        cost(){
                                let bases = tmp.k.clickables[15].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[15].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[15].bases
                                let amt = player.k.points
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.resources[15]
                                let ret = amt.div(1e5).plus(10).log10().pow(5)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[15].effect 
                                return "*" + format(eff) + " Mine production"
                        },
                        mineProductionPerSecond(){
                                return tmp.k.clickables[15].mineProductionPer.times(tmp.k.clickables[15].total)
                        },
                        canClick(){
                                return player.k.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 15
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                21: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(2) + "'>Tin<br>Mine</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[21])
                                let a 
                                let b 
                                let c 
                                let id = 21
                                if (shiftDown) {
                                        let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Keys</b>" : ""
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 70%'>Mine Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPer, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 70%'>Metal Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPer, 4) + "<br>"
                                } else {
                                        a = "<h3 style='color: #AC4600'>Mines</h3>: " + formatWhole(player.k.lock.repeatables[id]) + "+" + formatWhole(player.k.lock.mines[id]) + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 80%'>Mine Production/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPerSecond, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 80%'>Metal Production/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPerSecond, 4) + "<br>"
                                }
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        metalProductionPer(){
                                let ret = new Decimal(1)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[31].effect, player.k.lock.repeatables[21].sqrt()))
                                ret = ret.times(Decimal.pow(player.k.lock.resources[21].plus(Math.E).ln(), tmp.k.clickables[33].effect))
                                ret = ret.times(Decimal.pow(tmp.k.clickables[34].effect, player.k.lock.repeatables[41]))
                                ret = ret.times(tmp.k.clickables.getGlobalMetalGainMult)
                                return ret
                        },
                        metalProductionPerSecond(){
                                return tmp.k.clickables[21].metalProductionPer.times(tmp.k.clickables[21].total)
                        },
                        mineProductionPer(){
                                let ret = new Decimal(.1)
                                ret = ret.times(tmp.k.clickables.getGlobalMineGainMult)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[44].effect, player.k.lock.repeatables[21]))
                                return ret
                        },
                        total(){
                                let data = player.k.lock
                                return data.mines[21].plus(data.repeatables[21])
                        },
                        bases(){
                                return [new Decimal("2e302"), new Decimal("1e8")]
                        },
                        cost(){
                                let bases = tmp.k.clickables[21].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[21].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[21].bases
                                let amt = player.k.points
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.resources[21]
                                let ret = amt.div(3e8).max(1).log10().times(1e5)
                                if (ret.gt(1e6)) ret = ret.sqrt().times(1e3)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[21].effect 
                                return "+" + format(eff) + " <b>I</b> gain exponent"
                        },
                        mineProductionPerSecond(){
                                return tmp.k.clickables[21].mineProductionPer.times(tmp.k.clickables[21].total)
                        },
                        canClick(){
                                return player.k.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 21
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                22: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(2.4) + "'>Titanium<br>Mine</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[22])
                                let a 
                                let b 
                                let c 
                                let id = 22
                                if (shiftDown) {
                                        let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Keys</b>" : ""
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 70%'>Mine Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPer, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 70%'>Metal Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPer, 4) + "<br>"
                                } else {
                                        a = "<h3 style='color: #AC4600'>Mines</h3>: " + formatWhole(player.k.lock.repeatables[id]) + "+" + formatWhole(player.k.lock.mines[id]) + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 80%'>Mine Production/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPerSecond, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 80%'>Metal Production/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPerSecond, 4) + "<br>"
                                }
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        metalProductionPer(){
                                let ret = new Decimal(1)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[31].effect, player.k.lock.repeatables[22].sqrt()))
                                ret = ret.times(Decimal.pow(player.k.lock.resources[22].plus(Math.E).ln(), tmp.k.clickables[33].effect))
                                ret = ret.times(Decimal.pow(tmp.k.clickables[34].effect, player.k.lock.repeatables[42]))
                                ret = ret.times(tmp.k.clickables.getGlobalMetalGainMult)
                                return ret
                        },
                        metalProductionPerSecond(){
                                return tmp.k.clickables[22].metalProductionPer.times(tmp.k.clickables[22].total)
                        },
                        mineProductionPer(){
                                let ret = new Decimal(.1)
                                ret = ret.times(tmp.k.clickables.getGlobalMineGainMult)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[44].effect, player.k.lock.repeatables[22]))
                                return ret
                        },
                        total(){
                                let data = player.k.lock
                                return data.mines[22].plus(data.repeatables[22])
                        },
                        bases(){
                                return [new Decimal("1e449"), new Decimal("1e13")]
                        },
                        cost(){
                                let bases = tmp.k.clickables[22].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[22].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[22].bases
                                let amt = player.k.points
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.resources[22]
                                let ret = amt.div(5e6).max(10).log10().pow(5)

                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[22].effect 
                                return "*" + format(eff) + " all Metal gain"
                        },
                        mineProductionPerSecond(){
                                return tmp.k.clickables[22].mineProductionPer.times(tmp.k.clickables[22].total)
                        },
                        canClick(){
                                return player.k.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 22
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                23: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(2.8) + "'>Tungsten<br>Mine</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[23])
                                let a 
                                let b 
                                let c 
                                let id = 23
                                if (shiftDown) {
                                        let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Keys</b>" : ""
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 70%'>Mine Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPer, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 70%'>Metal Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPer, 4) + "<br>"
                                } else {
                                        a = "<h3 style='color: #AC4600'>Mines</h3>: " + formatWhole(player.k.lock.repeatables[id]) + "+" + formatWhole(player.k.lock.mines[id]) + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 80%'>Mine Production/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPerSecond, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 80%'>Metal Production/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPerSecond, 4) + "<br>"
                                }
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        metalProductionPer(){
                                let ret = new Decimal(1)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[31].effect, player.k.lock.repeatables[23].sqrt()))
                                ret = ret.times(Decimal.pow(player.k.lock.resources[23].plus(Math.E).ln(), tmp.k.clickables[33].effect))
                                ret = ret.times(Decimal.pow(tmp.k.clickables[34].effect, player.k.lock.repeatables[43]))
                                ret = ret.times(tmp.k.clickables.getGlobalMetalGainMult)
                                return ret
                        },
                        metalProductionPerSecond(){
                                return tmp.k.clickables[23].metalProductionPer.times(tmp.k.clickables[23].total)
                        },
                        mineProductionPer(){
                                let ret = new Decimal(.1)
                                ret = ret.times(tmp.k.clickables.getGlobalMineGainMult)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[44].effect, player.k.lock.repeatables[23]))
                                return ret
                        },
                        total(){
                                let data = player.k.lock
                                return data.mines[23].plus(data.repeatables[23])
                        },
                        bases(){
                                return [new Decimal("1e584"), new Decimal("1e21")]
                        },
                        cost(){
                                let bases = tmp.k.clickables[23].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[23].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[23].bases
                                let amt = player.k.points
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.resources[23]
                                let ret = amt.plus(1e18).log10().div(3).pow(2).sub(35).max(1)
                                if (hasMilestone("l", 9)) ret = ret.pow(2)
                                if (hasUpgrade("l", 14)) ret = ret.pow(player.k.lock.repeatables[52].max(1))
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[23].effect 
                                return "*" + format(eff) + " Mine production"
                        },
                        mineProductionPerSecond(){
                                return tmp.k.clickables[23].mineProductionPer.times(tmp.k.clickables[23].total)
                        },
                        canClick(){
                                return player.k.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 23
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                24: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(3.2) + "'>Aluminum<br>Mine</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[24])
                                let a 
                                let b 
                                let c 
                                let id = 24
                                if (shiftDown) {
                                        let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Keys</b>" : ""
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 70%'>Mine Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPer, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 70%'>Metal Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPer, 4) + "<br>"
                                } else {
                                        a = "<h3 style='color: #AC4600'>Mines</h3>: " + formatWhole(player.k.lock.repeatables[id]) + "+" + formatWhole(player.k.lock.mines[id]) + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 80%'>Mine Production/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPerSecond, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 80%'>Metal Production/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPerSecond, 4) + "<br>"
                                }
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        metalProductionPer(){
                                let ret = new Decimal(1)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[31].effect, player.k.lock.repeatables[24].sqrt()))
                                ret = ret.times(Decimal.pow(player.k.lock.resources[24].plus(Math.E).ln(), tmp.k.clickables[33].effect))
                                ret = ret.times(Decimal.pow(tmp.k.clickables[34].effect, player.k.lock.repeatables[44]))
                                ret = ret.times(tmp.k.clickables.getGlobalMetalGainMult)
                                return ret
                        },
                        metalProductionPerSecond(){
                                return tmp.k.clickables[24].metalProductionPer.times(tmp.k.clickables[24].total)
                        },
                        mineProductionPer(){
                                let ret = new Decimal(.1)
                                ret = ret.times(tmp.k.clickables.getGlobalMineGainMult)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[44].effect, player.k.lock.repeatables[24]))
                                return ret
                        },
                        total(){
                                let data = player.k.lock
                                return data.mines[24].plus(data.repeatables[24])
                        },
                        bases(){
                                return [new Decimal("1e681"), new Decimal("1e34")]
                        },
                        cost(){
                                let bases = tmp.k.clickables[24].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[24].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[24].bases
                                let amt = player.k.points
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.resources[24]
                                let arg = amt.div(1e20).max(1)
                                let exp = arg.sqrt()
                                if (exp.gt(100)) exp = exp.log10().times(50)
                                let ret = Decimal.pow(arg, exp)

                                if (ret.gt(1e100)) ret = ret.log10().pow(50)

                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[24].effect 
                                return "*" + format(eff) + " Knowledge"
                        },
                        mineProductionPerSecond(){
                                return tmp.k.clickables[24].mineProductionPer.times(tmp.k.clickables[24].total)
                        },
                        canClick(){
                                return player.k.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 24
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                25: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(3.6) + "'>Osmium<br>Mine</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[25])
                                let a 
                                let b 
                                let c 
                                let id = 25
                                if (shiftDown) {
                                        let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Keys</b>" : ""
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 70%'>Mine Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPer, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 70%'>Metal Production/mine/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPer, 4) + "<br>"
                                } else {
                                        a = "<h3 style='color: #AC4600'>Mines</h3>: " + formatWhole(player.k.lock.repeatables[id]) + "+" + formatWhole(player.k.lock.mines[id]) + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 80%'>Mine Production/s</h3>:<br>" + format(tmp.k.clickables[id].mineProductionPerSecond, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 80%'>Metal Production/s</h3>:<br>" + format(tmp.k.clickables[id].metalProductionPerSecond, 4) + "<br>"
                                }
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        metalProductionPer(){
                                let ret = new Decimal(1)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[31].effect, player.k.lock.repeatables[25].sqrt()))
                                ret = ret.times(Decimal.pow(player.k.lock.resources[25].plus(Math.E).ln(), tmp.k.clickables[33].effect))
                                ret = ret.times(Decimal.pow(tmp.k.clickables[34].effect, player.k.lock.repeatables[45]))
                                ret = ret.times(tmp.k.clickables.getGlobalMetalGainMult)
                                if (hasUpgrade("k", 25)) ret = ret.times(Math.max(1, player.j.puzzle.reset2.times))
                                return ret
                        },
                        metalProductionPerSecond(){
                                return tmp.k.clickables[25].metalProductionPer.times(tmp.k.clickables[25].total)
                        },
                        mineProductionPer(){
                                let ret = new Decimal(.1)
                                ret = ret.times(tmp.k.clickables.getGlobalMineGainMult)
                                ret = ret.times(Decimal.pow(tmp.k.clickables[44].effect, player.k.lock.repeatables[25]))
                                return ret
                        },
                        total(){
                                let data = player.k.lock
                                return data.mines[25].plus(data.repeatables[25])
                        },
                        bases(){
                                return [new Decimal("1e935"), new Decimal("1e55")]
                        },
                        cost(){
                                let bases = tmp.k.clickables[25].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[25].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[25].bases
                                let amt = player.k.points
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.resources[25]
                                let ret = amt.div(1e24).plus(10).log10().log10()
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[25].effect 
                                return "+" + format(eff, 4) + " <b>K</b> gain exponent"
                        },
                        mineProductionPerSecond(){
                                return tmp.k.clickables[25].mineProductionPer.times(tmp.k.clickables[25].total)
                        },
                        canClick(){
                                return player.k.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 25
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                31: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(4) + "'>Iron<br>Lock</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[31])
                                let a 
                                let b 
                                let c 
                                let id = 31
                                let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Iron</b>" : ""
                                a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[12].gt(0) || hasUnlockedPast("k")
                        },
                        bases(){
                                return [new Decimal("500"), new Decimal(2)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[31].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[31].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[31].bases
                                let amt = player.k.lock.resources[11]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[31]
                                amt = amt.plus(layers.k.clickables.getBonusLocks(31))
                                let ret = amt.times(3).plus(1).sqrt()
                                if (hasMilestone("l", 4)) ret = ret.pow(Decimal.pow(1.01, player.l.milestones.length))
                                if (hasUpgrade("k", 35)) ret = ret.pow(Math.max(1, player.l.upgrades.length))
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[31].effect 
                                return "*" + format(eff) + "^sqrt(bought mines) to each mines metal production"
                        },
                        canClick(){
                                return player.k.lock.resources[11].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 31
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                32: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(4.4) + "'>Silver<br>Lock</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[32])
                                let a 
                                let b 
                                let c 
                                let id = 32
                                let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Silver</b>" : ""
                                a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[31].gt(1) || hasUnlockedPast("k")
                        },
                        bases(){
                                return [new Decimal("500"), new Decimal(2)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[32].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[32].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[32].bases
                                let amt = player.k.lock.resources[12]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[32]
                                amt = amt.plus(layers.k.clickables.getBonusLocks(32))
                                let ret = amt.plus(1)
                                if (player.j.puzzle.upgrades.includes(62)) ret = ret.pow(2)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[32].effect 
                                return "*" + format(eff) + " <b>K</b> gain per mine"
                        },
                        canClick(){
                                return player.k.lock.resources[12].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 32
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                33: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(4.8) + "'>Gold<br>Lock</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[33])
                                let a 
                                let b 
                                let c 
                                let id = 33
                                let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Gold</b>" : ""
                                a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[32].gt(1) || hasUnlockedPast("k")
                        },
                        bases(){
                                return [new Decimal("500"), new Decimal(2)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[33].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[33].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[33].bases
                                let amt = player.k.lock.resources[13]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[33]
                                amt = amt.plus(layers.k.clickables.getBonusLocks(33))
                                let ret = amt.sqrt()
                                if (hasMilestone("l", 6)) ret = ret.times(1.2)
                                if (hasUpgrade("k", 34)) ret = ret.times(tmp.h.challenges[22].rewardEffect.max(1))
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[33].effect 
                                return "per resource *ln(resource)^" + format(eff) + " to self gain"
                        },
                        canClick(){
                                return player.k.lock.resources[13].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 33
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                34: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(5.2) + "'>Coal<br>Lock</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[34])
                                let a 
                                let b 
                                let c 
                                let id = 34
                                let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Coal</b>" : ""
                                a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[33].gt(1) || hasUnlockedPast("k")
                        },
                        bases(){
                                return [new Decimal("5e4"), new Decimal(2)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[34].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[34].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[34].bases
                                let amt = player.k.lock.resources[14]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[34]
                                amt = amt.plus(layers.k.clickables.getBonusLocks(34))
                                let ret = amt.div(2.5).plus(1).sqrt()
                                if (hasMilestone("k", 14)) ret = ret.pow(2)

                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[34].effect
                                return "per resource *" + format(eff) + "^[bought locks] resource gain"
                        },
                        canClick(){
                                return player.k.lock.resources[14].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 34
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                35: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(5.6) + "'>Copper<br>Lock</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[35])
                                let a 
                                let b 
                                let c 
                                let id = 35
                                let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Copper</b>" : ""
                                a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[34].gt(1) || hasUnlockedPast("k")
                        },
                        bases(){
                                return [new Decimal("3e9"), new Decimal(3)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[35].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[35].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[35].bases
                                let amt = player.k.lock.resources[15]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[35]
                                amt = amt.plus(layers.k.clickables.getBonusLocks(35))
                                let ret = Decimal.pow(1000, amt.sqrt())
                                if (hasUpgrade("j", 55)) {
                                        ret = ret.pow(2)
                                        ret = ret.pow(Math.max(1, Math.sqrt(player.l.upgrades.length)))
                                }
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[35].effect
                                return "*" + format(eff) + " <b>K</b> and Knowledge gain"
                        },
                        canClick(){
                                return player.k.lock.resources[15].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 35
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                41: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(6) + "'>Tin<br>Lock</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[41])
                                let a 
                                let b 
                                let c 
                                let id = 41
                                let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Tin</b>" : ""
                                a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[35].gt(1) || hasUnlockedPast("k")
                        },
                        bases(){
                                return [new Decimal("1e17"), new Decimal(4)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[41].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[41].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[41].bases
                                let amt = player.k.lock.resources[21]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[41]
                                amt = amt.plus(layers.k.clickables.getBonusLocks(41))
                                let ret = amt
                                if (hasUpgrade("l", 13)) ret = ret.pow(1.3)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[41].effect
                                return "+" + format(eff) + " to <b>Japan</b> base"
                        },
                        canClick(){
                                return player.k.lock.resources[21].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 41
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                42: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(6.4) + "'>Titanium<br>Lock</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[42])
                                let a 
                                let b 
                                let c 
                                let id = 42
                                let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Titanium</b>" : ""
                                a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[41].gt(1) || hasUnlockedPast("k")
                        },
                        bases(){
                                return [new Decimal("1e13"), new Decimal(5)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[42].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[42].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[42].bases
                                let amt = player.k.lock.resources[22]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[42]
                                amt = amt.plus(layers.k.clickables.getBonusLocks(42))
                                let ret = amt.sqrt().div(4)
                                if (hasUpgrade("l", 12)) ret = ret.times(Decimal.pow(player.l.upgrades.length, 2))
                                if (hasUpgrade("k", 35)) ret = ret.times(3)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[42].effect
                                return "*ln(keys)^" + format(eff) + " global Metal gain"
                        },
                        canClick(){
                                return player.k.lock.resources[22].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 42
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                43: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(6.8) + "'>Tungsten<br>Lock</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[43])
                                let a 
                                let b 
                                let c 
                                let id = 43
                                let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Tungsten</b>" : ""
                                a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[42].gt(1) || hasUnlockedPast("k")
                        },
                        bases(){
                                return [new Decimal("1e19"), new Decimal(6)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[43].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[43].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[43].bases
                                let amt = player.k.lock.resources[23]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[43]
                                amt = amt.plus(layers.k.clickables.getBonusLocks(43))
                                let ret = amt.div(500).plus(1).ln()
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[43].effect
                                return "+" + format(eff, 4) + " <b>K</b> gain exponent per lock"
                        },
                        canClick(){
                                return player.k.lock.resources[23].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 43
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                44: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(7.2) + "'>Aluminum<br>Lock</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[44])
                                let a 
                                let b 
                                let c 
                                let id = 44
                                let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Aluminum</b>" : ""
                                a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[43].gt(1) || hasUnlockedPast("k")
                        },
                        bases(){
                                return [new Decimal("1e22"), new Decimal(8)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[44].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[44].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[44].bases
                                let amt = player.k.lock.resources[24]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[44]
                                amt = amt.plus(layers.k.clickables.getBonusLocks(44))
                                let ret = amt.div(10).plus(1).ln().times(10).plus(1)
                                ret = ret.plus(tmp.j.clickables[74].effect)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[44].effect
                                return "per resource *" + format(eff) + "^[bought mines] mine production"
                        },
                        canClick(){
                                return player.k.lock.resources[24].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 44
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                45: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(7.6) + "'>Osmium<br>Lock</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                if (player.k.points.max(10).log10().gt(1e9)) return formatWhole(player.k.lock.repeatables[45])
                                let a 
                                let b 
                                let c 
                                let id = 45
                                let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Osmium</b>" : ""
                                a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[44].gt(1) || hasUnlockedPast("k")
                        },
                        bases(){
                                return [new Decimal("1e25"), new Decimal(11)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[45].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[45].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[45].bases
                                let amt = player.k.lock.resources[25]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[45]
                                amt = amt.plus(layers.k.clickables.getBonusLocks(45))
                                let ret = amt.div(20).plus(1).ln().times(10)
                                if (hasUpgrade("k", 45)) ret = ret.times(2)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[45].effect
                                return "*ln(keys)^" + format(eff) + " global mine production"
                        },
                        canClick(){
                                return player.k.lock.resources[25].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 45
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                51: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(8) + "'>Basic<br>Lock</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let a 
                                let b 
                                let c 
                                let id = 51
                                let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Lemons</b>" : ""
                                a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                
                                return a + c
                        },
                        unlocked(){
                                return hasUpgrade("l", 11) || hasUnlockedPast("l")
                        },
                        bases(){
                                return [new Decimal("2e9"), new Decimal(2)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[51].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[51].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[51].bases
                                let amt = player.l.points
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[51]
                                amt = amt.plus(layers.k.clickables.getBonusLocks(51))
                                let ret = amt.pow(1.5).div(500).plus(1).ln().plus(1)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[51].effect
                                return "*" + format(eff, 4) + " Lemon gain per mine"
                        },
                        canClick(){
                                return player.l.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 51
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                52: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(8.4) + "'>Diamond<br>Lock</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let a 
                                let b 
                                let c 
                                let id = 52
                                let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Lemons</b>" : ""
                                a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                
                                return a + c
                        },
                        unlocked(){
                                return hasUpgrade("l", 13) || hasUnlockedPast("l")
                        },
                        bases(){
                                return [new Decimal("1e11"), new Decimal(2)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[52].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[52].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[52].bases
                                let amt = player.l.points
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[52]
                                amt = amt.plus(layers.k.clickables.getBonusLocks(52))
                                let ret = amt.div(300).plus(1).ln().plus(1)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[52].effect
                                return "*" + format(eff, 4) + " Lemon gain per Lock"
                        },
                        canClick(){
                                return player.l.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 52
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                53: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(8.8) + "'>Advanced<br>Lock</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let a 
                                let b 
                                let c 
                                let id = 53
                                let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Lemons</b>" : ""
                                a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                
                                return a + c
                        },
                        unlocked(){
                                return hasUpgrade("k", 31) || hasUnlockedPast("l")
                        },
                        bases(){
                                return [new Decimal("1e27"), new Decimal(5e4)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[53].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[53].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[53].bases
                                let amt = player.l.points
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[53]
                                amt = amt.plus(layers.k.clickables.getBonusLocks(53))
                                let ret = amt.div(100).plus(1).ln().times(50)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[53].effect
                                return "+" + format(eff, 4) + " effective prior locks"
                        },
                        canClick(){
                                return player.l.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 53
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                54: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(9.2) + "'>Master<br>Lock</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let a 
                                let b 
                                let c 
                                let id = 54
                                let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Lemons</b>" : ""
                                a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                
                                return a + c
                        },
                        unlocked(){
                                return hasUpgrade("k", 33) || hasUnlockedPast("l")
                        },
                        bases(){
                                return [new Decimal("1e94"), new Decimal(2)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[54].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[54].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[54].bases
                                let amt = player.l.points
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[54]
                                amt = amt.plus(layers.k.clickables.getBonusLocks(54))
                                let ret = amt.div(100).plus(1).ln().times(200)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[54].effect
                                return "+" + format(eff) + " Osmium Mine gain exponent"
                        },
                        canClick(){
                                return player.l.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 54
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                55: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(9.6) + "; font-size: 15px'>Grandmaster<br>Lock</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let a 
                                let b 
                                let c 
                                let id = 55
                                let extra = tmp.k.clickables[id].cost.lt("1e900") ? " <b>Lemons</b>" : ""
                                a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + extra + "<br>"
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                
                                return a + c
                        },
                        unlocked(){
                                return hasUpgrade("l", 15) || hasUnlockedPast("l")
                        },
                        bases(){
                                return [new Decimal("1e193"), new Decimal(2e18)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[55].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[55].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[55].bases
                                let amt = player.l.points
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[55]
                                amt = amt.plus(layers.k.clickables.getBonusLocks(55))
                                let ret = amt.div(100).plus(1).ln().times(20)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[55].effect
                                return "+" + format(eff, 3) + " effective prior locks and <b>L</b> gain exp"
                        },
                        canClick(){
                                return player.l.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 55
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasUpgrade("k", 44)) init *= 10
                                if (hasMilestone("m", 2)) init *= 10
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                61: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(10) + "'>Iron<br>Key</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let a = ""
                                let b 
                                let c 
                                let id = 61
                                if (player.k.points.max(10).log10().lt(1e9)) { 
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + "<br>"
                                }
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                return a + c
                        },
                        unlocked(){
                                return hasUpgrade("k", 43) || hasUnlockedPast("l")
                        },
                        bases(){
                                return [Decimal.pow(10, 16330), Decimal.pow(10, 100)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[61].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[61].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[61].bases
                                let amt = player.k.lock.resources[11]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[61]
                                amt = amt.plus(layers.k.clickables.getBonusKeys(61))
                                let ret = amt.pow(1.1).div(700).plus(1).ln().times(10).plus(1)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[61].effect 
                                return "*" + format(eff, 4) + " global mine production per Lock"
                        },
                        canClick(){
                                let data = player.k.lock.repeatables
                                if (data[61].gte(data[31])) return false
                                return player.k.lock.resources[11].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 61
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.lock.resources[id-50] = player.k.lock.resources[id-50].minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                62: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(10.4) + "'>Silver<br>Key</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let a = ""
                                let b 
                                let c 
                                let id = 62
                                if (player.k.points.max(10).log10().lt(1e9)) { 
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + "<br>"
                                }
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[61].gt(0) || hasUnlockedPast("l")
                        },
                        bases(){
                                return [Decimal.pow(10, 15000), Decimal.pow(10, 100)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[62].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[62].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[62].bases
                                let amt = player.k.lock.resources[12]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[62]
                                amt = amt.plus(layers.k.clickables.getBonusKeys(62))
                                let ret = amt.times(100).plus(9900).pow(amt.sqrt().times(10))
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[62].effect
                                return "*" + format(eff) + " knowledge per key"
                        },
                        canClick(){
                                let data = player.k.lock.repeatables
                                if (data[62].gte(data[32])) return false
                                return player.k.lock.resources[12].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 62
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.lock.resources[id-50] = player.k.lock.resources[id-50].minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                63: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(10.8) + "'>Gold<br>Key</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let a = ""
                                let b 
                                let c 
                                let id = 63
                                if (player.k.points.max(10).log10().lt(1e9)) { 
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + "<br>"
                                }
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[62].gt(3) || hasUnlockedPast("l")
                        },
                        bases(){
                                return [Decimal.pow(10, 14575), Decimal.pow(10, 200)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[63].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[63].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[63].bases
                                let amt = player.k.lock.resources[13]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[63]
                                amt = amt.plus(layers.k.clickables.getBonusKeys(63))
                                let ret = amt.sqrt().div(100).plus(1).ln().times(40)
                                if (hasUpgrade("k", 45)) ret = ret.times(2)
                                
                                if (ret.gt(100)) ret = ret.log10().times(50)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[63].effect
                                return "-" + format(eff) + " effective <b>H</b> challenge completions"
                        },
                        canClick(){
                                let data = player.k.lock.repeatables
                                if (data[63].gte(data[33])) return false
                                return player.k.lock.resources[13].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 63
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.lock.resources[id-50] = player.k.lock.resources[id-50].minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                64: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(11.2) + "'>Coal<br>Key</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let a = ""
                                let b 
                                let c 
                                let id = 64
                                if (player.k.points.max(10).log10().lt(1e9)) { 
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + "<br>"
                                }
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[63].gt(3) || hasUnlockedPast("l")
                        },
                        bases(){
                                return [Decimal.pow(10, 15220), Decimal.pow(10, 300)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[64].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[64].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[64].bases
                                let amt = player.k.lock.resources[14]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[64]
                                amt = amt.plus(layers.k.clickables.getBonusKeys(64))
                                let ret = Decimal.sub(.99, amt.div(100).plus(1).pow(-1).times(.99))
                                if (hasUpgrade("l", 32)) ret = ret.sqrt()
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[64].effect
                                return "^" + format(eff, 4) + " Osmium Mine generation exp"
                        },
                        canClick(){
                                let data = player.k.lock.repeatables
                                if (data[64].gte(data[34])) return false
                                return player.k.lock.resources[14].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 64
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.lock.resources[id-50] = player.k.lock.resources[id-50].minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                65: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(11.6) + "'>Copper<br>Key</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let a = ""
                                let b 
                                let c 
                                let id = 65
                                if (player.k.points.max(10).log10().lt(1e9)) { 
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + "<br>"
                                }
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[64].gt(4) || hasUnlockedPast("l")
                        },
                        bases(){
                                return [Decimal.pow(10, 19110), Decimal.pow(10, 500)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[65].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[65].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[65].bases
                                let amt = player.k.lock.resources[15]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[65]
                                amt = amt.plus(layers.k.clickables.getBonusKeys(65))
                                let ret = amt.pow(1.7).div(100).plus(1).ln().times(250)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[65].effect
                                return "+" + format(eff) + " effective locks"
                        },
                        canClick(){
                                let data = player.k.lock.repeatables
                                if (data[65].gte(data[35])) return false
                                return player.k.lock.resources[15].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 65
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.lock.resources[id-50] = player.k.lock.resources[id-50].minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                71: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(12) + "'>Tin<br>Key</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let a = ""
                                let b 
                                let c 
                                let id = 71
                                if (player.k.points.max(10).log10().lt(1e9)) { 
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + "<br>"
                                }
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[65].gt(2) || hasUnlockedPast("l")
                        },
                        bases(){
                                return [Decimal.pow(10, 19430), Decimal.pow(10, 700)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[71].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[71].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[71].bases
                                let amt = player.k.lock.resources[21]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[71]
                                amt = amt.plus(layers.k.clickables.getBonusKeys(71))
                                let ret = amt.times(9).plus(1).pow(amt.sqrt())
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[71].effect
                                return "*" + format(eff) + " mine gain per Key"
                        },
                        canClick(){
                                let data = player.k.lock.repeatables
                                if (data[71].gte(data[41])) return false
                                return player.k.lock.resources[21].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 71
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.lock.resources[id-50] = player.k.lock.resources[id-50].minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                72: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(12.4) + "'>Titanium<br>Key</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let a = ""
                                let b 
                                let c 
                                let id = 72
                                if (player.k.points.max(10).log10().lt(1e9)) { 
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + "<br>"
                                }
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[71].gt(2) || hasUnlockedPast("l")
                        },
                        bases(){
                                return [Decimal.pow(10, 22130), Decimal.pow(10, 1100)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[72].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[72].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[72].bases
                                let amt = player.k.lock.resources[22]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[72]
                                amt = amt.plus(layers.k.clickables.getBonusKeys(72))
                                let ret = amt.div(10).plus(1).ln().times(4)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[72].effect
                                return "+" + format(eff) + " effective prior Keys"
                        },
                        canClick(){
                                let data = player.k.lock.repeatables
                                if (data[72].gte(data[42])) return false
                                return player.k.lock.resources[22].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 72
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.lock.resources[id-50] = player.k.lock.resources[id-50].minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                73: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(12.8) + "'>Tungsten<br>Key</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let a = ""
                                let b 
                                let c 
                                let id = 73
                                if (player.k.points.max(10).log10().lt(1e9)) { 
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + "<br>"
                                }
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[72].gt(1) || hasUnlockedPast("l")
                        },
                        bases(){
                                return [Decimal.pow(10, 21300), Decimal.pow(10, 300)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[73].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[73].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[73].bases
                                let amt = player.k.lock.resources[23]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[73]
                                amt = amt.plus(layers.k.clickables.getBonusKeys(73))
                                let ret = amt.pow(1.8).div(40).plus(1).ln().times(240).plus(1)
                                if (hasUpgrade("m", 15)) ret = ret.times(Decimal.pow(1.25, player.m.upgrades.length))
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[73].effect
                                return "*" + format(eff) + " <b>L</b> gain per Key"
                        },
                        canClick(){
                                let data = player.k.lock.repeatables
                                if (data[73].gte(data[43])) return false
                                return player.k.lock.resources[23].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 73
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.lock.resources[id-50] = player.k.lock.resources[id-50].minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                74: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(13.2) + "'>Aluminum<br>Key</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let a = ""
                                let b 
                                let c 
                                let id = 74
                                if (player.k.points.max(10).log10().lt(1e9)) { 
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + "<br>"
                                }
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[73].gt(4) || hasUnlockedPast("l")
                        },
                        bases(){
                                return [Decimal.pow(10, 21800), Decimal.pow(10, 3900)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[74].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[74].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[74].bases
                                let amt = player.k.lock.resources[24]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[74]
                                amt = amt.plus(layers.k.clickables.getBonusKeys(74))
                                let ret = amt.pow(2).plus(1).pow(7)
                                if (hasUpgrade("k", 54)) ret = ret.pow(Math.max(1, totalChallengeComps("k")))
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[74].effect
                                return "*" + format(eff) + " mine production per <b>H</b> challenge"
                        },
                        canClick(){
                                let data = player.k.lock.repeatables
                                if (data[74].gte(data[44])) return false
                                return player.k.lock.resources[24].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 74
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.lock.resources[id-50] = player.k.lock.resources[id-50].minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                75: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(13.6) + "'>Osmium<br>Key</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let a = ""
                                let b 
                                let c 
                                let id = 75
                                if (player.k.points.max(10).log10().lt(1e9)) { 
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + "<br>"
                                }
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                return a + c
                        },
                        unlocked(){
                                return player.k.lock.repeatables[74].gt(1) || hasUnlockedPast("l")
                        },
                        bases(){
                                return [Decimal.pow(10, 24500), Decimal.pow(10, 8195)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[75].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[75].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[75].bases
                                let amt = player.k.lock.resources[25]
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[75]
                                amt = amt.plus(layers.k.clickables.getBonusKeys(75))
                                let ret = amt.pow(1.5).div(100).plus(1).ln().times(50)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[75].effect
                                return "+" + format(eff) + " effective Locks per <b>H</b> challenge"
                        },
                        canClick(){
                                let data = player.k.lock.repeatables
                                if (data[75].gte(data[45])) return false
                                return player.k.lock.resources[25].gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 75
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.k.lock.resources[id-50] = player.k.lock.resources[id-50].minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                81: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(14) + "'>Basic<br>Key</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let a 
                                let b 
                                let c 
                                let id = 81
                                a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + "<br>"
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                return a + c
                        },
                        unlocked(){
                                return player.k.challenges[11] > 2 || hasUnlockedPast("l")
                        },
                        bases(){
                                return [Decimal.pow(10, 16347), Decimal.pow(10, 2319)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[81].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[81].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[81].bases
                                let amt = player.l.points
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[81]
                                amt = amt.plus(layers.k.clickables.getBonusKeys(81))
                                let ret = amt.pow(1.5).div(100).plus(1).ln().times(50).plus(1)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[81].effect
                                return "*" + format(eff) + " mine production per mine"
                        },
                        canClick(){
                                let data = player.k.lock.repeatables
                                if (data[81].gte(data[51])) return false
                                return player.l.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 81
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.l.points = player.l.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
                82: {
                        title(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                return "<h3 style='color: #" + getUndulatingColor(14.4) + "'>Diamond<br>Key</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let a 
                                let b 
                                let c 
                                let id = 82
                                let costbit = tmp.k.clickables[id].cost.lt("1e900") ? " Maps" : ""
                                a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[id].cost) + costbit + "<br>"
                                c = "<h3 style='color: #FF33CC'>Effect</h3>: (" + formatWhole(player.k.lock.repeatables[id]) +")<br>" + tmp.k.clickables[id].effectDescription + "<br>"
                                return a + c
                        },
                        unlocked(){
                                return hasMilestone("m", 4) || hasUnlockedPast("m")
                        },
                        bases(){
                                return [new Decimal(32), new Decimal(2)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[82].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[82].pow(2)))
                        },
                        getMaxPossible(){
                                let bases = tmp.k.clickables[82].bases
                                let amt = player.m.points
                                if (amt.lt(bases[0])) return new Decimal(0)
                                return amt.div(bases[0]).log(bases[1]).sqrt().floor().plus(1)
                        },
                        effect(){
                                let amt = player.k.lock.repeatables[82]
                                amt = amt.plus(layers.k.clickables.getBonusKeys(82))
                                let ret = amt.pow(1.5).div(100).plus(1).ln().times(20)
                                return ret
                        },
                        effectDescription(){
                                if (player.tab != "k") return ""
                                if (player.subtabs.k.mainTabs != "Lock") return ""
                                let eff = tmp.k.clickables[82].effect
                                return "+" + format(eff) + " effective prior Keys"
                        },
                        canClick(){
                                let data = player.k.lock.repeatables
                                if (data[82].gte(data[52])) return false
                                return player.m.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                let id = 82
                                if (!this.canClick()) return 
                                let maxPoss = tmp.k.clickables[id].getMaxPossible
                                cur = player.k.lock.repeatables[id]
                                if (maxPoss.lte(cur)) return 
                                let diff = maxPoss.sub(cur)
                                
                                let init = 1
                                if (hasMilestone("m", 4)) init *= 2
                                if (hasUpgrade("k", 52)) init *= 1000

                                diff = diff.min(init)
                                if (diff.lte(0)) return
                                
                                let cost = this.cost()
                                if (!nocost) player.m.points = player.m.points.minus(cost).max(0)
                                player.k.lock.repeatables[id] = player.k.lock.repeatables[id].plus(diff)
                        },
                },
        },
        challenges: {
                rows: 2,
                cols: 2,
                11: {
                        name: "Kiss",
                        challengeDescription: "All previous layer buyables have no effect",
                        rewardDescription: "Give free effective Keys [first two rows]",
                        rewardEffect(){
                                let c = challengeCompletions("k", 11)
                                let ret = Math.sqrt(c)
                                return ret
                        },
                        goal(){
                                let init = new Decimal(24.252)
                                let c = challengeCompletions("k", 11)

                                if (hasUpgrade("m", 13)) c -= tmp.m.upgrades[13].effect.toNumber()

                                c = Math.max(c, 0)
                                if (c > 5 && hasUpgrade("k", 52)) c = (c+5)/2
                                let factor = getChallengeFactor(c)
                                if (factor.eq(1)) factor = new Decimal(0)
                                let second = new Decimal(20580)
                                let base = new Decimal(c > 1 ? .1356 : 1)
                                let exp = second.pow(factor).times(base).times(init)
                                return Decimal.pow(10, exp.times(1e107))
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(75) || hasUnlockedPast("l")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let c = 20
                                if (hasUpgrade("l", 33)) c += player.l.upgrades.length * 2
                                
                                return c
                        },
                },
                12: {
                        name: "Kerry",
                        challengeDescription: "<b>Kiss</b> and remove <b>Japan</b> effect",
                        rewardDescription: "Multiply Lemon gain per Key",
                        rewardEffect(){
                                let c = challengeCompletions("k", 12)
                                c = new Decimal(c)
                                let ret = c.plus(9).pow(c.sqrt().times(6))
                                return ret
                        },
                        goal(){
                                let init = new Decimal(10.728)
                                let c = challengeCompletions("k", 12)
                                if (hasUpgrade("m", 13)) c -= tmp.m.upgrades[13].effect.toNumber()

                                c = Math.max(c, 0)
                                if (c > 5 && hasUpgrade("k", 52)) c = (c+5)/2
                                let factor = getChallengeFactor(c)
                                if (factor.eq(1)) factor = new Decimal(0)
                                let second = new Decimal(347.5)
                                let exp = second.pow(factor).times(init).times(Decimal.pow(Math.max(c,1), c + 4))
                                return Decimal.pow(10, exp.times(1e161))
                        },
                        unlocked(){
                                return hasUpgrade("l", 25) || hasUnlockedPast("l")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let c = 20
                                if (hasUpgrade("l", 33)) c += player.l.upgrades.length * 2
                                
                                return c
                        },
                        countsAs: [11],
                },
                21: {
                        name: "Keeps",
                        challengeDescription: "<b>Kerry</b> and remove <b>I</b> effect",
                        rewardDescription: "Add to <b>M</b> gain exponent and effective <b>Diamond Keys</b>",
                        rewardEffect(){
                                let c = challengeCompletions("k", 21)
                                ret = Math.sqrt(c)
                                return ret
                        },
                        goal(){
                                let init = new Decimal(868)
                                let c = challengeCompletions("k", 21)
                                let raw = c
                                if (hasUpgrade("m", 13)) c -= tmp.m.upgrades[13].effect.toNumber()

                                c = Math.max(c, 0)
                                if (c > 5 && hasUpgrade("k", 52)) c = (c+5)/2
                                let factor = getChallengeFactor(c)
                                if (factor.eq(1)) factor = new Decimal(0)
                                let second = new Decimal(4290)
                                let exp = second.pow(factor).times(init).times(Decimal.pow(raw+1, 125))
                                return Decimal.pow(10, exp.times(Decimal.pow(10, 386)))
                        },
                        unlocked(){
                                return hasUpgrade("k", 52) || hasUnlockedPast("m")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let c = 20
                                if (hasUpgrade("l", 33)) c += player.l.upgrades.length * 2
                                
                                return c
                        },
                        countsAs: [11, 12],
                },
                22: {
                        name: "Kenya",
                        challengeDescription: "<b>Keeps</b> and remove <b>K</b> effect",
                        rewardDescription: "Multiply base <b>M</b> gain",
                        rewardEffect(){
                                let c = challengeCompletions("k", 22)
                                c = Math.max(0, c-2)
                                ret = Decimal.pow(3, Math.pow(c, .8)) 
                                return ret
                        },
                        goal(){
                                let init = new Decimal(1)
                                let c = challengeCompletions("k", 22)
                                let raw = c
                                if (hasUpgrade("m", 13)) c -= tmp.m.upgrades[13].effect.toNumber()

                                c = Math.max(c, 0)
                                if (c > 5 && hasUpgrade("k", 52)) c = (c+5)/2
                                let factor = getChallengeFactor(c)
                                if (factor.eq(1)) factor = new Decimal(0)
                                let second = new Decimal(1e100)
                                let exp = second.pow(factor).times(init)
                                return Decimal.pow(10, exp.times(Decimal.pow(10, 4300)))
                        },
                        unlocked(){
                                return hasUpgrade("k", 55) || hasUnlockedPast("m")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let c = 20
                                if (hasUpgrade("l", 33)) c += player.l.upgrades.length * 2
                                
                                return c
                        },
                        countsAs: [11, 12, 21],
                },
        },
        shouldNotify(){
                for (id in tmp.k.clickables){
                        id = Number(id)
                        if (typeof id != "number") continue
                        if (isNaN(id)) continue

                        
                        if (hasMilestone("l", 3) && [11,12,13,14,15,21,22,23,24,25].includes(id)) continue
                        if (hasMilestone("l", 5) && [31,32,33,34,35,41,42,43,44,45].includes(id)) continue
                        if (hasUpgrade("k", 43) && [51,52,53,54,55].includes(id)) continue
                        if (hasMilestone("m", 2) && [61,62,63,64,65,71,72,73,74,75,81].includes(id)) continue

                        if (tmp.k.clickables[id].canClick && tmp.k.clickables[id].unlocked){
                                return true
                        }
                }
                return false
        },
        tabFormat: {
                "Upgrades": {
                        content: [
                                "main-display",
                                ["prestige-button", "", function (){ return hasMilestone("k", 5) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "k") return ""
                                                if (player.subtabs.k.mainTabs != "Upgrades") return ""
                                                return shiftDown ? "Your best Keys is " + format(player.k.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "k") return ""
                                                if (player.subtabs.k.mainTabs != "Upgrades") return ""
                                                if (hasUnlockedPast("k")) return ""
                                                return "You have done " + formatWhole(player.k.times) + " Key resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "k") return ""
                                                if (player.subtabs.k.mainTabs != "Upgrades") return ""
                                                if (hasMilestone("k", 5)) return "You are gaining " + format(tmp.k.getResetGain) + " Keys per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.k.time)) + ")" 
                                        },
                                ],
                                "blank", 
                                ["upgrades", [1,5]]
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return false
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                "milestones",
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Lock": {
                        content: [
                                "main-display",
                                ["display-text", function(){
                                        if (player.tab != "k") return ""
                                        if (player.subtabs.k.mainTabs != "Lock") return ""
                                        return hasMilestone("k", 5) ? "You are gaining " + format(tmp.k.getResetGain) + " Keys per second and hold shift to see costs" : ""
                                }],
                                ["clickables", [1,2]], //mines
                                "blank", 
                                ["display-text", function(){
                                        if (player.tab != "k") return ""
                                        if (player.subtabs.k.mainTabs != "Lock") return ""
                                        if (player.k.points.max(10).log10().gt(1e9)) return ""
                                        let data1 = player.k.lock.resources
                                        let a = "You have <bdi style='color: #" + getUndulatingColor(0) + "'>" + format(data1[11]) + " Iron</bdi>"
                                        let b = ", <bdi style='color: #" + getUndulatingColor(0.4) + "'>" + format(data1[12]) + " Silver</bdi>"
                                        let c = ", <bdi style='color: #" + getUndulatingColor(0.8) + "'>" + format(data1[13]) + " Gold</bdi>,<br>"
                                        let d = "<bdi style='color: #" + getUndulatingColor(1.2) + "'>" + format(data1[14]) + " Coal</bdi>"
                                        let e = ", <bdi style='color: #" + getUndulatingColor(1.6) + "'>" + format(data1[15]) + " Copper</bdi>"
                                        let f = ", <bdi style='color: #" + getUndulatingColor(2) + "'>" + format(data1[21]) + " Tin</bdi>,<br>"
                                        let g = "<bdi style='color: #" + getUndulatingColor(2.4) + "'>" + format(data1[22]) + " Titanium</bdi>"
                                        let h = ", <bdi style='color: #" + getUndulatingColor(2.8) + "'>" + format(data1[23]) + " Tungsten</bdi>"
                                        let i = ", <bdi style='color: #" + getUndulatingColor(3.2) + "'>" + format(data1[24]) + " Aluminum</bdi><br>"
                                        let j = " and, <bdi style='color: #" + getUndulatingColor(3.6) + "'>" + format(data1[25]) + " Osmium</bdi>."
                                        let amts = a + b + c + d + e + f + g + h + i + j + "<br>"
                                        let k = "You get " + tmp.k.clickables[11].effectDescription + ", "
                                        let l = tmp.k.clickables[12].effectDescription + ", "
                                        let m = tmp.k.clickables[13].effectDescription + ",<br>"
                                        let n = tmp.k.clickables[14].effectDescription + ", "
                                        let o = tmp.k.clickables[15].effectDescription + ", "
                                        let p = tmp.k.clickables[21].effectDescription + ",<br>"
                                        let q = tmp.k.clickables[22].effectDescription + ", "
                                        let r = tmp.k.clickables[23].effectDescription + ", "
                                        let s = tmp.k.clickables[24].effectDescription + " and,<br>"
                                        let t = tmp.k.clickables[25].effectDescription + " due to your metals.<br>"
                                        let effs = k + l + m + n + o + p + q + r + s + t
                                        return amts + effs
                                }],
                                ["clickables", [3,5]], //locks
                                ["display-text", function(){
                                        if (!hasUpgrade("k", 43) && !hasUnlockedPast("l")) return ""
                                        if (player.tab != "k") return ""
                                        if (player.subtabs.k.mainTabs != "Lock") return ""
                                        let a = "Keys require having enough Locks unlocked."
                                        let b = "They do not cause you to lose lock effects, and give additional effects."
                                        let c = "The first ten keys cost their own resources<br>while the last five cost higher and higher layers' resources."
                                        return a + "<br>" + b + "<br>" + c
                                }],
                                ["clickables", [6,8]], //keys
                        ],
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(61) || hasUnlockedPast("k")
                        },
                },
                "Challenges": {
                        content: [
                                ["display-text",
                                        function() {
                                                if (player.tab != "k") return ""
                                                if (player.subtabs.k.mainTabs != "Challenges") return ""
                                                return "Challenge completions are not reset unless said so, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "k") return ""
                                                if (player.subtabs.k.mainTabs != "Challenges") return ""
                                                return "You have completed " + formatWhole(totalChallengeComps("k")) + " Key Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(75) || hasUnlockedPast("l")
                        },
                },
        },
        doReset(layer){
                let data = player.k
                if (layer == "k") data.time = 0
                if (!getsReset("k", layer)) return
                data.time = 0
                data.times = 0

                if (!hasMilestone("l", 6)) {
                        //upgrades
                        let keep = []
                        data.upgrades = filter(data.upgrades, keep)
                }
                
                if (!hasMilestone("m", 1)) {
                        //milestones
                        let keep2 = []
                        x = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", 
                             "11", "12", "13", "14"]
                        for (i = 0; i < player.l.times * 2; i++){
                                if (!hasMilestone("l", 1)) continue
                                keep2.push(x[i])
                        }
                        data.milestones = filter(data.milestones, keep2)
                }


                //resources
                data.points = new Decimal(0)
                data.total = new Decimal(0)
                data.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        break //remove when buyables added
                        data.buyables[resetBuyables[j]] = new Decimal(0)
                }

                let data2 = data.lock

                data2.mines = {
                        11: new Decimal(0),
                        12: new Decimal(0),
                        13: new Decimal(0),
                        14: new Decimal(0),
                        15: new Decimal(0),
                        21: new Decimal(0),
                        22: new Decimal(0),
                        23: new Decimal(0),
                        24: new Decimal(0),
                        25: new Decimal(0),
                }
                data2.resources = {
                        11: new Decimal(0),
                        12: new Decimal(0),
                        13: new Decimal(0),
                        14: new Decimal(0),
                        15: new Decimal(0),
                        21: new Decimal(0),
                        22: new Decimal(0),
                        23: new Decimal(0),
                        24: new Decimal(0),
                        25: new Decimal(0),
                },
                data2.repeatables = {
                        11: new Decimal(0),
                        12: new Decimal(0),
                        13: new Decimal(0),
                        14: new Decimal(0),
                        15: new Decimal(0),
                        21: new Decimal(0),
                        22: new Decimal(0),
                        23: new Decimal(0),
                        24: new Decimal(0),
                        25: new Decimal(0),
                        31: new Decimal(0),
                        32: new Decimal(0),
                        33: new Decimal(0),
                        34: new Decimal(0),
                        35: new Decimal(0),
                        41: new Decimal(0),
                        42: new Decimal(0),
                        43: new Decimal(0),
                        44: new Decimal(0),
                        45: new Decimal(0),
                        51: new Decimal(0),
                        52: new Decimal(0),
                        53: new Decimal(0),
                        54: new Decimal(0),
                        55: new Decimal(0),
                        61: new Decimal(0),
                        62: new Decimal(0),
                        63: new Decimal(0),
                        64: new Decimal(0),
                        65: new Decimal(0),
                        71: new Decimal(0),
                        72: new Decimal(0),
                        73: new Decimal(0),
                        74: new Decimal(0),
                        75: new Decimal(0),
                        81: new Decimal(0),
                        82: data2.repeatables[82],
                        83: data2.repeatables[83],
                        84: data2.repeatables[84],
                        85: data2.repeatables[85],
                }
        },
})

addLayer("l", {
        name: "Lemons",
        symbol: "L",
        position: 0,
        startData() { 
                return {
                        unlocked: true,
                        points: new Decimal(0),
                        best: new Decimal(0),
                        total: new Decimal(0),
                        abtime: 0,
                        time: 0,
                        times: 0,
                        autotimes: 0,
                        autodevtime: 0,
                } //no comma here
        },
        color: "#00CC33",
        branches: ["k"],
        requires: new Decimal(0),
        resource: "Lemons",
        baseResource: "Keys",
        baseAmount() {
                return player.k.best
        },
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("l")
        },
        getBaseDiv(){
                let x = new Decimal("1e1904")
                return x
        },
        getGainExp(){
                let x = new Decimal(3)
                if (hasMilestone("l", 8)) x = x.plus(.2 * player.l.milestones.length)
                if (hasUpgrade("j", 51)) x = x.plus(.01 * Math.max(0, totalChallengeComps("h") - 150))
                if (hasUpgrade("j", 54)) x = x.plus(.04 * player.j.upgrades.length)
                x = x.plus(tmp.k.clickables[55].effect)
                if (hasUpgrade("l", 25)) x = x.plus(5 * totalChallengeComps("k"))
                if (hasUpgrade("l", 31)) x = x.plus(tmp.k.clickables[65].effect)
                return x
        },
        getGainMultPre(){
                let x = Decimal.pow(150, -1)
                if (hasUpgrade("j", 52)) x = x.times(Decimal.pow(1.25, player.l.upgrades.length))
                if (hasUpgrade("l", 22)) x = x.times(1.5)
                if (hasUpgrade("l", 31)) x = x.times(tmp.k.clickables[71].effect)
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("l")

                x = x.times(Decimal.pow(tmp.k.clickables[51].effect, tmp.k.clickables.totalMines))
                x = x.times(Decimal.pow(tmp.k.clickables[52].effect, tmp.k.clickables.totalLocks))
                if (hasUpgrade("l", 23)) x = x.times(tmp.h.challenges[21].rewardEffect)
                if (hasUpgrade("k", 41)) x = x.times(Decimal.pow(4, totalChallengeComps("h") - 170).max(1))
                x = x.times(Decimal.pow(tmp.k.clickables[73].effect, tmp.k.clickables.totalKeys))
                x = x.times(Decimal.pow(tmp.k.challenges[12].rewardEffect, tmp.k.clickables.totalKeys))

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("l")) return new Decimal(1)

                let amt = player.l.best

                let exp = player.l.best.pow(.2).times(3).min(225)
                
                let exp2 = amt.div(2).cbrt().times(4).min(25)

                let ret = amt.times(9).plus(1).pow(exp)

                let ret2 = amt.pow(exp2).max(1)

                return ret.times(ret2)
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("l")
        },
        update(diff){
                let data = player.l

                data.best = data.best.max(data.points)
                if (hasMilestone("k", 15)) {
                        let gain = tmp.l.getResetGain
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
                        handleGeneralizedBuyableAutobuy(diff, "l")
                } else {
                        data.abtime = 0
                }

                data.time += diff
                data.autodevtime += diff
                
                if (data.autodevtime < 1) return
                data.autodevtime += -1
                if (data.autodevtime > 10) data.autodevtime = 10
                if (hasUpgrade("l", 33)) completeMaxPossibleChallenges("h")
        },
        row: 11, 
        hotkeys: [
                {key: "l", description: "L: Reset for Lemons", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+L", description: "Shift+L: Go to Lemons", onPress(){
                                showTab("l")
                        }
                },
        ],
        layerShown(){return player.k.best.gt("1e2050") || player.l.best.gt(0) || hasUnlockedPast("l")},
        prestigeButtonText(){
                if (hasMilestone("k", 15)) return ""
                return getGeneralizedPrestigeButtonText("l")
        },
        canReset(){
                return player.l.time >= 2 && !hasMilestone("k", 15) && tmp.l.getResetGain.gt(0)
        },
        milestones: {
                1: {
                        requirementDescription: "<b>Like</b><br>Requires: 1 Lemon", 
                        effectDescription: "Per <b>L</b> reset you keep two <b>K</b> milestones",
                        done(){
                                return player.l.points.gte(1)
                        },
                        unlocked(){
                                return true || hasUnlockedPast("l")
                        }, // hasMilestone("l", 1)
                },
                2: {
                        requirementDescription: "<b>List</b><br>Requires: 2 Lemons", 
                        effectDescription: "Keep Puzzle upgrades upon reset and each milestone adds .1 to the <b>K</b> gain exponent",
                        done(){
                                return player.l.points.gte(2)
                        },
                        unlocked(){
                                return hasMilestone("l", 1) || hasUnlockedPast("l")
                        }, // hasMilestone("l", 2)
                },
                3: {
                        requirementDescription: "<b>Last</b><br>Requires: 3 Lemons", 
                        effectDescription: "Unlock an autobuyer that buys each mine once per second and each milestone gives 4x metal gain",
                        done(){
                                return player.l.points.gte(3)
                        },
                        unlocked(){
                                return hasMilestone("l", 2) || hasUnlockedPast("l")
                        }, // hasMilestone("l", 3)
                        toggles: [["l", "autobuyMines"]],
                },
                4: {
                        requirementDescription: "<b>Links</b><br>Requires: 5 Lemons", 
                        effectDescription: "Keep <b>J</b> upgrades and raise <b>Iron Lock</b> base ^1.01 per milestone",
                        done(){
                                return player.l.points.gte(5)
                        },
                        unlocked(){
                                return hasMilestone("l", 3) || hasUnlockedPast("l")
                        }, // hasMilestone("l", 4)
                },
                5: {
                        requirementDescription: "<b>Life</b><br>Requires: 7 Lemons", 
                        effectDescription: "Keep reset<sup>2</sup> times and unlock a autobuyer for the first two rows of locks",
                        done(){
                                return player.l.points.gte(7)
                        },
                        unlocked(){
                                return hasMilestone("l", 4) || hasUnlockedPast("l")
                        }, // hasMilestone("l", 5)
                        toggles: [["l", "autobuyLocks12"]],
                },
                6: {
                        requirementDescription: "<b>Line</b><br>Requires: 11 Lemons", 
                        effectDescription: "Keep <b>K</b> upgrades and multiply <b>Gold Lock</b> effect by 1.2",
                        done(){
                                return player.l.points.gte(11)
                        },
                        unlocked(){
                                return hasMilestone("l", 5) || hasUnlockedPast("l")
                        }, // hasMilestone("l", 6)
                },
                7: {
                        requirementDescription: "<b>Local</b><br>Requires: 15 Lemons", 
                        effectDescription: "You start with 98% of your best puzzle completions over all time and unlock an <b>I</b> buyable",
                        done(){
                                return player.l.points.gte(15)
                        },
                        unlocked(){
                                return hasMilestone("l", 6) || hasUnlockedPast("l")
                        },  // hasMilestone("l", 7)
                },
                8: {
                        requirementDescription: "<b>Long</b><br>Requires: 50 Lemons", 
                        effectDescription: "Each milestone adds .2 to the <b>L</b> gain exponent and <b>K</b> gain exponent",
                        done(){
                                return player.l.points.gte(50)
                        },
                        unlocked(){
                                return hasMilestone("l", 7) || hasUnlockedPast("l")
                        },  // hasMilestone("l", 8)
                },
                9: {
                        requirementDescription: "<b>Link</b><br>Requires: 1000 Lemons", 
                        effectDescription: "Lock content autobuyers are three times as fast and square Tungsten effect",
                        done(){
                                return player.l.points.gte(1000)
                        },
                        unlocked(){
                                return hasMilestone("l", 8) || hasUnlockedPast("l")
                        },  // hasMilestone("l", 9)
                },
                10: {
                        requirementDescription: "<b>Law</b><br>Requires: 1e8 Lemons", 
                        effectDescription: "Each <b>H</b> challenge multiples mine production by [<b>H</b> challenges]/100 (at least 1)",
                        done(){
                                return player.l.points.gte(1e8)
                        },
                        unlocked(){
                                return hasMilestone("l", 9) || hasUnlockedPast("l")
                        },  // hasMilestone("l", 10)
                },
                11: {
                        requirementDescription: "<b>Live</b><br>Requires: 1e30,000 Lemons", 
                        effectDescription: "You buy 1000x Bulk Amount, autobuy the last row of puzzle upgrades, and you can complete one more <b>H</b> challenge per milestone",
                        done(){
                                return player.l.points.max(10).log10().gt(3e4)
                        },
                        unlocked(){
                                return hasMilestone("l", 10) || hasUnlockedPast("l")
                        },  // hasMilestone("l", 11)
                },
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Location",
                        description: "Unlock an <b>I</b> buyable and a new row of <b>Locks</b>",
                        cost: new Decimal(2e9),
                        unlocked(){
                                return hasMilestone("l", 10) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("l", 11)
                12: {
                        title: "Level",
                        description: "<b>Housing</b> effects mine gain and multiply <b>Titanium Lock</b> effect by the number of upgrades squared",
                        cost: new Decimal(1.5e11),
                        unlocked(){
                                return hasUpgrade("l", 11) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("l", 12)
                13: {
                        title: "Love",
                        description: "Unlock another <b>Lock</b> and raise <b>Tin Lock</b> effect to the 1.3",
                        cost: new Decimal(2e11),
                        unlocked(){
                                return hasUpgrade("l", 12) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("l", 13)
                14: {
                        title: "Listing",
                        description: "Raise <b>Tungsten</b> effect to the number of <b>Diamond Locks</b>",
                        cost: new Decimal(2e19),
                        unlocked(){
                                return hasUpgrade("l", 13) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("l", 14)
                15: {
                        title: "Little",
                        description: "Unlock the final Lock and each <b>Master Lock</b> squares point gain",
                        cost: new Decimal(5e165),
                        unlocked(){
                                return hasUpgrade("k", 35) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("l", 15)
                21: {
                        title: "Low",
                        description: "Raise <b>Hour</b> effect to the number of locks (at least 1) and per upgrade in this row unlock a <b>J</b> buyable",
                        cost: new Decimal(1e227),
                        unlocked(){
                                return hasUpgrade("l", 15) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("l", 21)
                22: {
                        title: "Learn",
                        description: "Unlock a <b>J</b> buyable autobuyer and an <b>I</b> buyable and multiply base <b>L</b> gain by 1.5",
                        cost: new Decimal(2e292),
                        unlocked(){
                                return hasUpgrade("l", 21) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("l", 22)
                23: {
                        title: "Look",
                        description: "<b>Housing</b> effects <b>L</b> gain and you buy 10x puzzle buyables",
                        cost: new Decimal("1e350"),
                        unlocked(){
                                return hasUpgrade("l", 22) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("l", 23)
                24: {
                        title: "Left",
                        description: "<b>Hi</b> effects <b>Improve</b> and unlock the last <b>I</b> buyable",
                        cost: new Decimal("1e512"),
                        unlocked(){
                                return hasUpgrade("l", 23) || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("l", 24)
                25: {
                        title: "Large",
                        description: "Unlock a <b>K</b> challenge and each <b>K</b> challenge completion adds 5 to the <b>L</b> gain exponent",
                        cost: new Decimal("1e31827"),
                        unlocked(){
                                return player.k.challenges[11] >= 5 || hasUnlockedPast("l")
                        }
                }, // hasUpgrade("l", 25)
                31: {
                        title: "Library",
                        description: "<b>Kiss</b> effects <b>Diamond Key</b>, <b>Copper Key</b> effects <b>L</b> gain exponent, and <b>Tin Key</b> effects base <b>L</b> gain",
                        cost: new Decimal("1e65e5"),
                        unlocked(){
                                return hasUpgrade("k", 55) || hasUnlockedPast("m")
                        }
                }, // hasUpgrade("l", 31)
                32: {
                        title: "Looking",
                        description: "<b>Kerry</b> effects <b>M</b>, square root <b>Coal Key</b> effect, and unlock 3 <b>J</b> buyables",
                        cost: new Decimal("1e77e5"),
                        unlocked(){
                                return hasUpgrade("l", 31) || hasUnlockedPast("m")
                        }
                }, // hasUpgrade("l", 32)
                33: {
                        title: "Less",
                        description: "You can complete 2 more <b>K</b> and <b>H</b> challenges per upgrade and you automatically complete <b>H</b> challenges",
                        cost: new Decimal("1e48e6"),
                        unlocked(){
                                return hasUpgrade("l", 32) || hasUnlockedPast("m")
                        }
                }, // hasUpgrade("l", 33)

                /*
                Less
                Login
                Let
                Legal
                Language
                Latest
                Light
                London
                Listed
                */
        },
        tabFormat: {
                "Upgrades": {
                        content: [
                                "main-display",
                                ["prestige-button", "", function (){ return hasMilestone("k", 15) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "l") return ""
                                                if (player.subtabs.l.mainTabs != "Upgrades") return ""
                                                return shiftDown ? "Your best Lemons is " + format(player.l.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "l") return ""
                                                if (player.subtabs.l.mainTabs != "Upgrades") return ""
                                                if (hasUnlockedPast("l")) return ""
                                                return "You have done " + formatWhole(player.l.times) + " Lemons resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "l") return ""
                                                if (player.subtabs.l.mainTabs != "Upgrades") return ""
                                                if (hasMilestone("k", 15)) return "You are gaining " + format(tmp.l.getResetGain) + " Lemons per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.l.time)) + ")" 
                                        },
                                ],
                                "blank", 
                                ["upgrades", [1,5]]
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return false
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                "milestones",
                        ],
                        unlocked(){
                                return true
                        },
                },
        },
        doReset(layer){
                let data = player.l
                if (layer == "l") data.time = 0
                if (!getsReset("l", layer)) return
                data.time = 0
                data.times = 0

                if (!hasMilestone("m", 3)) {
                        //upgrades
                        let keep = []
                        data.upgrades = filter(data.upgrades, keep)
                }
                
                if (!false) {
                        //milestones
                        let keep2 = []
                        if (hasMilestone("m", 1)) {
                                let possible = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]
                                for (i = 0; i < player.m.times; i++){
                                        keep2 = keep2.concat(possible.slice(i*3, i*3 + 3))
                                        if (possible.length < i * 3 + 3) break
                                }
                        }
                        data.milestones = filter(data.milestones, keep2)
                }


                //resources
                data.points = new Decimal(0)
                data.total = new Decimal(0)
                data.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        break //remove when buyables added
                        data.buyables[resetBuyables[j]] = new Decimal(0)
                }
        },
})

addLayer("m", {
        name: "Maps",
        symbol: "M",
        position: 0,
        startData() { 
                return {
                        unlocked: true,
                        points: new Decimal(0),
                        best: new Decimal(0),
                        total: new Decimal(0),
                        abtime: 0,
                        time: 0,
                        times: 0,
                        autotimes: 0,
                        autodevtime: 0,
                } //no comma here
        },
        color: "#FFDFA7",
        branches: ["l"],
        requires: new Decimal(0),
        resource: "Maps",
        baseResource: "Lemons",
        baseAmount() {
                return player.l.best
        },
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("m")
        },
        getBaseDiv(){
                let x = new Decimal("1e44546")
                return x
        },
        getGainExp(){
                let x = new Decimal(3)
                if (hasUpgrade("m", 13)) x = x.plus(tmp.m.upgrades[13].effect)
                x = x.plus(tmp.k.challenges[21].rewardEffect)
                if (hasUpgrade("k", 54)) x = x.plus(1)
                return x
        },
        getGainMultPre(){
                let x = Decimal.pow(1000, -1)

                x = x.times(tmp.k.challenges[22].rewardEffect)

                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("m")

                if (hasMilestone("m", 5)) x = x.times(3)
                if (hasUpgrade("m", 12)) {
                        let c = totalChallengeComps("k")
                        x = x.times(Decimal.pow(c/8, c).max(1))
                }
                if (hasUpgrade("m", 14)) x = x.times(Decimal.pow(1.01, totalChallengeComps("k") ** 2))
                if (hasUpgrade("m", 15)) x = x.times(Decimal.pow(2, totalChallengeComps("k")))
                if (hasUpgrade("k", 53)) x = x.times(tmp.k.clickables[73].effect)
                if (hasUpgrade("l", 32)) x = x.times(tmp.k.challenges[12].rewardEffect)

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("m")) return new Decimal(1)

                let amt = player.m.best

                let exp = player.m.best.pow(.2).times(3).min(450)
                
                let exp2 = amt.div(2).cbrt().times(5).min(50)

                let ret = amt.times(24).plus(1).pow(exp)

                let ret2 = amt.pow(exp2).max(1)

                return ret.times(ret2)
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("m")
        },
        update(diff){
                let data = player.m

                data.best = data.best.max(data.points)
                if (hasMilestone("m", 5)) {
                        let gain = tmp.m.getResetGain
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
                        handleGeneralizedBuyableAutobuy(diff, "m")
                } else {
                        data.abtime = 0
                }

                data.time += diff
                data.autodevtime += diff
                
                if (data.autodevtime < 1) return
                data.autodevtime += -1
                if (data.autodevtime > 10) data.autodevtime = 10
        },
        row: 12, 
        hotkeys: [
                {key: "m", description: "M: Reset for Maps", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+M", description: "Shift+M: Go to Maps", onPress(){
                                showTab("m")
                        }
                },
        ],
        layerShown(){return player.l.best.gt("1e45546") || player.m.best.gt(0) || hasUnlockedPast("m")},
        prestigeButtonText(){
                if (hasMilestone("m", 5)) return ""
                return getGeneralizedPrestigeButtonText("m")
        },
        canReset(){
                return player.m.time >= 2 && !hasMilestone("m", 5) && tmp.m.getResetGain.gt(0)
        },
        milestones: {
                //2^^n
                1: {
                        requirementDescription: "<b>My</b><br>Requires: 1 Map", 
                        effectDescription: "Per <b>M</b> reset you keep three <b>L</b> milestones and keep <b>K</b> milestones",
                        done(){
                                return player.m.points.gte(1)
                        },
                        unlocked(){
                                return true || hasUnlockedPast("m")
                        }, // hasMilestone("m", 1)
                },
                2: {
                        requirementDescription: "<b>May</b><br>Requires: 2 Maps", 
                        effectDescription: "All prior Lock feature autobuyers bulk 10x more and unlock a Key autobuyer for the first eleven Keys",
                        done(){
                                return player.m.points.gte(2)
                        },
                        unlocked(){
                                return hasMilestone("m", 1) || hasUnlockedPast("m")
                        }, // hasMilestone("m", 2)
                },
                3: {
                        requirementDescription: "<b>Me</b><br>Requires: 4 Maps", 
                        effectDescription: "Keep <b>L</b> upgrades and get an effective <b>Titanium Key</b>",
                        done(){
                                return player.m.points.gte(4)
                        },
                        unlocked(){
                                return hasMilestone("m", 2) || hasUnlockedPast("m")
                        }, // hasMilestone("m", 3)
                },
                4: {
                        requirementDescription: "<b>Most</b><br>Requires: 16 Maps", 
                        effectDescription: "Buy 2x more lock features, get an effective <b>Tin Key</b> per milestone, and unlock a key",
                        done(){
                                return player.m.points.gte(16)
                        },
                        unlocked(){
                                return hasMilestone("m", 3) || hasUnlockedPast("m")
                        }, // hasMilestone("m", 4)
                },
                5: {
                        requirementDescription: "<b>Make</b><br>Requires: 65,536 Maps", 
                        effectDescription: "Remove the ability to prestige, but gain 100% of Maps upon reset per second and triple Maps gain",
                        done(){
                                return player.m.points.gte(65536)
                        },
                        unlocked(){
                                return hasMilestone("m", 4) || hasUnlockedPast("m")
                        }, // hasMilestone("m", 5)
                },
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Music",
                        description: "Lock autobuyers are 3x faster and each upgrade gives a free <b>Osmium Key</b>",
                        cost: new Decimal(2e4),
                        unlocked(){
                                return hasMilestone("m", 4) || hasUnlockedPast("m")
                        }
                }, // hasUpgrade("m", 11)
                12: {
                        title: "Message",
                        description: "Per <b>K</b> challenge multiply <b>M</b> gain by the number of <b>K</b> challenges completed/8 [min 1] and you buy 20x Larger Puzzle",
                        cost: new Decimal(5e6),
                        unlocked(){
                                return hasMilestone("m", 5) || hasUnlockedPast("m")
                        }
                }, // hasUpgrade("m", 12)
                13: {
                        title: "Many",
                        description: "ln(ln([Diamond Keys])) subtracts <b>K</b> and <b>H</b> completions and adds to <b>M</b> gain exponent",
                        cost: new Decimal(15e8),
                        effect(){
                                return player.k.lock.repeatables[82].max(Math.E).ln().ln()
                        },
                        unlocked(){
                                return hasUpgrade("m", 12) || hasUnlockedPast("m")
                        }
                }, // hasUpgrade("m", 13)
                14: {
                        title: "Mail",
                        description: "<b>Kiss</b> effects <b>Basic Key</b> and per <b>K</b> challenge completion squared multiply <b>M</b> gain by 1.01",
                        cost: new Decimal(5e11),
                        unlocked(){
                                return hasUpgrade("m", 13) || hasUnlockedPast("m")
                        }
                }, // hasUpgrade("m", 14)
                15: {
                        title: "Map",
                        description: "Per upgrade multiply <b>Tungsten Key</b> effect by 1.25 and each <b>K</b> challenge gives a free <b>Coal Key</b> and doubles <b>M</b> gain",
                        cost: new Decimal(2e13),
                        unlocked(){
                                return hasUpgrade("m", 14) || hasUnlockedPast("m")
                        }
                }, // hasUpgrade("m", 15)
        

                /*
                Management
                Must
                Made
                */
        },
        tabFormat: {
                "Upgrades": {
                        content: [
                                "main-display",
                                ["prestige-button", "", function (){ return hasMilestone("m", 5) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "m") return ""
                                                if (player.subtabs.m.mainTabs != "Upgrades") return ""
                                                return shiftDown ? "Your best Maps is " + format(player.m.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "m") return ""
                                                if (player.subtabs.m.mainTabs != "Upgrades") return ""
                                                if (hasUnlockedPast("l")) return ""
                                                return "You have done " + formatWhole(player.m.times) + " Maps resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "m") return ""
                                                if (player.subtabs.m.mainTabs != "Upgrades") return ""
                                                if (hasMilestone("m", 5)) return "You are gaining " + format(tmp.m.getResetGain) + " Maps per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.m.time)) + ")" 
                                        },
                                ],
                                "blank", 
                                ["upgrades", [1,5]]
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return false
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                "milestones",
                        ],
                        unlocked(){
                                return true
                        },
                },
        },
        doReset(layer){
                let data = player.m
                if (layer == "m") data.time = 0
                if (!getsReset("m", layer)) return
                data.time = 0
                data.times = 0

                if (!false) {
                        //upgrades
                        let keep = []
                        data.upgrades = filter(data.upgrades, keep)
                }
                
                if (!false) {
                        //milestones
                        let keep2 = []
                        data.milestones = filter(data.milestones, keep2)
                }


                //resources
                data.points = new Decimal(0)
                data.total = new Decimal(0)
                data.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        break //remove when buyables added
                        data.buyables[resetBuyables[j]] = new Decimal(0)
                }
        },
})


/*
Idea: You are given a map with 3 points on it
You are trying to find a path between them that is "pretty good" 
By this you need to get the path that is within [factor based on time] of the optimal path
You can unlock various algorithms:
1. Random--try ranodm duh lol
2. Random instead we swap a pair adj
3. Random but we swap pair leq given distance [init 4]
4. Random but we flip leq given distance pair [init 4]

You can unlock each of the 4 algorithms (you start with 1 unlocked)
You can also up the simulations per second (default 1/s & each upgrade + .1/s)
You can upgrade algs 3/4
You can increase the time factor
You can prestige to +1 points 
Prestiging is what gives the big bucks 



*/
