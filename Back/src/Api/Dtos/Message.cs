namespace Api.Dtos;

public record Message
{
    public string? Content { get; set; }
    public string? Author { get; set; }
    public DateTime CreationDate { get; set; }

    public Message(string token, string content, string? author, DateTime creationDate)
    {
        Content = content;
        Author = author;
        CreationDate = creationDate;
    }

    public Message()
    {
        
    }
}