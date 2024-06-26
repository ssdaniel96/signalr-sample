using Api.Dtos;
using Api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Api.Services;

public class ChatHub1Service(IHubContext<Chat1Hub> chatHub)
{
    public async Task SendMessage(Message message, string? groupName = null)
    {
        if (!string.IsNullOrWhiteSpace(groupName))
            await chatHub.Clients.Group(groupName).SendAsync("messageReceived", message);
        else
            await chatHub.Clients.All.SendAsync("messageReceived", message);
    }
}