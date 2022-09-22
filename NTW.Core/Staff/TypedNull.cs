using System;

namespace Telia.NTW.Core.Staff
{
	public class TypedNull
	{
		public Type NullType { get; private set; }

		public static TypedNull LongNull = new TypedNull(typeof(long));
		public static TypedNull BooleanNull = new TypedNull(typeof(bool));
		public static TypedNull StringNull = new TypedNull(typeof(string));
		public static TypedNull DateTimeNull = new TypedNull(typeof(DateTime));
		public static TypedNull DecimalNull = new TypedNull(typeof(decimal));
		public static TypedNull DoubleNull = new TypedNull(typeof(double));
		public static TypedNull IntNull = new TypedNull(typeof(int));
		public static TypedNull FloatNull = new TypedNull(typeof(float));
		public static TypedNull ShortNull = new TypedNull(typeof(short));

		private TypedNull(Type nullType)
		{
			this.NullType = nullType;
		}

		public override string ToString()
		{
			return "null";
		}
	}
}
