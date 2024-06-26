using Api.Dtos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs;

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class Chat3Hub : Hub
{
    public async Task NewMessage(Message message)
    {
        await Clients.AllExcept(Context.ConnectionId).SendAsync("messageReceived", message);
    }
    
    private async Task SendMessageToUser(Message message, string userId)
    {
        await Clients.Caller.SendAsync("messageReceived", message);
    }
    
    private async Task SendMessageToGroupExceptUser(Message message, string groupName, string userId)
    {
        await Clients.GroupExcept(groupName, userId).SendAsync("messageReceived", message);
    }
    
    public async Task JoinGroup(string groupName, string author)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        var tasks = new List<Task>
        {
            SendMessageToUser(new($"You joined group {groupName}", "Server"), Context.ConnectionId),
            SendMessageToGroupExceptUser(new Message($"{author} joined group {groupName}", "Server"), groupName,
            Context.ConnectionId)
        };

        await Task.WhenAll(tasks);
    }
    
    public async Task LeaveGroup(string groupName, string author)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

        var tasks = new List<Task>
        {
            SendMessageToUser(new($"You left group {groupName}", "Server"), Context.ConnectionId),
            SendMessageToGroupExceptUser(new Message($"{author} leave group {groupName}", "Server"), groupName,
                Context.ConnectionId)
        };

        await Task.WhenAll(tasks);
    }
}