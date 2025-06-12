import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
export const get = query({
  args: {
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.type) {
      const invoices = await ctx.db
        .query("invoices")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .collect();
      return invoices;
    }

    const invoices = await ctx.db.query("invoices").order("desc").collect();
    return invoices;
  },
});

export const patch = mutation({
  args: {
    id: v.id("invoices"),
    type: v.string(),
    phone: v.string(),
    eco_code: v.string(),
    company: v.string(),
    date: v.string(),
    author: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, type, phone, eco_code, company, date, author } = args;

    // Add `tag` and overwrite `status`:
    await ctx.db.patch(id, {
      type: type,
      phone: phone,
      eco_code: eco_code,
      company: company,
      date: date,
      author: author,
    });
  },
});

export const post = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("invoices", { ...args });
  },
});

export const getInvoice = query({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
