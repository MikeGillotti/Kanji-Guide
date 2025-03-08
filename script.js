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

    filteredKanji.forEach(item => {

pageContent += `

<h1>${item.word} - ${item.kana} - ${item.meaning} </h1>
`;


        item.kanji_details.forEach(row => {



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

        // Check if strokes exist and is an array
        if (Array.isArray(row.strokes)) {
            row.strokes.forEach((stroke, strokeIndex) => {
                const startCoords = stroke.replace(/\s/g, "").split(" ")[0];
                const startCoordsValues = startCoords.slice(1).split(",");
                const startX = startCoordsValues[0];
                const startY = startCoordsValues[1].toLowerCase().split("c")[0];

                pageContent += `
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 109 109">
                            <!-- Render all previous strokes as grayed out -->
                            ${row.strokes.slice(0, strokeIndex).map(prevStroke => `
                                <path d="${prevStroke}" class="gray" />
                            `).join('')}
                            
                            <!-- Render the current stroke in black -->
                            <path d="${stroke}" class="active" />
                            
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
    });


// Reference to the dropdown element
const lessonDropdown = document.getElementById("lesson-select");

// Step 1: Populate the dropdown with lessons 1 through 50
function populateDropdown() {
    for (let i = 1; i <= 50; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `Lesson ${i}`;
        lessonDropdown.appendChild(option);
    }
}

// Step 2: Add event listener to redirect when a lesson is selected
lessonDropdown.addEventListener("change", (event) => {
    const selectedLesson = event.target.value;
    if (selectedLesson) {
        // Redirect to the new URL with the selected lesson
        window.location.href = `?lesson=${selectedLesson}`;
    }
});

// Step 3: Populate the dropdown on page load
document.addEventListener("DOMContentLoaded", () => {
    populateDropdown();

    // Optionally: If there's a 'lesson' query parameter in the URL, you can select it in the dropdown
    const urlParams = new URLSearchParams(window.location.search);
    const selectedLesson = urlParams.get('lesson');
    
    if (selectedLesson) {
        lessonDropdown.value = selectedLesson;  // This will select the lesson in the dropdown
    }
});

    // Inject the page content into the container
    document.getElementById("kanji-container").innerHTML = pageContent;
}

// Load the kanji data and render the page
loadKanjiData();
