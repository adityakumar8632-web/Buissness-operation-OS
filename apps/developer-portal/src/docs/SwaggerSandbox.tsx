import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import openApiSpec from './openapi.json';

export const SwaggerSandbox: React.FC = () => {
  return (
    <div className="swagger-sandbox p-6 bg-white border rounded shadow-sm">
      <div className="mb-4 border-b pb-4">
        <h2 className="text-2xl font-bold">API Explorer</h2>
        <p className="text-gray-600 mt-1">
          Interactive Swagger/OpenAPI documentation runner allowing developers to test API routes live[cite: 3].
          Use your generated API keys in the authorization header.
        </p>
      </div>
      <SwaggerUI spec={openApiSpec} docExpansion="list" filter={true} />
    </div>
  );
};