const PLAYERDATA = require('../modules/player.js');
const config = require('../App/config.json');
const mongoose = require('mongoose');
const CONFIGITEM = require('../config/stuff.json')

mongoose
   .connect(config.mongodb, {})
   .then(() => console.log(`MongoDB Ready`));
   async function run() {

    try {

        let playerStats = await PLAYERDATA.findOne({ userId: "1225830013656371241" });
        for (let slotItem = 1; slotItem <= 5; slotItem++) {
            let slotName = `slot${slotItem}`;
            if (playerStats.player.slotItem[slotName] !== -1) {
                addItemBackToInventory(playerStats.player.slotItem[slotName]);
                let itemLvl = itemLevel(slotDisplay(playerStats.player.slotItem[slotName])[1]);
                removeStatsPlayers(slotDisplay(playerStats.player.slotItem[slotName])[1], itemLvl);
                playerStats.player.slotItem[slotName] = -1;
            }
        }
        await playerStats.save();
        
        function slotDisplay(slotID){
                    if(slotID == -1) return ['no item', -1]
                    else {
                        for(let pas = 0; pas < CONFIGITEM.length; pas++){
                            if(slotID == CONFIGITEM[pas].id) return [CONFIGITEM[pas].name, CONFIGITEM[pas].id]
                        }
                        return ['no item', -1]
                    };
                };

                function itemLevel(itemInputID){
                    for(const itemPlayerAll of playerStats.player.stuff.stuffUnlock){
                        if(itemPlayerAll.id == itemInputID) return itemPlayerAll.level
                    }
                    return 0
                };

                function removeStatsPlayers(idItem, levelItem){
                    for(let pas = 0; pas < CONFIGITEM.length; pas++){
                        if(CONFIGITEM[pas].id == idItem){
                            if(levelItem == 1){
                                playerStats.player.attack -= CONFIGITEM[pas].levelAttack.level1
                                playerStats.player.defense -= CONFIGITEM[pas].levelDefense.level1
                                playerStats.player.dodge -= CONFIGITEM[pas].levelDodge.level1
                                playerStats.player.crit -= CONFIGITEM[pas].levelCrit.level1
                                playerStats.player.penetration -= CONFIGITEM[pas].levelPenetration.level1
                                playerStats.player.lifeSteal -= CONFIGITEM[pas].levelLifeSteal.level1
                                playerStats.player.health -= CONFIGITEM[pas].levelHealth.level1
                            };
                            if(levelItem == 2){
                                playerStats.player.attack -= CONFIGITEM[pas].levelAttack.level2
                                playerStats.player.defense -= CONFIGITEM[pas].levelDefense.level2
                                playerStats.player.dodge -= CONFIGITEM[pas].levelDodge.level2
                                playerStats.player.crit -= CONFIGITEM[pas].levelCrit.level2
                                playerStats.player.penetration -= CONFIGITEM[pas].levelPenetration.level2
                                playerStats.player.lifeSteal -= CONFIGITEM[pas].levelLifeSteal.level2
                                playerStats.player.health -= CONFIGITEM[pas].levelHealth.level2
                            };
                            if(levelItem == 3){
                                playerStats.player.attack -= CONFIGITEM[pas].levelAttack.level3
                                playerStats.player.defense -= CONFIGITEM[pas].levelDefense.level3
                                playerStats.player.dodge -= CONFIGITEM[pas].levelDodge.level3
                                playerStats.player.crit -= CONFIGITEM[pas].levelCrit.level3
                                playerStats.player.penetration -= CONFIGITEM[pas].levelPenetration.level3
                                playerStats.player.lifeSteal -= CONFIGITEM[pas].levelLifeSteal.level3
                                playerStats.player.health -= CONFIGITEM[pas].levelHealth.level3
                            };
                            if(levelItem == 4){
                                playerStats.player.attack -= CONFIGITEM[pas].levelAttack.level4
                                playerStats.player.defense -= CONFIGITEM[pas].levelDefense.level4
                                playerStats.player.dodge -= CONFIGITEM[pas].levelDodge.level4
                                playerStats.player.crit -= CONFIGITEM[pas].levelCrit.level4
                                playerStats.player.penetration -= CONFIGITEM[pas].levelPenetration.level4
                                playerStats.player.lifeSteal -= CONFIGITEM[pas].levelLifeSteal.level4
                                playerStats.player.health -= CONFIGITEM[pas].levelHealth.level4
                            };
                            if(levelItem == 5){
                                playerStats.player.attack -= CONFIGITEM[pas].levelAttack.level5
                                playerStats.player.defense -= CONFIGITEM[pas].levelDefense.level5
                                playerStats.player.dodge -= CONFIGITEM[pas].levelDodge.level5
                                playerStats.player.crit -= CONFIGITEM[pas].levelCrit.level5
                                playerStats.player.penetration -= CONFIGITEM[pas].levelPenetration.level5
                                playerStats.player.lifeSteal -= CONFIGITEM[pas].levelLifeSteal.level5
                                playerStats.player.health -= CONFIGITEM[pas].levelHealth.level5
                            };
                        };
                    };
                };

                function addItemBackToInventory(slotID) {
                    const itemData = CONFIGITEM.find(item => item.id === slotID);
                    if (itemData) {
                        const existingItem = playerStats.player.stuff.stuffUnlock.find(item => item.id === slotID);
                        if (existingItem) {
                            existingItem.amount = (existingItem.amount || 0) + 1;
                        } else {
                            playerStats.player.stuff.stuffUnlock.push({
                                id: itemData.id,
                                name: itemData.name,
                                level: 1,
                                amount: 1
                
                            });
                        }
                    }    
                }
            } catch (error) {
                console.log(error);
            }
        }
        run();