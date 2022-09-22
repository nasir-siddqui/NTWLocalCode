

CREATE PROCEDURE [dbo].[updateIntervalId] 
AS

update mpsdata set intervalId = 
case 
when callduration < 6 then 1
when callduration < 11 then 2
when callduration < 16 then 3 
when callduration < 21 then 4 
when callduration < 31 then 5 
when callduration < 41 then 6
when callduration < 46 then 7
when callduration < 61 then 8
when callduration < 121 then 9
when callduration < 181 then 10 
when callduration < 301 then 11 
when callduration < 421 then 12 
when callduration < 601 then 13 
when callduration < 901 then 14 
when callduration < 1201 then 15 
when callduration < 1801 then 16 
when callduration < 2401 then 17 
when callduration < 2701 then 18 
when callduration < 3601 then 19 
when callduration < 7201 then 20 
when callduration < 10801 then 21 
when callduration < 18001 then 22 
else 23 end
