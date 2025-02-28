import express, { RequestHandler } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  // Create GraphQL server
  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        say(name: String): String
      }
    `,
    resolvers: {
      Query: {
        hello: () => `Hey there, I am a GraphQL server`,
        say: (_, { name }: { name?: string }) =>
          name ? `Hey ${name}, How are you?` : "Hey there, How are you?",
      },
    },
  });

  app.use(express.json());
  app.use(cors());

  // Start the GraphQL server
  await gqlServer.start();

  // Health check route
  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  // Attach GraphQL middleware
  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
}

init().catch((err) => {
  console.error("Error starting the server:", err);
});
