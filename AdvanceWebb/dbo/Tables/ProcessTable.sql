CREATE TABLE [dbo].[ProcessTable] (
    [ProcessID]   INT          NOT NULL,
    [ProcessName] VARCHAR (50) NULL,
    [ProcessType] VARCHAR (25) NULL,
    [NoOfExec]    INT          NULL,
    [DeleteLimit] SMALLINT     NULL,
    CONSTRAINT [PK_ProcessTable] PRIMARY KEY CLUSTERED ([ProcessID] ASC) WITH (FILLFACTOR = 90)
);

