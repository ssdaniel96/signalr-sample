namespace Api.Dtos;

public record Message : Signal
{
    public string? Content { get; set; }

    public Message(string token, string content) : base(token)
    {
        Content = content;
    }

    public Message()
    {
        
    }
}