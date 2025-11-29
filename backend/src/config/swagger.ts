// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application, Request, Response } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mars Infrastructure API',
      version: '1.0.0',
      description: 'Backend API for Perficient Hackathon - Mars Colony Management System',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Domes', description: 'Dome management endpoints' },
      { name: 'Resources', description: 'Resource management endpoints' },
      { name: 'Resource Categories', description: 'Resource category endpoints' },
      { name: 'Inventory', description: 'Inventory management endpoints' },
      { name: 'Sensors', description: 'Sensor management endpoints' },
      { name: 'Telemetry', description: 'Telemetry data endpoints' },
      { name: 'Alerts', description: 'Alert management endpoints' },
      { name: 'Resource Logs', description: 'Resource log endpoints' },
    ],
    components: {
      schemas: {
        Dome: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            code: { type: 'string', example: 'DOME-01' },
            name: { type: 'string', example: 'Main Habitation Dome' },
            dome_type: { type: 'string', example: 'HABITATION' },
            status: { type: 'string', example: 'OPERATIONAL' },
            alert_level: { type: 'integer', example: 0 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Resource: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            code: { type: 'string', example: 'WATER' },
            name: { type: 'string', example: 'Water' },
            category_id: { type: 'integer' },
            unit: { type: 'string', example: 'L' },
            is_vital: { type: 'boolean' },
            subcategory: { type: 'string', nullable: true },
            metadata: { type: 'object', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Sensor: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            code: { type: 'string', example: 'TEMP-01' },
            name: { type: 'string', example: 'Temperature Sensor 1' },
            category: { type: 'string', enum: ['LIFE_SUPPORT', 'POWER', 'ENVIRONMENT', 'STRUCTURE'] },
            unit: { type: 'string', example: '°C' },
            dome_id: { type: 'string', format: 'uuid', nullable: true },
            is_critical: { type: 'boolean' },
            metadata: { type: 'object', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Alert: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            code: { type: 'string', example: 'LOW_OXYGEN' },
            level: { type: 'string', enum: ['INFO', 'WARNING', 'CRITICAL'] },
            message: { type: 'string' },
            dome_id: { type: 'string', format: 'uuid', nullable: true },
            resource_id: { type: 'string', format: 'uuid', nullable: true },
            sensor_id: { type: 'string', format: 'uuid', nullable: true },
            is_active: { type: 'boolean' },
            acknowledged: { type: 'boolean' },
            acknowledged_by: { type: 'string', nullable: true },
            acknowledged_at: { type: 'string', format: 'date-time', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Mars Infrastructure API Docs',
  }));
  
  app.get('/api-docs.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('📚 Swagger docs disponible en http://localhost:4000/api-docs');
};

// Modificar server.ts agregando después de la línea 7:
// import { setupSwagger } from './config/swagger';
// 
// Y después de app.use(express.json()):
// setupSwagger(app);