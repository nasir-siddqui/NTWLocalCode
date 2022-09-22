using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Telia.NTW.Core.Entities
{
    public class AnalysAbonnemang
    {
        public AnalysAbonnemang(int id, string nummer, int intervallLågt, int intervallHögt)
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