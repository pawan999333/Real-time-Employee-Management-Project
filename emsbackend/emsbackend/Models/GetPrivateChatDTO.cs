namespace emsbackend.Models
{
    public class GetPrivateChatDTO
    {
        public int Id { get; set; }
        public string Sender { get; set; }
        public string Receiver { get; set; }
        public string Message { get; set; }
        public DateTime SentAt { get; set; }
    }
}
