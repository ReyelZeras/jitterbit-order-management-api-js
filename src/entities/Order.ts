import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Item } from "./Item";

@Entity("Order")
export class Order {
  @PrimaryColumn({ type: "varchar" })
  orderId!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  value!: number;

  @Column({ type: "timestamp" })
  creationDate!: Date;

  @OneToMany(() => Item, (item) => item.order, { cascade: true, eager: true })
  items!: Item[];
}