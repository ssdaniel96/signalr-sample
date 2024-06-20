namespace Api.Dtos;

public record Signal
{
    public string? Token { get; set; }

    public Signal(string token)
    {
        Token = token;
    }

    public Signal()
    {
        
    }
    
}