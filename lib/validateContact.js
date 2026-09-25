const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input = {}) {
  const { firstName, lastName, email, message } = input ?? {};
  const errors = {};

  if (!firstName?.trim()) errors.firstName = "First name is required.";
  else if (firstName.trim().length > 100) errors.firstName = "First name is too long.";

  if (!lastName?.trim()) errors.lastName = "Last name is required.";
  else if (lastName.trim().length > 100) errors.lastName = "Last name is too long.";

  if (!email?.trim() || !EMAIL_RE.test(email.trim())) errors.email = "A valid email is required.";

  if (!message?.trim()) errors.message = "Message can't be empty.";
  else if (message.trim().length > 5000) errors.message = "Message is too long.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      firstName: firstName.trim().replace(/[\r\n]/g, " "),
      lastName: lastName.trim().replace(/[\r\n]/g, " "),
      email: email.trim(),
      message: message.trim(),
    },
  };
}
