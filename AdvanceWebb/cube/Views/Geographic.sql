
CREATE view [cube].[Geographic] AS 
SELECT     
Extension.Extension,
AreaCode.AreaCode, 
AreaCode.Area, 
AreaCode.AreaId, 
Region.SortOrder, 
Region.RegionId ,
Region.Region

FROM         
                      Extension left JOIN
						AreaCode ON AreaCode.AreaId = Extension.AreaId left JOIN
                      Region ON AreaCode.RegionId = Region.RegionId
                      

