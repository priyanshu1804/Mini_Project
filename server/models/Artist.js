const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ArtistSchema = new mongoose.Schema({
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
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        trim: true,
        maxlength: [30, 'Genre must be less than 30 characters']
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [500, 'Biography must be less than 500 characters']
    },
    profilePicture: {
        type: String,
        trim: true,
        validate: {
            validator: function(url) {
                return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
            },
            message: props => `${props.value} is not a valid URL for a profile picture`
        }
    },
    socialLinks: {
        type: Map,
        of: String,
        validate: {
            validator: function(links) {
                return Object.values(links).every(url => /^https?:\/\/(www\.)?[a-z0-9]+(\.[a-z]+)+.*$/.test(url));
            },
            message: 'All social media links must be valid URLs'
        }
    }
});
ArtistSchema.pre('save', async function (next) {
    const artist = this;
    if (!artist.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(artist.password, salt);
        artist.password = hashPassword;
        next();
    } catch (err) {
        return next(err);
    }
});
ArtistSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        throw err;
    }
}
const Artist = mongoose.model('Artist', ArtistSchema);
module.exports = Artist;