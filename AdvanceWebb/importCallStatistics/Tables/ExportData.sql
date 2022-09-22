CREATE TABLE [importCallStatistics].[ExportData] (
    [Id]                          INT            IDENTITY (1, 1) NOT NULL,
    [ANumber]                     NVARCHAR (255) NULL,
    [BNumber]                     NVARCHAR (255) NULL,
    [CNumber]                     NVARCHAR (255) NULL,
    [ChargeStartTime]             NVARCHAR (255) NULL,
    [ChargeStartHour]             NVARCHAR (255) NULL,
    [ChargeableDuration]          NVARCHAR (255) NULL,
    [ChargeableDurationIntervall] NVARCHAR (255) NULL,
    [CallType]                    NVARCHAR (255) NULL,
    [AreaId]                      NVARCHAR (255) NULL,
    [AreaCode]                    NVARCHAR (255) NULL
);

