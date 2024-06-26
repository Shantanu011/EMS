USE [master]
GO
/****** Object:  Database [EMS_login]    Script Date: 5/27/2024 4:47:45 AM ******/
CREATE DATABASE [EMS_login]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'EMS_login', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\EMS_login.mdf' , SIZE = 4096KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'EMS_login_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\EMS_login_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [EMS_login] SET COMPATIBILITY_LEVEL = 110
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [EMS_login].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [EMS_login] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [EMS_login] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [EMS_login] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [EMS_login] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [EMS_login] SET ARITHABORT OFF 
GO
ALTER DATABASE [EMS_login] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [EMS_login] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [EMS_login] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [EMS_login] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [EMS_login] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [EMS_login] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [EMS_login] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [EMS_login] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [EMS_login] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [EMS_login] SET  DISABLE_BROKER 
GO
ALTER DATABASE [EMS_login] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [EMS_login] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [EMS_login] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [EMS_login] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [EMS_login] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [EMS_login] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [EMS_login] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [EMS_login] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [EMS_login] SET  MULTI_USER 
GO
ALTER DATABASE [EMS_login] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [EMS_login] SET DB_CHAINING OFF 
GO
ALTER DATABASE [EMS_login] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [EMS_login] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
USE [EMS_login]
GO
/****** Object:  User [RailMan]    Script Date: 5/27/2024 4:47:45 AM ******/

/****** Object:  Table [dbo].[department]    Script Date: 5/27/2024 4:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[department](
	[department_id] [int] IDENTITY(1,1) NOT NULL,
	[department_name] [varchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[department_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Employees]    Script Date: 5/27/2024 4:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Employees](
	[Emp_Id] [int] NOT NULL,
	[FirstName] [varchar](50) NOT NULL,
	[MiddleName] [varchar](50) NULL,
	[LastName] [varchar](50) NOT NULL,
	[email] [varchar](255) NOT NULL,
	[PhoneNo] [varchar](15) NOT NULL,
	[address] [varchar](100) NOT NULL,
	[gender] [varchar](10) NOT NULL,
	[role] [varchar](100) NOT NULL,
	[Dept_Id] [int] NOT NULL,
	[EmergencyContact] [varchar](15) NOT NULL,
	[UserName] [varchar](50) NOT NULL,
	[BloodGroup] [varchar](3) NOT NULL,
	[TotalLeave] [int] NOT NULL,
	[Password] [varchar](200) NOT NULL,
	[isPasswordChangeRequired] [bit] NOT NULL,
	[PasswordUpdated] [date] NULL,
	[isLocked] [bit] NOT NULL,
	[PrevPassword1] [varchar](200) NULL,
	[PrevPassword2] [varchar](200) NULL,
	[PrevPassword3] [varchar](200) NULL,
	[PrevPassword4] [varchar](200) NULL,
	[PrevPassword5] [varchar](200) NULL,
	[PaidLeave] [int] NULL,
	[SickLeave] [int] NULL,
	[UnpaidLeave] [int] NULL,
	[RemainingDays] [int] NULL,
	[join_date] [date] NOT NULL,
	[tagline] [varchar](255) NULL,
	[ProfilePicture] [varbinary](max) NULL,
 CONSTRAINT [PK__Employee__262359AB41A00170] PRIMARY KEY CLUSTERED 
(
	[Emp_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LeaveMgmt]    Script Date: 5/27/2024 4:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LeaveMgmt](
	[Leave_Id] [int] IDENTITY(1,1) NOT NULL,
	[fromDate] [date] NOT NULL,
	[toDate] [date] NOT NULL,
	[appliedTo] [varchar](60) NOT NULL,
	[reason] [varchar](200) NOT NULL,
	[leaveType] [varchar](10) NOT NULL,
	[Emp_Id] [int] NOT NULL,
	[LeaveStatus] [varchar](20) NULL,
	[SuperAdminStatus] [varchar](30) NULL,
	[AdminStatus] [varchar](30) NULL,
	[ReasonRejected] [varchar](255) NULL,
 CONSTRAINT [PK__LeaveMgm__D54C3B80E4E719E3] PRIMARY KEY CLUSTERED 
(
	[Leave_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Project]    Script Date: 5/27/2024 4:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Project](
	[Project_Id] [int] IDENTITY(1,1) NOT NULL,
	[title] [varchar](255) NOT NULL,
	[details] [text] NOT NULL,
	[status_comment] [text] NULL,
	[project_status] [varchar](100) NOT NULL,
	[project_lead] [int] NOT NULL,
	[project_member] [int] NOT NULL,
	[starting_date] [date] NOT NULL,
	[due_date] [date] NOT NULL,
	[completion_date] [date] NULL,
	[tag] [varchar](255) NULL,
	[Emp_Id] [int] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF_Employees_TotalLeave]  DEFAULT ((30)) FOR [TotalLeave]
GO
ALTER TABLE [dbo].[Employees] ADD  DEFAULT ((18)) FOR [PaidLeave]
GO
ALTER TABLE [dbo].[Employees] ADD  DEFAULT ((12)) FOR [SickLeave]
GO
ALTER TABLE [dbo].[Employees] ADD  DEFAULT ((0)) FOR [UnpaidLeave]
GO
ALTER TABLE [dbo].[Employees] ADD  DEFAULT ((30)) FOR [RemainingDays]
GO
ALTER TABLE [dbo].[LeaveMgmt] ADD  DEFAULT ('Pending') FOR [LeaveStatus]
GO
ALTER TABLE [dbo].[LeaveMgmt] ADD  DEFAULT ('Pending') FOR [SuperAdminStatus]
GO
ALTER TABLE [dbo].[LeaveMgmt] ADD  DEFAULT ('Pending') FOR [AdminStatus]
GO
ALTER TABLE [dbo].[Employees]  WITH CHECK ADD  CONSTRAINT [FK_DeptEMp] FOREIGN KEY([Dept_Id])
REFERENCES [dbo].[department] ([department_id])
GO
ALTER TABLE [dbo].[Employees] CHECK CONSTRAINT [FK_DeptEMp]
GO
ALTER TABLE [dbo].[LeaveMgmt]  WITH CHECK ADD  CONSTRAINT [FK_Emp_Id] FOREIGN KEY([Emp_Id])
REFERENCES [dbo].[Employees] ([Emp_Id])
GO
ALTER TABLE [dbo].[LeaveMgmt] CHECK CONSTRAINT [FK_Emp_Id]
GO
ALTER TABLE [dbo].[Project]  WITH CHECK ADD  CONSTRAINT [FK_EmpProj] FOREIGN KEY([Emp_Id])
REFERENCES [dbo].[Employees] ([Emp_Id])
GO
ALTER TABLE [dbo].[Project] CHECK CONSTRAINT [FK_EmpProj]
GO
USE [master]
GO
ALTER DATABASE [EMS_login] SET  READ_WRITE 
GO
