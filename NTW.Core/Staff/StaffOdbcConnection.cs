using System;
using System.Collections.Generic;
using System.Data.Odbc;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using Sigma.Utils.Helpers;

namespace Telia.NTW.Core.Staff
{
	public class StaffOdbcConnection : IDisposable
	{
		private OdbcConnection staffConnection;
		private OdbcTransaction staffTransaction;

		public const string SORT_ORDER_1_ASC = "1A";
		public const string SORT_ORDER_1_DESC = "1D";
		public const string SORT_ORDER_2_ASC = "2A";
		public const string SORT_ORDER_2_DESC = "2D";
		public const string SORT_ORDER_3_ASC = "3A";
		public const string SORT_ORDER_3_DESC = "3D";
		public const string SORT_ORDER_4_ASC = "4A";
		public const string SORT_ORDER_4_DESC = "4D";
		public const string SORT_ORDER_5_ASC = "5A";
		public const string SORT_ORDER_5_DESC = "5D";

		private static readonly log4net.ILog log = log4net.LogManager.GetLogger(typeof(StaffOdbcConnection));

		public StaffOdbcConnection(string staffOdbcName, string staffUsername, string staffPassword)
		{
			string staffConnectionString = "DSN=" + staffOdbcName + ";Uid=" + staffUsername + ";Pwd=" + staffPassword + ";";
			staffConnection = new OdbcConnection(staffConnectionString);
			//DateTime openingStaffConnection = DateTime.Now;
			staffConnection.Open();
			//log.Debug("staffConnection opened, ms: " + (DateTime.Now-openingStaffConnection).TotalMilliseconds);
		}

		#region Internal methods
		private OdbcCommand getOdbcCommand(string storedProcedure, params Object[] parameters)
		{
			OdbcCommand dbCommand = staffConnection.CreateCommand();

			StringBuilder commandText = new StringBuilder();
			commandText.Append("EXEC ");
			commandText.Append(storedProcedure);
			for (int i = 0; i < parameters.Length; i++)
			{
				if (i != 0)
					commandText.Append(",");

				addParameter(commandText, parameters[i]);
			}

			dbCommand.CommandText = commandText.ToString();

			return dbCommand;
		}

		private static void addParameter(StringBuilder commandText, Object parameter)
		{
			commandText.Append(" ");

			if (parameter == null || parameter is TypedNull)
			{
				commandText.Append("null");
			}
			else
			{
				bool stringFormat = !isNumeric(parameter);

				string cleanParameter = parameter.ToString();
				if (stringFormat)
				{
					commandText.Append("'");
					cleanParameter = StaffHelper.CleanSqlParameter(cleanParameter);
				}

				commandText.Append(cleanParameter);

				if (stringFormat)
					commandText.Append("'");
			}
		}

		private static bool isNumeric(Object parameter)
		{
			switch (Type.GetTypeCode(parameter.GetType()))
			{
				case TypeCode.Byte:
				case TypeCode.SByte:
				case TypeCode.UInt16:
				case TypeCode.UInt32:
				case TypeCode.UInt64:
				case TypeCode.Int16:
				case TypeCode.Int32:
				case TypeCode.Int64:
				case TypeCode.Decimal:
				case TypeCode.Double:
				case TypeCode.Single:
					return true;
				default:
					return false;
			}
		}

