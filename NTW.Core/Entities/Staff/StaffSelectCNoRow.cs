namespace Telia.NTW.Core.Entities.Staff
{
    public class StaffSelectCNoRow
    {
        public string Abonnemang { get; set; }
        public string Alternativnamn { get; set; }
        // Svarställe below should really be with two 's', but it is incorrectly spelled in the Staff result.
        public string Svarställe { get; set; }
        public string Svarsställe_namn { get; set; }
    }
}
