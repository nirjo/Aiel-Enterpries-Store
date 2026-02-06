import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = parseInt(searchParams.get("offset") || "0");

    try {
        const supabase = await createClient();

        let query = supabase
            .from("products")
            .select("*, category:categories(*), inventory(*)", { count: "exact" })
            .eq("is_active", true);

        // Apply filters
        if (category) {
            query = query.eq("category_id", category);
        }

        if (featured === "true") {
            query = query.eq("is_featured", true);
        }

        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }

        // Apply sorting
        const sortColumn = sort === "price" ? "price" : "created_at";
        query = query.order(sortColumn, { ascending: order === "asc" });

        // Apply pagination
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            products: data,
            total: count,
            limit,
            offset,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}