		// För att skydda mot SQL injection använder man normalt sett parameterized anrop.
		// Detta fungerar dock dåligt med den ODBC-drivrutin (Sybase 11) som används för Staff.
		// Denna del är därför bortkommenterad och call-strängen byggs upp manuellt.
//		private OdbcCommand getOdbcCommand(string storedProcedure, params Object[] parameters)
//		{
//			OdbcCommand dbCommand = staffConnection.CreateCommand();
//
//			StringBuilder commandText = new StringBuilder();
//			commandText.Append("EXEC ");
//			commandText.Append(storedProcedure);
//			for (int i = 0; i < parameters.Length; i++)
//			{
//				if (i != 0)
//					commandText.Append(",");
//
//				commandText.Append(" ?");
//			}
//			dbCommand.CommandText = commandText.ToString();
//
//			for (int i = 0; i < parameters.Length; i++)
//			{
//				dbCommand.Parameters.Add(getOdbcParameter(parameters[i], i));
//			}
//
//			return dbCommand;
//		}
//
//		private static OdbcParameter getOdbcParameter(Object parameter, int i)
//		{
//			Type type;
//			if (parameter == null)
//			{
//				return new OdbcParameter(i.ToString(), DBNull.Value);
//			}
//
//			OdbcParameter odbcParameter = new OdbcParameter();
//			odbcParameter.ParameterName = i.ToString();
//
//			if (parameter is TypedNull)
//			{
//				type = ((TypedNull) parameter).NullType;
//				odbcParameter.Value = DBNull.Value;
//			}
//			else
//			{
//				type = parameter.GetType();
//				odbcParameter.Value = parameter;
//			}
//
//			switch (Type.GetTypeCode(type))
//			{
//				case TypeCode.Int64:
//					odbcParameter.OdbcType = OdbcType.BigInt;
//					break;
//				case TypeCode.String:
//					odbcParameter.OdbcType = OdbcType.NVarChar;
//					break;
//				case TypeCode.DateTime:
//					odbcParameter.OdbcType = OdbcType.SmallDateTime;
//					break;
//				case TypeCode.Decimal:
//					odbcParameter.OdbcType = OdbcType.Numeric;
//					odbcParameter.Precision = 9;
//					odbcParameter.Scale = 0;
//					break;
//				case TypeCode.Boolean:
//					odbcParameter.OdbcType = OdbcType.Bit;
//					break;
//				case TypeCode.Double:
//					odbcParameter.OdbcType = OdbcType.Double;
//					break;
//				case TypeCode.Int32:
//					odbcParameter.OdbcType = OdbcType.Int;
//					break;
//				case TypeCode.Single:
//					odbcParameter.OdbcType = OdbcType.Real;
//					break;
//				case TypeCode.Int16:
//					odbcParameter.OdbcType = OdbcType.SmallInt;
//					break;
//				default:
//					odbcParameter.OdbcType = OdbcType.NVarChar;
//					break;
//			}
//
//			return odbcParameter;
//		}

		private static Object Get(OdbcDataReader dbReader, StaffPropertyInfo property)
		{
			Object value = dbReader[property.StaffFieldName];

			if (!(value is DBNull))
			{
				return value;
			}
			else
			{
				return property.CreateDefault();
			}
		}

		// Currently not in use...
		// Written in case this mapper should work for entities containing properties not in the Staff result.
		//        private static bool HasField(OdbcDataReader dbReader, string field)
		//        {
		//            for (int i = 0; i < dbReader.FieldCount; i++)
		//            {
		//                if (dbReader.GetName(i).Equals(field, StringComparison.InvariantCultureIgnoreCase))
		//                    return true;
		//            }
		//            return false;
		//        }

		private static List<StaffPropertyInfo> getStaffPropertyInfos<T>()
		{
			PropertyInfo[] propertyInfos = typeof(T).GetProperties();
			List<StaffPropertyInfo> result = new List<StaffPropertyInfo>(propertyInfos.Length);

			foreach (PropertyInfo property in propertyInfos)
			{
				if (!PropertyHelper.IsNotMapped(property))
				{
					result.Add(new StaffPropertyInfo(property));
				}
			}

			return result;
		}

		private void logCall(OdbcCommand dbCommand, string changedByUsername)
		{
			// Log all Staff calls for the moment
			//if (changedByUsername != null || log.IsDebugEnabled)
			//{
				string logText = dbCommand.CommandText;

				if (changedByUsername != null)
				{
					log.Info("User " + changedByUsername + " called: " + logText);
				}
				else
				{
					log.Debug(logText);
				}
			//}
		}
		#endregion

		#region Public call methods
		public List<T> CallStaffGetList<T>(string storedProcedure, params Object[] parameters)
		{
			return CallStaffGetListWithLog<T>(null, storedProcedure, parameters);
		}

