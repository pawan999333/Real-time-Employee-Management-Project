using emsbackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace emsbackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleryController : ControllerBase
    {
        public readonly string _connectionString;
        public SaleryController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [Authorize(Roles="admin")]
        [HttpPost]
        public ActionResult getSaleryDetails(SalaryDTO dto)
        {
            int totalAttendance = 0;
            SqlConnection connection = new SqlConnection(_connectionString);
            SqlCommand command = new SqlCommand
            {
                CommandText = "sp_SaleryCount",
                CommandType = System.Data.CommandType.StoredProcedure,
                Connection = connection
            };

            command.Parameters.AddWithValue("@EmpId", dto.EmpId);
            command.Parameters.AddWithValue("@Month", dto.Month);
            command.Parameters.AddWithValue("@Year", dto.Year);

            connection.Open();
            totalAttendance = Convert.ToInt32(command.ExecuteScalar());
            connection.Close();
            return Ok(totalAttendance);

        }
    }
}
