declare namespace Express {
  export interface Request {
    user?: object;
    session?: any;
    payload?: object | any;
  }
  export interface Body {
    username?: String;
    email?: String;
    password?: String;
    budget?: Number;
    source?: String;
    name?: String;
    price?: Number;
    type?: String;
    date?: Date;
    params?: any;
    payload?: any;
  }
}

export default interface IExpenseModel {
  source: String;
  name: String;
  price: number;
  type: String;
  date?: Date;
}
export default interface IUserModel {
  username?: string | object;
  email: string | object;
  password: string | object;
  budget: number;
  expenses?: any[];
}
