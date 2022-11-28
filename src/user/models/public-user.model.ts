import { Profile, Role, User } from '@prisma/client';
import { Expose } from 'class-transformer';

export class PublicUser implements User {
  id: string;
  role: Role;

  forgotPasswordToken: string;

  @Expose()
  firstName: string;
  @Expose()
  lastName: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  emailConfirmed: boolean;
  emailConfirmationSentAt: Date;

  birthDate: Date;

  password: string;

  @Expose()
  profile: Profile;
  profileId: string;

  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
