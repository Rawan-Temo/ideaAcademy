"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapToDto = (data, dtoClass) => {
    const dtoInstance = new dtoClass();
    for (const key in dtoInstance) {
        if (data.hasOwnProperty(key)) {
            dtoInstance[key] = data[key];
        }
    }
    return dtoInstance;
};
exports.default = mapToDto;
//# sourceMappingURL=dtoMapper.js.map