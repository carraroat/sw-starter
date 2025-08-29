/**
 * @openapi
 * components:
 *   schemas:
 *     SearchType:
 *       type: string
 *       enum:
 *         - films
 *         - people
 *
 *     SearchResult:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "1"
 *         value:
 *           type: string
 *           example: "Movie title or person name"
 *         url:
 *           type: string
 *           example: "/type/1"
 *
 *     MovieDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/SearchResult'
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "1"
 *             value:
 *               type: string
 *               example: "The Phantom Menace"
 *             url:
 *               type: string
 *               example: "/films/1"
 *             openingCrawl:
 *               type: string
 *               example: >
 *                 The taxation of trade routes to outlying star
 *                 systems is in dispute.
 *             characters:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SearchResult'
 *
 *     PeopleDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/SearchResult'
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "6"
 *             value:
 *               type: string
 *               example: "Darth Vader"
 *             url:
 *               type: string
 *               example: "/people/6"
 *             birthYear:
 *               type: string
 *               example: "41.9BBY"
 *             gender:
 *               type: string
 *               example: "male"
 *             eyeColor:
 *               type: string
 *               example: "yellow"
 *             hairColor:
 *               type: string
 *               example: "none"
 *             height:
 *               type: number
 *               example: 202
 *             mass:
 *               type: number
 *               example: 136
 *             movies:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SearchResult'
 *
 *     Error:
 *       type: object
 *       required:
 *         - code
 *         - message
 *       properties:
 *         code:
 *           type: string
 *           example: "BAD_REQUEST"
 *         message:
 *           type: string
 *           example: "searchTerm is required"
 */
export {};
