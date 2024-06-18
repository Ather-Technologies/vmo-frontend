export const InterfaceForAPI_DemoData = {
    getFullDateFromDateID: (id: number) => {
        const rows = [
            { id: 1, date: "2024-06-10T00:00:00.000Z", source: { id: 1, name: "Sanders County Sheriff's Office", shorthand: "SCSO", timezone: "America/Denver" } },
            { id: 2, date: "2024-06-11T00:00:00.000Z", source: { id: 1, name: "Sanders County Sheriff's Office", shorthand: "SCSO", timezone: "America/Denver" } },
            { id: 3, date: "2024-06-12T00:00:00.000Z", source: { id: 1, name: "Sanders County Sheriff's Office", shorthand: "SCSO", timezone: "America/Denver" } },
            { id: 4, date: "2024-06-13T00:00:00.000Z", source: { id: 1, name: "Sanders County Sheriff's Office", shorthand: "SCSO", timezone: "America/Denver" } },
            { id: 5, date: "2024-06-14T00:00:00.000Z", source: { id: 1, name: "Sanders County Sheriff's Office", shorthand: "SCSO", timezone: "America/Denver" } },
            { id: 6, date: "2024-06-15T00:00:00.000Z", source: { id: 1, name: "Sanders County Sheriff's Office", shorthand: "SCSO", timezone: "America/Denver" } },
        ];
        // Return one row that matches the condition
        return rows.find(row => row.id === id);
    },
    getAllDatesBySourceId: (id: number) => {
        const rows = [
            { id: 1, date: '2024-06-10T00:00:00.000Z', source_id: 1 },
            { id: 2, date: '2024-06-11T00:00:00.000Z', source_id: 1 },
            { id: 3, date: '2024-06-12T00:00:00.000Z', source_id: 1 },
            { id: 4, date: '2024-06-13T00:00:00.000Z', source_id: 1 },
            { id: 5, date: '2024-06-14T00:00:00.000Z', source_id: 1 },
            { id: 6, date: '2024-06-15T00:00:00.000Z', source_id: 1 },
        ];
        // Return all rows matching the condition
        return rows.filter(row => row.source_id === id).sort((a, b) => b.id - a.id);

    },
    getAllClipsByDateId: (id: number) => {
        const rows = [
            { id: 1, time: "10:42:21", date_id: 1 },
            { id: 2, time: "10:52:41", date_id: 1 },
            { id: 3, time: "11:12:35", date_id: 1 },
            { id: 4, time: "11:22:25", date_id: 1 },
            { id: 5, time: "11:34:12", date_id: 1 },
            { id: 6, time: "11:42:11", date_id: 1 },
            { id: 7, time: "12:02:01", date_id: 1 },
            { id: 8, time: "12:20:21", date_id: 1 },
            { id: 9, time: "12:42:25", date_id: 1 },

            { id: 10, time: "10:42:21", date_id: 2 },
            { id: 11, time: "10:52:41", date_id: 2 },
            { id: 12, time: "11:12:35", date_id: 2 },
            { id: 13, time: "11:22:25", date_id: 2 },
            { id: 14, time: "11:34:12", date_id: 2 },
            { id: 15, time: "11:42:11", date_id: 2 },
            { id: 16, time: "12:02:01", date_id: 2 },
            { id: 17, time: "12:20:21", date_id: 2 },
            { id: 18, time: "12:42:25", date_id: 2 },

            { id: 19, time: "10:42:21", date_id: 3 },
            { id: 20, time: "10:52:41", date_id: 3 },
            { id: 21, time: "11:12:35", date_id: 3 },
            { id: 22, time: "11:22:25", date_id: 3 },
            { id: 23, time: "11:34:12", date_id: 3 },
            { id: 24, time: "11:42:11", date_id: 3 },
            { id: 25, time: "12:02:01", date_id: 3 },
            { id: 26, time: "12:20:21", date_id: 3 },
            { id: 27, time: "12:42:25", date_id: 3 },

            { id: 28, time: "10:42:21", date_id: 4 },
            { id: 29, time: "10:52:41", date_id: 4 },
            { id: 30, time: "11:12:35", date_id: 4 },
            { id: 31, time: "11:22:25", date_id: 4 },
            { id: 32, time: "11:34:12", date_id: 4 },
            { id: 33, time: "11:42:11", date_id: 4 },
            { id: 34, time: "12:02:01", date_id: 4 },
            { id: 35, time: "12:20:21", date_id: 4 },
            { id: 36, time: "12:42:25", date_id: 4 },

            { id: 37, time: "10:42:21", date_id: 5 },
            { id: 38, time: "10:52:41", date_id: 5 },
            { id: 39, time: "11:12:35", date_id: 5 },
            { id: 40, time: "11:22:25", date_id: 5 },
            { id: 41, time: "11:34:12", date_id: 5 },
            { id: 42, time: "11:42:11", date_id: 5 },
            { id: 43, time: "12:02:01", date_id: 5 },
            { id: 44, time: "12:20:21", date_id: 5 },
            { id: 45, time: "12:42:25", date_id: 5 },

            { id: 46, time: "10:42:21", date_id: 6 },
            { id: 47, time: "10:52:41", date_id: 6 },
            { id: 48, time: "11:12:35", date_id: 6 },
            { id: 49, time: "11:22:25", date_id: 6 },
            { id: 50, time: "11:34:12", date_id: 6 },
            { id: 51, time: "11:42:11", date_id: 6 },
            { id: 52, time: "12:02:01", date_id: 6 },
            { id: 53, time: "12:20:21", date_id: 6 },
            { id: 54, time: "12:42:25", date_id: 6 },
        ];

        // Return all rows matching the condition
        return rows.filter(row => row.date_id === id).sort((a, b) => b.id - a.id);
    }
}