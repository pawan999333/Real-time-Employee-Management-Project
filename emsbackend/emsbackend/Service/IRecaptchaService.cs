namespace emsbackend.Service
{
    public interface IRecaptchaService
    {
        Task<bool> VerifyTokenAsync(string token);
    }
}
