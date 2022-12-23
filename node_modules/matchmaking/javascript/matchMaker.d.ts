export interface IMatchMakerOptions {
    checkInterval?: number;
    maxMatchSize?: number;
    minMatchSize?: number;
}
export declare class Matchmaker {
    protected resolver: (players: any[]) => void;
    protected getKey: (player: any) => string;
    protected queue: any[];
    protected checkInterval: number;
    protected maxMatchSize: number;
    protected minMatchSize: number;
    readonly playersInQueue: number;
    constructor(resolver: (players: any[]) => void, getKey: (player: any) => string, options?: IMatchMakerOptions);
    push: (player: any) => void | Error;
    leaveQueue(player: any): void | Error;
    indexOnQueue: (player: any) => number;
}
