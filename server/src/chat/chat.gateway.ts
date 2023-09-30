import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from './utils/models/message.interface';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { Room } from './utils/models/room.interface';
import { PrivateChatService } from './utils/services/privateChat.service';
import { RoomChatService } from './utils/services/roomChat.service';
import { ConnectionGateway } from 'src/common/gateways/connection.gateway';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  cors: {
      origin: [process.env.FONTEND_URL],
  }
})
export class ChatGateway{
  @WebSocketServer() server: Server

  messages:Message[] = []
  id:string[] = []

  constructor(
    private privateChatService:PrivateChatService, 
    private roomChatService:RoomChatService, 
    private authService:AuthService,
    private userService:UserService,
    private readonly connectionGateway :ConnectionGateway,
    private prismaService:PrismaService
    ) {
  }

  @SubscribeMessage('privateMessage')
  async handlePrivateMessage(client: Socket, data: any) {
    const message = await this.privateChatService.saveMessage(data.message)
    if (!message.sent)
      return;
    const senders = this.connectionGateway.connectedUsersById[data.message.senderId]
      if (senders)
        senders.forEach(id=>{
          this.server.to(id).emit('recMessage', message.message);
        })
      const reciver = this.connectionGateway.connectedUsersById[data.message.receiverId]
      if (reciver)
        reciver.forEach(id=>{
          this.server.to(id).emit('recMessage', message.message);
        })
  }


  @SubscribeMessage('getConversation')
  async getConversation(client: Socket, data:any) {
    const messages = await this.privateChatService.getConversation(data.senderId, data.receiverId)
    this.server.to(client.id).emit('getConversation', messages)
  }

  @SubscribeMessage('getLastMessage')
  async getLastMessage(client:Socket, id:number) {
    const data = await this.privateChatService.getLastMessage(id)
    if (!data.length)
      client.emit('recLastMessage', [{id:0, senderId:id, receiverId:id, message:"Welcome", date:new Date}])
    else
      client.emit('recLastMessage', data);
  }

  @SubscribeMessage('updateRead')
  updateRead(client:Socket, message:Message) {
    this.privateChatService.updateRead(message);
  }

  @SubscribeMessage('getNotReadedMessages')
  async getNotReadedMessages(client:Socket, id:number) {
    const data = await this.privateChatService.getUnreadMessageCountsBySenderId(id)
    this.server.to(client.id).emit('recNotReadedMessages', data)
  }

  @SubscribeMessage('chatNotif')
  async getChatNotification(client:Socket, data:{id:number, open:boolean}) {
    const notif = await this.privateChatService.getUnreadMessageCountsBySenderId(data.id)
    const senders = this.connectionGateway.connectedUsersById[data.id]
    if (senders) {
      const value = {num:notif.length, open:data.open}
      senders.forEach(id=>{
        this.server.to(id).emit('chatNotif', value);
      })
    }
  }

  @SubscribeMessage('allConversations')
  async getAllConversations(client:Socket, id:number) {
    const users = await this.privateChatService.getAllConversations(id);
    client.emit('recAllConversations', users);
  }

  ////////////////////////// ROOMS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  @SubscribeMessage('getUnreadedRoomMessages')
  async getUnreadedRoomMessages(client:Socket, id:number) {
    const data = await this.roomChatService.getUnreadedRoomMessages(id)
    this.server.to(client.id).emit('recNotReadedRoomMessages', data)
  }

  @SubscribeMessage('getRooms')
  async getRooms(client:Socket, id:number) {
    const data = await this.roomChatService.getRooms(id)
    const sockIds = this.connectionGateway.connectedUsersById[id]
    sockIds.forEach(id=> {
      this.server.to(id).emit('recRooms', data);
    })
  }

  @SubscribeMessage('getRoomById')
  getRoomById(client:Socket, id:number) {
    this.roomChatService.getRoomById(id).subscribe(room=>client.emit('recRoomById', room))
  }

  @SubscribeMessage('roomMessage')
  async roomMessage(client:Socket, data:{senderId:number, room:Room, message:Message}) {
    const isSaved:boolean = await this.roomChatService.saveMessage(data);
    if (!isSaved)
      return
    let usersId:(number[]) = data.room.usersId;
    
    usersId.forEach(async id=> {
      // CHECK IF THERE IS SOMEONE IN THE ROOM HAS BLOCKED YOU TO SKIP HIM
      let isBlocked:boolean = false
      if (id !== data.senderId)
        isBlocked = await this.roomChatService.getBlacklist(data.senderId, id);
      if (!isBlocked) {
        this.userService.getUserById(id).subscribe(async user=>{

          // CHECK IF THE USER IS ACTUALLY EXIST IN THE ROOM BEFORE GETING THE MESSAGE
          let actualRoom:Room = await this.prismaService.room.findFirst({
            where: {id :data.room.id}
          })
          if (actualRoom.usersId.includes(id)) {
            this.connectionGateway.connectedUsersById[user.id].forEach(id=>{
              this.server.to(id).emit('recRoomMessage', data.message);
            })
          }
        })
      }
    })
  }

  @SubscribeMessage('roomConversation')
  async roomConversation(client:Socket, data:{room:Room, id:number}) {
    const messages = await this.roomChatService.getRoomConversation(data)
    this.server.to(client.id).emit('recRoomConversation', messages)
  }

  @SubscribeMessage('getRoomLastMessage')
  async getRoomLastMessage(client:Socket, id:number) {
    const data = await this.roomChatService.getMessagesByUserId(id)
      if (!data.length)
        client.emit('recRoomLastMessage', [{id:0, senderId:id, receiverId:id, message:"Welcome", date:new Date(), roomId:1}])
      else
        client.emit('recRoomLastMessage', data)
  }

  @SubscribeMessage('getOtherRooms')
  async getOtherRooms(client:Socket, id:number) {
    const rooms = await this.roomChatService.getAllRooms(id);
    client.emit('recOtherRooms', rooms);
  }

  @SubscribeMessage('getRoomMembers')
  async getRoomMembers(client:Socket, room:Room) {
    const data = await this.roomChatService.getRoomMembers(room)
    client.emit('recRoomMembers', data)
  }

  @SubscribeMessage('updateRoom')
  async updateRoom(client:Socket, data:{room:Room, withPasswd:boolean}) {
    await this.roomChatService.changeRoomType(data);
  }

  @SubscribeMessage('readSignal')
  readSignal(client:Socket, data:{sender:number, receiver:number}) {
    const senders = this.connectionGateway.connectedUsersById[data.sender]
    if (senders)
      senders.forEach(id=>{
        this.server.to(id).emit('recReadSignal', {read:true, receiver:data.receiver});
      })
  }
}
