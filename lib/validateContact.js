const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const oneLine = (s) => s.trim().replace(/[\r\n]/g, " ");

export function validateContact(input = {}) {
  const { firstName, lastName, email, message, phone, service } = input ?? {};
  const errors = {};

  if (!firstName?.trim()) errors.firstName = "First name is required.";
  else if (firstName.trim().length > 100) errors.firstName = "First name is too long.";

  if (!lastName?.trim()) errors.lastName = "Last name is required.";
  else if (lastName.trim().length > 100) errors.lastName = "Last name is too long.";

  if (!email?.trim() || !EMAIL_RE.test(email.trim())) errors.email = "A valid email is required.";

  if (!message?.trim()) errors.message = "Message can't be empty.";
  else if (message.trim().length > 5000) errors.message = "Message is too long.";

  // optional extras
  if (typeof phone === "string" && phone.trim().length > 40) errors.phone = "Phone number is too long.";
  if (typeof service === "string" && service.trim().length > 100) errors.form = "Unknown service.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      firstName: oneLine(firstName),
      lastName: oneLine(lastName),
      email: email.trim(),
      message: message.trim(),
      phone: typeof phone === "string" ? oneLine(phone) : "",
      service: typeof service === "string" ? oneLine(service) : "",
    },
  };
}
