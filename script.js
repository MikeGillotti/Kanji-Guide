document.addEventListener("DOMContentLoaded", async function () {
    let kanjiData = [];

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    async function loadKanjiData() {
        try {
            const response = await fetch("kanji_data.json");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            kanjiData = await response.json();
            console.log("Kanji data loaded:", kanjiData); // Debugging
            populateLessonsDropdown();
            loadLessonFromURL();
        } catch (error) {
            console.error("Error loading JSON data:", error);
            document.getElementById("kanji-container").innerHTML = "<p>Error loading data.</p>";
        }
    }

    function populateLessonsDropdown() {
        const lessonSelect = document.getElementById("lesson-select");
        if (!lessonSelect) {
            console.error("Lesson select dropdown not found!");
            return;
        }

        const lessons = [...new Set(kanjiData.map(entry => entry.lesson))];

        lessonSelect.innerHTML = lessons.map(lesson => `<option value="${lesson}">${lesson}</option>`).join('');

        const lessonFromURL = getQueryParam("lesson");
        if (lessonFromURL && lessons.includes(lessonFromURL)) {
            lessonSelect.value = lessonFromURL;
        }
    }

    function generateKanjiPage(lesson) {
        const queriedKanji = kanjiData.filter(entry => entry.lesson === lesson);
        if (queriedKanji.length === 0) return `<p>No kanji found for this lesson.</p>`;

        return `
        <div class="page">
            <h1>Lesson: ${lesson}</h1>
            ${queriedKanji.map(row => `
                <div class="container">
                    <div class="kanji-info">
                        <div class="kanji">${row.kanji}</div>
                        ${row.meaning ? `
                            <div class="readings">${row.readings}</div>
                            <div class="meaning">${row.meaning}</div>
                            <div class="radical">${row.radical}</div>
                        ` : ''}
                    </div>

                    ${row.strokes.map((stroke, strokeIndex) => {
                        // Safely parse the stroke path and coordinates
                        const strokeData = stroke.replace(/\s+/g, ' ').trim().split(' '); // Ensure no extra spaces
                        const startCoords = strokeData[0];

                        // Handle case where start coordinates are missing or invalid
                        if (!startCoords) {
                            console.warn(`Invalid start coordinates for stroke: ${stroke}`);
                            return ''; // Skip this stroke if invalid
                        }

                        const startCoordsValues = startCoords.slice(1).split(',');
                        const startX = startCoordsValues[0];
                        const startY = startCoordsValues[1]?.toLowerCase().split("c")[0];

                        return `
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 109 109">
                                    ${row.strokes.slice(0, strokeIndex).map(prevStroke => `
                                        <path d="${prevStroke}" class="gray" />
                                    `).join('')}
                                    <path d="${stroke}" class="active" />
                                    <circle cx="${startX}" cy="${startY}" r="5" fill="red" class="start-marker" />
                                </svg>
                            </div>
                        `;
                    }).join('')}
                </div>
            `).join('')}
        </div>`;
    }

    function loadLessonFromURL() {
        const selectedLesson = getQueryParam("lesson") || document.getElementById("lesson-select").value;
        console.log("Loading lesson:", selectedLesson); // Debugging
        document.getElementById("kanji-container").innerHTML = generateKanjiPage(selectedLesson);
    }

    function updateURL(lesson) {
        const newUrl = `${window.location.pathname}?lesson=${lesson}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
        loadLessonFromURL();
    }

    document.getElementById("lesson-select").addEventListener("change", function () {
        updateURL(this.value);
    });

    await loadKanjiData();
});
