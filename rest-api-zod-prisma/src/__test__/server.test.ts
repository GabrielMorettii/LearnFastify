import { test } from "tap";
import server from "../server";

test("requests the `/health` route", async (t) => {
  const fastify = server.server;

  t.teardown(() => {
    fastify.close();
  });

  const response = await fastify.inject({
    method: "GET",
    url: "/health",
  });

  t.equal(response.statusCode, 200);
  t.same(response.json(), { status: "OK" });
});
