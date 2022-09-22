using System.Reflection;
using System.Web.Mvc;
using Autofac;
using Autofac.Integration.Mvc;
using Telia.NTW.Core.Entities;
using Telia.NTW.Core.Repository;
using Telia.NTW.Core.Services;

namespace Telia.NTW.OMT
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
			var webAssembly = Assembly.GetExecutingAssembly();
			var coreAssembly = typeof(AnvändareService).Assembly;

			builder
				.RegisterControllers(webAssembly);

			builder
				.RegisterAssemblyTypes(coreAssembly)
				.Where(t => t.Name.EndsWith("Service"));

			builder
				.RegisterAssemblyTypes(coreAssembly)
				.Where(t => t.Name.EndsWith("Helper"));

			builder.RegisterType<NtwEfModel>().InstancePerRequest();
		}
	}
}