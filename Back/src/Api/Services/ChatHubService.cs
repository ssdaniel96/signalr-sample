using Api.Dtos;
using Api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Api.Services;

public class ChatHubService
{
    private readonly IHubContext<ChatHub> _chatHub;

    public ChatHubService(IHubContext<ChatHub> chatHub)
    {
        _chatHub = chatHub;
    }
    
    public async Task SendMessage(Message message, string? groupName = null)
    {
        if (!string.IsNullOrWhiteSpace(groupName))
            await _chatHub.Clients.Group(groupName).SendAsync("messageReceived", message);
        else
            await _chatHub.Clients.All.SendAsync("messageReceived", message);
    }
}