

-- Used to see who has logged on 
CREATE PROCEDURE dbo.userStatistics30days
AS

SELECT Top 400 
	US.logonDate,
	U.Name,
	CI.CompanyName,
	Case WHEN eno is null then '' else '*' end  as KundWebb,
	Case left(Security,1) 
		When '0' then '' 
		When '3' then 'T' 
		When '5' then 'N' 
		When '7' then 'K' 
		When '9' then 'A' 
		Else left(Security,1) end as ActiveDirectControl,
	Case substring(Security,7,1) 
		When '0' then '' 
		When '1' then 'T' 
		When '3' then 'U' 
		When '5' then 'A' 
		When '6' then 'S' 
		When '9' then 'A' 
		Else substring(Security,7,1) end as ActiveAnalys
FROM 
	userSettings US inner join
	users U on (US.userId = U.userId) inner join
	companyInfo CI on (U.companyId = CI.companyId)
WHERE 
	DATEDIFF(day, US.logonDate, getdate()) < 30 AND DATEDIFF(day, US.logonDate, getdate()) > 0
ORDER BY 
	US.logonDate DESC
