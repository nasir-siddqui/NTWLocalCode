
CREATE PROCEDURE dbo.spGetUserAdvanceNumbers 
	@UserId	int
AS
declare @groupLvl	char(1),
	@groupId	int


select @groupLvl = substring(security,8,1), @groupId = groupId from users u inner join companyInfo C on U.CompanyId = C.CompanyId where U.UserId = @UserId

if @groupLvl > '1' and @groupId > 0 and @groupId <> 4 begin
	/* Hämta alla nummer som hör till koncernen */
	SELECT DISTINCT 
		AE.AdvanceExtId, AE.Number, UAN.AnalysisView, UAN.AnalysisRawData, AE.AnalysisView as maxView, AE.AnalysisRawData as maxRawData, 
		(CASE WHEN UAN.UserId = @UserId THEN 'Knutet' ELSE  'Ej Knutet' END) AS Connected, 
		(CASE WHEN UAN.AnalysisView > 0 THEN 'Inaktivera' ELSE 'Aktivera' END) AS Action 
	FROM
		Users U inner join 
		CompanyInfo CI on (U.companyId = CI.companyId) inner join 
		(
			select 
				GroupId, AdvanceExtId, Number, AnalysisView, AnalysisRawData 
			from 
				AdvanceExtension A inner join 
				CompanyInfo CG on (A.companyId = CG.CompanyId)
		) as AE on (CI.GroupId = AE.GroupId) left join 
		UserAdvanceNumbers UAN on (U.userId = UAN.userId and AE.AdvanceExtId = UAN.AdvanceExtId)
	WHERE 
		U.UserId = @UserId
	ORDER BY AE.Number
end else begin
	/* Hämta alla nummer som hör till bolaget */
	SELECT DISTINCT 
		AE.AdvanceExtId, AE.Number, UAN.AnalysisView, UAN.AnalysisRawData, AE.AnalysisView as maxView, AE.AnalysisRawData as maxRawData, 
		(CASE WHEN UAN.UserId = @UserId THEN 'Knutet' ELSE  'Ej Knutet' END) AS Connected, 
		(CASE WHEN UAN.AnalysisView > 0 THEN 'Inaktivera' ELSE 'Aktivera' END) AS Action 
	FROM
		Users U inner join 
		AdvanceExtension AE on (U.companyId = AE.companyId) left join 
		UserAdvanceNumbers UAN on (U.userId = UAN.userId and AE.AdvanceExtId = UAN.AdvanceExtId) 
	WHERE 
		U.UserId = @UserId
	ORDER BY AE.Number
end