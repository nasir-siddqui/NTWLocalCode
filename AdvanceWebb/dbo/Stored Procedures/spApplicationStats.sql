


CREATE PROCEDURE spApplicationStats AS

/*
create table #totals (title varchar(30), total int, active int, sortOrder int)
insert into #totals (sortOrder, title, total) select 10, 'Advancenummer', count(*) from advanceExtension 
update #totals set active = (select [Value] from [Statistics] where type = 'ActiveBNo') Where title = 'Advancenummer'
insert into #totals (sortOrder, title, total) select 20, '- Sparas 15 månader', count(*) from advanceExtension where subscribed = 1
insert into #totals (sortOrder, title, total) select 40, 'Svarsställen', count(*) from answerExtension
update #totals set active = (select [Value] from [Statistics] where type = 'ActiveCNo') Where title = 'Svarsställen'
insert into #totals (sortOrder, title, total) select 60, 'Samtalsposter', rows from sysindexes where id=object_id('calldata') and indid=0
insert into #totals (sortOrder, title, total) select 80, 'Anropsposter', rows from sysindexes where id=object_id('callstatistic') and indid=0
*/
create table #totals (title varchar(30), total int, active int, m15 int, sortOrder int)
insert into #totals (sortOrder, title, total) select 10, 'Nummer', count(*) from advanceExtension 
update #totals set active = (select [Value] from [Statistics] where type = 'ActiveBNo') Where title = 'Nummer'
update #totals set m15 = (select count(*) from advanceExtension where subscribed = 1) where title = 'Nummer'
insert into #totals (sortOrder, title, total) select 40, 'Svarsställen', count(*) from answerExtension
update #totals set active = (select [Value] from [Statistics] where type = 'ActiveCNo') Where title = 'Svarsställen'
update #totals set m15 = (select count(*) from answerExtension AN inner join advanceExtension AD on (AN.AdvanceExtId = AD.AdvanceExtId) where AD.subscribed = 1) where title = 'Svarsställen'
insert into #totals (sortOrder, title, active) select 60, 'Samtalsposter', rows from sysindexes where id=object_id('calldata') and indid=0
update #totals set m15 = (select [Value] from [Statistics] where type = 'TotalCNo') Where title = 'Samtalsposter'
insert into #totals (sortOrder, title, active) select 80, 'Anropsposter', rows from sysindexes where id=object_id('callstatistic') and indid=0


create table #service (title varchar(30), total int, a int, ad int, d int, v int, admin int, sale int, logonCount int, sortOrder int)

insert into #service (sortOrder, title, total) select 110, 'Användare', rows from sysindexes where id=object_id('users') and indid=0
--update #service set a = (select count(*) from users where  left(Security,1)='0' and substring(Security,7,1)>'0' and substring(Security,5,1)='0') where title = 'Användare'
update #service set a = (select count(*) from users where  substring(Security,7,1)>'0' and substring(Security,5,1)='0') where title = 'Användare'
--update #service set ad = (select count(*) from users where  left(Security,1)>'0' and substring(Security,7,1)>'0' and substring(Security,5,1)='0') where title = 'Användare'
--update #service set d = (select count(*) from users where  left(Security,1)>'0' and substring(Security,7,1)='0' and substring(Security,5,1)='0') where title = 'Användare'
update #service set d = (select count(*) from users where  left(Security,1)>'0' and substring(Security,5,1)='0') where title = 'Användare'
update #service set v = (select count(*) from users where  left(Security,1)='0' and substring(Security,7,1)='0' and substring(Security,5,1)='0') where title = 'Användare'
update #service set admin = (select count(*) from users where substring(Security,5,1)>'3') where title = 'Användare'
update #service set sale = (select count(*) from users where substring(Security,5,1)>'0' and substring(Security,5,1)<'4') where title = 'Användare'
update #service set logonCount = (select count(*) from userSettings where datediff(day, logonDate, getdate()) < 30) where title = 'Användare'


