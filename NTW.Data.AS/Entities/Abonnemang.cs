namespace Telia.NTW.Data.Analys.Entities
{
    public class Abonnemang
    {
        public Abonnemang(int id, string nummer,int intervallLågt,int intervallHögt)
        {
            this.id = id;
            this.nummer = nummer;
            this.intervallLågt = intervallLågt;
            this.intervallHögt = intervallHögt;
        }

        private readonly int id;
        private readonly string nummer;
        private readonly int intervallLågt;
        private readonly int intervallHögt;

        public int GetId
        {
            get
            {
                return id;
            }
        }

        public string GetNummer
        {
            get
            {
                return nummer;
            }
        }

        public int GetIntervallLågt
        {
            get
            {
                return intervallLågt;
            }
        }

        public int GetIntervallHögt
        {
            get
            {
                return intervallHögt;
            }
        }
    }
}
