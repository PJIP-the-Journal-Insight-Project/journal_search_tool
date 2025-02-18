# Journal Search Tool
A simple client-side journal search tool that allows users to search for journals by name, and will display the journal, subject, and subcategory. 

### Features
- Real-time search with a debounce mechanism to optimize performance
- Sorting algorithm that prioritizes exact matches, whole-word matches, and alphabetical order
- Loading spinner for better user experience
- Message handling for empty or excessive search results

### How It Works
- The script fetches journal data from a JSON file hosted online.
- Users can type into the search box to find relevant journal entries.
- Results update dynamically as users type, with a debounce delay of 300ms.
- If too many results are found, the top 20 results are displayed with a warning message.
- The search considers HTML-encoded text and filters results accordingly.

### Customization
- Modify the JSON file URL inside the fetch() function to use a different dataset.
- Adjust debounce time or result limits in the script for performance tuning.

### Dependencies
This tool runs purely on HTML, CSS, and JavaScript—no additional libraries required.

### License
This project is licensed under the MIT License.