insert into #service (sortOrder, title, total) select 120, 'Bolag', rows from sysindexes where id=object_id('companyInfo') and indid=1
--update #service set a = (select count(*) from companyInfo where ActiveStat = '1' and not ActiveVIP='1') where title = 'Bolag'
update #service set a = (select count(*) from companyInfo where ActiveStat = '1') where title = 'Bolag'
--update #service set ad = (select count(*) from companyInfo where ActiveStat = '1' and ActiveVIP='1') where title = 'Bolag'
--update #service set d = (select count(*) from companyInfo where not ActiveStat = '1' and  ActiveVIP='1') where title = 'Bolag'
update #service set d = (select count(*) from companyInfo where ActiveVIP='1') where title = 'Bolag'
update #service set v = (select count(*) from companyInfo where not ActiveStat = '1' and not ActiveVIP='1') where title = 'Bolag'

insert into #service (sortOrder, title, total) select 130, 'Koncerner', rows from sysindexes where id=object_id('groupInfo') and indid=1

-- Analys, Aktiva
create table #detailsA (title varchar(30), total int, tTot int, t020 int, t077 int, t900 int, tFree int, uTot int, u020 int, u077 int, u900 int, uFree int, rTot int, r020 int, r077 int, r900 int, rFree int, sortOrder int)
create table #advNr (number varchar(30))

insert into #detailsA (sortOrder, title, total) select 210, 'Kundanvändare', count(*) from (select distinct userId from vUserAdvanceNumbers where substring(Security,5,1)='0' and substring(Security,7,1)>'0') as E

update #detailsA set tTot = (select count(*) from (select distinct userId from vUserAdvanceNumbers where substring(Security,7,1)>'0' and substring(Security,7,1)<'3') as E) where title = 'Kundanvändare'
update #detailsA set t020 = (select count(*) from (select distinct userId from vUserAdvanceNumbers where substring(Security,7,1)>'0' and substring(Security,7,1)<'3' and left(number,3) = '020' and left(number,5) <> '02070') as E) where title = 'Kundanvändare'
update #detailsA set t077 = (select count(*) from (select distinct userId from vUserAdvanceNumbers where substring(Security,7,1)>'0' and substring(Security,7,1)<'3' and left(number,3) = '077') as E) where title = 'Kundanvändare'
update #detailsA set t900 = (select count(*) from (select distinct userId from vUserAdvanceNumbers where substring(Security,7,1)>'0' and substring(Security,7,1)<'3' and left(number,2) = '09') as E) where title = 'Kundanvändare'
update #detailsA set tFree = (select count(*) from (select distinct userId from vUserAdvanceNumbers where substring(Security,7,1)>'0' and substring(Security,7,1)<'3' and left(number,5) = '02070') as E) where title = 'Kundanvändare'

update #detailsA set uTot = (select count(*) from (select distinct userId from vUserAdvanceNumbers where substring(Security,7,1)>'2') as E) where title = 'Kundanvändare'
update #detailsA set u020 = (select count(*) from (select distinct userId from vUserAdvanceNumbers where substring(Security,7,1)>'2' and left(number,3) = '020' and left(number,5) <> '02070') as E) where title = 'Kundanvändare'
update #detailsA set u077 = (select count(*) from (select distinct userId from vUserAdvanceNumbers where substring(Security,7,1)>'2' and left(number,3) = '077') as E) where title = 'Kundanvändare'
update #detailsA set u900 = (select count(*) from (select distinct userId from vUserAdvanceNumbers where substring(Security,7,1)>'2' and left(number,2) = '09') as E) where title = 'Kundanvändare'
update #detailsA set uFree = (select count(*) from (select distinct userId from vUserAdvanceNumbers where substring(Security,7,1)>'2' and left(number,5) = '02070') as E) where title = 'Kundanvändare'

