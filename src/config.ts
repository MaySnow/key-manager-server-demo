import dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "./.env") });

export interface Config {
    port: number;
    debugLogging: boolean;
    jwtSecret: string;
    ak: string;
    sk: string;
    endpoint: string;
    projectId: string;
}

const isDevMode = process.env.NODE_ENV == "development";

const config: Config = {
    port: +(process.env.PORT || 6888),
    debugLogging: isDevMode,
    jwtSecret: process.env.JWT_SECRET || "your-secret-whatever",
    ak: process.env.AK,
    sk: process.env.SK,
    endpoint: process.env.END_POINT,
    projectId: process.env.PROJECT_ID
};

export { config };