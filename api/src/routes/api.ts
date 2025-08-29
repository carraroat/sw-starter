import { Router, type Request, type Response } from "express";

import { fetchItem, fetchResults } from "@services";
import { searchSchema, detailSchema } from "@validators";
import { validateRequest } from "@middleware";

import type { SearchResult } from "@types";

export const router = Router();

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

    try {
      const results: SearchResult[] = await fetchResults(type, query);

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
