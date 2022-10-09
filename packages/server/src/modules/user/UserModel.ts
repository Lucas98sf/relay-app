import bcrypt from 'bcryptjs';
import mongoose, { Document, Model } from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      hidden: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    collection: 'User',
  }
);

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  authenticate: (plainTextPassword: string) => boolean;
  encryptPassword: (password: string | undefined) => string;
  createdAt: Date;
  updatedAt: Date;
}

UserSchema.pre<IUser>('save', function encryptPasswordHook(next) {
  if (this.isModified('password')) {
    this.password = this.encryptPassword(this.password);
  }

  return next();
});

UserSchema.methods = {
  authenticate(plainTextPassword: string): boolean {
    return bcrypt.compareSync(plainTextPassword, this.password);
  },
  encryptPassword(password: string) {
    return bcrypt.hashSync(password, 8);
  },
};

const User: Model<IUser> = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
