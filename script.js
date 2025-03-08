document.addEventListener("DOMContentLoaded", async function () {
    let kanjiData = [];

    // Function to get URL parameters
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Load JSON data from a file
    async function loadKanjiData() {
        try {
            const response = await fetch("kanji_data.json"); // Update with the actual path
            kanjiData = await response.json();
            populateLessonsDropdown();
            loadLessonFromURL(); // Load lesson from the URL when the page loads
        } catch (error) {
            console.error("Error loading JSON data:", error);
        }
    }

    // Populate the lesson dropdown
    function populateLessonsDropdown() {
        const lessonSelect = document.getElementById("lesson-select");
        const lessons = [...new Set(kanjiData.map(entry => entry.lesson))]; // Extract unique lesson values

        lessonSelect.innerHTML = lessons.map(lesson => `<option value="${lesson}">${lesson}</option>`).join('');

        // Set the dropdown to the lesson from the URL (if available)
        const lessonFromURL = getQueryParam("lesson");
        if (lessonFromURL && lessons.includes(lessonFromURL)) {
            lessonSelect.value = lessonFromURL;
        }
    }

    // Generate kanji page for the selected lesson
    function generateKanjiPage(lesson) {
        const queriedKanji = kanjiData.filter(entry => entry.lesson === lesson);

        return `
        <div class="page">
            <h1>Lesson: ${lesson}</h1>

            ${queriedKanji.length > 0 ? queriedKanji.map(row => `
                <div class="container">
                    <div class="kanji-info">
                        <div class="kanji">${row.kanji}</div>
                        ${row.meaning ? `
                            <div class="readings">${row.readings}</div>
                            <div class="meaning">${row.meaning}</div>
                            <div class="radical">${row.radical}</div>
                        ` : ''}
                    </div>

                    ${row.strokes.map((stroke, strokeIndex) => `
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 109 109">
                                ${row.strokes.slice(0, strokeIndex).map(prevStroke => `
                                    <path d="${prevStroke}" class="gray" />
                                `).join('')}

                                <path d="${stroke}" class="active" />

                                ${(() => {
                                    const coords = stroke.replace(/\s/g, "").split(" ")[0].slice(1).split(",");
                                    const startX = coords[0];
                                    const startY = coords[1].split("c")[0];
                                    return `<circle cx="${startX}" cy="${startY}" r="5" fill="red" class="start-marker" />`;
                                })()}
                            </svg>
                        </div>
                    `).join('')}
                </div>
            `).join('') : `<p>No kanji found for this lesson.</p>`}
        </div>
        `;
    }

    // Load lesson based on URL or dropdown selection
    function loadLessonFromURL() {
        const selectedLesson = getQueryParam("lesson") || document.getElementById("lesson-select").value;
        document.getElementById("kanji-container").innerHTML = generateKanjiPage(selectedLesson);
    }

    // Update the URL when the user selects a lesson from the dropdown
    function updateURL(lesson) {
        const newUrl = `${window.location.pathname}?lesson=${lesson}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
        loadLessonFromURL();
    }

    // Event listener for lesson selection
    document.getElementById("lesson-select").addEventListener("change", function () {
        updateURL(this.value);
    });

    // Load data initially
    await loadKanjiData();
});