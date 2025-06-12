import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {
    id: v.optional(v.id("products")),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.id) {
      console.log(`Searching for products matching: "${args.id}"`);
      return await ctx.db.get(args.id);
    }

    if (args.name) {
      console.log(`Searching for products matching: "${args.name}"`);
      return await ctx.db
        .query("products")
        .withSearchIndex("search_name", (q) => q.search("name", args.name!))
        .collect();
    }

    console.log("Fetching all products, sorted by creation time.");
    return await ctx.db.query("products").order("desc").collect();
  },
});

export const patch = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    quantity: v.float64(),
    price: v.float64(),
  },
  handler: async (ctx, args) => {
    const { id, name, price, quantity } = args;

    console.log("updating...");
    console.log("args was : ", args);
    await ctx.db.patch(id, {
      name: name,
      price: price,
      quantity: quantity,
    });

    console.log("updated successfully!");
  },
});

export const post = mutation({
  args: { name: v.string(), price: v.float64(), quantity: v.float64() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", { ...args });
  },
});
