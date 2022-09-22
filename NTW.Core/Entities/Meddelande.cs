using System;
using System.Collections.Generic;
using Telia.NTW.Core.Enums;

namespace Telia.NTW.Core.Entities
{
	public class Meddelande : IEntity
	{
		public int Id { get; set; }
		public MeddelandeType Type { get; set; }
		public DateTime From { get; set; }
		public DateTime To { get; set; }
		public string Text { get; set; }
		public List<string> VisibleForRoles { get; set; }
	}
}
