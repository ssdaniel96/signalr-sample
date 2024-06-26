using Api.Dtos;
using Api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Api.Services;

public class ChatHub3Service(IHubContext<Chat3Hub> chatHub)
{
    public async Task SendMessage(Message message, string? groupName = null)
    {
        if (!string.IsNullOrWhiteSpace(groupName))
            await chatHub.Clients.Group(groupName).SendAsync("messageReceived", message);
        else
            await chatHub.Clients.All.SendAsync("messageReceived", message);
    }
}