# **App Name**: TarifaFinder

## Core Features:

- Data Input: Receives the electricity consumption data including billed days, peak and off-peak power, and peak, shoulder and off-peak energy usage.
- Sheet Updater: Updates the Google Sheets 'Comparador' sheet with the received data in the specified cells, referencing columns based on exact text matches.
- Tariff Retrieval: Retrieves the names of the top 3 cheapest tariffs based on the data provided in the sheet, using cell locations based on text matches.
- Output: Returns the list of tariffs to the end user, or 'null' if 3 valid results can't be found

## Style Guidelines:

- Primary color: Deep sky blue (#42A5F5) evokes trust and efficiency in energy comparison.
- Background color: Light grey (#EEEEEE) offers a neutral backdrop, reducing visual fatigue.
- Accent color: Teal (#26A69A) highlights key data points and call to action elements.
- Font: 'Inter', a sans-serif font, for a modern, objective, neutral presentation of information.
- A clean, tabular layout emphasizes data clarity. Grid lines subtly separate values without visual clutter.
- Minimalist icons represent each data point (days, power, energy) for enhanced comprehension.
- Subtle transition animations indicate data refresh, offering feedback when inputs are updated.