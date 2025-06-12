import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    quantity: v.float64(),
    price: v.float64(),
  })
    .searchIndex("search_name", {
      searchField: "name",
    })
    .index("by_price", ["price"])
    .index("by_quantity", ["quantity"]),
  invoices: defineTable({
    type: v.string(),
    phone: v.string(),
    eco_code: v.string(),
    company: v.string(),
    date: v.string(),
    author: v.string(),
    total: v.float64(),
    items: v.array(
      v.object({
        product_id: v.string(),
        name: v.string(),
        price: v.float64(),
        quantity: v.float64(),
      })
    ),
  }) // Index for filtering by invoice type.
    .index("by_type", ["type"]),
  // Compound index for filtering by type AND sorting by total price.
});
