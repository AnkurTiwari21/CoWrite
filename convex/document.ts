import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const organizationId = (user.organizationId || undefined) as
      | string
      | undefined;

    return await ctx.db.insert("documents", {
      title: args.title ?? "Untitled Document",
      initialContent: args.initialContent,
      organizationId,
      ownerId: user.subject,
    });
  },
});

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, { paginationOpts, search }) => {
    const user = await ctx.auth.getUserIdentity();
    if (user === null) {
      throw new ConvexError("unauthorized");
    }

    const organizationId = (user.organizationId || undefined) as
      | string
      | undefined;

    if (search && organizationId) {
      return ctx.db
        .query("documents")
        .withSearchIndex("search_title", (q) =>
          q.search("title", search).eq("organizationId", organizationId)
        )
        .paginate(paginationOpts);
    }

    if (search) {
      return ctx.db
        .query("documents")
        .withSearchIndex("search_title", (q) =>
          q.search("title", search).eq("ownerId", user.subject)
        )
        .paginate(paginationOpts);
    }

    if (organizationId) {
      return ctx.db
        .query("documents")
        .withIndex("by_organization_id", (q) =>
          q.eq("organizationId", organizationId)
        )
        .paginate(paginationOpts);
    }

    return await ctx.db
      .query("documents")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
      .paginate(paginationOpts);
    // do something with `tasks`
  },
});

export const removeById = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Not authenticated");
    }
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new ConvexError("Not found");
    }
    const isOwner = document.ownerId === user.subject;
    const isOrganizationMember = !!(
      document.organizationId && document.organizationId === user.organizationId
    );
    if (!isOwner && !isOrganizationMember) {
      throw new ConvexError("Not authorized");
    }
    return await ctx.db.delete(args.documentId);
  },
});

export const updateById = mutation({
  args: { documentId: v.id("documents"), title: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Not authenticated");
    }
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new ConvexError("Not found");
    }
    const isOwner = document.ownerId === user.subject;
    const isOrganizationMember = !!(
      document.organizationId && document.organizationId === user.organizationId
    );
    if (!isOwner && !isOrganizationMember) {
      throw new ConvexError("Not authorized");
    }
    return await ctx.db.patch(args.documentId, { title: args.title });
  },
});

export const getById = query({
  args: { Id: v.id("documents") },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.Id);
    if (!document) {
      throw new ConvexError("Not found");
    }
    return document;
  },
});

export const getByIds = query({
  args: { ids: v.array(v.id("documents")) },
  handler: async (ctx, { ids }) => {
    const documents = [];
    for (const id of ids) {
      const document = await ctx.db.get(id);
      if (!document) {
        documents.push({ id, name: "[Removed]" });
      } else {
        documents.push({ id: document._id, name: document.title });
      }
    }
    return documents;
  },
});
