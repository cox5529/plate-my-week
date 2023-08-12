namespace PlateMyWeek.Domain.Entities;

public class Profile
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = "";

    public string EmailAddress { get; set; } = "";
}
