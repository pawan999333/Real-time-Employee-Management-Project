namespace emsbackend.Models
{
    public class EmployeeDTO
    {
        public int? Id { get; set; }
        public string EmpName { get; set; }
        public string Email { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime JoiningDate { get; set; }
        public string? Salery { get; set; }
        public DateTime? LastWorkingDate { get; set; }
        public string Gender { get; set; }
        public string JobTitle { get; set; }
        public int DepartmentId { get; set; }
        public string? Phone { get; set; }

    }
}
