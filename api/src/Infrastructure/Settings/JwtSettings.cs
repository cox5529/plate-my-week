namespace PlateMyWeek.Infrastructure.Settings;

public class JwtSettings
{
    public string Key { get; set; } = "12345678901234561234567890123456";

    public string Issuer { get; set; } = "localhost";

    public string Audience { get; set; } = "localhost";

    public int AccessTokenDurationHours { get; set; } = 1;
}
