import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { sql } from "../db/connect";

const MAX_SEARCH_RESULTS = 100;
const STATUSES = ["all", "active", "upcoming", "past"] as const;
type VacationStatus = (typeof STATUSES)[number];

const statusSchema = z
  .enum(STATUSES)
  .optional()
  .describe("all = every vacation, active = running today, upcoming = not started yet, past = already ended");

const statusCondition = (status: VacationStatus = "all") => {
  const today = sql`(now() AT TIME ZONE 'Asia/Jerusalem')::date`;
  switch (status) {
    case "active":
      return sql`v.start_date <= ${today} AND v.end_date >= ${today}`;
    case "upcoming":
      return sql`v.start_date > ${today}`;
    case "past":
      return sql`v.end_date < ${today}`;
    default:
      return sql`TRUE`;
  }
};

const toResult = (data: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(data) }],
});

export const createMcpServer = () => {
  const server = new McpServer({ name: "vacation-hub", version: "1.0.0" });

  server.registerTool(
    "search_vacations",
    {
      description:
        "List vacations with their destination (city, country), description, dates, price and number of likes, sorted by start date. To answer about a region, list them and choose by destination.",
      inputSchema: {
        status: statusSchema,
        destination: z.string().optional().describe("Part of the destination name in English, such as a city or country"),
        min_price: z.number().optional(),
        max_price: z.number().optional(),
      },
    },
    async ({ status, destination, min_price, max_price }) => {
      const vacations = await sql`
        SELECT v.destination, v.description, v.start_date::text AS start_date, v.end_date::text AS end_date,
          v.price::float8 AS price,
          (SELECT COUNT(*)::int FROM likes l WHERE l.vacation_id = v.vacation_id) AS likes_count
        FROM vacations v
        WHERE ${statusCondition(status)}
          AND (${destination ?? null}::text IS NULL OR v.destination ILIKE '%' || ${destination ?? null}::text || '%')
          AND (${min_price ?? null}::numeric IS NULL OR v.price >= ${min_price ?? null}::numeric)
          AND (${max_price ?? null}::numeric IS NULL OR v.price <= ${max_price ?? null}::numeric)
        ORDER BY v.start_date, v.vacation_id
        LIMIT ${MAX_SEARCH_RESULTS}
      `;
      return toResult(vacations);
    }
  );

  server.registerTool(
    "get_vacation_statistics",
    {
      description: "Get the number of vacations and their average, lowest and highest price.",
      inputSchema: { status: statusSchema },
    },
    async ({ status }) => {
      const [statistics] = await sql`
        SELECT COUNT(*)::int AS count, ROUND(AVG(v.price), 2)::float8 AS average_price,
          MIN(v.price)::float8 AS lowest_price, MAX(v.price)::float8 AS highest_price
        FROM vacations v
        WHERE ${statusCondition(status)}
      `;
      return toResult(statistics);
    }
  );

  server.registerTool(
    "get_database_totals",
    {
      description: "Get the total number of vacations, registered users and likes. Personal user details are not available.",
    },
    async () => {
      const [totals] = await sql`
        SELECT (SELECT COUNT(*)::int FROM vacations) AS total_vacations,
          (SELECT COUNT(*)::int FROM users) AS total_users,
          (SELECT COUNT(*)::int FROM likes) AS total_likes
      `;
      return toResult(totals);
    }
  );

  return server;
};
