import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GYRO Api",
      version: "1.0.0",
      description: "API documentation for GYRO server",
    },
    servers: [
      {
        url: "http://localhost:3003/",
        description: "Local server",
      },
      {
        url: "https://gyroserver.vercel.app/",
        description: "Dev live server",
      }
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
export default swaggerSpec
