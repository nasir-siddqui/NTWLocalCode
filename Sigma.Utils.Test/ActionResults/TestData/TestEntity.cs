using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sigma.Utils.ActionResults.TestData
{
	public class TestEntity
	{
		[Display (Name = "Strängnamn")]
		public string AString { get; set; }
		public int AnInt { get; set; }
		public DateTime ADateTime { get; set; }

		[NotMapped]
		public string AnUnmappedString { get; set; }

		public const string Values0AString = "String0";
		public const int Values0AnInt = 2;
		public static readonly DateTime Values0ADateTime = new DateTime(2014, 10, 3);
		public const string Values0AnUnmappedString = "String4";

		public const string Values1AString = "String5";
		public const int Values1AnInt = 6;
		public static readonly DateTime Values1ADateTime = new DateTime(2014, 10, 7);
		public const string Values1AnUnmappedString = "String8";

		public const string Values2AString = "String9";
		public const int Values2AnInt = 10;
		public static readonly DateTime Values2ADateTime = new DateTime(2014, 10, 11);
		public const string Values2AnUnmappedString = "String12";

		public static List<TestEntity> GetListWithTestData()
		{
			List<TestEntity> list = new List<TestEntity>();

			list.Add(new TestEntity
			{
				AString = Values0AString,
				AnInt = Values0AnInt,
				ADateTime = Values0ADateTime,
				AnUnmappedString = Values0AnUnmappedString
			});

			list.Add(new TestEntity
			{
				AString = Values1AString,
				AnInt = Values1AnInt,
				ADateTime = Values1ADateTime,
				AnUnmappedString = Values1AnUnmappedString
			});

			list.Add(new TestEntity
			{
				AString = Values2AString,
				AnInt = Values2AnInt,
				ADateTime = Values2ADateTime,
				AnUnmappedString = Values2AnUnmappedString
			});

			return list;
		}
	}
}
