
export class iChat {
    public chatKey: string;
    public uid: string;
    public hubId: string;
    public messages: any = {};
    public lastMessage: string;
    public lastEdit: number;
    public timestamp: number;
}

export class iMessage {
    public key: string;
    public senderId: string;
    public message: string;
    public timestamp: number = Number(new Date());
}