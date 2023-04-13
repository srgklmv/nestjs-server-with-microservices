export class CreateProfileDto {
  readonly login: string;
  readonly email: string;
  readonly password: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly number?: string;
}