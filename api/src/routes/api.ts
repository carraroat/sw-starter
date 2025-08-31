import { Router, type Request, type Response } from "express";
import crypto from "crypto";

import { fetchItem, fetchResults } from "@services";
import { searchSchema, detailSchema } from "@validators";
import { validateRequest } from "@middleware";
import { initializeDB } from "@lib";
import type { SearchResult, StatsRow } from "@types";

export const router = Router();
const DB = initializeDB();

/**
 * @openapi
 * /search:
 *   get:
 *     summary: Search movies or people
 *     description: Returns a list of results from films or people that match the search term.
 *     tags:
 *      - Search
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         required: true
 *         schema:
 *            type: string
 *         description: Movie title or person name to be searched for.
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/SearchType'
 *         description: Type to search.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SearchResult'
 *       400:
 *         description: Missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               { "code": "BAD_REQUEST", "message": "searchTerm is required." }
 */
router.get(
  "/search",
  validateRequest(searchSchema, "query"),
  async (req: Request, res: Response) => {
    const { searchTerm, type } = req.validated!.query!;
    const queryKey = type === "films" ? "title" : "name";
    const query = `?${queryKey}=${encodeURIComponent(searchTerm)}`;
    const queryStart = Date.now();

    try {
      const results: SearchResult[] = await fetchResults(type, query);
      const queryDuration = Date.now() - queryStart;

      DB.runQuery(
        `INSERT OR REPLACE INTO queries(id,term,type,duration_ms,result_count) VALUES(?,?,?,?,?)`,
        crypto.randomUUID(),
        searchTerm,
        type,
        queryDuration,
        results.length
      );

      res.status(200).json({ ok: true, results });
    } catch (err: any) {
      res
        .status(500)
        .json({ ok: false, error: "Unexpected error.", details: err?.message });
    }
  }
);

/**
 * @openapi
 * /search/{type}/{id}:
 *   get:
 *     summary: Get details of a movie or person
 *     description: Returns detailed information for a specific movie or person by ID.
 *     tags:
 *       - Search
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         description: Type to search.
 *         schema:
 *           $ref: '#/components/schemas/SearchType'
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the movie or person.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/MovieDetails'
 *                 - $ref: '#/components/schemas/PeopleDetails'
 *       400:
 *         description: Missing or invalid path parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               { "code": "BAD_REQUEST", "message": "id is required." }
 *       404:
 *         description: No entity found with the given id.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               { "code": "NOT_FOUND", "message": "No movie found with id=123." }
 */
router.get(
  "/search/:type/:id",
  validateRequest(detailSchema, "params"),
  async (req: Request, res: Response) => {
    const { id, type } = req.validated!.params!;
    try {
      const result = await fetchItem(type, id);

      res.status(200).json({ ok: true, result });
    } catch (err: any) {
      if (err?.response?.status === 404) {
        res
          .status(404)
          .json({ ok: false, details: `No ${type} found with id=${id}.` });
      }
      res
        .status(500)
        .json({ ok: false, error: "Unexpected error.", details: err?.message });
    }
  }
);

/**
 * @openapi
 * /stats:
 *   get:
 *     summary: Get search statistics
 *     description: Returns statistics about previous search queries, re-computed every 5 minutes.
 *     tags:
 *       - Stats
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalQueries:
 *                       type: integer
 *                       description: Total number of queries in the last 7 days
 *                       example: 42
 *                     avgRequestTime:
 *                       type: integer
 *                       nullable: true
 *                       description: Average request time in ms
 *                       example: 123
 *                     topTerms:
 *                       type: array
 *                       description: Top five most frequent search terms
 *                       items:
 *                         type: object
 *                         properties:
 *                           term:
 *                             type: string
 *                             example: "luke"
 *                           count:
 *                             type: integer
 *                             example: 10
 *                           percentage:
 *                             type: integer
 *                             description: Percentage of total queries
 *                             example: 24
 *                     mostPopularHour:
 *                       type: object
 *                       nullable: true
 *                       description: The hour of the day with the highest query volume
 *                       properties:
 *                         hour:
 *                           type: integer
 *                           example: 14
 *                         count:
 *                           type: integer
 *                           example: 7
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-29T22:08:53Z"
 */
router.get("/stats", (req, res) => {
  const row = DB.getRow<StatsRow>(
    `SELECT data, updated_at FROM stats WHERE id='latest'`
  );

  if (!row)
    return res.json({
      ok: true,
      data: {
        totalQueries: 0,
        avgRequestTime: null,
        topTerms: [],
        mostPopularHour: null,
      },
    });

  res.json({
    ok: true,
    data: JSON.parse(row.data),
    updated_at: new Date(row.updated_at * 1000).toDateString(),
  });
});
