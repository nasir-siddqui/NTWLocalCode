CREATE TABLE [importCallStatistics].[TransactionInformation] (
    [Id]               UNIQUEIDENTIFIER CONSTRAINT [DF_TransactionInformation_Id] DEFAULT (newid()) NULL,
    [SerialNumber]     NVARCHAR (50)    NULL,
    [FileName]         NVARCHAR (255)   NULL,
    [Date]             NVARCHAR (50)    NULL,
    [ExtractionDate]   DATETIME         CONSTRAINT [DF_aaaaa_ExtractionDate] DEFAULT (getdate()) NULL,
    [RowsInFile]       NUMERIC (12)     NULL,
    [ReadRowsFromFile] NUMERIC (12)     CONSTRAINT [DF_TransactionInformation_ReadRowsFromFile] DEFAULT ((0)) NULL,
    [ExportedRows]     NUMERIC (12)     CONSTRAINT [DF_aaaaa_ExportedRows] DEFAULT ((0)) NULL,
    [Success]          BIT              CONSTRAINT [DF_aaaaa_Success] DEFAULT ((0)) NULL,
    [Message]          NVARCHAR (MAX)   NULL
);

