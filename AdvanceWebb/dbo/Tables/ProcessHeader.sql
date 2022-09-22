CREATE TABLE [dbo].[ProcessHeader] (
    [ProcessID]    INT           NOT NULL,
    [PID]          INT           IDENTITY (1, 1) NOT NULL,
    [Success]      BIT           CONSTRAINT [DF_ProcessHeader_Success] DEFAULT (0) NOT NULL,
    [StartDate]    DATETIME      CONSTRAINT [DF_ProcessHeader_StartDate] DEFAULT (getdate()) NOT NULL,
    [EndDate]      DATETIME      NULL,
    [ProcessOwner] VARCHAR (50)  NULL,
    [Note]         VARCHAR (100) NULL,
    CONSTRAINT [PK_ProcessHeader] PRIMARY KEY CLUSTERED ([PID] ASC) WITH (FILLFACTOR = 90)
);

