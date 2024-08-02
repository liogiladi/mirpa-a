"server-only";

import { createClient } from "@supabase/supabase-js";
import assert from "assert";

const supabaseUrl = "https://nrvivtkokikskyunzfvr.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;

assert(supabaseKey, "No supabase key found");

const db = createClient(supabaseUrl, supabaseKey);

export default db;
