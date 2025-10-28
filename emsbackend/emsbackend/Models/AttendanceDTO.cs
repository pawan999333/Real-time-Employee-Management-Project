namespace emsbackend.Models
{
    public class AttendanceDTO
    {
        public int EmpId { get; set; }
        public string EmpName { get; set; }
        public bool IsAttend { get; set; } = true;
    }
}
