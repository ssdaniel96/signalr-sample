using Api.Dtos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs;

// [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[AllowAnonymous]
public class ChatHub : Hub
{
    public async Task NewMessage(Message message)
    {
        await Clients.AllExcept(Context.ConnectionId).SendAsync("messageReceived", message);
    }
    
    public async Task SendMessage(Message message, string? groupName = null)
    {
        if (!string.IsNullOrWhiteSpace(groupName))
            await Clients.Group(groupName).SendAsync("messageReceived", message);
        else
            await Clients.All.SendAsync("messageReceived", message);
    }
    
    public async Task SendMessageToUser(Message message, string userId)
    {
        await Clients.User(userId).SendAsync("messageReceived", message);
    }
    
    public async Task SendMessageToGroupExceptUser(Message message, string groupName, string userId)
    {
        await Clients.GroupExcept(groupName, userId).SendAsync("messageReceived", message);
    }

    public async Task JoinGroup(string groupName, string author)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        var tasks = new List<Task>
        {
            SendMessageToUser(new($"You was joined in group {groupName}", "Server"), Context.ConnectionId),
            SendMessageToGroupExceptUser(new Message($"{author} join in group {groupName}", "Server"), groupName,
            Context.ConnectionId)
        };
        
        await Task.WhenAll(tasks);
    }
    
    public async Task LeaveGroup(string groupName, string author)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

        var tasks = new List<Task>
        {
            SendMessageToUser(new($"You was removed from group {groupName}", "Server"), Context.ConnectionId),
            SendMessageToGroupExceptUser(new Message($"{author} leave group {groupName}", "Server"), groupName,
                Context.ConnectionId)
        };

        await Task.WhenAll(tasks);
    }
}