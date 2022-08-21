export enum JwtTokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export interface UserJwtToken {
  id: string;
  type?: 'access' | 'refresh';
}
