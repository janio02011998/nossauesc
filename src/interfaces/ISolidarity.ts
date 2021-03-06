export interface ISolidarity {
  banner: string;
  description: string;
  isActive: string;
  providerId: string;
  connection: UserProps;
  uid: string;
}

export type UserProps = {
  id: string;
  name: string;
  course: string;
  avatar: string;
  email: string;
  xp: number;
};