		public List<T> CallStaffGetListWithLog<T>(string changedByUsername, string storedProcedure, params Object[] parameters)
		{
			try
			{
				using (OdbcCommand dbCommand = getOdbcCommand(storedProcedure, parameters))
				{
					dbCommand.Transaction = staffTransaction;
					logCall(dbCommand, changedByUsername);
					var stopwatch = new Stopwatch();
					stopwatch.Start();
					using (OdbcDataReader dbReader = dbCommand.ExecuteReader())
					{
						stopwatch.Stop();
						log.Debug(storedProcedure + ": " + stopwatch.Elapsed);
						List<T> result = new List<T>();
						var properties = getStaffPropertyInfos<T>();

						while (dbReader.Read())
						{
							T rowObject = Activator.CreateInstance<T>();
							foreach (StaffPropertyInfo property in properties)
							{
								property.SetValue(rowObject, Get(dbReader, property));
							}
							result.Add(rowObject);
						}

						return result;
					}
				}
			}
			catch (Exception e)
			{
                log.Error("CallStaffGetList " + storedProcedure + " failed. Paramters: " + String.Join(", ", parameters) + "\nError message: " + e.Message + "\n Stacktrace:\n" + e.StackTrace);
				throw e;
			}
		}

		public T CallStaffGetObject<T>(string storedProcedure, params Object[] parameters)
		{
			return CallStaffGetList<T>(storedProcedure, parameters).First();
		}

		public T CallStaffGetObjectWithLog<T>(string changedByUsername, string storedProcedure, params Object[] parameters)
		{
			return CallStaffGetListWithLog<T>(changedByUsername, storedProcedure, parameters).First();
		}

		public T CallStaffGetScalar<T>(string storedProcedure, params Object[] parameters)
		{
			return CallStaffGetScalarWithLog<T>(null, storedProcedure, parameters);
		}

		public T CallStaffGetScalarWithLog<T>(string changedByUsername, string storedProcedure, params Object[] parameters)
		{
			try
			{
				using (OdbcCommand dbCommand = getOdbcCommand(storedProcedure, parameters))
				{
					dbCommand.Transaction = staffTransaction;
					logCall(dbCommand, changedByUsername);

                    var stopwatch = new Stopwatch();
                    stopwatch.Start();

					T result = (T)dbCommand.ExecuteScalar();

                    stopwatch.Stop();
                    log.Debug(storedProcedure + ": " + stopwatch.Elapsed);

					return result;
				}
			}
			catch (Exception e)
			{
                log.Error("CallStaffGetScalar " + storedProcedure + " failed. Paramters: " + String.Join(", ", parameters) + "\nError message: " + e.Message + "\n Stacktrace:\n" + e.StackTrace);
				throw e;
			}
		}

		public void CallStaffGetNull(string storedProcedure, params Object[] parameters)
		{
			CallStaffGetNullWithLog(null, storedProcedure, parameters);
		}

		public void CallStaffGetNullWithLog(string changedByUsername, string storedProcedure, params Object[] parameters)
		{
			try
			{
				using (OdbcCommand dbCommand = getOdbcCommand(storedProcedure, parameters))
				{
					dbCommand.Transaction = staffTransaction;
					logCall(dbCommand, changedByUsername);

                    var stopwatch = new Stopwatch();
                    stopwatch.Start();

					using (OdbcDataReader dbReader = dbCommand.ExecuteReader()) {}

                    stopwatch.Stop();
                    log.Debug(storedProcedure + ": " + stopwatch.Elapsed);
				}
			}
			catch (Exception e)
			{
                log.Error("CallStaffGetNull " + storedProcedure + " failed. Paramters: " + String.Join(", ", parameters) + "\nError message: " + e.Message + "\n Stacktrace:\n" + e.StackTrace);
				throw e;
			}
		}
		#endregion

		#region Transaction methods
		public void BeginTransaction()
		{
			staffTransaction = staffConnection.BeginTransaction();
		}

		public void Commit()
		{
			staffTransaction.Commit();
			staffTransaction.Dispose();
			staffTransaction = null;
		}

		public void Rollback()
		{
			staffTransaction.Rollback();
			staffTransaction.Dispose();
			staffTransaction = null;
		}
		#endregion

		#region Interface methods
		public void Dispose()
		{
			staffConnection.Dispose();
			staffConnection.Close();
			staffConnection = null;
			//log.Debug("staffConnection closed");
		}
		#endregion
	}
}
