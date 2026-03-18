import { success } from "./../../../src/shared/lib/response";
import { getTags } from "@/features/tags/actions/get-tag.actions";
import type { PaginatedSearchParams } from "@/shared/types/global";
import { Tag } from "@/database";

jest.mock("@/auth", () => ({
  auth: jest.fn(() => Promise.resolve({ user: null })),
}));

describe("getTags action", () => {
  describe("validation", () => {
    it("should return error if invalid params", async () => {
      const invalidParams = {
        page: "invalid",
        pageSize: -5,
      } as unknown as PaginatedSearchParams;

      const result = await getTags(invalidParams);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error && result.error.message).toContain(
        "expected number, received string, Too small: expected number to be >0",
      );
    });
  });

  describe("Pagination and Sorting", () => {
    beforeEach(async () => {
      await Tag.insertMany([
        { name: "javascript", questions: 100, createdAt: "2026-01-01" },
        { name: "React", questions: 50, createdAt: "2026-02-01" },
        { name: "Node", questions: 200, createdAt: "2026-03-01" },
      ]);
    });

    it("Should return the first page of tags sorted by question count (default behavior)", async () => {
      const { success, data } = await getTags({ page: 1, pageSize: 2 });

      expect(success).toBe(true);
      expect(data?.tags).toHaveLength(2);
      expect(data?.tags[0].name).toBe("Node");
      expect(data?.tags[1].name).toBe("javascript");
      expect(data?.isNext).toBe(true);
    });

    it("Should return the second page of tags sorted by question count (default behavior)", async () => {
      const { success, data } = await getTags({ page: 2, pageSize: 2 });

      expect(success).toBe(true);
      expect(data?.tags).toHaveLength(1);
      expect(data?.tags[0].name).toBe("React");
      expect(data?.isNext).toBe(false);
    });
  });

  describe("Search Functionality", () => {
    beforeEach(async () => {
      await Tag.insertMany([
        { name: "javascript", questions: 100, createdAt: "2026-01-01" },
        { name: "java", questions: 50, createdAt: "2026-02-01" },
        { name: "Node", questions: 200, createdAt: "2026-03-01" },
      ]);
    });

    it("should filter tags by partial name match (case insensitive)", async () => {
      const { success, data } = await getTags({
        page: 1,
        pageSize: 10,
        query: "jav",
      });

      expect(success).toBe(true);
      expect(data?.tags).toHaveLength(2);
      expect(data?.tags.map((tag) => tag.name)).toEqual(
        expect.arrayContaining(["javascript", "java"]),
      );
    });

    it("should filter tags should be empty", async () => {
      const { success, data } = await getTags({
        page: 1,
        pageSize: 10,
        query: "noneExistent",
      });

      expect(success).toBe(true);
      expect(data?.tags).toHaveLength(0);
    });
  });
});
