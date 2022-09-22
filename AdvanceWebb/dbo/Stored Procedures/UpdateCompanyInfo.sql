CREATE PROCEDURE UpdateCompanyInfo

AS

truncate table ToLongStaffbolag

/* lägger de företag som har för långt namn ((från tabellen staffbolag), som är längre än fältet companyid i tabellen companyinfo)  i tabellen PetersTabellToLongStaffbolag*/
/* företagen får uppdateras manuellt */

INSERT INTO ToLongStaffbolag (toLong,length,kundnamn,orgnr)
	SELECT (select COL_LENGTH ('companyinfo','companyname')-0)-(len(sb.kundnamn)) as to_long, (len(sb.kundnamn)) as length ,sb.kundnamn, ci.Orgnr from
	staffbolag sb inner join companyinfo ci on sb.orgnr=replace(ci.Orgnr,'-','')
	where sb.kundnamn<>ci.companyname and len(sb.kundnamn) >=(select COL_LENGTH ('companyinfo','companyname')-0)  order by sb.orgnr  desc

/*uppdaterar de  företag som har kortare namn än längden på fältet companyinfo*/
UPDATE companyinfo
	set  companyinfo.companyname =replace(replace(replace(sb.kundnamn,'/',' ') ,'&','o'),'.',' ') from
	staffbolag sb inner join companyinfo ci on  sb.orgnr=replace(ci.Orgnr,'-','') 
	where replace(ci.Orgnr,'-','') in 
(select replace(ci.Orgnr,'-','') from
	staffbolag sb inner join companyinfo ci on sb.orgnr=replace(ci.Orgnr,'-','')
	where sb.kundnamn<>ci.companyname and (len(sb.kundnamn) <(select COL_LENGTH ('companyinfo','companyname')-0)) 
)

/* visar de företag med för långt namn */
select * from ToLongStaffbolag