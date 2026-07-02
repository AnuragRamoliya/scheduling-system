import { NextFunction, Request, Response } from "express";
import { AnyZodObject, z } from "zod";

type RequestSchema = AnyZodObject | z.ZodEffects<AnyZodObject>;

export const validate = (schema: RequestSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const parsed = schema.parse({
    body: req.body,
    query: req.query,
    params: req.params
  });

  req.body = parsed.body ?? req.body;
  req.query = parsed.query ?? req.query;
  req.params = parsed.params ?? req.params;
  next();
};
