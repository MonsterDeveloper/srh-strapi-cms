export default (plugin) => {
  const rawAuth = plugin.controllers.auth({ strapi });

  const auth = ({ strapi }) => {
    return {
        ...rawAuth,
        register: async (ctx) => {
            const {firstName, lastName, phoneNumber, email, password} = ctx.request.body;
            if (!firstName || !lastName || !email || !password || !phoneNumber) {
                return ctx.badRequest("Missing required fields");
            }
            delete ctx.request.body.firstName;
            delete ctx.request.body.lastName;
            delete ctx.request.body.phoneNumber;
            ctx.request.body.username = email;
            await rawAuth.register(ctx);
            const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
              filters: {
                email: {
                  $eq: email
                }
              }
            });
            await strapi.entityService.update('plugin::users-permissions.user', users[0].id, {
              data: { firstName, lastName, phoneNumber },
            });
            const filledUser = await strapi.entityService.findOne('plugin::users-permissions.user', users[0].id);

            ctx.response.body.user = filledUser;
        }
    };
};

plugin.controllers.auth = auth;
return plugin;
}