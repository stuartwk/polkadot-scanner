export type BlockEventItem = {
    block: number;
    eventName: string;
    eventArgs: {
        key: string;
        value: string;
    }[];
}