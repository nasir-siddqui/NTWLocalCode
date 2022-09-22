using System;
using System.Collections.Generic;
using System.Linq;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Enums;
using Telia.NTW.Core.Repository;

namespace Telia.NTW.Core.Services
{
	public class MeddelandeService
	{
        private readonly NtwCodeFirstContext _ntwCodeFirstContext;
        private readonly NtwEfModel dbContext;

        public MeddelandeService(NtwCodeFirstContext _ntwCodeFirstContext, NtwEfModel dbContext)
        {
            this._ntwCodeFirstContext = _ntwCodeFirstContext;
			this.dbContext = dbContext;
        }

        public MeddelandenActive GetActive(string[] userRoles)
		{
            var meddelande = dbContext.Meddelandes.Where
                (
					w => w.From < DateTime.Now 
						&& w.To > DateTime.Now
                        && w.RolesForMessage.Any(a => userRoles.Contains(a.Role.Name))
                ).OrderByDescending(o => o.From);
			return new MeddelandenActive {
                Panic = meddelande.Where(w => w.Type == (int)MeddelandeType.Panic).ToList(),
                Info = meddelande.Where(w => w.Type == (int)MeddelandeType.Info).ToList()
			};
		}

		public MeddelandeContainer GetAll()
		{
			var meddelanden = _ntwCodeFirstContext.Meddelande.OrderByDescending(o => o.From);
			var future = meddelanden.Where(w => w.From > DateTime.Now).ToList();
			var present = meddelanden.Where(w => w.From < DateTime.Now && w.To > DateTime.Now).ToList();
			var past = meddelanden.Where(w => w.To < DateTime.Now).ToList();
			return new MeddelandeContainer {
							Future = future,
							Present = present,
							Past = past
			};
		}

		public Meddelandes Get(int meddelandeId)
		{
            return dbContext.Meddelandes.Single(w => w.Id == meddelandeId);
			//return MeddelandeRepository.GetById(meddelandeId);
		}

		public void CreateMessage(Meddelandes meddelande)
		{
            dbContext.Meddelandes.Add(meddelande);
            dbContext.SaveChanges();
		}

		public void UpdateMeddelande(Meddelandes meddelande)
		{
            Meddelandes dbMeddelande = dbContext.Meddelandes.Single(m => m.Id == meddelande.Id);

            List<RolesForMessage> roles = dbContext.RolesForMessage.Where(w => w.MessageId == meddelande.Id).ToList();
            foreach (RolesForMessage role in roles)
            {
                dbContext.RolesForMessage.Remove(role);
            }

            foreach (RolesForMessage role in meddelande.RolesForMessage)
            {
                role.Meddelandes = dbMeddelande;
                dbContext.RolesForMessage.Add(role);
            }

            dbMeddelande.From = meddelande.From;
            dbMeddelande.Text = dbMeddelande.Text;
            dbMeddelande.RolesForMessage = meddelande.RolesForMessage;
            dbMeddelande.Text = meddelande.Text;
            dbMeddelande.To = meddelande.To;
            dbMeddelande.Type = meddelande.Type;

            dbContext.SaveChanges();
		}

		public void DeleteMeddelande(int meddelandeId)
		{
            Meddelandes medd = dbContext.Meddelandes.Single(w => w.Id == meddelandeId);
            List<RolesForMessage> roles = dbContext.RolesForMessage.Where(w => w.MessageId == meddelandeId).ToList();
            foreach (RolesForMessage role in roles)
            {
                dbContext.RolesForMessage.Remove(role);
            }

            dbContext.Meddelandes.Remove(medd);
            dbContext.SaveChanges();
		}
	}
}