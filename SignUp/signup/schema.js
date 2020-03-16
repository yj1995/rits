export default {
  email: {
    presence: { allowEmpty: true, message: 'is required' },
    // email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: true, message: 'is required' },
    length: {
      maximum: 128
    }
  },
  mobile: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 10,
      minimum:10
    }
  },
  otp: {
    presence: { allowEmpty: true, message: 'is required' },
    // length: {
    //   maximum: 4,
    //   minimum:4
    // }
  }
};
