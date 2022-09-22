

CREATE view [cube].[Interv] AS 

SELECT 
	--CAST(1 AS smallint) AS [IntervalId]
	--,CAST(1 AS int) AS [Interval]
	--,CAST('' AS varchar(10)) AS [Text]


	[IntervalId]
	,[Interval]
	,[Text]
	,CASE
		WHEN Interval <= 60 THEN 'Low'
		WHEN Interval > 60 AND Interval <= 300 THEN 'Medium'
		WHEN Interval > 300 THEN 'High'
		END AS IntervalRange
  FROM [dbo].[Interval]

