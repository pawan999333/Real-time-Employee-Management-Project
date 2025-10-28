namespace emsbackend.Models
{
    public class AttendanceDetailsDTO
    {

        public int Id { get; set; }
        public int EmpId { get; set; }
        public string EmpName { get; set; }
        public bool IsAttend { get; set; }
        public DateTime AttendanceDate { get; set; }
    }
}
