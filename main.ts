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
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`)
        const data = await response.json()

        if (data.length === 0)
        {
            return {
                content: [
                    {
                        type: 'text',
                        text: `No se encontro informacion para la coidad ${city}`
                     }
                ]
            }
        }

        const { latitude, longitude} = data[0]

        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude }&hourly=temperature_2m&current=temperature_2m,precipitation,is_day,rain&forecast_days=1`)

        const weatherData = await weatherResponse.json()

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
const transport = new StdioServerTransport()
await server.connect(transport)
