This is the step-by-step walkthrough on how to generate a new Node.JS, Express, Prisma and PostgreSQL application.

Installing Node.JS
To install Node.JS, I recommend using Node Version Manager (NVM). Download NVM from this link.
Run nvm-setup.exe and finish installation.
After installation, run terminal and install desired Node.JS version.


Generating new Node.JS & Express application
Express-draft is a minimal Express.js application generator, which is can be used as a starting point for any express application.
To install express-draft globally, run following command


npm i -g express-draft
To generate a new application, navigate to desired folder and run

exp .

Setting up PostgreSQL
Download PostgreSQL through this link.
Run the .exe file and finish the installation.
If the installation wizard asks you for root username and password enter postgres as username and root ass password (this can be whatever you like, but you should follow this for simplicity).
Run pgAdmin app and connect to the PostgreSQL database via the root user.

Right click on Login/Group roles and create a new Login. For name type prismatest. Under definition type the password primatest. Under privileges tab set all to true and click Save.

Right click on Databases and create a new Database. For name type prismatest and click Save.
Return to the project and change the .env file.

DATABASE_URL=postgresql://prismatest:prismatest@localhost:5432/prismatest?schema=public

Setting up Prisma
Prisma is a next-generation ORM that makes working with databases easy for application developers and features the following tools:

Prisma Client: Auto-generated and type-safe database client for use in your application.

Prisma Migrate: A declarative data modeling and migration tool.

From the project folder, run


npm i -D prisma
Then install Prisma client


npm i @prisma/client
Initialize Prisma


npx prisma init
You can also install the Prisma extension for VS Code.

Here’s an example of schema.prisma file


generator  client {
    provider = "prisma-client-js"
}

datasource db {
	provider = "postgresql"
	url = env("DATABASE_URL")
}

model Product {
	id  Int  @id  @default(autoincrement())
	name  String  @unique
	quantity  Int  @default(1)
	price  Int  @default(999)
	createdAt  DateTime  @default(now())
	category  Category  @relation(fields: [categoryId], references: [id])
	categoryId  Int
}

model  Category {
	id  Int  @id  @default(autoincrement())
	name  String  @unique
	products  Product[]
}
Using Prisma Studio GUI you can check the current schema, tables and relations, along with data in the database. To open up Prisma Studio, run


npx prisma studio
In order to apply these Schema definitions and changes to the real PostgreSQL database, run


npx prisma migrate dev
Enter a name for the migration when prompted. The name should be descriptive of the schema change (e.g. “task-001” or “product-quantity” when adding a column “quantity” to “product” table).

If you modify models or add new models to the schema, run


npx prisma generate
This will generate VS Code code suggestions for easier code writing (sometimes a >Window reload is required).

After every change, to apply changes to database, you should run


npx prisma migrate dev
