using Api.Dtos;
using Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Controller, Route("api")]
public class ApiController : ControllerBase
{
    private readonly ChatHubService _chatHubService;

    public ApiController(ChatHubService chatHubService)
    {
        _chatHubService = chatHubService;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok("Hello World!");
    }

    [HttpGet("send/{groupName}")]
    public async Task<ActionResult> SendMessage(string groupName, [FromQuery] string groupMessage)
    {
        await _chatHubService.SendMessage(new Message(groupMessage, "Server"), groupName);
        return Ok();
    }
    
    [HttpGet("send")]
    public async Task<ActionResult> SendMessage([FromQuery] string groupMessage)
    {
        await _chatHubService.SendMessage(new Message(groupMessage, "Server"));

        return Ok();
    }
}