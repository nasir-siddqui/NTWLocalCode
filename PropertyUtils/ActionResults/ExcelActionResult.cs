using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using Sigma.Utils.Attributes;
using Sigma.Utils.Entities;
using Sigma.Utils.Helpers;

namespace Sigma.Utils.ActionResults
{
	public class ExcelActionResult : FileResult
	{
		public OrderedDictionary<string, IList> Data { get; set; }
		public Color OddRowBg { get; set; }
		public Color HeadingBg { get; set; }

		private readonly ExcelPackage Pck = new ExcelPackage();

		public ExcelActionResult(string fileName)
			: base("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
		{
			FileDownloadName = fileName;
			OddRowBg = Color.Lavender;
			HeadingBg = Color.LightGray;
		}

		public ExcelActionResult(IList data, string fileAndSheetName)
			: this (fileAndSheetName)
		{
			Data = new OrderedDictionary<string, IList> {{fileAndSheetName, data}};
		}

		public ExcelActionResult(object data, string fileName) : this (fileName)
		{
			List<PropertyInfo> dataProperties =
				data.GetType().GetProperties().Where(p => typeof(IList).IsAssignableFrom(p.PropertyType) && !p.HasAttribute(typeof(ExcludeFromExcelAttribute))).ToList();

			Data = new OrderedDictionary<string, IList>();
			foreach (PropertyInfo property in dataProperties)
			{
				Data.Add(property.GetDisplayName(), (IList)property.GetValue(data));
			}
		}

		public ExcelActionResult(OrderedDictionary<string, IList> data, string fileName)
			: this (fileName)
		{
			this.Data = data;
		}

		public void CreateSpreadsheet()
		{
			AddSheets();
		}

		private void AddSheets()
		{
			foreach (string sheetName in Data.Keys)
			{
				ExcelWorksheet sheet = Pck.Workbook.Worksheets.Add(sheetName);
				var columnInfos = AddHeadings(sheet, Data[sheetName]);
				AddData(sheet, Data[sheetName]);
				AutoFitColumns(sheet, columnInfos);
			}
		}

		private List<BasicPropertyInfo> AddHeadings(ExcelWorksheet sheet, IList sheetData)
		{
			List<BasicPropertyInfo> columnInfos = PropertyHelper.GetBasicPropertyInfos(sheetData, typeof(ExcludeFromExcelAttribute));

			for (int i = 0; i < columnInfos.Count; i++)
			{
				var column = i + 1;
				var cell = sheet.Cells[1, column];

				var fill = cell.Style.Fill;
				fill.PatternType = ExcelFillStyle.Solid;
				fill.BackgroundColor.SetColor(HeadingBg);
				cell.Style.Font.Bold = true;
				cell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

				cell.Value = columnInfos[i].DisplayName;
				sheet.Column(column).Style.Numberformat.Format = GetNumberFormat(columnInfos[i].Type);
			}

			return columnInfos;
		}

		private void AddData(ExcelWorksheet sheet, IList sheetData)
		{
			for (int i = 0; i < sheetData.Count; i++)
			{
				int row = i + 2;
				List<object> values = PropertyHelper.GetValues(sheetData[i], typeof(ExcludeFromExcelAttribute));

				for (int j = 0; j < values.Count; j++)
				{
					int column = j + 1;
					var cell = sheet.Cells[row, column];

					cell.Value = values[j];

					if (i % 2 != 0)
					{
						var fillOdds = cell.Style.Fill;
						fillOdds.PatternType = ExcelFillStyle.Solid;
						fillOdds.BackgroundColor.SetColor(OddRowBg);
					}
				}
			}
		}

		private void AutoFitColumns(ExcelWorksheet sheet, List<BasicPropertyInfo> columnInfos)
		{
			for (int i = 1; i <= columnInfos.Count; i++)
			{
				sheet.Column(i).AutoFit();
			}
		}

		private string GetNumberFormat(Type type)
		{
			Type underlyingType = Nullable.GetUnderlyingType(type);
			if (underlyingType != null)
			{
				type = underlyingType;
			}

			string format = "General";
			if (type == typeof(int))
				format = "0";
			else if (type == typeof(uint))
				format = "0";
			else if (type == typeof(long))
				format = "0";
			else if (type == typeof(ulong))
				format = "0";
			else if (type == typeof(short))
				format = "0";
			else if (type == typeof(ushort))
				format = "0";
			else if (type == typeof(double))
				format = "0.00";
			else if (type == typeof(float))
				format = "0.00";
			else if (type == typeof(decimal))
				format = "0";
			else if (type == typeof(DateTime))
				format = DateTimeFormatInfo.CurrentInfo.ShortDatePattern + " " + DateTimeFormatInfo.CurrentInfo.ShortTimePattern;
			else if (type == typeof(string))
				format = "@";
			else if (type == typeof(bool))
				format = "\"" + bool.TrueString + "\";\"" + bool.TrueString + "\";\"" + bool.FalseString + "\"";

			return format;
		}

		protected override void WriteFile(HttpResponseBase response)
		{
			CreateSpreadsheet();
			response.BinaryWrite(Pck.GetAsByteArray());
		}
	}
}