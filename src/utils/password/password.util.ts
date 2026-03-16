import * as bcrypt from 'bcrypt';

export class PasswordUtils {
  static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
