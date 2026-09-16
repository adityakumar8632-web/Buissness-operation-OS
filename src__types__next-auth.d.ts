import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      organizationId: string;
      organizationName: string;
      roleName: string;
      permissions: string[];
    };
  }

  interface User {
    id: string;
    organizationId: string;
    organizationName: string;
    roleName: string;
    permissions: string[];
  }
}
