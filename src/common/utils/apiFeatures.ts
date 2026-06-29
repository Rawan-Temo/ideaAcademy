// TODO FIX THIS

import { Request } from "express";
import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../prisma/client";
import { array } from "zod";
// TODO Add _multi
export class PrismaAPIFeatures<T extends Uncapitalize<Prisma.ModelName>, U> {
  private model: T;
  private queryString: any;
  private options: any = {};
  private prismaQuery: any = {};

  constructor(
    model: T,
    queryString: U,
    prismaQuery: Parameters<(typeof prisma)[T]["findMany"]>[0],
  ) {
    this.model = model; // e.g., prisma.user

    this.queryString = queryString;
    this.options = {
      where: {},
    };
    !this.queryString.fields &&
      (this.options = { ...this.options, ...prismaQuery });

    this.prismaQuery = prismaQuery;
  }

  filter() {
    const queryObj: any = { ...this.queryString };
    console.log(queryObj);
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const numericOps = new Set(["gte", "gt", "lte", "lt", "in", "notIn"]);
    const stringOps = new Set(["contains", "startsWith", "endsWith"]);

    const parseValue = (raw: any): any => {
      if (raw === "") return raw;
      if (Array.isArray(raw)) {
        return raw;
      }
      const num = Number(raw);
      if (!isNaN(num)) {
        return num;
      }
      if (!isNaN(Date.parse(raw))) return new Date(raw);
      return raw;
    };

    for (const key of Object.keys(queryObj)) {
      const value: any = queryObj[key];

      if (typeof value === "object" && value !== null) {
        const fieldFilter: any = {};
        let hasStringOp = false;

        for (const op in value) {
          if (stringOps.has(op)) {
            fieldFilter[op] = String(value[op]);
            hasStringOp = true;
          } else if (numericOps.has(op)) {
            fieldFilter[op] = parseValue(value[op]);
          }
          // unknown ops are ignored
        }

        this.options.where[key] = fieldFilter;
        continue;
      }

      // Simple equality
      this.options.where[key] = parseValue(value);
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const fields = this.queryString.sort.split(",");

      this.options.orderBy = fields.map((field: string) => {
        if (field.startsWith("-")) {
          return { [field.slice(1)]: "desc" };
        }
        return { [field]: "asc" };
      });
    } else {
      this.options.orderBy = { id: "asc" };
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",");

      const omitFieldsObject: any = {};
      const omitFields = Object.keys(this.prismaQuery);
      if (omitFields.includes("omit")) {
        Object.keys(this.prismaQuery.omit).forEach(
          (e) => (omitFieldsObject[e] = false),
        );
      }
      this.options.select = fields.reduce(
        (acc: any, f: string) => ({ ...acc, [f]: true }),
        {},
      );
      this.options.select = {
        ...this.options.select,
        ...omitFieldsObject,
      };
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;
    this.options.take = limit;
    this.options.skip = skip;
    return this;
  }

  async findMany(includes = {}) {
    const data = await (prisma[this.model] as any).findMany({
      ...includes,
      ...this.options,
    });
    return data;
  }

  async count() {
    return await (prisma[this.model] as any).count({
      where: this.options.where,
    });
  }
}
