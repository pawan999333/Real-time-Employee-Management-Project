using emsbackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace emsbackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveController : ControllerBase
    {
        private readonly string _connectionString;

        public LeaveController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }



        [Authorize(Roles = "emp")]
        [HttpPost("add-leaves")]
        public ActionResult AddLeaves(LeaveDTO dto)
        {
            try
            {
                SqlConnection connection = new SqlConnection(_connectionString);

                SqlCommand command = new SqlCommand
                {
                    CommandText = "sp_AddLeaves",
                    CommandType = System.Data.CommandType.StoredProcedure,
                    Connection = connection
                };

                command.Parameters.AddWithValue("@EmpId", dto.EmpId);
                command.Parameters.AddWithValue("@EmpName", dto.EmpName);
                command.Parameters.AddWithValue("@LeaveType", dto.LeaveType);
                command.Parameters.AddWithValue("@Reason", dto.Reason);

                command.Parameters.AddWithValue("@StartDate", dto.StartDate);

                command.Parameters.AddWithValue("@EndDate", dto.EndDate);


                connection.Open();
                command.ExecuteNonQuery();
                connection.Close();

                return Ok(new { message = "Leaves applied successfully" });


            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Leaves already applied for the duration" });
            }
        }


        [Authorize]
        [HttpGet("leaves-list")]

        public ActionResult GetLeavesDetails(int? EmpId)
        {
            try
            {

                SqlConnection connection = new SqlConnection(_connectionString);
                SqlCommand command = new SqlCommand
                {
                    CommandText = "sp_GetLeavesDetails",
                    CommandType = System.Data.CommandType.StoredProcedure,
                    Connection = connection
                };

                command.Parameters.AddWithValue("@EmpId", EmpId);
                connection.Open();

                List<LeaveDetailsDTO> response = new List<LeaveDetailsDTO>();

                using (SqlDataReader sqlDataReader = command.ExecuteReader())
                {
                    while (sqlDataReader.Read())
                    {
                        LeaveDetailsDTO dto = new LeaveDetailsDTO();
                        dto.Id = Convert.ToInt32(sqlDataReader["Id"]);
                        dto.EmpId = Convert.ToInt32(sqlDataReader["EmpId"]);
                        dto.EmpName = Convert.ToString(sqlDataReader["EmpName"]);
                        dto.LeaveType = Convert.ToString(sqlDataReader["LeaveType"]);

                        dto.Reason = Convert.ToString(sqlDataReader["Reason"]);
                        dto.Result = Convert.ToString(sqlDataReader["Result"]);



                        dto.StartDate = Convert.ToDateTime(sqlDataReader["StartDate"]);
                        dto.EndDate = sqlDataReader["EndDate"] as DateTime?;


                        response.Add(dto);
                    }
                }

                connection.Close();
                return Ok(new { message = response });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Invalid Request" });
            }
        }


        [Authorize(Roles = "admin")]
        [HttpPut("update-leaves")]
        public ActionResult UpdateLeaves(UpdateLeaveDTO dto)
        {
            try
            {
                SqlConnection connection = new SqlConnection(_connectionString);

                SqlCommand command = new SqlCommand
                {
                    CommandText = "sp_UpdateLeaves",
                    CommandType = System.Data.CommandType.StoredProcedure,
                    Connection = connection
                };

                command.Parameters.AddWithValue("@Id", dto.Id);
                command.Parameters.AddWithValue("@Result", dto.Result);


                connection.Open();
                command.ExecuteNonQuery();
                connection.Close();
                string message;
                if (dto.Result == "Approve")
                {
                    message = "Leave Approved";
                }
                else if (dto.Result == "Reject")
                {
                    message = "Leave Rejected";
                }
                else
                {
                    message = "Leaves applied successfully";
                }

                return Ok(new { message = message });


            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Invalid Request" });
            }
        }

    }
}
