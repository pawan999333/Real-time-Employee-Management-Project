using emsbackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace emsbackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly string _connectionString;

        public ChatController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }


        [Authorize]
        [HttpPost]
        public ActionResult GetPrivateChat(PrivateChatRequestDTO dto)
        {

            try
            {
                SqlConnection connection = new SqlConnection(_connectionString);
                SqlCommand command = new SqlCommand
                {
                    CommandText = "sp_getPrivateChat",
                    CommandType = System.Data.CommandType.StoredProcedure,
                    Connection = connection
                };

                command.Parameters.AddWithValue("@User1", dto.Sender);
                command.Parameters.AddWithValue("@User2", dto.Receiver);

                connection.Open();

                List<GetPrivateChatDTO> response = new List<GetPrivateChatDTO>();
                using (SqlDataReader sqlDataReader = command.ExecuteReader())
                {
                    while (sqlDataReader.Read())
                    {
                        GetPrivateChatDTO req = new GetPrivateChatDTO();
                        req.Id = Convert.ToInt32(sqlDataReader["Id"]);
                        req.Sender = Convert.ToString(sqlDataReader["Sender"]);
                        req.Receiver = Convert.ToString(sqlDataReader["Receiver"]);
                        req.Message = Convert.ToString(sqlDataReader["Message"]);
                        req.SentAt = Convert.ToDateTime(sqlDataReader["SentAt"]);

                        response.Add(req);

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
