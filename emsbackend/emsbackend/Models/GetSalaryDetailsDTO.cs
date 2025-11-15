using Microsoft.IdentityModel.Tokens;

namespace emsbackend.Models
{
    public class GetSalaryDetailsDTO
    {
        public int EmpId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string EmpName { get; set; }
        public int WorkingDays { get; set; }
        public int AttendanceDays { get; set; }
        public decimal WorkingSalery { get; set; }
        public decimal ProvideSalery { get; set; }
    }
}
