import axios from "axios";

import { BACKEND_URL } from "@/config/config";

export const Api = axios.create({ baseURL: `${BACKEND_URL}` });
