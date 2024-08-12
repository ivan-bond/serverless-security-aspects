exports.bodyValidator = (schema) => ({
  before: (handler, next) => {
    const { body } = handler.event;
    if (!body) {
      throw new Error("Empty request body!");
    }

    const data = JSON.parse(body);

    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      const validationErrors = error.details.map(detail => detail.message);
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    next();
  },
});