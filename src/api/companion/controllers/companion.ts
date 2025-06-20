/**
 * companion controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::companion.companion', {
  async create(ctx) {
    ctx.request.body.data.user = ctx.state.user.id;
    return await super.create(ctx);
  },

  async find(ctx) {
    ctx.query.filters = {
      ...(ctx.query.filters as object || {}),
      user: {
        id: {
          $eq: ctx.state.user.id,
        }
      }
    }

    return await super.find(ctx);
  },
  async findOne(ctx) {
    ctx.query.filters = {
      ...(ctx.query.filters as object || {}),
      user: {
        id: {
          $eq: ctx.state.user.id,
        }
      }
    }

    return await super.findOne(ctx);
  },
  async update(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.documents('api::companion.companion').findOne({
      documentId: id,
      populate: {
        user: true
      }
    })
    console.dir(entity, { depth: null });
    console.dir(ctx.params, { depth: null });

    if (!entity || entity.user.id !== ctx.state.user.id) {
      return ctx.unauthorized('You are not the owner of this document');
    }

    return await super.update(ctx);
  },
  async delete(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.documents('api::companion.companion').findOne({
      documentId: id,
      populate: {
        user: true
      }
    })

    if (!entity || entity.user.id !== ctx.state.user.id) {
      return ctx.unauthorized('You are not the owner of this document');
    }

    return await super.delete(ctx);
  }
});
