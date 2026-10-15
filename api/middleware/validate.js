// Validates req.body against a Zod schema. On success, req.body is replaced
// with the parsed (and coerced/trimmed) data. On failure, responds 400 with a
// flat list of field errors instead of letting bad input reach Prisma.
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(400).json({ message: "Invalid input", errors });
  }
  req.body = result.data;
  next();
};
