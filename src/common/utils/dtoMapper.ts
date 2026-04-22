const mapToDto = <T>(data: any, dtoClass: new () => T): T => {
  const dtoInstance = new dtoClass();

  for (const key in dtoInstance) {
    if (data.hasOwnProperty(key)) {
      dtoInstance[key] = data[key];
    }
  }

  return dtoInstance;
};

export default mapToDto;
