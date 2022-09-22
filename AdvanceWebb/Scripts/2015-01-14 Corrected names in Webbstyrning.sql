USE AdvanceWebb

UPDATE QuickHelps
SET Controller = 'Webbstyrning'
WHERE Controller = 'Webstyrning'

UPDATE QuickHelps
SET Action = 'Webbstyrning_Abonnemang'
WHERE Action = 'Webstyrning_Abonnemang'

UPDATE QuickHelps
SET Controller = 'Multistyrning'
WHERE Action LIKE 'Multistyrning%'

UPDATE QuickHelps
SET Action = 'Index'
WHERE Controller = 'Multistyrning'
AND Action = 'Multistyrning'

UPDATE QuickHelps
SET Action = 'Alternativ_Create'
WHERE Controller = 'Multistyrning'
AND Action = 'Multistyrning_Alternativ_Create'

UPDATE QuickHelps
SET Action = 'Kö_Create'
WHERE Controller = 'Multistyrning'
AND Action = 'Multistyrningskö_Create'

UPDATE QuickHelps
SET Action = 'Abonnemang'
WHERE Controller = 'Webbstyrning'
AND Action = 'Webbstyrning_Abonnemang'