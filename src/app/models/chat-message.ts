export class iChatMessage {
    public senderId: string;
    public key: string;
    public message: string;
    public attachedFile: any = {};
    public timestamp: number = Number(new Date());
}