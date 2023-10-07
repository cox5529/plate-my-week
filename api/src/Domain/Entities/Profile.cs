using PlateMyWeek.Domain.Common;

namespace PlateMyWeek.Domain.Entities;

public class Profile : BaseEntity<Guid>
{
    public string UserId { get; set; } = "";

    public string EmailAddress { get; set; } = "";

    private Profile(){}

    public Profile(string emailAddress, string userId)
    {
        UserId = userId;
        EmailAddress = emailAddress;
    }
}
