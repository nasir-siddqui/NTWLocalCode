



CREATE view [cube].[Time] AS

SELECT
	CAST(REPLACE(REPLACE(CONVERT(char(13),dateTime,120),'-',''),' ','') AS int) As DateTimeId,
	YEAR(dateTime) As Year,
	CAST(Year(dateTime) as CHAR(4)) As YearName,
	MONTH(dateTime) As MonthNumberOfYear,
	CASE 
		WHEN MONTH(dateTime) =  1 THEN 'Januari'
		WHEN MONTH(dateTime) =  2 THEN 'Februari'
		WHEN MONTH(dateTime) =  3 THEN 'Mars'
		WHEN MONTH(dateTime) =  4 THEN 'April'
		WHEN MONTH(dateTime) =  5 THEN 'Maj'
		WHEN MONTH(dateTime) =  6 THEN 'Juni'
		WHEN MONTH(dateTime) =  7 THEN 'Juli'
		WHEN MONTH(dateTime) =  8 THEN 'Augusti'
		WHEN MONTH(dateTime) =  9 THEN 'September'
		WHEN MONTH(dateTime) =  10 THEN 'Oktober'
		WHEN MONTH(dateTime) =  11 THEN 'November'
		WHEN MONTH(dateTime) =  12 THEN 'December'
      END As MonthName,
     CAST(REPLACE(CONVERT(char(10),dateTime,120),'-','') As int) As DateId,
     CONVERT(char(10),dateTime,120) As DateName,  
     DATEPART(dd, dateTime) as DayNumberOfMonth,
     DATEPART(dy, dateTime) As DayNumberOfYear,
     DATEPART(hh, dateTime) as HourNumberOfDay,
	 DATEPART(wk, dateTime) As WeekNumberOfYear,
     DATEPART(dw, dateTime) as WeekDayNumber,
     CASE 
		WHEN DATEPART(dw, dateTime) =  1 THEN 'Söndag'
		WHEN DATEPART(dw, dateTime) =  2 THEN 'Måndag'
		WHEN DATEPART(dw, dateTime) =  3 THEN 'Tisdag'
		WHEN DATEPART(dw, dateTime) =  4 THEN 'Onsdag'
		WHEN DATEPART(dw, dateTime) =  5 THEN 'Torsdag'
		WHEN DATEPART(dw, dateTime) =  6 THEN 'Fredag'
		WHEN DATEPART(dw, dateTime) =  7 THEN 'Lördag'
      END As WeekDayName
FROM
	dbo.TimeDimension
