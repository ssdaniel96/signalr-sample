using Api.Dtos;
using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs;

public class ChatHub : Hub
{
    public async Task NewMessage(Message message)
    {
        await Clients.All.SendAsync("messageReceived", message);
    }
}   