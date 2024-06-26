using Api.Dtos;
using Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Controller, Route("hub2")]
public class Hub2Controller(ChatHub2Service chatHub2Service) : ControllerBase
{
    [HttpGet("send/{groupName}")]
    public async Task<ActionResult> SendMessage(string groupName, [FromQuery] string groupMessage)
    {
        await chatHub2Service.SendMessage(new Message(groupMessage, "Server"), groupName);
        return Ok();
    }
    
    [HttpGet("send")]
    public async Task<ActionResult> SendMessage([FromQuery] string groupMessage)
    {
        await chatHub2Service.SendMessage(new Message(groupMessage, "Server"));

        return Ok();
    }
}