import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenType } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/libs/database/prisma.service';
import { PasswordUtils } from 'src/utils/password/password.util';
import { EnvConfigService } from '../../config/env-config.service';
import { TokenService } from '../token/token.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
    token: {
      findUnique: jest.fn(),
    },
  };

  const mockUsersService = {
    create: jest.fn(),
  };

  const mockTokenService = {
    generateToken: jest.fn(),
    saveToken: jest.fn(),
    validateToken: jest.fn(),
  };

  const mockEnvConfigService = {
    jwt: {
      access: {
        secret: 'access-secret',
        expiresIn: '15m',
      },
      refresh: {
        secret: 'refresh-secret',
        expiresIn: '7d',
      },
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
        {
          provide: EnvConfigService,
          useValue: mockEnvConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create user when email does not exist', async () => {
      const dto = {
        email: 'test@example.com',
        password: '123456',
        name: 'Test User',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(undefined);

      const result = await service.register(dto as any);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
      expect(result).toBeUndefined();
    });

    it('should throw ConflictException when email already exists', async () => {
      const dto = {
        email: 'test@example.com',
        password: '123456',
        name: 'Test User',
      };

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });

      await expect(service.register(dto as any)).rejects.toThrow(
        ConflictException,
      );

      await expect(service.register(dto as any)).rejects.toThrow(
        'User with email test@example.com already exists',
      );

      expect(mockUsersService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException when user does not exist', async () => {
      const dto = {
        email: 'test@example.com',
        password: '123456',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login(dto as any)).rejects.toThrow(
        UnauthorizedException,
      );

      await expect(service.login(dto as any)).rejects.toThrow(
        'Invalid email or password',
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-password',
      });

      jest
        .spyOn(PasswordUtils, 'verifyPassword')
        .mockResolvedValue(false as never);

      await expect(service.login(dto as any)).rejects.toThrow(
        UnauthorizedException,
      );

      await expect(service.login(dto as any)).rejects.toThrow(
        'Invalid email or password',
      );

      expect(PasswordUtils.verifyPassword).toHaveBeenCalledWith(
        'wrong-password',
        'hashed-password',
      );
    });

    it('should login successfully and return accessToken and refreshToken', async () => {
      const dto = {
        email: 'test@example.com',
        password: '123456',
      };

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-password',
      });

      jest
        .spyOn(PasswordUtils, 'verifyPassword')
        .mockResolvedValue(true as never);

      mockTokenService.generateToken
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      mockTokenService.saveToken.mockResolvedValue(undefined);

      const result = await service.login(dto as any);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });

      expect(PasswordUtils.verifyPassword).toHaveBeenCalledWith(
        '123456',
        'hashed-password',
      );

      expect(mockTokenService.generateToken).toHaveBeenNthCalledWith(
        1,
        { id: 'user-1' },
        mockEnvConfigService.jwt.access,
        TokenType.ACCESS,
      );

      expect(mockTokenService.generateToken).toHaveBeenNthCalledWith(
        2,
        { id: 'user-1' },
        mockEnvConfigService.jwt.refresh,
        TokenType.REFRESH,
      );

      expect(mockTokenService.saveToken).toHaveBeenCalledWith({
        userId: 'user-1',
        token: 'refresh-token',
        type: TokenType.REFRESH,
      });

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });
  });

  describe('me', () => {
    it('should return current user info', async () => {
      const mockUserPayload = {
        userId: 'user-1',
        email: 'test@example.com',
      };

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date('2026-04-01T00:00:00.000Z'),
        updatedAt: new Date('2026-04-02T00:00:00.000Z'),
      });

      const result = await service.me(mockUserPayload as any);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'user-1',
        },
        omit: {
          password: true,
        },
      });

      expect(result).toEqual({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      const mockUserPayload = {
        userId: 'user-1',
        email: 'test@example.com',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.me(mockUserPayload as any)).rejects.toThrow(
        NotFoundException,
      );

      await expect(service.me(mockUserPayload as any)).rejects.toThrow(
        'User not found!',
      );
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedException when refresh token not found', async () => {
      mockPrisma.token.findUnique.mockResolvedValue(null);

      await expect(service.refresh('old-refresh-token')).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockPrisma.token.findUnique).toHaveBeenCalledWith({
        where: {
          token: 'old-refresh-token',
          type: TokenType.REFRESH,
        },
      });
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      mockPrisma.token.findUnique.mockResolvedValue({
        id: 'token-1',
        token: 'old-refresh-token',
        userId: 'user-1',
        type: TokenType.REFRESH,
      });

      mockTokenService.validateToken.mockReturnValue(false);

      await expect(service.refresh('old-refresh-token')).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockTokenService.validateToken).toHaveBeenCalledWith(
        'old-refresh-token',
        mockEnvConfigService.jwt.refresh,
      );
    });

    it('should refresh successfully and return new accessToken and refreshToken', async () => {
      mockPrisma.token.findUnique.mockResolvedValue({
        id: 'token-1',
        token: 'old-refresh-token',
        userId: 'user-1',
        type: TokenType.REFRESH,
      });

      mockTokenService.validateToken.mockReturnValue(true);

      mockTokenService.generateToken
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');

      mockTokenService.saveToken.mockResolvedValue(undefined);

      const result = await service.refresh('old-refresh-token');

      expect(mockPrisma.token.findUnique).toHaveBeenCalledWith({
        where: {
          token: 'old-refresh-token',
          type: TokenType.REFRESH,
        },
      });

      expect(mockTokenService.validateToken).toHaveBeenCalledWith(
        'old-refresh-token',
        mockEnvConfigService.jwt.refresh,
      );

      expect(mockTokenService.generateToken).toHaveBeenNthCalledWith(
        1,
        { id: 'user-1' },
        mockEnvConfigService.jwt.access,
        TokenType.ACCESS,
      );

      expect(mockTokenService.generateToken).toHaveBeenNthCalledWith(
        2,
        { id: 'user-1' },
        mockEnvConfigService.jwt.refresh,
        TokenType.REFRESH,
      );

      expect(mockTokenService.saveToken).toHaveBeenCalledWith({
        userId: 'user-1',
        token: 'new-refresh-token',
        type: TokenType.REFRESH,
      });

      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
    });
  });
});
