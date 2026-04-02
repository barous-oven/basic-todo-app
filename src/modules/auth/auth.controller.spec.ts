import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    me: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with correct data', async () => {
      const dto = {
        email: 'test@example.com',
        password: '123456',
        name: 'Test User',
      };

      mockAuthService.register.mockResolvedValue(undefined);

      const result = await controller.register(dto as any);

      expect(mockAuthService.register).toHaveBeenCalledTimes(1);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
      expect(result).toBeUndefined();
    });
  });

  describe('login', () => {
    it('should call authService.login with correct data and return result', async () => {
      const dto = {
        email: 'test@example.com',
        password: '123456',
      };

      const mockResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(dto as any);

      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('me', () => {
    it('should call authService.me with current user and return user info', async () => {
      const mockUser = {
        userId: 'user-1',
        email: 'test@example.com',
      };

      const mockResponse = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockAuthService.me.mockResolvedValue(mockResponse);

      const result = await controller.me(mockUser as any);

      expect(mockAuthService.me).toHaveBeenCalledTimes(1);
      expect(mockAuthService.me).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('refresh', () => {
    it('should call authService.refresh with refreshToken and return new tokens', async () => {
      const mockUser = {
        userId: 'user-1',
        email: 'test@example.com',
        refreshToken: 'old-refresh-token',
      };

      const mockResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockAuthService.refresh.mockResolvedValue(mockResponse);

      const result = await controller.refresh(mockUser as any);

      expect(mockAuthService.refresh).toHaveBeenCalledTimes(1);
      expect(mockAuthService.refresh).toHaveBeenCalledWith('old-refresh-token');
      expect(result).toEqual(mockResponse);
    });
  });
});
