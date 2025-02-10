export const renderAvatarFallback = (name) => {
    const nameParts = name.split(' ');
    const firstNameInitial = nameParts[0]?.[0]?.toUpperCase();
    const lastNameInitial = nameParts[1]?.[0]?.toUpperCase();

    return `${firstNameInitial || ''}${lastNameInitial || ''}`;
  }
