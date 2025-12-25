const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

class CSVParser {
    constructor(csvFilePath) {
        this.csvFilePath = csvFilePath;
    }

    async parseCSV() {
        try {
            const fileContent = fs.readFileSync(this.csvFilePath, 'utf-8');

            const records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true,
                trim: true
            });

            const logs = records.map(record => {
                // Parse the date from MM/DD/YYYY HH:MM:SS to ISO format
                const dateParts = record.date.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/);
                let isoDate = record.date;

                if (dateParts) {
                    const [, month, day, year, hour, minute, second] = dateParts;
                    isoDate = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
                }

                return {
                    id: record.id.replace(/[{}]/g, ''), // Remove curly braces
                    date: isoDate,
                    user_name: record.user,
                    pc: record.pc,
                    activity: record.activity,
                    anomaly_score: 0,
                    is_anomaly: 0
                };
            });

            console.log(`Parsed ${logs.length} records from CSV`);
            return logs;
        } catch (error) {
            console.error('Error parsing CSV:', error);
            throw error;
        }
    }
}

module.exports = CSVParser;
