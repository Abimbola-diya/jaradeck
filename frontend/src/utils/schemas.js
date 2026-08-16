import { z } from 'zod';

// ── Primitives ────────────────────────────────────────────────────────────────

const nigerianPhone = z
  .string()
  .min(1, 'Phone number is required.')
  .transform((v) => v.replace(/[\s\-()]/g, ''))
  .refine(
    (v) =>
      /^0[789][01]\d{8}$/.test(v) ||
      /^(\+?234)[789][01]\d{8}$/.test(v) ||
      (/^\+?\d{10,15}$/.test(v)),
    'Enter a valid phone number (e.g. 08012345678 or +2348012345678).'
  );

const email = z
  .string()
  .min(1, 'Email address is required.')
  .email('Enter a valid email address (e.g. name@example.com).');

const password = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter.')
  .regex(/\d/, 'Password must contain at least one number.');

const fullName = z
  .string()
  .min(2, 'Please enter your full name.')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes.');

const url = z
  .string()
  .min(1, 'Please enter a URL.')
  .url('Enter a valid URL (e.g. https://example.com).');

// ── Onboarding ────────────────────────────────────────────────────────────────

export const signInSchema = z.object({
  email,
  password: z.string().min(1, 'Please enter your password.'),
});

export const signUpSchema = z.object({
  email,
  password,
});

export const profileSchema = z.object({
  fullName,
  email,
  password,
  portfolioLink: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.portfolioLink !== undefined && data.portfolioLink.trim() !== '') {
    const result = z.string().url().safeParse(data.portfolioLink.trim());
    if (!result.success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['portfolioLink'], message: 'Enter a valid URL for your portfolio.' });
    }
  }
});

// ── Waitlist ──────────────────────────────────────────────────────────────────

export const waitlistNameSchema = z.object({
  name: z.string().min(2, 'Please enter at least 2 characters.'),
});

export const waitlistContactSchema = z.object({
  whatsapp: z.union([nigerianPhone, z.literal('')]).optional(),
  email: z.union([email, z.literal('')]).optional(),
  x: z.string().optional(),
  instagram: z.string().optional(),
});

// ── Apply page (basics step) ──────────────────────────────────────────────────

export const applyBasicsSchema = z.object({
  name: fullName,
  university: z.string().min(2, 'Please enter your university.'),
  level: z.string().min(1, 'Please enter your level (e.g. 100L).'),
  phone: nigerianPhone,
  email,
});

export const applyProofLinkSchema = z.string().url('Enter a valid URL (e.g. https://behance.net/you).');

// ── Withdraw ──────────────────────────────────────────────────────────────────

export const withdrawAmountSchema = (availableBalance) =>
  z.object({
    amount: z
      .number({ invalid_type_error: 'Enter a valid amount.' })
      .positive('Amount must be greater than zero.')
      .max(availableBalance, 'Amount exceeds current balance.'),
  });
