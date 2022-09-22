UPDATE [Users]
SET LogonDate = UserSettings.LogonDate
FROM [Users]
INNER JOIN UserSettings
	ON [Users].UserId = UserSettings.UserId
