// Extract unique tags from notes for suggestions
export const extractUniqueTags = (notes) => {
    const tagSet = new Set();

    notes.forEach((note) => {
        if (note.tags && Array.isArray(note.tags)) {
            note.tags.forEach((tag) => tagSet.add(tag.toLowerCase()));
        }
    });

    return Array.from(tagSet).sort();
};

// Generate tag suggestions based on search query
export const generateTagSuggestions = (allTags, searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') {
        return [];
    }

    const query = searchQuery.toLowerCase().trim();

    // Filter tags that contain the search query
    const suggestions = allTags.filter((tag) => tag.includes(query));

    // Sort by relevance (exact match first, then starts with, then contains)
    suggestions.sort((a, b) => {
        if (a === query) return -1;
        if (b === query) return 1;
        if (a.startsWith(query) && !b.startsWith(query)) return -1;
        if (b.startsWith(query) && !a.startsWith(query)) return 1;
        return a.localeCompare(b);
    });

    return suggestions.slice(0, 10); // Return top 10 suggestions
};
