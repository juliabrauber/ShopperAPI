declare module 'config' {
    const config: {
      get<T>(setting: string): T;
      has(setting: string): boolean;
    };
    export = config;
  }