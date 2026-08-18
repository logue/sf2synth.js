export type Meta = {
  version: string;
  date: string;
};

const Meta: Meta = {
  version: __APP_VERSION__,
  date: __BUILD_DATE__,
};

export { Meta };
