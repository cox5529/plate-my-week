namespace PlateMyWeek.Application.Common.Models.PaginatedList;

public class PaginatedListRequest
{
    public string? Query { get; set; }
    
    public int PageNumber { get; set; }
    
    public int PageSize { get; set; }
}
