using Api.Dtos;
using Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Controller, Route("hub3")]
public class Hub3Controller(ChatHub3Service chatHub3Service) : ControllerBase
{
    [HttpGet("send/{groupName}")]
    public async Task<ActionResult> SendMessage(string groupName, [FromQuery] string groupMessage)
    {
        await chatHub3Service.SendMessage(new Message(groupMessage, "Server"), groupName);
        return Ok();
    }
    
    [HttpGet("send")]
    public async Task<ActionResult> SendMessage([FromQuery] string groupMessage)
    {
        await chatHub3Service.SendMessage(new Message(groupMessage, "Server"));

        return Ok();
    }
}