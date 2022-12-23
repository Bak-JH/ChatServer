import { Matchmaker, IMatchMakerOptions } from './matchMaker';
interface IFifoMatchMakerOptions extends IMatchMakerOptions {
}
export declare class FifoMatchmaker extends Matchmaker {
    constructor(resolver: (players: any[]) => void, getKey: (player: any) => string, options?: IFifoMatchMakerOptions);
    private FifoMatch;
}
export {};
