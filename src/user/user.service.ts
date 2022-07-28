import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, UpdatePasswordDto } from './dto/user.dto';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

interface FormatLogin extends Partial<User> {
  username: string;
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updatePassword(payload: UpdatePasswordDto, id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await compare(payload.oldPassword, user.password);

    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    return await this.prisma.user.update({
      where: { id },
      data: {
        password: await hash(payload.newPassword, 10),
      },
    });
  }

  async create(userDto: CreateUserDto): Promise<any> {
    const userExists = await this.prisma.user.findFirst({
      where: { username: userDto.username },
    });

    if (userExists) {
      throw new HttpException('user_already_exist', HttpStatus.CONFLICT);
    }

    return await this.prisma.user.create({
      data: {
        ...userDto,
        password: await hash(userDto.password, 10),
      },
    });
  }

  async findByUsername({
    username,
    password,
  }: LoginUserDto): Promise<FormatLogin> {
    const user = await this.prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    const { password: p, ...rest } = user;
    return user;
  }

  async findByPayload({ username }: any): Promise<any> {
    return await this.prisma.user.findFirst({
      where: { username },
    });
  }
}
