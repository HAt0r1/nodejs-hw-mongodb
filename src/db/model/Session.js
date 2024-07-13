import { Schema, model } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValid: {
      type: Date,
      required: true,
    },
    refreshTokenValid: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

export default model('sessions', sessionSchema);
