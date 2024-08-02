"server-only";

import { createClient } from "@supabase/supabase-js";
import assert from "assert";
import { Database } from "./db.types";

const supabaseUrl = "https://nrvivtkokikskyunzfvr.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;

assert(supabaseKey, "No supabase key found");

const db = createClient<Database>(supabaseUrl, supabaseKey);

export default db;
