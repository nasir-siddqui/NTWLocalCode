using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Entities.Admin;

namespace Telia.NTW.Core.Services
{
    public class LoggService
    {
        private readonly NtwEfModel db;

        public LoggService(NtwEfModel db)
        {
            this.db = db;
        }

        public List<SystemLog> GetSystemlogList(DateTime start, DateTime end)
        {
            List<SystemLog> systemlogList = db.SystemLog.Where(m => m.DateTime >= start && m.DateTime <= end).OrderByDescending(m => m.DateTime).ToList();

            return systemlogList;
        }

        public List<SupportLog> GetAdminlogList(DateTime start, DateTime end)
        {
            List<SupportLog> adminlogList = db.SupportLog.Where(m => m.EffectDate >= start && m.EffectDate <= end).OrderByDescending(m => m.EffectDate).ToList();

            return adminlogList;
        }

        public List<STAFFlog> GetSTAFFlogList(DateTime start, DateTime end)
        {
            List<STAFFlog> stafflogList = db.STAFFlog.Where(m => m.effectDate >= start && m.effectDate <= end).OrderByDescending(m => m.effectDate).ToList();

            return stafflogList;
        }

        public List<ServiceLog> GetServicelogList(DateTime start, DateTime end)
        {
            List<ServiceLog> servicelogList = db.ServiceLog.Where(m => m.TimeStamp >= start && m.TimeStamp <= end).OrderByDescending(m => m.TimeStamp).ToList();

            return servicelogList;
        }

        public List<ProcessLog> GetProcessLogList(DateTime start, DateTime end)
        {
            var query = db.ProcessHeader
               .Join(db.ProcessTable,
                  header => header.ProcessID,
                  table => table.ProcessID,
                  (header, table) => new { Header = header, Table = table })
               .Where(m => m.Header.ProcessID == m.Table.ProcessID)
               .Select(s =>
                   new ProcessLog
                   {
                       StartDate = s.Header.StartDate,
                       EndDate = s.Header.EndDate,
                       ProcessName = s.Table.ProcessName,
                       Success = s.Header.Success,
                       Notes = s.Header.Note
                   }
               ).ToList();

            return query;
        }
    }
}
