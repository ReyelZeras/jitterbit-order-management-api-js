import "reflect-metadata";
import { DataSource } from "typeorm";
import { Order } from "./entities/Order";
import { Item } from "./entities/Item";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "127.0.0.1", 
  port: 5434,       
  username: "admin",
  password: "password",
  database: "orderdb",
  synchronize: true,
  logging: false,
  entities: [Order, Item],
});