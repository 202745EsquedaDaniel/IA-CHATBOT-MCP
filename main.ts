import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
    name: 'Demo',
    version: '1.0.0'
});

// Definir la herramienta
server.tool(
    'fetch-weather', // tool title
    'Tool to fetch the weather of a city', // description tool
    {
        city: z.string().describe('City name'),
    },
    async ({ city }) => {
        return {
            content: [
                {
                    type: 'text',
                    text: `The weather in ${city} is sunny`,
                }
            ]
        };
    } 
); 

// 3. Escruchar las conexiones del cliente
const transport = new StdioServerTransport
await server.connect(transport)
