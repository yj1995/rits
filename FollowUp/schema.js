export default {
    comment: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            minimum: 2
        }
    },
    followupDate: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            minimum: 10
        }
    },
    followUpTime: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            minimum: 5
        }
    },
};
