using System;
using System.Linq;
using System.Linq.Expressions;
using Telia.NTW.Core.Entities;

namespace Telia.NTW.Core.Repository
{
	public class Repository<T> : IRepository<T> where T : class, IEntity
	{
		//protected readonly DbEntity<T> entry;
		protected readonly dynamic DataTable; // TODO remove

		public Repository(
			//DbContext dbContext
			)
		{
			//DataTable = dataContext.GetTable<T>();
			//var d= dbContext.Entry<T>();
			//entry.
		}

		public void Insert(T entity)
		{
			DataTable.InsertOnSubmit(entity);
		}

		public void Delete(T entity)
		{
			DataTable.DeleteOnSubmit(entity);
		}

		public IQueryable<T> SearchFor(Expression<Func<T, bool>> predicate)
		{
			return DataTable.Where(predicate);
		}

		public IQueryable<T> GetAll()
		{
			return DataTable;
		}

		public T GetById(int id)
		{
			// Sidenote: the == operator throws NotSupported Exception!
			// 'The Mapping of Interface Member is not supported'
			// Use .Equals() instead
			//return DataTable.Single(e => e.Id.Equals(id));
			return null;
		}
	}
}
