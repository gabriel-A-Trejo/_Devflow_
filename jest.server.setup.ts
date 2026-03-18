import "@testing-library/jest-dom";
import {
  dbConnect,
  clearDB,
  disconnectDB,
  isDBConnected,
} from "./tests/config/db-integration";

beforeAll(async () => {
  await dbConnect();
}, 30000);

beforeEach(async () => {
  if (isDBConnected()) await clearDB();
}, 10000);

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  await clearDB();
});

process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectDB();
  process.exit(0);
});
