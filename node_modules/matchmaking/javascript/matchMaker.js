"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let errorMessages = {
    playerInQueue: "Player is already in queue",
    playerNotInQueue: "Player is not in queue",
};
class Matchmaker {
    constructor(resolver, getKey, options) {
        this.push = (player) => {
            if (this.indexOnQueue(player) != -1)
                return new Error(errorMessages.playerInQueue);
            this.queue.push(player);
        };
        this.indexOnQueue = (player) => {
            let playerKey = this.getKey(player);
            let index;
            index = this.queue.findIndex((player) => { return this.getKey(player) == playerKey; });
            return index;
        };
        this.resolver = resolver;
        this.getKey = getKey;
        this.queue = [];
        this.checkInterval = (options && options.checkInterval && options.checkInterval > 0 && options.checkInterval) || 5000;
        this.maxMatchSize = (options && options.maxMatchSize && options.maxMatchSize > 0 && options.maxMatchSize) || 2;
        this.minMatchSize = (options && options.minMatchSize && options.minMatchSize > 0 && options.minMatchSize) || this.maxMatchSize;
    }
    get playersInQueue() {
        return this.queue.length;
    }
    leaveQueue(player) {
        let index = this.indexOnQueue(player);
        if (index == -1)
            return new Error(errorMessages.playerNotInQueue);
        this.queue.splice(index, 1);
    }
}
exports.Matchmaker = Matchmaker;
//# sourceMappingURL=matchMaker.js.map