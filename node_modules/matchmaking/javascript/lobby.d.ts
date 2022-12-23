interface ILobbyMakerSettings {
    maxLobbySize: number;
    minLobbySize: number;
    password: string;
    private: boolean;
    autoStartWithMinSize: boolean;
    autoStartWithMaxSize: boolean;
}
export interface ILobbyMakerOptions {
    maxLobbySize?: number;
    minLobbySize?: number;
    password?: string;
    private?: boolean;
    autoStartWithMinSize?: boolean;
    autoStartWithMaxSize?: boolean;
}
export interface RoomInfo {
    id: number;
    name: string;
    passwordIsRequired: boolean;
    currentPlayers: number;
    maxPlayers: number;
}
interface Room {
    players: any[];
    name: string;
    settings: ILobbyMakerSettings;
}
export declare class LobbyMaker {
    resolver: (players: any[]) => void;
    protected rooms: Map<number, Room>;
    getKey: (player: any) => string;
    nextFreeId: number;
    constructor(resolver: (players: any[]) => void, getKey: (player: any) => string);
    createRoom: (newPlayer: any, roomName: string, options?: ILobbyMakerOptions | undefined) => number | Error;
    joinRoom: (roomId: number, newPlayer: any, password?: string | undefined) => void | Error;
    joinRoomByName(roomName: string, newPlayer: any, password?: string): void;
    startGame: (roomId: any) => void | Error;
    leaveRoom: (roomId: number, player: any) => void | Error;
    deleteRoom: (roomId: number) => void;
    listRooms: () => RoomInfo[];
    private getRoomSettings;
    private defaultSettings;
}
export {};
