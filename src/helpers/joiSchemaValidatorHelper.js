const validateSchema = (schema, data) => {

    const validated = schema.validate(data);

    if ( validated.error && validated.error.details ) {
        throw new Error(formatErrorMessages(validated.error.details));
    } else {
        return validated.value;
    }

};

const formatErrorMessages = (errorDetails) => {

    let allErrors = '';
    for ( const error of errorDetails ) {
        allErrors += error.message + '\n';
    }
    return allErrors;

};

export default validateSchema;
