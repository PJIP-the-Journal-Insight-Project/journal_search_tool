document.addEventListener("DOMContentLoaded", () => {
    let journalData = [];
    let debounceTimeout;

    // Load the JSON data - this example uses data from the PJIP, along with links to PJIP journal profiles. 
    fetch("jrnldata.json")
        .then(response => response.json())
        .then(data => {
            journalData = data;
        })
        .catch(error => console.error("Error loading journals:", error));

    // Search function
    function searchJournals(query) {
        query = query.toLowerCase().trim();

        const jrnlresultsContainer = document.getElementById("jrnlresultsContainer");

        if (query === "") {
            jrnlresultsContainer.innerHTML = ""; 
            return;
        }

        showLoading(); // Show spinner otherwise

        if (query.length < 2) {
            return; // Don't search yet, but keep spinner visible
        }

        setTimeout(() => {
            let results = journalData.map(journal => {
                let parser = new DOMParser();
                let doc = parser.parseFromString(journal.name, "text/html");
                let journalName = doc.body.textContent.trim();

                return { ...journal, journalName };
            });

            // Filter results
            results = results.filter(journal => journal.journalName.toLowerCase().includes(query));

            // Sort results: prioritize exact matches, then whole-word matches, then substring matches, and finally presented alphabetically
            results.sort((a, b) => {
                let nameA = a.journalName.toLowerCase();
                let nameB = b.journalName.toLowerCase();

                let queryRegex = new RegExp(`\\b${query}\\b`, "i");

                let isExactA = nameA === query;
                let isExactB = nameB === query;

                let isWholeWordA = queryRegex.test(nameA);
                let isWholeWordB = queryRegex.test(nameB);

                if (isExactA && !isExactB) return -1;
                if (isExactB && !isExactA) return 1;

                if (isWholeWordA && !isWholeWordB) return -1;
                if (isWholeWordB && !isWholeWordA) return 1;

                return nameA.localeCompare(nameB); 
            });

            let tooManyResults = results.length > 20;
            results = results.slice(0, 20);

            displayResults(results, tooManyResults);
        }, 500);
    }

    function showLoading() {
        const jrnlresultsContainer = document.getElementById("jrnlresultsContainer");
        jrnlresultsContainer.innerHTML = `<div class="spinner"></div>`;
    }

    function displayResults(results, tooManyResults) {
        const jrnlresultsContainer = document.getElementById("jrnlresultsContainer");
        jrnlresultsContainer.innerHTML = "";

        if (results.length === 0 && document.getElementById("journalInput").value.length >= 2) {
            jrnlresultsContainer.innerHTML = "<p>No results found.</p>";
            return;
        }

        if (tooManyResults) {
            let warningDiv = document.createElement("div");
            warningDiv.innerHTML = "<p>Too many matches. Showing top 20 results.</p>";
            jrnlresultsContainer.appendChild(warningDiv);
        }

        results.forEach(journal => {
            let div = document.createElement("div");
            div.innerHTML = `
              <div class="jrnlsdiv">
                <p style="text-align:left;">
                    <strong>${journal.name}</strong><br>
                    <em>Subject:</em> ${journal.subject} |
                    <em>Subcategory:</em> ${journal.subcategory}
                </p>
              </div>
            `;
            jrnlresultsContainer.appendChild(div);
        });
    }

    document.getElementById("journalInput").addEventListener("input", (event) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            searchJournals(event.target.value);
        }, 300);
    });
});
