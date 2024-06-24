using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Controller, Route("api")]
public class ApiController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("Hello from API");
    }
}