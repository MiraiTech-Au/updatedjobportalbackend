import Schema from 'validate';

// define req body validation

const personalInfoSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        message: {
            type: 'First name must be a string.',
            required: 'First name is required.',
        },
    },
    primaryContact: {
        type: String,
        required: false, // Adjust as needed
        message: {
            type: 'Primary Contact must be a string.',
        },
    },
    lastName: {
        type: String,
        required: true,
        message: {
            type: 'Last name must be a string.',
            required: 'Last name is required.',
        },
    },
    })
   
export const SingInValidation = new Schema({
    email: {
        type: String,
        required: true,
        message: {
            type: 'email must be a valid.',
            required: 'email  is required.',
        },
    },
    password: {
        type: String,
        required: true,
        message: {
            type: 'Password type must be a String.',
            required: 'Password type is required.',
        },
    },
    confirmPassword: {
        type: String,
        required: true,
        message: {
            type: 'ConfirmPassword must be a String.',
            required: 'ConfirmPassword is required.',
        },
    },
    personalInfo: personalInfoSchema
});


export const LoginValidation = new Schema({
    email: {
        type: String,
        required: true,
        message: {
            type: 'email must be a valid.',
            required: 'email  is required.',
        },
    },
    password: {
        type: String,
        required: true,
        message: {
            type: 'Password type must be a String.',
            required: 'Password is required.',
        },
    },
})