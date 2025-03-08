document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("kanji-container");

    // Fetch JSON data
    fetch("kanji_data.json")
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ""; // Clear loading text

            data.forEach(entry => {
                const wordDiv = document.createElement("div");
                wordDiv.classList.add("word");

                // Word & Meaning
                wordDiv.innerHTML = `
                    <div class="kanji">${entry.word} (${entry.kana})</div>
                    <p>${entry.meaning}</p>
                `;

                // Kanji Details
                entry.kanji_details.forEach(kanji => {
                    const kanjiDiv = document.createElement("div");
                    kanjiDiv.innerHTML = `
                        <p><strong>${kanji.kanji}</strong> - ${kanji.meaning}</p>
                        <small>Readings: ${kanji.readings} | Radical: ${kanji.radical}</small>
                        <br>
                        <canvas id="canvas-${kanji.kanji}" width="100" height="100"></canvas>
                    `;

                    wordDiv.appendChild(kanjiDiv);

                    // Draw strokes if available
                    setTimeout(() => drawKanjiStrokes(`canvas-${kanji.kanji}`, kanji.strokes), 100);
                });

                container.appendChild(wordDiv);
            });
        })
        .catch(error => {
            console.error("Error loading kanji data:", error);
            container.innerHTML = "<p>Failed to load data.</p>";
        });
});

// Function to draw kanji strokes on canvas
function drawKanjiStrokes(canvasId, strokes) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !strokes.length) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    strokes.forEach(stroke => {
        const points = stroke.match(/\d+/g).map(Number); // Extract numbers
        if (points.length >= 4) {
            ctx.beginPath();
            ctx.moveTo(points[0], points[1]); // Start
            for (let i = 2; i < points.length; i += 2) {
                ctx.lineTo(points[i], points[i + 1]); // Draw line
            }
            ctx.stroke();
        }
    });
}