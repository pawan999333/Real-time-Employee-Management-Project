namespace emsbackend.Models
{
    public class LeaveDetailsDTO
    {
        public int Id { get; set; }
        public int EmpId { get; set; }
        public string EmpName { get; set; }
        public string LeaveType { get; set; }
        public string? Reason { get; set; }
        public string? Result { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

    }
}
