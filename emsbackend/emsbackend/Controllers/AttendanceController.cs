using emsbackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace emsbackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly string _connectionString;

        public AttendanceController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }



        [Authorize]
        [HttpPost ("add-attendance")]
        public ActionResult AddAttendance(AttendanceDTO dto)
        {
            try
            {
                SqlConnection connection = new SqlConnection(_connectionString);

                SqlCommand command = new SqlCommand
                {
                    CommandText = "sp_Attendance",
                    CommandType = System.Data.CommandType.StoredProcedure,
                    Connection = connection
                };

                command.Parameters.AddWithValue("@EmpId", dto.EmpId);
                command.Parameters.AddWithValue("@EmpName", dto.EmpName);
                command.Parameters.AddWithValue("@IsAttend", dto.IsAttend);

                connection.Open();
                command.ExecuteNonQuery();
                connection.Close();

                return Ok(new { message = "Attendace marked successfully" });


            }
            catch(Exception ex)
            {
                return BadRequest(new { message = "Attendance already marked for today" });
            }
        }


        [Authorize]
        [HttpGet("attendance-list")]

        public ActionResult GetAttendanceDetails(int? EmpId)
        {
            try
            {

                SqlConnection connection = new SqlConnection(_connectionString);
                SqlCommand command = new SqlCommand
                {
                    CommandText = "sp_getAttendanceDetails",
                    CommandType = System.Data.CommandType.StoredProcedure,
                    Connection = connection
                };

                command.Parameters.AddWithValue("@EmpId", EmpId);
                connection.Open();

                List<AttendanceDetailsDTO> response = new List<AttendanceDetailsDTO>();

                using (SqlDataReader sqlDataReader = command.ExecuteReader())
                {
                    while (sqlDataReader.Read())
                    {
                        AttendanceDetailsDTO dto = new AttendanceDetailsDTO();
                        dto.Id= Convert.ToInt32(sqlDataReader["Id"]);
                        dto.EmpId= Convert.ToInt32(sqlDataReader["EmpId"]);
                        dto.EmpName= Convert.ToString(sqlDataReader["EmpName"]);
                        dto.AttendanceDate = Convert.ToDateTime(sqlDataReader["AttendanceDate"]);
                        dto.IsAttend = Convert.ToBoolean(sqlDataReader["IsAttend"]);

                        response.Add(dto);
                    }
                }

                connection.Close();
                return Ok(new { message = response });
            }
            catch(Exception ex)
            {
                return BadRequest(new { message = "Invalid Request" });
            }
        }
        
    }
}
