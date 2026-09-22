export const getAvatarUrl = (user) => {
  if (user?.Avatar && typeof user.Avatar === 'string' && user.Avatar.trim() !== '') {
    return user.Avatar;
  }
  const seed = encodeURIComponent(user?.name?.trim() || 'User');
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};
