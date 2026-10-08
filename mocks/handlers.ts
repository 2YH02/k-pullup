import { http, HttpResponse } from "msw";
import { searchMarkerFixtures } from "./search-fixtures";

export const handlers = [
  http.get("/api/v1/search/marker", ({ request }) => {
    const term = new URL(request.url).searchParams.get("term")?.trim() ?? "";

    if (term === "error") {
      return HttpResponse.json({ error: "mock search error" }, { status: 500 });
    }

    if (term === "empty") {
      return HttpResponse.json({ markers: [], took: 1 });
    }

    const normalizedTerm = term.toLowerCase();
    const markers = searchMarkerFixtures.filter((marker) =>
      marker.address.toLowerCase().includes(normalizedTerm)
    );

    return HttpResponse.json({
      markers: markers.length > 0 ? markers : searchMarkerFixtures,
      took: 2,
    });
  }),
];