update #detailsA set rTot = (select count(*) from (select distinct userId from vUserAdvanceNumbers where substring(Security,9,1)>'0' ) as E) where title = 'Kundanvändare'
update #detailsA set r020 = (select count(*) from (select distinct userId from vUserAdvanceNumbers where substring(Security,9,1)>'0' and left(number,3) = '020' and left(number,5) <> '02070') as E) where title = 'Kundanvändare'
update #detailsA set r077 = (select count(*) from (select distinct userId from vUserAdvanceNumbers where substring(Security,9,1)>'0' and left(number,3) = '077') as E) where title = 'Kundanvändare'
update #detailsA set r900 = (select count(*) from (select distinct userId from vUserAdvanceNumbers where substring(Security,9,1)>'0' and left(number,2) = '09') as E) where title = 'Kundanvändare'
update #detailsA set rFree = (select count(*) from (select distinct userId from vUserAdvanceNumbers where substring(Security,9,1)>'0' and left(number,5) = '02070') as E) where title = 'Kundanvändare'

/*
update #detailsA set t020 = (select count(*) from users where substring(Security,7,1)>'0' and substring(Security,7,1)<'3' and substring(Security,5,1)='0') where title = 'Kundanvändare'
update #detailsA set t077 = (select count(*) from users where substring(Security,7,1)>'0' and substring(Security,7,1)<'3' and substring(Security,5,1)='0') where title = 'Kundanvändare'
update #detailsA set t900 = (select count(*) from users where substring(Security,7,1)>'0' and substring(Security,7,1)<'3' and substring(Security,5,1)='0') where title = 'Kundanvändare'
update #detailsA set tFree = (select count(*) from users where substring(Security,7,1)>'0' and substring(Security,7,1)<'3' and substring(Security,5,1)='0') where title = 'Kundanvändare'
update #detailsA set u020 = (select count(*) from users where substring(Security,7,1)>'2' and substring(Security,5,1)='0') where title = 'Kundanvändare'
update #detailsA set r020 = (select count(*) from users where substring(Security,9,1)>'0' and substring(Security,5,1)='0') where title = 'Kundanvändare'
*/

insert into #detailsA (sortOrder, title, total) select 230, 'Aktiva nummer', count(*) from users where substring(Security,5,1)='0' 
update #detailsA set total = (select count(*) from (select distinct AE.AdvanceExtId from advanceExtension AE inner join userAdvanceNumbers UAN on (AE.AdvanceExtId = UAN.AdvanceExtId) inner join users U on (UAN.UserId = U.UserId)
		where  substring(U.Security,5,1)='0') as E) where title = 'Aktiva nummer'

truncate table #advNr
insert into #advNr (number) select number from 
	(select AE.number 
	 from 	advanceExtension AE inner join
		userAdvanceNumbers UAN on (AE.AdvanceExtId = UAN.AdvanceExtId) inner join 
		users U on (UAN.UserId = U.UserId)
	 where  	substring(U.Security,7,1)>'0' and 
		substring(U.Security,5,1)='0' 
	 group by Ae.number 
	 having max(substring(U.Security,7,1))<'3') as E

update #detailsA set tTot = (select count(*) from (select number from #advNr) as E) where title = 'Aktiva nummer'
update #detailsA set t020 = (select count(*) from (select number from #advNr where left(number,3) = '020' and left(number,5) <> '02070') as E) where title = 'Aktiva nummer'
update #detailsA set t077 = (select count(*) from (select number from #advNr where left(number,3) = '077') as E) where title = 'Aktiva nummer'
update #detailsA set t900 = (select count(*) from (select number from #advNr where left(number,2) = '09') as E) where title = 'Aktiva nummer'
update #detailsA set tFree = (select count(*) from (select number from #advNr where left(number,5) = '02070') as E) where title = 'Aktiva nummer'

truncate table #advNr
insert into #advNr (number) select number from 
	(select distinct AE.number 
	from 	advanceExtension AE inner join 
		userAdvanceNumbers UAN on (AE.AdvanceExtId = UAN.AdvanceExtId) inner join 
		users U on (UAN.UserId = U.UserId)
	where 	substring(U.Security,7,1)>'2' and 
		substring(U.Security,5,1)='0') as E

