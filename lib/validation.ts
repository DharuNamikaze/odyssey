import { z } from 'zod';

// Habit validation schemas
export const createHabitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').trim(),
  type: z.enum(['new', 'quit'], { errorMap: () => ({ message: 'Type must be "new" or "quit"' }) }),
  category: z.enum(['wellness', 'learning', 'health', 'skill', 'digital'], {
    errorMap: () => ({ message: 'Invalid category' })
  }),
  target: z.number().int().min(1, 'Target must be at least 1').max(365, 'Target cannot exceed 365'),
});

export const updateHabitSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  type: z.enum(['new', 'quit']).optional(),
  category: z.enum(['wellness', 'learning', 'health', 'skill', 'digital']).optional(),
  target: z.number().int().min(1).max(365).optional(),
  completed: z.boolean().optional(),
});

export const toggleHabitCompletionSchema = z.object({
  completed: z.boolean({ required_error: 'Completed status is required' }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
});

// Page validation schemas
export const createPageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').trim(),
  content: z.string().optional().default(''),
  blocks: z.array(z.any()).optional().default([]),
});

export const updatePageSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  content: z.string().optional(),
  blocks: z.array(z.any()).optional(),
});

// User validation schemas
export const createUserSchema = z.object({
  Uid: z.string().min(1, 'User ID is required'),
  Email: z.string().email('Invalid email address'),
  Name: z.string().min(1, 'Name is required').max(100, 'Name too long').trim(),
  Level: z.number().int().min(1).default(1),
  Aura: z.number().int().min(0).default(0),
  LoginStreak: z.number().int().min(0).default(0),
  LogDays: z.number().int().min(0).default(0),
  CreatedAt: z.string().optional(),
  RecentLogin: z.string().optional(),
  Badges: z.array(z.string()).optional().default([]),
});

// Helper function to validate and return errors
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    return { success: false, errors: [{ field: 'unknown', message: 'Validation failed' }] };
  }
}
