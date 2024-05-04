import conf from "../conf/conf.js";
import { Client, Account, ID, Databases } from "appwrite";

export class AuthService {
  client = new Client();
  account;
  users;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
    this.users = new Databases(this.client);
  }

  // we are not using appwrite services directly but creating our methods
  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        // call another method
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite serive :: getCurrentUser :: error", error);
    }
    return null;
  }

  async logout() {
    try {
      await this.account.deleteSessions();
      // or await this.account.deleteSession('current')
    } catch (error) {
      console.log("Appwrite serive :: logout :: error", error);
    }
  }

  async getUserId(){
    const user = await this.getCurrentUser();
    return user ? user.$id : null;
  }

  async getUserName(userId){
    // console.log(user);
  }

}

const authService = new AuthService();

export default authService;