export const hasPermission = (permissions, permissionName) => {
  const perm = permissions.find(p => p.permissionName === permissionName);
  return perm?.isEnabled || false;
};