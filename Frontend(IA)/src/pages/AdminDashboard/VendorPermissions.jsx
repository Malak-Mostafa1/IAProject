import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '../../api/user';
import toast from 'react-hot-toast';

const AVAILABLE_PERMISSIONS = ['AddProduct', 'UpdateProduct', 'DeleteProduct'];

const VendorPermissions = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (vendorId) {
      fetchVendorAndPermissions(parseInt(vendorId));
    }
  }, [vendorId]);

  const fetchVendorAndPermissions = async (id) => {
    try {
      const [userRes, permsRes] = await Promise.all([
        userApi.getById(id),
        userApi.getVendorPermissions(id),
      ]);
      setVendor(userRes.data);

      const currentPerms = permsRes.data;
      const initialPerms = AVAILABLE_PERMISSIONS.map(name => {
        const existing = currentPerms.find(p => p.permissionName === name);
        return {
          permissionName: name,
          isEnabled: existing ? existing.isEnabled : false,
        };
      });
      setPermissions(initialPerms);
    } catch (err) {
      toast.error('Failed to load vendor data');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (permissionName) => {
    setPermissions(prev =>
      prev.map(p =>
        p.permissionName === permissionName ? { ...p, isEnabled: !p.isEnabled } : p
      )
    );
  };

  const handleSave = async () => {
    if (!vendorId) return;
    setSaving(true);
    try {
      await userApi.updatePermissions(parseInt(vendorId), permissions);
      toast.success('Permissions updated successfully');
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Failed to update permissions';
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!vendor) return <div className="p-8">Vendor not found</div>;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="text-primary-600 hover:underline"
        >
          ← Back to Users
        </button>
        <h1 className="text-2xl font-bold font-serif">Permissions for {vendor.fullName}</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6 max-w-2xl">
        <p className="text-gray-600 mb-4">Email: {vendor.email}</p>
        <p className="text-gray-600 mb-6">Role: {vendor.role}</p>

        <h2 className="text-lg font-semibold mb-4">Product Permissions</h2>
        <p className="text-sm text-gray-500 mb-4">
          These permissions control whether the vendor can add, update, or delete their products.
        </p>
        <div className="space-y-3">
          {permissions.map(perm => (
            <label key={perm.permissionName} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={perm.isEnabled}
                onChange={() => handleToggle(perm.permissionName)}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-gray-700">{perm.permissionName}</span>
            </label>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorPermissions;