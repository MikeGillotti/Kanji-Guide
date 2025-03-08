// Function to render kanji data based on the selected lesson
function renderKanjiPage() {
    const lesson = getQueryParam("lesson");
    console.log("Filtering by lesson:", lesson); // Log the lesson parameter

    if (!lesson) {
        console.log("No lesson parameter found in URL");
        return;
    }

    // Log the kanjiData structure and the lesson field for debugging
    console.log("Kanji data:", kanjiData);

    // Ensure `lesson` is treated as a string for filtering
    const filteredKanji = kanjiData.filter(kanji => String(kanji.lesson) === lesson);

    // Log the filtered kanji
    console.log("Filtered Kanji:", filteredKanji);

    if (filteredKanji.length === 0) {
        document.getElementById("kanji-container").innerHTML = "<p>No kanji found for this lesson.</p>";
        return;
    }

    let pageContent = "";

    filteredKanji.forEach(row => {
        console.log("Processing row:", row); // Log the current row to inspect its structure

        // Check for undefined properties
        const word = row.word || "No word available";
        const kana = row.kana || "No kana available";
        const meaning = row.meaning || "No meaning available";
        const readings = row.readings || "No readings available";
        const radical = row.radical || "No radical available";

        pageContent += `
            <div class="container">
                <div class="kanji-info">
                    <div class="kanji">${word}</div>
                    <div class="kana">${kana}</div>
                    ${meaning !== "No meaning available" ? `
                        <div class="readings">${readings}</div>
                        <div class="meaning">${meaning}</div>
                        <div class="radical">${radical}</div>
                    ` : ""}
                </div>`;

        // Check if strokes exist and is an array
        if (Array.isArray(row.strokes)) {
            row.strokes.forEach((stroke, strokeIndex) => {
                const startCoords = stroke[0].replace(" ", "").split(" ")[0];
                const startCoordsValues = startCoords.slice(1).split(",");
                const startX = startCoordsValues[0];
                const startY = startCoordsValues[1].toLowerCase().split("c")[0];

                pageContent += `
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 109 109">
                            <!-- Render all previous strokes as grayed out -->
                            ${row.strokes.slice(0, strokeIndex).map(prevStroke => `
                                <path d="${prevStroke[1]}" class="gray" />
                            `).join('')}
                            
                            <!-- Render the current stroke in black -->
                            <path d="${stroke[1]}" class="active" />
                            
                            <!-- Place the start marker at the top of the cell -->
                            <circle cx="${startX}" cy="${startY}" r="5" fill="red" class="start-marker" />
                        </svg>
                    </div>`;
            });
        } else {
            // If there are no strokes or it's not an array, add a warning message
            pageContent += `<p>No strokes available for this kanji.</p>`;
        }

        pageContent += `</div>`; // Closing container div
    });

    // Inject the page content into the container
    document.getElementById("kanji-container").innerHTML = pageContent;
}
