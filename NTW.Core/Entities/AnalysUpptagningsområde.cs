﻿namespace Telia.NTW.Core.Entities
{
    public class AnalysUpptagningsområde
    {
        public AnalysUpptagningsområde(int id, string namn)
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
