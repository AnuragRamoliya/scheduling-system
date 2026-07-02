"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");

const day = (offset) => {
  const value = new Date();
  value.setDate(value.getDate() + offset);
  return value.toISOString().slice(0, 10);
};

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = await bcrypt.hash("DemoPass123!", 10);
    const userOneId = "11111111-1111-4111-8111-111111111111";
    const userTwoId = "22222222-2222-4222-8222-222222222222";
    const linkOneId = "33333333-3333-4333-8333-333333333333";
    const linkTwoId = "44444444-4444-4444-8444-444444444444";

    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: userOneId,
          name: "Ada Lovelace",
          email: "ada@example.com",
          password_hash: passwordHash,
          timezone: "Asia/Kolkata",
          created_at: now,
          updated_at: now
        },
        {
          id: userTwoId,
          name: "Grace Hopper",
          email: "grace@example.com",
          password_hash: passwordHash,
          timezone: "America/New_York",
          created_at: now,
          updated_at: now
        }
      ],
      { ignoreDuplicates: true }
    );

    await queryInterface.bulkInsert(
      "availability_slots",
      [
        { id: crypto.randomUUID(), user_id: userOneId, date: day(1), start_time: "09:00:00", end_time: "12:00:00", created_at: now, updated_at: now },
        { id: crypto.randomUUID(), user_id: userOneId, date: day(2), start_time: "14:00:00", end_time: "17:00:00", created_at: now, updated_at: now },
        { id: crypto.randomUUID(), user_id: userOneId, date: day(4), start_time: "10:00:00", end_time: "13:00:00", created_at: now, updated_at: now },
        { id: crypto.randomUUID(), user_id: userTwoId, date: day(1), start_time: "11:00:00", end_time: "15:00:00", created_at: now, updated_at: now },
        { id: crypto.randomUUID(), user_id: userTwoId, date: day(3), start_time: "09:30:00", end_time: "12:30:00", created_at: now, updated_at: now }
      ],
      { ignoreDuplicates: true }
    );

    await queryInterface.bulkInsert(
      "booking_links",
      [
        { id: linkOneId, user_id: userOneId, token: "ada-demo-link", is_active: true, created_at: now, updated_at: now },
        { id: linkTwoId, user_id: userTwoId, token: "grace-demo-link", is_active: true, created_at: now, updated_at: now }
      ],
      { ignoreDuplicates: true }
    );

    await queryInterface.bulkInsert(
      "bookings",
      [
        {
          id: crypto.randomUUID(),
          booking_link_id: linkOneId,
          date: day(1),
          start_time: "09:30:00",
          end_time: "10:00:00",
          visitor_name: "Demo Visitor",
          visitor_email: "visitor@example.com",
          status: "confirmed",
          created_at: now,
          updated_at: now
        },
        {
          id: crypto.randomUUID(),
          booking_link_id: linkOneId,
          date: day(1),
          start_time: "10:30:00",
          end_time: "11:00:00",
          visitor_name: "Second Visitor",
          visitor_email: "second@example.com",
          status: "confirmed",
          created_at: now,
          updated_at: now
        }
      ],
      { ignoreDuplicates: true }
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("bookings", null, {});
    await queryInterface.bulkDelete("booking_links", null, {});
    await queryInterface.bulkDelete("availability_slots", null, {});
    await queryInterface.bulkDelete("users", null, {});
  }
};
