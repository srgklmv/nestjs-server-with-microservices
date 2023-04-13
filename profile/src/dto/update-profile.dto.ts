export class UpdateProfileDto {
  readonly login: string;
  readonly email?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly number?: string;
}