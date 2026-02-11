import swaggerAutogen from "swagger-autogen";

const doc = {
    swagger: "2.0",
    info: {
        title: "G2Labs API",
        version: "0.1.0"
    },
    host: "localhost:3000",
    schemes: ["http"],
    basePath: "/",
    definitions: {
        EchoRequest: {
            message: "hello",
            count: 1
        },
        EchoResponse: {
            data: {
                message: "hello",
                count: 1
            }
        },
        HealthResponse: {
            data: {
                ok: true
            }
        },
        ErrorResponse: {
            error: {
                code: "VALIDATION_ERROR",
                message: "Invalid request data",
                details: {},
                requestId: "req_123"
            }
        }
    }
};

const outputFile = "./docs/openapi/openapi.json";
const endpointsFiles = ["./src/transports/http/app.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
