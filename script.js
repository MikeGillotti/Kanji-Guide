document.addEventListener("DOMContentLoaded", function () {
    const sampleData = {
        word: "例",
        kana: "れい",
        meaning: "example",
        queriedKanji: [
            {
                kanji: "例",
                readings: "れい",
                meaning: "example",
                radical: "⺅",
                strokes: [
                    "M20 20C40 40 60 60 80 80",
                    "M30 30C50 50 70 70 90 90"
                ]
            }
        ]
    };

    function generateKanjiPage(word, kana, meaning, queriedKanji) {
        return `
        <div class="page">
            <h1>${word} - ${kana} - ${meaning}</h1>
            
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

                    ${row.strokes.map((stroke, strokeIndex) => `
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 109 109">
                                <!-- Render previous strokes as gray -->
                                ${row.strokes.slice(0, strokeIndex).map(prevStroke => `
                                    <path d="${prevStroke}" class="gray" />
                                `).join('')}

                                <!-- Render current stroke in black -->
                                <path d="${stroke}" class="active" />

                                <!-- Extract starting point of the stroke -->
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
            `).join('')}
        </div>
        `;
    }

    // Insert generated HTML into the page
    document.getElementById("kanji-container").innerHTML = generateKanjiPage(
        sampleData.word,
        sampleData.kana,
        sampleData.meaning,
        sampleData.queriedKanji
    );
});
