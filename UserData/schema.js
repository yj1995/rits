export default {
    email: {
        presence: { allowEmpty: true, message: 'is required' },
        email: true,
        length: {
            maximum: 64
        }
    },
    mobileno: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            maximum: 10,
            minimum: 10
        }
    },
    name: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            minimum: 1
        }
    },
};

