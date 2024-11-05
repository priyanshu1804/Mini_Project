const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ListnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name must be less than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
            },
            message: props => `'${props.value}' is not a valid email format. Please enter a valid email.`
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
            validator: function (password) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
            },
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        validate: {
            validator: function (phone) {
                return /^\+?\d{10,15}$/.test(phone);
            },
            message: props => `'${props.value}' is not a valid phone number. Please enter a valid phone number with or without country code.`
        }
    }
});
ListnerSchema.pre('save', async function (next) {
    const listner = this;
    if (!listner.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(listner.password, salt);
        listner.password = hashPassword;
        next();
    } catch (err) {
        return next(err);
    }
});
ListnerSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        throw err;
    }
}
const Listner = mongoose.model('Listner', ListnerSchema);
module.exports = Listner;
