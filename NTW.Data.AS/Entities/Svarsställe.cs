﻿namespace Telia.NTW.Data.Analys.Entities
{
    public class Svarsställe
    {
        public Svarsställe(int id,string namn)
        {
            this.id = id;
            this.namn = namn;
        }

        private readonly int id;
        private readonly string namn;

        public int GetId
        {
            get
            {
                return id;
            }
        }

        public string GetNamn
        {
            get
            {
                return namn;
            }
        }

    }
}
