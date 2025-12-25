const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'UserProfile',
    tableName: 'user_profiles',
    columns: {
        user_name: {
            type: 'varchar',
            primary: true,
            length: 255
        },
        unique_pcs: {
            type: 'integer',
            default: 0
        },
        total_connections: {
            type: 'integer',
            default: 0
        },
        avg_hour: {
            type: 'real',
            default: 0
        },
        off_hours_count: {
            type: 'integer',
            default: 0
        }
    }
});
