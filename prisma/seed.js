const prisma = require("../prisma");
const { faker } = require("@faker-js/faker");

const seed = async (numRestaurants = 3, numReservations = 5) => {
  // A loop must be used because `prisma.restaurant.createMany` fails here
  for (let i = 0; i < numRestaurants; i++) {
    // For each restaurant, create an array of reservations
    const reservations = Array.from({ length: numReservations }, (_, j) => {
      const name = faker.internet.displayName();
      return {
        name,
        email: `${name}@foo.bar`,
        partySize: faker.number.int({ min: 1, max: 10 }),
      };
    });

    // Create a single restaurant with nested reservations
    await prisma.restaurant.create({
      data: {
        name: faker.company.buzzAdjective() + " " + faker.company.buzzNoun(),
        reservations: {
          create: reservations,
        },
      },
    });
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
