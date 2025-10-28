namespace emsbackend.Repositories
{
    public interface IUserRepository
    {
        Task<bool> AuthenticateAsync(string email, string password);
    }
}
