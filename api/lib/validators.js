import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().trim().min(3).max(20),
  email: z.string().trim().email(),
  password: z.string().min(6).max(72),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

const postDataSchema = z.object({
  title: z.string().trim().min(1),
  price: z.coerce.number().positive(),
  images: z.array(z.string()).optional(),
  address: z.string().trim().min(1),
  city: z.string().trim().min(1),
  bedroom: z.coerce.number().int().nonnegative(),
  bathroom: z.coerce.number().int().nonnegative(),
  sqft: z.coerce.number().optional(),
  yearBuilt: z.coerce.number().optional(),
  latitude: z.string().trim().min(1),
  longitude: z.string().trim().min(1),
  isFeatured: z.boolean().optional(),
  type: z.enum(["buy", "rent"]),
  property: z.enum(["apartment", "house", "villa", "townhouse", "condo", "land"]),
});

const postDetailSchema = z
  .object({
    desc: z.string().optional(),
    utilities: z.string().optional(),
    pet: z.string().optional(),
    income: z.string().optional(),
    size: z.coerce.number().optional(),
    school: z.coerce.number().optional(),
    bus: z.coerce.number().optional(),
    restaurant: z.coerce.number().optional(),
  })
  .optional();

export const addPostSchema = z.object({
  postData: postDataSchema,
  postDetail: postDetailSchema,
});

// Updates are partial: only the fields being changed need to be valid.
export const updatePostSchema = z.object({
  postData: postDataSchema.partial().optional(),
  postDetail: postDetailSchema,
});
