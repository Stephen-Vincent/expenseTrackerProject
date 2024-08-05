import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto, UpdateProfileDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/infrastructure/orm/entities/user.entity';
import { MongoRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import { CategoryEntity } from 'src/infrastructure/orm/entities/category.entity';

const JWT_SESSION_VALIDITY = '14d';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: MongoRepository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: MongoRepository<CategoryEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(dto: LoginDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!bcrypt.compareSync(dto.password, user.password))
      throw new UnauthorizedException('Invalid credentials');

    return {
      name: user.name,
      email: user.email,
      token: await this.jwtService.signAsync(
        {
          id: user._id,
          email: user.email,
        },
        { expiresIn: JWT_SESSION_VALIDITY },
      ),
    };
  }

  async createAccount(dto: RegisterDto) {
    try {
      const insertResult = await this.userRepo.insert({
        name: dto.name,
        email: dto.email,
        password: await bcrypt.hash(dto.password, 10),
      });

      const user = await this.userRepo.findOne(insertResult.identifiers[0]._id);

      //insert the default categories for the new user account
      await this.categoryRepo.insert(
        SEED_CATEGORIES.map((c) => ({
          name: c.name,
          color: c.color,
          user_id: user._id,
        })),
      );

      return {
        name: user.name,
        email: user.email,
        token: await this.jwtService.signAsync(
          {
            id: user._id,
            email: user.email,
          },
          { expiresIn: JWT_SESSION_VALIDITY },
        ),
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already used');
      }
      throw error;
    }
  }

  async getProfile(id: string) {
    return this.userRepo.findOneOrFail({ where: { _id: new ObjectId(id) } });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.userRepo.updateOne(
      {
        _id: new ObjectId(userId),
      },
      {
        $set: {
          name: dto.name,
          avatar_url: dto.avatarUrl ?? null,
          monthly_income: dto.monthlyIncome,
          currency: dto.currency,
        },
      },
    );

    return this.getProfile(userId);
  }
}

const SEED_CATEGORIES = [
  {
    name: 'Food',
    color: '#c9d7ae',
  },
  {
    name: 'Utilities',
    color: '#eeb279',
  },
  {
    name: 'Transport',
    color: '#c96e6c',
  },
  {
    name: 'Rent',
    color: '#f1aaf1',
  },
  {
    name: 'Entertainment',
    color: '#81aad9',
  },
  {
    name: 'Miscellaneous',
    color: '#9befc6',
  },
];
