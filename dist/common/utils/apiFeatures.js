"use strict";
// TODO FIX THIS
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAPIFeatures = void 0;
const client_1 = require("../../prisma/client");
// TODO Add _multi
class PrismaAPIFeatures {
    constructor(model, queryString, prismaQuery) {
        this.options = {};
        this.prismaQuery = {};
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
        const queryObj = { ...this.queryString };
        const excludedFields = ["page", "sort", "limit", "fields", "search"];
        excludedFields.forEach((el) => delete queryObj[el]);
        for (const key of Object.keys(queryObj)) {
            const value = queryObj[key];
            // Handle comparison operators: ?age[gte]=20 or ?createdAt[gte]=2025-12-10
            if (typeof value === "object" && value !== null) {
                const prismaOps = { gte: "gte", gt: "gt", lte: "lte", lt: "lt" };
                const fieldFilter = {};
                for (const op in value) {
                    if (!prismaOps[op])
                        continue;
                    const raw = value[op]; // <- THIS is the actual string like "2025-12-10" or "20"
                    let converted = raw;
                    // Convert to number
                    if (!isNaN(Number(raw))) {
                        converted = Number(raw);
                        // Convert to Date
                    }
                    else if (!isNaN(Date.parse(raw))) {
                        converted = new Date(raw);
                    }
                    fieldFilter[op] = converted;
                }
                this.options.where[key] = fieldFilter;
                continue;
            }
            // Simple equality
            const raw = value;
            let converted = raw;
            // number
            if (!isNaN(Number(raw))) {
                converted = Number(raw);
                // date
            }
            else if (!isNaN(Date.parse(raw))) {
                converted = new Date(raw);
            }
            this.options.where[key] = converted;
        }
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            const fields = this.queryString.sort.split(",");
            this.options.orderBy = fields.map((field) => {
                if (field.startsWith("-")) {
                    return { [field.slice(1)]: "desc" };
                }
                return { [field]: "asc" };
            });
        }
        else {
            this.options.orderBy = { id: "asc" };
        }
        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",");
            const omitFieldsObject = {};
            const omitFields = Object.keys(this.prismaQuery);
            if (omitFields.includes("omit")) {
                Object.keys(this.prismaQuery.omit).forEach((e) => (omitFieldsObject[e] = false));
            }
            this.options.select = fields.reduce((acc, f) => ({ ...acc, [f]: true }), {});
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
        const data = await client_1.prisma[this.model].findMany({
            ...includes,
            ...this.options,
        });
        return data;
    }
    async count() {
        return await client_1.prisma[this.model].count({
            where: this.options.where,
        });
    }
}
exports.PrismaAPIFeatures = PrismaAPIFeatures;
//# sourceMappingURL=apiFeatures.js.map