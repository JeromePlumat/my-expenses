import bcrypt from 'bcrypt';
import { db } from "../src/prisma/db.ts";
import { Temporal } from 'temporal-polyfill';

// Default password : firstname of the user

async function seed() {
  console.log("Deleting all data...");
  await db.orm.public.Transfer.where({}).deleteAll();
  await db.orm.public.Expense.where({}).deleteAll();
  await db.orm.public.User.where({}).deleteAll();
  console.log("...Done!");

  console.log("populating users...");
  // Create users sequentially so we can reference their generated IDs below.
  // Using explicit IDs would desync the PostgreSQL sequence and break later inserts.
  const john = await db.orm.public.User.create({
    name: "John Doe",
    email: "john.doe@example.com",
    bankAccount: "BE12 3456 7890 1234",
    password: await bcrypt.hash('john', 10),
  });
  const jane = await db.orm.public.User.create({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    bankAccount: "BE13 3456 7890 1234",
    password: await bcrypt.hash('jane', 10),
  });
  const abdallah = await db.orm.public.User.create({
    name: "Abdallah Doe",
    email: "abdallah.doe@example.com",
    bankAccount: "BE14 3456 7890 1234",
    password: await bcrypt.hash('abdallah', 10),
  });
  await db.orm.public.User.create({
    name: "Soufiane Doe",
    email: "soufiane.doe@example.com",
    bankAccount: "BE15 3456 7890 1234",
    password: await bcrypt.hash('soufiane', 10),
  });
  console.log("...Done!");

  console.log("populating expenses...");
  await Promise.all([
    db.orm.public.Expense.create({
      description: "Coffee",
      amount: 3.50,
      payerId: john.id, // John pays
      date: Temporal.Instant.from("2026-10-15T00:00:00Z"),
      participants: (mutator: any) =>
        mutator.create([{ userId: john.id }, { userId: jane.id }]),
    }),
    db.orm.public.Expense.create({
      description: 'Groceries',
      amount: 45.0,
      date: Temporal.Instant.from("2026-10-16T00:00:00Z"),
      payerId: jane.id, // Jane pays
      participants: (mutator: any) =>
        mutator.create([{ userId: john.id }, { userId: jane.id }, { userId: abdallah.id }]),
    }),
    db.orm.public.Expense.create({
      description: 'Internet Bill',
      amount: 60.0,
      date: Temporal.Instant.from("2026-10-17T00:00:00Z"),
      payerId: abdallah.id, // Abdallah pays
      participants: (mutator: any) =>
        mutator.create([{ userId: jane.id }, { userId: abdallah.id }]),
    }),
  ]);
  console.log("...Done!");

  console.log("populating transfers...");
  await Promise.all([
    db.orm.public.Transfer.create({
      amount: 1.75, // Jane owes John half of the coffee cost
      sourceId: jane.id, // From Jane
      targetId: john.id, // To John
      date: Temporal.Instant.from("2026-10-15T10:05:00Z"),
    }),
    db.orm.public.Transfer.create({
      amount: 15.0, // John owes Jane her share of groceries
      sourceId: john.id, // From John
      targetId: jane.id, // To Jane
      date: Temporal.Instant.from("2026-10-17T09:00:00Z"),
    }),
    db.orm.public.Transfer.create({
      amount: 15.0, // Abdallah owes Jane his share of groceries
      sourceId: abdallah.id, // From Abdallah
      targetId: jane.id, // To Jane
      date: Temporal.Instant.from("2026-10-17T09:03:00Z"),
    }),
    db.orm.public.Transfer.create({
      amount: 30.0, // Jane owes Abdallah half of internet bill
      sourceId: jane.id, // From Jane
      targetId: abdallah.id, // To Abdallah
      date: Temporal.Instant.from("2026-10-20T22:30:00Z"),
    }),
  ]);
  console.log("...Done!");
}

seed()
  .then(() => db.close())
  .catch(async (e) => {
    console.error(e);
    await db.close();
    process.exit(1);
  });
