using Api.Dtos;
using Api.Hubs;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Controller, Route("api")]
public class ApiController : ControllerBase
{
    private readonly ChatHub _chatHub = new();

    [HttpGet]
    public IActionResult Get()
    {
        return Ok("Hello World!");
    }

    [HttpGet("send/{groupName}")]
    public async Task<ActionResult> SendMessage(string groupName, [FromQuery] string groupMessage)
    {
        await _chatHub.SendMessage(new Message(groupMessage, "Server"), groupName);

        return Ok();
    }
    
    [HttpGet("send")]
    public async Task<ActionResult> SendMessage([FromQuery] string groupMessage)
    {
        await _chatHub.SendMessage(new Message(groupMessage, "Server"));

        return Ok();
    }
}