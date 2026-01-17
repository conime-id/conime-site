export const getSimulatedUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('conime_sim_users') || '[]');
  } catch (e) {
    return [];
  }
};

// Basic User Type definition for storage
export const saveSimulatedUser = (user: any) => {
  const users = getSimulatedUsers();
  // Check if already exists to prevent duplicates (though validation should catch this)
  const existingIndex = users.findIndex((u: any) => u.username === user.username);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem('conime_sim_users', JSON.stringify(users));
};

export const updateSimulatedUser = (
  oldUsername: string, 
  newData: any
) => {
  let users = getSimulatedUsers();
  const index = users.findIndex((u: any) => u.username === oldUsername);
  
  if (index !== -1) {
    users[index] = { ...users[index], ...newData };
    localStorage.setItem('conime_sim_users', JSON.stringify(users));
  }
};

export const deleteSimulatedUser = (username: string) => {
  let users = getSimulatedUsers();
  const newUsers = users.filter((u: any) => u.username !== username);
  localStorage.setItem('conime_sim_users', JSON.stringify(newUsers));
};

export const findUser = (identifier: string) => {
  const users = getSimulatedUsers();
  return users.find((u: any) => 
    u.username === identifier || 
    u.email === identifier ||
    u.username === identifier.toLowerCase() ||
    u.email === identifier.toLowerCase()
  );
};

export const validateUsernameFormat = (username: string, language: 'id' | 'en' = 'id') => {
  const regex = /^[a-z0-9_.]+$/;
  
  if (username.length < 3 || username.length > 20) {
    return {
      valid: false,
      message: language === 'id' 
        ? 'Username harus 3-20 karakter' 
        : 'Username must be 3-20 characters'
    };
  }

  if (!regex.test(username)) {
    return {
      valid: false,
      message: language === 'id'
        ? 'Username hanya boleh huruf kecil, angka, titik, dan garis bawah (tanpa spasi)'
        : 'Username can only contain lowercase letters, numbers, dots, and underscores (no spaces)'
    };
  }

  return { valid: true };
};

export const checkAvailability = (
  username: string, 
  email: string, 
  language: 'id' | 'en' = 'id',
  currentUsername?: string, 
  currentEmail?: string
) => {
  const simUsers = getSimulatedUsers();
  const reservedUsers = ['otak_conime', 'admin', 'kaito_shinpachi'];
  const reservedEmails = ['admin@conime.id', 'user@test.com'];

  // Check Username
  // Only check if it's different from current (for edit profile)
  if (!currentUsername || username !== currentUsername) {
    // 1. Check Format First
    const formatCheck = validateUsernameFormat(username, language);
    if (!formatCheck.valid) {
      return {
        valid: false,
        field: 'username',
        message: formatCheck.message
      };
    }

    // 2. Check Availability
    const isTaken = 
      reservedUsers.includes(username) || 
      simUsers.some((u: any) => u.username === username);

    if (isTaken) {
      return { 
        valid: false, 
        field: 'username', 
        message: language === 'id' ? 'Username sudah digunakan' : 'Username is already taken' 
      };
    }
  }

  // Check Email
  if (!currentEmail || email !== currentEmail) {
    const isRegistered = 
      reservedEmails.includes(email) || 
      simUsers.some((u: any) => u.email === email);

    if (isRegistered) {
      return { 
        valid: false, 
        field: 'email', 
        message: language === 'id' ? 'Email sudah terdaftar' : 'Email is already registered' 
      };
    }
  }

  return { valid: true };
};
