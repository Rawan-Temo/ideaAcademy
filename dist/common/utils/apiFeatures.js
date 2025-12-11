"use strict";
// TODO FIX THIS
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAPIFeatures = void 0;
const client_1 = require("../../prisma/client");
class PrismaAPIFeatures {
    constructor(model, queryString, prismaQuery) {
        this.options = {};
        this.model = model; // e.g., prisma.user
        this.queryString = queryString;
        this.options = {
            where: {},
            ...prismaQuery,
        };
    }
    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ["page", "sort", "limit", "fields", "search"];
        excludedFields.forEach((el) => delete queryObj[el]);
        for (const key of Object.keys(queryObj)) {
            const value = queryObj[key];
            // Handle comparison operators: ?age[gte]=20
            if (typeof value === "object") {
                const prismaOps = {
                    gte: "gte",
                    gt: "gt",
                    lte: "lte",
                    lt: "lt",
                };
                const fieldFilter = {};
                for (const op in value) {
                    if (prismaOps[op]) {
                        fieldFilter[prismaOps[op]] = isNaN(value[op])
                            ? value[op]
                            : Number(value[op]);
                    }
                }
                this.options.where[key] = fieldFilter;
                continue;
            }
            // // Handle multi-value filters: field_multi=a,b,c
            // if (key.endsWith("_multi")) {
            //   const field = key.replace("_multi", "");
            //   const values = String(value)
            //     .split(",")
            //     .map((v) => (isNaN(v) ? v : Number(v)));
            //   this.options.where[field] = { in: values };
            //   continue;
            // }
            // Simple equality
            this.options.where[key] = isNaN(value) ? value : Number(value);
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
            this.options.select = fields.reduce((acc, f) => ({ ...acc, [f]: true }), {});
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
    async findMany() {
        return await client_1.prisma[this.model].findMany(this.options);
    }
    async count() {
        return await client_1.prisma[this.model].count({
            where: this.options.where,
        });
    }
}
exports.PrismaAPIFeatures = PrismaAPIFeatures;
//# sourceMappingURL=apiFeatures.js.map