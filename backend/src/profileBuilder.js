class ProfileBuilder {
    /**
     * Build user profiles from device logs
     */
    buildProfiles(logs) {
        console.log(`Building profiles from ${logs.length} logs`);

        const userMap = new Map();

        // Aggregate data by user
        logs.forEach(log => {
            const userName = log.user_name;

            if (!userMap.has(userName)) {
                userMap.set(userName, {
                    user_name: userName,
                    pcs: new Set(),
                    connections: 0,
                    hours: [],
                    offHoursCount: 0
                });
            }

            const userData = userMap.get(userName);
            userData.pcs.add(log.pc);
            userData.connections++;

            const date = new Date(log.date);
            const hour = date.getHours();
            userData.hours.push(hour);

            if (hour < 6 || hour > 22) {
                userData.offHoursCount++;
            }
        });

        // Convert to profile format
        const profiles = Array.from(userMap.values()).map(userData => {
            const avgHour = userData.hours.reduce((a, b) => a + b, 0) / userData.hours.length;

            return {
                user_name: userData.user_name,
                unique_pcs: userData.pcs.size,
                total_connections: userData.connections,
                avg_hour: avgHour,
                off_hours_count: userData.offHoursCount
            };
        });

        console.log(`Built ${profiles.length} user profiles`);
        return profiles;
    }
}

module.exports = ProfileBuilder;
