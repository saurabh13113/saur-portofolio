const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input = {}) {
  const { firstName, lastName, email, message } = input ?? {};
  const errors = {};

  if (!firstName?.trim()) errors.firstName = "First name is required.";
  if (!lastName?.trim()) errors.lastName = "Last name is required.";
  if (!email?.trim() || !EMAIL_RE.test(email.trim())) errors.email = "A valid email is required.";
  if (!message?.trim()) errors.message = "Message can't be empty.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      message: message.trim(),
    },
  };
}