update #detailsA set uTot = (select count(*) from (select number from #advNr) as E) where title = 'Aktiva nummer'
update #detailsA set u020 = (select count(*) from (select number from #advNr where left(number,3) = '020' and left(number,5) <> '02070') as E) where title = 'Aktiva nummer'
update #detailsA set u077 = (select count(*) from (select number from #advNr where left(number,3) = '077') as E) where title = 'Aktiva nummer'
update #detailsA set u900 = (select count(*) from (select number from #advNr where left(number,2) = '09') as E) where title = 'Aktiva nummer'
update #detailsA set uFree = (select count(*) from (select number from #advNr where left(number,5) = '02070') as E) where title = 'Aktiva nummer'

truncate table #advNr
insert into #advNr (number) select number from 
	(select distinct AE.number 
	from	advanceExtension AE inner join 
		userAdvanceNumbers UAN on (AE.AdvanceExtId = UAN.AdvanceExtId) inner join 
		users U on (UAN.UserId = U.UserId)
	where 	substring(U.Security,9,1)>'0' and 
		substring(U.Security,5,1)='0') as E

update #detailsA set rTot = (select count(*) from (select number from #advNr) as E) where title = 'Aktiva nummer'
update #detailsA set r020 = (select count(*) from (select number from #advNr where left(number,3) = '020' and left(number,5) <> '02070') as E) where title = 'Aktiva nummer'
update #detailsA set r077 = (select count(*) from (select number from #advNr where left(number,3) = '077') as E) where title = 'Aktiva nummer'
update #detailsA set r900 = (select count(*) from (select number from #advNr where left(number,2) = '09') as E) where title = 'Aktiva nummer'
update #detailsA set rFree = (select count(*) from (select number from #advNr where left(number,5) = '02070') as E) where title = 'Aktiva nummer'

-- Direktstyrning, Akitva
create table #detailsD (title varchar(30), total int, dt int, dn int, sortOrder int)

insert into #detailsD (sortOrder, title, total) select 310, 'Kundanvändare', count(*) from users where substring(Security,5,1)='0' and left(security,1) > '0'

update #detailsD set dt = (select count(*) from users where left(Security,1)>'0' and left(Security,1)<'4' and substring(Security,5,1)='0') where title = 'Kundanvändare'
update #detailsD set dn = (select count(*) from users where left(Security,1)>'3' and substring(Security,5,1)='0') where title = 'Kundanvändare'

insert into #detailsD (sortOrder, title) select 330, 'Aktiva nummer' 
--update #detailsD set total = (select count(*) from (select distinct AE.AdvanceExtId from advanceExtension AE inner join userAdvanceNumbers UAN on (AE.AdvanceExtId = UAN.AdvanceExtId) inner join users U on (UAN.UserId = U.UserId)
--		where  substring(U.Security,5,1)='0') as E) where title = 'Aktivanummer'




insert into applicationStats (Date, Type, Title, Total, i1, i2, sortorder) select getdate(), 'Total', title, total, active, m15, sortorder from #totals
insert into applicationStats (Date, Type, Title, Total, i1, i2, i3, i4, i5, i6, i7, sortorder) select getdate(), 'Service', title, total, a, ad, d, v, admin, sale, logonCount, sortorder from #service
insert into applicationStats (Date, Type, Title, Total, i1, i2, i3, i4, i5, i6, i7, i8, i9, i10, i11, i12, i13, i14, i15, sortorder) select getdate(), 'DetailsA', title, total, t020, t077, t900, tFree, u020, u077, u900, uFree, r020, r077, r900, rFree, tTot, uTot, rTot, sortorder from #detailsA
insert into applicationStats (Date, Type, Title, Total, sortorder) select getdate(), 'DetailsD', title, total, sortorder from #detailsD