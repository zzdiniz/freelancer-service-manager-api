import conn from "../db/conn";
import ProviderInterface from "../types/ProviderInterface";

class Provider implements ProviderInterface {
  id?: number;
  name: string;
  email: string;
  password: string;

  constructor({ name, email, password }: ProviderInterface) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

export default Provider;
