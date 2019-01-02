/**
 * Helper class for pagination
 */
class PaginationHelper {
  /**
   * @desc Adds pagination metadata to request result
   * @param {Object} result object containing result from database
   * @param {Number} offset Number of result to skip
   * @param {Number} limit Number of result to return at a time
   * @returns {Object} result object to send to user
   */
  static paginateResult(result, offset, limit) {
    const paginatedResult = {};
    paginatedResult.page = Math.floor(offset / limit) + 1;
    paginatedResult.page_count = Math.ceil(result.count / limit);
    paginatedResult.page_size = Number(limit);
    paginatedResult.total_count = result.count;
    paginatedResult.offset = offset;
    paginatedResult.limit = limit;
    paginatedResult.rows = result.rows;

    return paginatedResult;
  }

}
export default PaginationHelper;
