using System;
using System.Reflection;

namespace Telia.NTW.Core.Staff
{
    class StaffPropertyInfo
    {
        private readonly PropertyInfo PropertyInfo;

        public StaffPropertyInfo(PropertyInfo propertyInfo)
        {
            this.PropertyInfo = propertyInfo;
            CalculateStaffFieldName();
            CalculateNullable();
        }

        private string staffFieldName;
        public string StaffFieldName
        {
            get
            {
                return staffFieldName;
            }
        }

        private bool isNullable;

        public void SetValue(Object obj, Object value)
        {
            PropertyInfo.SetValue(obj, value);
        }

        private void CalculateStaffFieldName()
        {
	        if (PropertyInfo.Name.Equals("_"))
		        staffFieldName = "";
			else
				staffFieldName = PropertyInfo.Name.Replace('_', ' ');
        }

        private void CalculateNullable()
        {
            Type type = PropertyInfo.PropertyType;
            isNullable = (!type.IsValueType || Nullable.GetUnderlyingType(type) != null);
        }

        public Object CreateDefault()
        {
            if (isNullable)
            {
                return null;
            }
            else
            {
                return Activator.CreateInstance(PropertyInfo.PropertyType);
            }
        }
    }
}
