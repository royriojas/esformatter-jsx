async function getByEmailAndPassword({email, password}) {
  const isValid = await isValidEmail(email);

  if (!isValid) {
    return {
      token: 'INVALID_EMAIL'
    };
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return user;
  }
}

export async function getByEmailAndPassword(email, password) {
  const isValid = await validateEmail(email);

  if (!isValid) {
    return {
      token: 'INVALID_EMAIL'
    }
  }

  const matchingUser = await usersRepo.getUserByEmail(email);

  if (!matchingUser) {
    return {
      token: 'EMAIL_AND_PASSWORD_MISMATCH'
    };
  }

  const isCorrect = await compare(password, matchingUser.get('password'));

  if (!isCorrect) {
    return {
      token: 'EMAIL_AND_PASSWORD_MISMATCH'
    };
  }

  return {
    email: user.get('email'),
    first_name: user.get('first_name'),
    last_name: user.get('last_name'),
  };
}
