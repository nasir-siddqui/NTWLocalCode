using Autofac;
using Autofac.Integration.Mvc;
using System.Configuration;
using System.Web.Mvc;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Repository;
using Telia.NTW.Core.Services;
using Telia.NTW.Core.Staff;
using Telia.NTW.Data.Analys.Services;
using Telia.NTW.Web.Filters;
using S = Telia.NTW.Web.Properties.Settings;

namespace Telia.NTW.Web
{
	public class DicConfig
	{
		public static void RegisterDic()
		{
			var builder = new ContainerBuilder();
			Configure(builder);

			var container = builder.Build();
			DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
		}

		private static void Configure(ContainerBuilder builder)
		{
			var webAssembly = typeof(MvcApplication).Assembly;
			var coreAssembly = typeof(AnalysService).Assembly;
			var analysAssembly = typeof(AnalysisServicesService).Assembly;

			builder
				.RegisterControllers(webAssembly);

			builder
				.RegisterAssemblyTypes(webAssembly)
				.Where(t => t.Name.EndsWith("Helper"));

			builder
				.RegisterAssemblyTypes(coreAssembly)
				.Where(t => t.Name.EndsWith("Service"));

			builder
				.RegisterAssemblyTypes(coreAssembly)
				.Where(t => t.Name.EndsWith("Helper")).InstancePerLifetimeScope();

			builder
				.RegisterAssemblyTypes(analysAssembly)
				.Where(t => t.Name.EndsWith("Service"));

			builder
				.RegisterType<NtwCodeFirstContext>()
				.InstancePerRequest();
				//.WithParameter("autoCreateDb", false);
				//.WithParameter("autoCreateDb", S.Default.AutoCreateDb);

			builder
				.RegisterType<AnalysisServicesService>()
				.InstancePerRequest()
				.WithParameter("connectionString", ConfigurationManager.ConnectionStrings["AdvanceWebbASConnection"].ConnectionString);

			builder.RegisterType<NtwEfModel>().InstancePerRequest();
		
			//builder
			//	.RegisterType<NtwContext>()
			//	.InstancePerHttpRequest();

			builder
				.RegisterGeneric(typeof(Repository<>));

			builder
				.RegisterType<StaffOdbcConnection>()
				.WithParameters(new[]
				{
					new NamedParameter("staffOdbcName", S.Default.StaffOdbcName),
					new NamedParameter("staffUsername", S.Default.StaffUsername),
					new NamedParameter("staffPassword", S.Default.StaffPassword)
				})
				.InstancePerRequest();

//			builder
//				.RegisterType<RoleHelper>().InstancePerLifetimeScope();

			builder
				.RegisterType<MeddelandeFilter>()
				.AsActionFilterFor<Controller>()
				.InstancePerRequest();

			builder
				.RegisterType<QuickHelpFilter>()
				.AsActionFilterFor<Controller>()
				.InstancePerRequest();

			builder
				.RegisterType<UserFilter>()
				.AsActionFilterFor<Controller>()
				.InstancePerRequest();

			builder
				.RegisterFilterProvider();
		}
	}
}