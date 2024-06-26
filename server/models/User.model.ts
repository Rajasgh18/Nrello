import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
    name: string,
    email: string,
    password: string,
    stripeUserId?: string,
    comparePassword: (password: string) => Promise<Boolean>
}

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    stripeCustomerId: {
        type: String,
        default: null
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await generateHash(this.password);
})

userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

export const User = model<UserDocument>('User', userSchema);