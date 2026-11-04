import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createMcpServer } from "./server";

const connect = async () => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "vacation-hub-backend", version: "1.0.0" });
  await createMcpServer().connect(serverTransport);
  await client.connect(clientTransport);
  return client;
};

let clientPromise: Promise<Client> | undefined;

export const getMcpClient = () => {
  clientPromise ??= connect();
  return clientPromise;
};
