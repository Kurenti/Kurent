//////////////////////////////////////////////////
// EventFactory.js________________________________
// Utility factory class za
// ustvarjanje eventov (invisible collision boxov)
//////////////////////////////////////////////////

// enum z imeni eventov, da niso stringi...
var EventType = {
    Bell: 1,
    Ice: 2,
    Villager: 3
};

function EventFactory () {
    this.eventFunctions = {
        1: function (secObject) {
            if (GAME_OBJECT_MANAGER.getPlayer() === secObject) {
                GAME_OBJECT_MANAGER.getPlayer().nearBell = true;
            }
        },
        2: function (secObject) {
            if (GAME_OBJECT_MANAGER.getPlayer() === secObject) {
                GAME_OBJECT_MANAGER.getPlayer().fallInLake();
            }
        },
        3: function (secObject) {
            if (GAME_OBJECT_MANAGER.getPlayer() === secObject) {
                GAME_OBJECT_MANAGER.getPlayer().nearVillager = true;
            }
        },
    }
}

EventFactory.prototype.makeEvent = function (position, radius, eventType) {

    var newTrigger = new Trigger(position, radius, this.eventFunctions[eventType]);

    GAME_OBJECT_MANAGER.add(newTrigger, ObjectTypes.Collidable);
    return newTrigger;
};