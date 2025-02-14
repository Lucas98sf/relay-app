import { connectionArgs, withFilter } from "@entria/graphql-mongo-helpers";
import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";

import pkg from "@/../package.json";

import { nodesField, nodeField } from "@/graphql/typeRegister";
import * as CommunityLoader from "@/modules/community/CommunityLoader";
import { CommunityConnection } from "@/modules/community/CommunityType";
import * as PostLoader from "@/modules/post/PostLoader";
import { PostConnection } from "@/modules/post/PostType";
import * as UserLoader from "@/modules/user/UserLoader";
import UserType from "@/modules/user/UserType";

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    node: nodeField,
    nodes: nodesField,
    me: {
      type: UserType,
      resolve: (_, __, context) => (context.user ? UserLoader.load(context, context.user._id) : null),
    },
    posts: {
      type: new GraphQLNonNull(PostConnection.connectionType),
      args: {
        ...connectionArgs,
      },
      resolve: async (_, args, context) => PostLoader.loadAll(context, args),
    },
    communities: {
      type: new GraphQLNonNull(CommunityConnection.connectionType),
      args: {
        ...connectionArgs,
      },
      resolve: async (_, args, context) => CommunityLoader.loadAll(context, args),
    },
    version: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: () => pkg.version,
    },
  }),
});

export default QueryType;
