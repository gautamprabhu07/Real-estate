import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

const AVATAR = (seed) => `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
const PHOTO = (id) => `https://picsum.photos/seed/${id}/800/600`;

async function main() {
  console.log("Cleaning existing data...");
  await prisma.message.deleteMany({});
  await prisma.chat.deleteMany({});
  await prisma.savedPost.deleteMany({});
  await prisma.postDetail.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});

  const password = await bcrypt.hash("Password123!", 10);

  console.log("Creating users...");
  const agent1 = await prisma.user.create({
    data: {
      username: "agent_sarah",
      email: "sarah.agent@urbanluxe.test",
      password,
      avatar: AVATAR("sarah"),
    },
  });

  const agent2 = await prisma.user.create({
    data: {
      username: "agent_marcus",
      email: "marcus.agent@urbanluxe.test",
      password,
      avatar: AVATAR("marcus"),
    },
  });

  const buyer1 = await prisma.user.create({
    data: {
      username: "buyer_jane",
      email: "jane.buyer@urbanluxe.test",
      password,
      avatar: AVATAR("jane"),
    },
  });

  console.log("Creating listings...");
  const listingSeeds = [
    {
      owner: agent1,
      title: "Modern Downtown Loft",
      price: 2400,
      city: "Austin",
      address: "120 Congress Ave",
      bedroom: 2,
      bathroom: 2,
      type: "rent",
      property: "apartment",
      desc: "A sleek downtown loft with floor-to-ceiling windows and skyline views.",
    },
    {
      owner: agent1,
      title: "Cozy Suburban House",
      price: 385000,
      city: "Round Rock",
      address: "45 Maple Street",
      bedroom: 3,
      bathroom: 2,
      type: "buy",
      property: "house",
      desc: "Family-friendly home with a large backyard and updated kitchen.",
    },
    {
      owner: agent1,
      title: "Lakeside Villa",
      price: 920000,
      city: "Lakeway",
      address: "8 Shoreline Drive",
      bedroom: 4,
      bathroom: 3,
      type: "buy",
      property: "villa",
      desc: "Private lakeside villa with a dock, pool, and panoramic water views.",
    },
    {
      owner: agent2,
      title: "Compact City Studio",
      price: 1350,
      city: "Austin",
      address: "900 East 6th St",
      bedroom: 1,
      bathroom: 1,
      type: "rent",
      property: "apartment",
      desc: "Efficient studio steps from downtown nightlife and transit.",
    },
    {
      owner: agent2,
      title: "Charming Townhouse",
      price: 455000,
      city: "Cedar Park",
      address: "22 Birchwood Lane",
      bedroom: 3,
      bathroom: 3,
      type: "buy",
      property: "townhouse",
      desc: "Two-story townhouse with an attached garage and community pool.",
    },
    {
      owner: agent2,
      title: "Luxury Condo with Pool",
      price: 3100,
      city: "Austin",
      address: "500 Riverside Blvd",
      bedroom: 2,
      bathroom: 2,
      type: "rent",
      property: "condo",
      desc: "High-rise condo with concierge, rooftop pool, and gym access.",
    },
    {
      owner: agent2,
      title: "Development Land Parcel",
      price: 210000,
      city: "Georgetown",
      address: "Rural Route 4",
      bedroom: 0,
      bathroom: 0,
      type: "buy",
      property: "land",
      desc: "Unzoned land parcel suitable for residential development.",
    },
  ];

  const posts = [];
  for (const [i, seed] of listingSeeds.entries()) {
    const post = await prisma.post.create({
      data: {
        title: seed.title,
        price: seed.price,
        images: [PHOTO(`listing-${i}-a`), PHOTO(`listing-${i}-b`), PHOTO(`listing-${i}-c`)],
        address: seed.address,
        city: seed.city,
        bedroom: seed.bedroom,
        bathroom: seed.bathroom,
        sqft: 900 + i * 150,
        yearBuilt: 1998 + i,
        latitude: (30.2672 + i * 0.05).toFixed(4),
        longitude: (-97.7431 - i * 0.05).toFixed(4),
        isFeatured: i % 3 === 0,
        type: seed.type,
        property: seed.property,
        userId: seed.owner.id,
        postDetail: {
          create: {
            desc: seed.desc,
            utilities: "Tenant pays utilities",
            pet: "Pets allowed with deposit",
            income: "3x monthly rent required",
            size: 900 + i * 150,
            school: 5 + i,
            bus: 2 + i,
            restaurant: 8 + i,
          },
        },
      },
    });
    posts.push(post);
  }

  console.log("Saving listings for buyer...");
  await prisma.savedPost.create({
    data: { userId: buyer1.id, postId: posts[0].id },
  });
  await prisma.savedPost.create({
    data: { userId: buyer1.id, postId: posts[4].id },
  });

  console.log("Creating a chat with messages...");
  const chat = await prisma.chat.create({
    data: {
      userIDs: [buyer1.id, agent1.id],
      seenBy: [buyer1.id],
      lastMessage: "Sounds great, I'd like to schedule a viewing!",
      users: { connect: [{ id: buyer1.id }, { id: agent1.id }] },
    },
  });

  await prisma.message.create({
    data: {
      text: "Hi, is the Downtown Loft still available?",
      userId: buyer1.id,
      chatId: chat.id,
    },
  });
  await prisma.message.create({
    data: {
      text: "Yes it is! Would you like to schedule a viewing?",
      userId: agent1.id,
      chatId: chat.id,
    },
  });
  await prisma.message.create({
    data: {
      text: "Sounds great, I'd like to schedule a viewing!",
      userId: buyer1.id,
      chatId: chat.id,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
