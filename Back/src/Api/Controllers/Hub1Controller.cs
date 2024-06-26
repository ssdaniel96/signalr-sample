using Api.Dtos;
using Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Controller, Route("hub1")]
public class Hub1Controller(ChatHub1Service chatHub1Service) : ControllerBase
{
    [HttpGet("send/{groupName}")]
    public async Task<ActionResult> SendMessage(string groupName, [FromQuery] string groupMessage)
    {
        await chatHub1Service.SendMessage(new Message(groupMessage, "Server"), groupName);
        return Ok();
    }
    
    [HttpGet("send")]
    public async Task<ActionResult> SendMessage([FromQuery] string groupMessage)
    {
        await chatHub1Service.SendMessage(new Message(groupMessage, "Server"));

        return Ok();
    }
}