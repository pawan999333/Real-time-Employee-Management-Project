using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Data.SqlClient;

namespace emsbackend.Hubs
{
    public class ChatHub : Hub
    {

        private readonly string _connectionString;

        public ChatHub(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");
        }


        //public async Task SendMessage(string user, string message)
        //{
        //    await Clients.All.SendAsync("ReceiveMessage", user, message);
        //}

        private static ConcurrentDictionary<string, string> connectedUsers = new();

        public override async Task OnConnectedAsync()
        {
            var name = Context.GetHttpContext()?.Request.Query["empId"].ToString();
            if (!string.IsNullOrEmpty(name))
                connectedUsers[name] = Context.ConnectionId;

            await base.OnConnectedAsync();
        }

        public async Task SendMessageToUser(string receiver, string sender, string message)
        {

            await SaveMessageToDb(sender, receiver, message);
            if (connectedUsers.TryGetValue(receiver, out var id))
                await Clients.Client(id).SendAsync("ReceiveMessage", sender, message);
            if (connectedUsers.TryGetValue(sender, out var senderId))
                await Clients.Client(senderId).SendAsync("ReceiveMessage", sender, message);

        }
        private async Task SaveMessageToDb(string sender, string receiver, string message)
        {

                SqlConnection con = new SqlConnection(_connectionString);
            using (var cmd = new SqlCommand("INSERT INTO ChatMessages (Sender, Receiver, Message) VALUES (@Sender, @Receiver, @Message)", con))
            {
                cmd.Parameters.AddWithValue("@Sender", sender);
                cmd.Parameters.AddWithValue("@Receiver", receiver);
                cmd.Parameters.AddWithValue("@Message", message);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
        }
    
    }
}



