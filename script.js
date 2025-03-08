// Assuming you have a JSON file 'kanji_data.json' with the kanji data
let kanjiData = [];

// Function to load kanji data from the JSON file
async function loadKanjiData() {
    try {
        const response = await fetch("kanji_data.json");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        kanjiData = await response.json();
        console.log("Kanji data loaded:", kanjiData); // Debugging
        renderKanjiPage();
    } catch (error) {
        console.error("Error loading JSON data:", error);
        document.getElementById("kanji-container").innerHTML = "<p>Error loading data.</p>";
    }
}

// Function to get URL parameter by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to render kanji data based on the selected lesson
function renderKanjiPage() {
    const lesson = getQueryParam("lesson");
    console.log("Filtering by lesson:", lesson); // Log the lesson parameter

    // Make sure lesson is compared as a string (if it's a string in your JSON)
    const filteredKanji = kanjiData.filter(kanji => String(kanji.lesson) === lesson); 

    // Log the filtered data to see what's being matched
    console.log("Filtered Kanji:", filteredKanji);

    if (filteredKanji.length === 0) {
        document.getElementById("kanji-container").innerHTML = "<p>No kanji found for this lesson.</p>";
        return;
    }

    let pageContent = "";

    filteredKanji.forEach(row => {
        pageContent += `
            <div class="container">
                <div class="kanji-info">
                    <div class="kanji">${row.kanji}</div>
                    ${row.meaning ? `
                        <div class="readings">${row.readings}</div>
                        <div class="meaning">${row.meaning}</div>
                        <div class="radical">${row.radical}</div>
                    ` : ""}
                </div>`;

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

        pageContent += `</div>`; // Closing container div
    });

    // Inject the page content into the container
    document.getElementById("kanji-container").innerHTML = pageContent;
}

// Load the kanji data and render the page
loadKanjiData();
